from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.booking import Booking
from app.models.booking_seat import BookingSeat
from app.models.scheduled_trip import ScheduledTrip
from app.models.vehicle_seat import VehicleSeat
from app.schemas.booking import BookingCreate, BookingResponse, BookingSeatResponse, BookingUpdateStatus

router = APIRouter(prefix="/bookings", tags=["Bookings"])

ALLOWED_BOOKING_STATUSES = {
    "pending_payment",
    "confirmed",
    "cancelled",
}


def serialize_booking(booking: Booking) -> BookingResponse:
    return BookingResponse(
        id=booking.id,
        scheduled_trip_id=booking.scheduled_trip_id,
        customer_name=booking.customer_name,
        customer_email=booking.customer_email,
        customer_phone=booking.customer_phone,
        passenger_count=booking.passenger_count,
        total_amount=booking.total_amount,
        status=booking.status,
        seats=[
            BookingSeatResponse(
                id=seat.id,
                vehicle_seat_id=seat.vehicle_seat_id,
                seat_number=seat.seat_number,
            )
            for seat in booking.booking_seats
        ],
        created_at=booking.created_at,
        updated_at=booking.updated_at,
    )


@router.get("/", response_model=list[BookingResponse])
def get_bookings(
    scheduled_trip_id: int | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(Booking).options(joinedload(Booking.booking_seats))

    if scheduled_trip_id is not None:
        query = query.filter(Booking.scheduled_trip_id == scheduled_trip_id)

    if status_filter is not None:
        query = query.filter(Booking.status == status_filter)

    bookings = query.order_by(Booking.created_at.desc()).all()
    return [serialize_booking(item) for item in bookings]


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.booking_seats))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )
    return serialize_booking(booking)


@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate, db: Session = Depends(get_db)):
    trip = (
        db.query(ScheduledTrip)
        .filter(ScheduledTrip.id == payload.scheduled_trip_id)
        .first()
    )
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )

    if trip.status != "scheduled":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This scheduled trip is not available for booking",
        )

    normalized_seats = [seat.strip().upper() for seat in payload.seat_numbers if seat.strip()]
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
            VehicleSeat.vehicle_id == trip.vehicle_id,
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

    for seat_number in normalized_seats:
        if seat_number not in seat_map:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Seat {seat_number} is invalid for this vehicle",
            )

    selected_ids = [seat_map[seat_number].id for seat_number in normalized_seats]

    occupied = (
        db.query(BookingSeat)
        .join(BookingSeat.booking)
        .filter(
            BookingSeat.scheduled_trip_id == trip.id,
            BookingSeat.vehicle_seat_id.in_(selected_ids),
            BookingSeat.booking.has(status="confirmed"),
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
        scheduled_trip_id=payload.scheduled_trip_id,
        customer_name=payload.customer_name,
        customer_email=payload.customer_email,
        customer_phone=payload.customer_phone,
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

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="One or more selected seats were just booked by another user",
        )

    db.refresh(booking)
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.booking_seats))
        .filter(Booking.id == booking.id)
        .first()
    )
    return serialize_booking(booking)


@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    payload: BookingUpdateStatus,
    db: Session = Depends(get_db),
):
    booking = (
        db.query(Booking)
        .options(joinedload(Booking.booking_seats))
        .filter(Booking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if payload.status not in ALLOWED_BOOKING_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid booking status",
        )

    if booking.status == payload.status:
        return serialize_booking(booking)

    trip = (
        db.query(ScheduledTrip)
        .filter(ScheduledTrip.id == booking.scheduled_trip_id)
        .first()
    )
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )

    if booking.status == "confirmed" and payload.status == "cancelled":
        trip.available_seats += booking.passenger_count

    booking.status = payload.status

    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(joinedload(Booking.booking_seats))
        .filter(Booking.id == booking.id)
        .first()
    )
    return serialize_booking(booking)