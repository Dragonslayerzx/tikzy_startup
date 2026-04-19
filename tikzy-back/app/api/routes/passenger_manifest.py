from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.booking import Booking
from app.models.operator import Operator
from app.models.scheduled_trip import ScheduledTrip
from app.models.trip_session import TripSession
from app.models.user import User
from app.schemas.passenger_manifest import (
    PassengerManifestItem,
    PassengerManifestResponse,
)

router = APIRouter(prefix="/trip-sessions", tags=["Passenger Manifest"])


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
            joinedload(TripSession.scheduled_trip).joinedload(ScheduledTrip.route),
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


@router.get("/current/passengers", response_model=PassengerManifestResponse)
def get_current_passenger_manifest(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)
    trip_session = get_active_trip_session(db, operator.id)

    scheduled_trip = trip_session.scheduled_trip
    route = scheduled_trip.route
    vehicle = trip_session.vehicle

    bookings = (
        db.query(Booking)
        .options(joinedload(Booking.booking_seats))
        .filter(Booking.scheduled_trip_id == scheduled_trip.id)
        .filter(Booking.status.in_(["confirmed", "paid", "boarded"]))
        .order_by(Booking.created_at.asc())
        .all()
    )

    manifest_items: list[PassengerManifestItem] = []

    total_passengers = 0
    boarded_count = 0

    for booking in bookings:
        seat_numbers = [seat.seat_number for seat in booking.booking_seats]
        primary_seat = seat_numbers[0] if seat_numbers else None
        is_boarded = booking.status == "boarded"

        total_passengers += booking.passenger_count
        if is_boarded:
            boarded_count += booking.passenger_count

        manifest_items.append(
            PassengerManifestItem(
                booking_id=booking.id,
                ticket_code=f"TK-{booking.id}",
                customer_name=booking.customer_name,
                customer_email=booking.customer_email,
                customer_phone=booking.customer_phone,
                passenger_count=booking.passenger_count,
                seat_numbers=seat_numbers,
                primary_seat=primary_seat,
                status=booking.status,
                is_boarded=is_boarded,
                total_amount=booking.total_amount,
                booked_at=booking.created_at,
                boarded_at=booking.updated_at if is_boarded else None,
            )
        )

    boarding_percent = round((boarded_count / total_passengers) * 100) if total_passengers > 0 else 0

    return PassengerManifestResponse(
        trip_session_id=trip_session.id,
        scheduled_trip_id=scheduled_trip.id,
        route_origin=route.origin_city,
        route_destination=route.destination_city,
        departure_time=scheduled_trip.departure_time.strftime("%H:%M"),
        vehicle_label=f"{vehicle.internal_code} · {vehicle.plate_number}",
        total_passengers=total_passengers,
        boarded_count=boarded_count,
        boarding_percent=boarding_percent,
        passengers=manifest_items,
    )