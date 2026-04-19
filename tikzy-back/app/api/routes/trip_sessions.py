from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.booking import Booking
from app.models.operator import Operator
from app.models.scheduled_trip import ScheduledTrip
from app.models.trip_session import TripSession
from app.models.user import User
from app.models.vehicle import Vehicle
from app.schemas.trip_session import (
    TripSessionDashboardResponse,
    TripSessionEndResponse,
    TripSessionResponse,
    TripSessionStartRequest,
)

router = APIRouter(prefix="/trip-sessions", tags=["Trip Sessions"])

ACTIVE_SESSION_STATUSES = {"active"}
SCHEDULED_TRIP_STARTABLE_STATUSES = {"scheduled", "boarding"}


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


@router.post("/start", response_model=TripSessionResponse, status_code=status.HTTP_201_CREATED)
def start_trip_session(
    payload: TripSessionStartRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)

    active_session = (
        db.query(TripSession)
        .filter(TripSession.operator_id == operator.id)
        .filter(TripSession.status.in_(ACTIVE_SESSION_STATUSES))
        .first()
    )
    if active_session:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Operator already has an active trip session",
        )

    scheduled_trip = (
        db.query(ScheduledTrip)
        .options(
            joinedload(ScheduledTrip.route),
            joinedload(ScheduledTrip.vehicle),
        )
        .filter(ScheduledTrip.id == payload.scheduled_trip_id)
        .first()
    )
    if not scheduled_trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )

    if scheduled_trip.status not in SCHEDULED_TRIP_STARTABLE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Scheduled trip cannot be started from its current status",
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    if not vehicle.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle is inactive",
        )

    if vehicle.company_id != scheduled_trip.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle does not belong to the scheduled trip company",
        )

    if vehicle.operator_id is not None and vehicle.operator_id != operator.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle is assigned to another operator",
        )

    existing_trip_session = (
        db.query(TripSession)
        .filter(TripSession.scheduled_trip_id == scheduled_trip.id)
        .filter(TripSession.status.in_(ACTIVE_SESSION_STATUSES))
        .first()
    )
    if existing_trip_session:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Scheduled trip already has an active trip session",
        )

    scheduled_trip.operator_id = operator.id
    scheduled_trip.vehicle_id = vehicle.id
    scheduled_trip.status = "boarding"

    trip_session = TripSession(
        scheduled_trip_id=scheduled_trip.id,
        operator_id=operator.id,
        vehicle_id=vehicle.id,
        status="active",
    )

    db.add(trip_session)
    db.add(scheduled_trip)
    db.commit()
    db.refresh(trip_session)

    return trip_session


@router.get("/current", response_model=TripSessionDashboardResponse)
def get_current_trip_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)

    trip_session = (
        db.query(TripSession)
        .options(
            joinedload(TripSession.scheduled_trip).joinedload(ScheduledTrip.route),
            joinedload(TripSession.vehicle),
        )
        .filter(TripSession.operator_id == operator.id)
        .filter(TripSession.status == "active")
        .order_by(TripSession.started_at.desc())
        .first()
    )

    if not trip_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active trip session found",
        )

    scheduled_trip = trip_session.scheduled_trip
    route = scheduled_trip.route
    vehicle = trip_session.vehicle

    occupied_seats_count = (
        db.query(Booking)
        .filter(Booking.scheduled_trip_id == scheduled_trip.id)
        .filter(Booking.status.in_(["confirmed", "paid", "boarded"]))
        .count()
    )

    total_capacity = vehicle.seats_capacity or 0
    occupancy_percent = (
        round((occupied_seats_count / total_capacity) * 100)
        if total_capacity > 0
        else 0
    )

    next_stop = route.destination_terminal or route.destination_city
    next_stop_minutes = max(route.estimated_duration_minutes or 0, 0)
    distance_km = float(route.distance_km or 0)

    return TripSessionDashboardResponse(
        trip_session_id=trip_session.id,
        scheduled_trip_id=scheduled_trip.id,
        operator_id=operator.id,
        operator_name=operator.full_name,
        vehicle_id=vehicle.id,
        vehicle_internal_code=vehicle.internal_code,
        vehicle_plate_number=vehicle.plate_number,
        total_capacity=total_capacity,
        route_id=route.id,
        origin_city=route.origin_city,
        destination_city=route.destination_city,
        next_stop=next_stop,
        next_stop_minutes=next_stop_minutes,
        distance_km=distance_km,
        current_occupancy=occupied_seats_count,
        occupancy_percent=occupancy_percent,
        departure_time=scheduled_trip.departure_time.strftime("%H:%M"),
        arrival_time=scheduled_trip.arrival_time.strftime("%H:%M"),
        price=scheduled_trip.price,
        currency=scheduled_trip.currency or "HNL",
        status=trip_session.status,
        started_at=trip_session.started_at,
    )


@router.post("/end", response_model=TripSessionEndResponse)
def end_current_trip_session(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    operator = get_current_operator(db, current_user)

    trip_session = (
        db.query(TripSession)
        .options(joinedload(TripSession.scheduled_trip))
        .filter(TripSession.operator_id == operator.id)
        .filter(TripSession.status == "active")
        .order_by(TripSession.started_at.desc())
        .first()
    )

    if not trip_session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active trip session found",
        )

    trip_session.status = "finished"
    trip_session.scheduled_trip.status = "arrived"
    trip_session.ended_at = db.scalar(db.func.now())

    db.add(trip_session)
    db.add(trip_session.scheduled_trip)
    db.commit()
    db.refresh(trip_session)

    return TripSessionEndResponse(
        message="Trip session ended successfully",
        trip_session=trip_session,
    )