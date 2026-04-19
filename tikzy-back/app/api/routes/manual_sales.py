from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.booking import Booking
from app.models.booking_seat import BookingSeat
from app.models.operator import Operator
from app.models.scheduled_trip import ScheduledTrip
from app.models.trip_session import TripSession
from app.models.user import User
from app.models.vehicle_seat import VehicleSeat
from app.schemas.manual_sale import ManualSaleCreateRequest, ManualSaleResponse

router = APIRouter(prefix="/manual-sales", tags=["Manual Sales"])


def get_current_operator(db: Session, current_user: User) -> Operator:
    if not current_user.is_operator:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Current user is not an operator",
        )

    operator = db.query(Operator).filter(Operator.email == current_user.email).first()

    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operator profile not found for current user",
        )

    if not operator.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Operator is inactive",
        )

    return operator


def get_active_trip_session(db: Session, operator_id: int) -> TripSession:
    trip_session = (
        db.query(TripSession)
        .options(
            joinedload(TripSession.scheduled_trip),
            joinedload(TripSession.vehicle),
        )
        .filter(TripSession.operator_id == operator_id)
        .filter(TripSession.status == "active")
        .order_by(TripSession.started_at.desc())
        .first()
    )

    if not trip_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active trip session found",
        )

    return trip_session


@router.post("/", response_model=ManualSaleResponse, status_code=status.HTTP_201_CREATED)
def create_manual_sale(
    payload: ManualSaleCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)
    trip_session = get_active_trip_session(db, operator.id)

    trip = trip_session.scheduled_trip
    vehicle = trip_session.vehicle

    normalized_seats = [
        seat.strip().upper() for seat in payload.seat_numbers if seat.strip()
    ]

    if not normalized_seats:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one seat must be selected",
        )

    if len(normalized_seats) != payload.passenger_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passenger count must match selected seats",
        )

    if len(set(normalized_seats)) != len(normalized_seats):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seat numbers cannot be duplicated",
        )

    if trip.available_seats < payload.passenger_count:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enough seats available",
        )

    vehicle_seats = (
        db.query(VehicleSeat)
        .filter(
            VehicleSeat.vehicle_id == vehicle.id,
            VehicleSeat.seat_number.in_(normalized_seats),
            VehicleSeat.is_active.is_(True),
        )
        .all()
    )

    if len(vehicle_seats) != len(normalized_seats):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more selected seats do not exist for this vehicle",
        )

    seat_map = {seat.seat_number: seat for seat in vehicle_seats}
    selected_ids = [seat_map[seat_number].id for seat_number in normalized_seats]

    occupied = (
        db.query(BookingSeat)
        .join(BookingSeat.booking)
        .filter(
            BookingSeat.scheduled_trip_id == trip.id,
            BookingSeat.vehicle_seat_id.in_(selected_ids),
            Booking.status.in_(["confirmed", "paid", "boarded"]),
        )
        .all()
    )

    if occupied:
        occupied_numbers = [item.seat_number for item in occupied]
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Seats already occupied: {', '.join(occupied_numbers)}",
        )

    total_amount = Decimal(trip.price) * payload.passenger_count

    booking = Booking(
        scheduled_trip_id=trip.id,
        customer_name=payload.customer_name.strip(),
        customer_email=payload.customer_email.strip().lower() if payload.customer_email else None,
        customer_phone=payload.customer_phone.strip() if payload.customer_phone else None,
        passenger_count=payload.passenger_count,
        total_amount=total_amount,
        status="confirmed",
    )

    db.add(booking)
    db.flush()

    for seat_number in normalized_seats:
        seat = seat_map[seat_number]
        db.add(
            BookingSeat(
                booking_id=booking.id,
                scheduled_trip_id=trip.id,
                vehicle_seat_id=seat.id,
                seat_number=seat.seat_number,
            )
        )

    trip.available_seats -= payload.passenger_count
    db.add(trip)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="One or more selected seats were just taken",
        )

    db.refresh(booking)

    return ManualSaleResponse(
        booking_id=booking.id,
        ticket_code=f"TK-{booking.id}",
        scheduled_trip_id=trip.id,
        customer_name=booking.customer_name,
        customer_phone=booking.customer_phone,
        customer_email=booking.customer_email,
        passenger_count=booking.passenger_count,
        seat_numbers=normalized_seats,
        total_amount=booking.total_amount,
        status=booking.status,
        payment_method=payload.payment_method,
        created_at=booking.created_at,
    )