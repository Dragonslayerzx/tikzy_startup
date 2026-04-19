import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.booking import Booking
from app.models.operator import Operator
from app.models.scheduled_trip import ScheduledTrip
from app.models.trip_session import TripSession
from app.models.user import User
from app.schemas.ticket import (
    TicketConfirmRequest,
    TicketSeatItem,
    TicketValidateRequest,
    TicketValidationResponse,
)

router = APIRouter(prefix="/tickets", tags=["Tickets"])

VALID_BOOKING_STATUSES_FOR_SCAN = {"confirmed", "paid", "boarded"}


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
            joinedload(TripSession.scheduled_trip).joinedload(ScheduledTrip.route),
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


def extract_booking_id_from_qr(qr_code: str) -> int:
    value = qr_code.strip()

    patterns = [
        r"^tikzy-booking-(\d+)$",
        r"^TK-(\d+)$",
        r"^booking:(\d+)$",
        r"^(\d+)$",
    ]

    for pattern in patterns:
        match = re.fullmatch(pattern, value, flags=re.IGNORECASE)
        if match:
            return int(match.group(1))

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid QR code format",
    )


def serialize_ticket_validation(booking: Booking, scheduled_trip: ScheduledTrip) -> TicketValidationResponse:
    route = scheduled_trip.route
    is_boarded = booking.status == "boarded"

    return TicketValidationResponse(
        booking_id=booking.id,
        ticket_code=f"TK-{booking.id}",
        status=booking.status,
        is_boarded=is_boarded,
        customer_name=booking.customer_name,
        customer_email=booking.customer_email,
        customer_phone=booking.customer_phone,
        passenger_count=booking.passenger_count,
        seats=[
            TicketSeatItem(seat_number=seat.seat_number)
            for seat in booking.booking_seats
        ],
        total_amount=booking.total_amount,
        scheduled_trip_id=scheduled_trip.id,
        origin_city=route.origin_city,
        destination_city=route.destination_city,
        departure_time=scheduled_trip.departure_time.strftime("%H:%M"),
        arrival_time=scheduled_trip.arrival_time.strftime("%H:%M"),
        route_label=f"{route.id} - {scheduled_trip.service_type.capitalize()}",
        validated_at=datetime.now(timezone.utc),
    )


@router.post("/validate", response_model=TicketValidationResponse)
def validate_ticket(
    payload: TicketValidateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)
    trip_session = get_active_trip_session(db, operator.id)

    booking_id = extract_booking_id_from_qr(payload.qr_code)

    booking = (
        db.query(Booking)
        .options(
            joinedload(Booking.booking_seats),
            joinedload(Booking.scheduled_trip).joinedload(ScheduledTrip.route),
        )
        .filter(Booking.id == booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.scheduled_trip_id != trip_session.scheduled_trip_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This ticket does not belong to the current active trip",
        )

    if booking.status not in VALID_BOOKING_STATUSES_FOR_SCAN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This ticket cannot be validated from its current status",
        )

    return serialize_ticket_validation(booking, booking.scheduled_trip)


@router.post("/confirm", response_model=TicketValidationResponse)
def confirm_ticket_boarding(
    payload: TicketConfirmRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)
    trip_session = get_active_trip_session(db, operator.id)

    booking = (
        db.query(Booking)
        .options(
            joinedload(Booking.booking_seats),
            joinedload(Booking.scheduled_trip).joinedload(ScheduledTrip.route),
        )
        .filter(Booking.id == payload.booking_id)
        .first()
    )

    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.scheduled_trip_id != trip_session.scheduled_trip_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This ticket does not belong to the current active trip",
        )

    if booking.status == "boarded":
        return serialize_ticket_validation(booking, booking.scheduled_trip)

    if booking.status not in {"confirmed", "paid"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This ticket cannot be boarded from its current status",
        )

    booking.status = "boarded"

    db.add(booking)
    db.commit()
    db.refresh(booking)

    booking = (
        db.query(Booking)
        .options(
            joinedload(Booking.booking_seats),
            joinedload(Booking.scheduled_trip).joinedload(ScheduledTrip.route),
        )
        .filter(Booking.id == booking.id)
        .first()
    )

    return serialize_ticket_validation(booking, booking.scheduled_trip)