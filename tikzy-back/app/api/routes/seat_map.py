from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.booking import Booking
from app.models.operator import Operator
from app.models.scheduled_trip import ScheduledTrip
from app.models.trip_session import TripSession
from app.models.user import User
from app.models.vehicle_seat import VehicleSeat
from app.schemas.seat_map import SeatMapResponse, SeatMapSeatItem

router = APIRouter(prefix="/trip-sessions", tags=["Seat Map"])


def get_current_operator(db: Session, current_user: User) -> Operator:
    if not current_user.is_operator:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Current user is not an operator",
        )

    operator = (
        db.query(Operator)
        .filter(Operator.email == current_user.email)
        .first()
    )

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


@router.get("/current/seats", response_model=SeatMapResponse)
def get_current_trip_seat_map(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)
    trip_session = get_active_trip_session(db, operator.id)

    vehicle = trip_session.vehicle
    scheduled_trip = trip_session.scheduled_trip

    vehicle_seats = (
        db.query(VehicleSeat)
        .filter(VehicleSeat.vehicle_id == vehicle.id)
        .order_by(VehicleSeat.row_number.asc(), VehicleSeat.seat_number.asc())
        .all()
    )

    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.booking_seats))
        .filter(Booking.scheduled_trip_id == scheduled_trip.id)
        .filter(Booking.status.in_(["confirmed", "paid", "boarded"]))
        .all()
    )

    occupied_by_seat_number: dict[str, dict] = {}

    for booking in bookings:
        for booking_seat in booking.booking_seats:
            occupied_by_seat_number[booking_seat.seat_number] = {
                "booking_id": booking.id,
                "passenger_name": booking.customer_name,
                "booking_status": booking.status,
                "is_boarded": booking.status == "boarded",
            }

    seat_items: list[SeatMapSeatItem] = []
    occupied_count = 0
    boarded_count = 0

    for seat in vehicle_seats:
        occupied_info = occupied_by_seat_number.get(seat.seat_number)
        is_occupied = occupied_info is not None
        is_boarded = bool(occupied_info and occupied_info["is_boarded"])

        if is_occupied:
            occupied_count += 1
        if is_boarded:
            boarded_count += 1

        seat_items.append(
            SeatMapSeatItem(
                seat_id=seat.id,
                seat_number=seat.seat_number,
                row_number=seat.row_number,
                column_number=getattr(seat, "column_number", None),
                position_type=getattr(seat, "position_type", None),
                is_occupied=is_occupied,
                is_boarded=is_boarded,
                booking_id=occupied_info["booking_id"] if occupied_info else None,
                passenger_name=occupied_info["passenger_name"] if occupied_info else None,
                booking_status=occupied_info["booking_status"] if occupied_info else None,
            )
        )

    total_seats = len(vehicle_seats)

    return SeatMapResponse(
        trip_session_id=trip_session.id,
        scheduled_trip_id=scheduled_trip.id,
        vehicle_id=vehicle.id,
        vehicle_label=f"{vehicle.internal_code} · {vehicle.plate_number}",
        total_seats=total_seats,
        occupied_seats=occupied_count,
        boarded_seats=boarded_count,
        available_seats=total_seats - occupied_count,
        seats=seat_items,
    )