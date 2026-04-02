from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.models.booking_seat import BookingSeat
from app.models.booking import Booking
from app.models.vehicle_seat import VehicleSeat
from app.core.database import get_db
from app.models.company import Company
from app.models.operator import Operator
from app.models.route import Route
from app.models.scheduled_trip import ScheduledTrip
from app.models.vehicle import Vehicle
from app.schemas.scheduled_trip import (
    ScheduledTripCreate,
    ScheduledTripResponse,
    ScheduledTripSearchItem,
    ScheduledTripUpdate,
)

router = APIRouter(prefix="/scheduled-trips", tags=["Scheduled Trips"])

ALLOWED_STATUSES = {"scheduled", "boarding", "departed", "arrived", "cancelled"}
ALLOWED_SERVICE_TYPES = {"direct", "1_stop", "2_stops", "multi_stop"}


@router.get("/", response_model=list[ScheduledTripResponse])
def get_scheduled_trips(
    company_id: int | None = Query(default=None),
    vehicle_id: int | None = Query(default=None),
    route_id: int | None = Query(default=None),
    travel_date: date | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
):
    query = db.query(ScheduledTrip)

    if company_id is not None:
        query = query.filter(ScheduledTrip.company_id == company_id)

    if vehicle_id is not None:
        query = query.filter(ScheduledTrip.vehicle_id == vehicle_id)

    if route_id is not None:
        query = query.filter(ScheduledTrip.route_id == route_id)

    if travel_date is not None:
        query = query.filter(ScheduledTrip.travel_date == travel_date)

    if status_filter is not None:
        query = query.filter(ScheduledTrip.status == status_filter)

    return query.order_by(
        ScheduledTrip.travel_date.asc(),
        ScheduledTrip.departure_time.asc(),
    ).all()


@router.get("/search", response_model=list[ScheduledTripSearchItem])
def search_scheduled_trips(
    origin: str = Query(..., min_length=2),
    destination: str = Query(..., min_length=2),
    date_value: date = Query(..., alias="date"),
    passengers: int = Query(default=1, ge=1),
    db: Session = Depends(get_db),
):
    trips = (
        db.query(ScheduledTrip)
        .options(
            joinedload(ScheduledTrip.company),
            joinedload(ScheduledTrip.vehicle),
            joinedload(ScheduledTrip.route),
        )
        .join(Route, ScheduledTrip.route_id == Route.id)
        .join(Company, ScheduledTrip.company_id == Company.id)
        .join(Vehicle, ScheduledTrip.vehicle_id == Vehicle.id)
        .filter(Route.origin_city.ilike(origin.strip()))
        .filter(Route.destination_city.ilike(destination.strip()))
        .filter(Route.is_active.is_(True))
        .filter(Company.is_active.is_(True))
        .filter(Vehicle.is_active.is_(True))
        .filter(ScheduledTrip.travel_date == date_value)
        .filter(ScheduledTrip.status == "scheduled")
        .filter(ScheduledTrip.available_seats >= passengers)
        .order_by(ScheduledTrip.price.asc(), ScheduledTrip.departure_time.asc())
        .all()
    )

    result = []
    for trip in trips:
        vehicle_label = f"{trip.vehicle.brand} - {trip.vehicle.model}"
        result.append(
            ScheduledTripSearchItem(
                id=trip.id,
                company_id=trip.company_id,
                company_name=trip.company.name,
                company_logo_url=trip.company.logo_url,
                company_rating=trip.company.rating,
                vehicle_id=trip.vehicle_id,
                vehicle_label=vehicle_label,
                bus_type=trip.vehicle.bus_type,
                route_id=trip.route_id,
                origin_city=trip.route.origin_city,
                destination_city=trip.route.destination_city,
                travel_date=trip.travel_date,
                departure_time=trip.departure_time,
                arrival_time=trip.arrival_time,
                estimated_duration_minutes=trip.route.estimated_duration_minutes,
                meeting_point=trip.meeting_point,
                service_type=trip.service_type,
                price=trip.price,
                currency=trip.currency,
                available_seats=trip.available_seats,
                status=trip.status,
            )
        )

    return result


@router.get("/{scheduled_trip_id}", response_model=ScheduledTripResponse)
def get_scheduled_trip(scheduled_trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(ScheduledTrip).filter(ScheduledTrip.id == scheduled_trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )
    return trip


@router.post("/", response_model=ScheduledTripResponse, status_code=status.HTTP_201_CREATED)
def create_scheduled_trip(payload: ScheduledTripCreate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == payload.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    route = db.query(Route).filter(Route.id == payload.route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found",
        )

    if vehicle.company_id != payload.company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle does not belong to the selected company",
        )

    if payload.operator_id is not None:
        operator = db.query(Operator).filter(Operator.id == payload.operator_id).first()
        if not operator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Operator not found",
            )
        if operator.company_id != payload.company_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Operator does not belong to the selected company",
            )

    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status",
        )

    if payload.service_type not in ALLOWED_SERVICE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service type",
        )

    if payload.available_seats > vehicle.seats_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Available seats cannot exceed vehicle capacity",
        )

    trip = ScheduledTrip(**payload.model_dump())
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return trip


@router.put("/{scheduled_trip_id}", response_model=ScheduledTripResponse)
def update_scheduled_trip(
    scheduled_trip_id: int,
    payload: ScheduledTripUpdate,
    db: Session = Depends(get_db),
):
    trip = db.query(ScheduledTrip).filter(ScheduledTrip.id == scheduled_trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    new_company_id = update_data.get("company_id", trip.company_id)
    new_vehicle_id = update_data.get("vehicle_id", trip.vehicle_id)
    new_operator_id = update_data.get("operator_id", trip.operator_id)
    new_route_id = update_data.get("route_id", trip.route_id)
    new_status = update_data.get("status", trip.status)
    new_service_type = update_data.get("service_type", trip.service_type)
    new_available_seats = update_data.get("available_seats", trip.available_seats)

    company = db.query(Company).filter(Company.id == new_company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    vehicle = db.query(Vehicle).filter(Vehicle.id == new_vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    route = db.query(Route).filter(Route.id == new_route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Route not found",
        )

    if vehicle.company_id != new_company_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle does not belong to the selected company",
        )

    if new_operator_id is not None:
        operator = db.query(Operator).filter(Operator.id == new_operator_id).first()
        if not operator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Operator not found",
            )
        if operator.company_id != new_company_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Operator does not belong to the selected company",
            )

    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid status",
        )

    if new_service_type not in ALLOWED_SERVICE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid service type",
        )

    if new_available_seats > vehicle.seats_capacity:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Available seats cannot exceed vehicle capacity",
        )

    for field, value in update_data.items():
        setattr(trip, field, value)

    db.commit()
    db.refresh(trip)
    return trip


@router.delete("/{scheduled_trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_scheduled_trip(scheduled_trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(ScheduledTrip).filter(ScheduledTrip.id == scheduled_trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )

    db.delete(trip)
    db.commit()
    return None

@router.get("/{scheduled_trip_id}/occupied-seats", response_model=list[str])
def get_occupied_seats(scheduled_trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(ScheduledTrip).filter(ScheduledTrip.id == scheduled_trip_id).first()
    if not trip:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scheduled trip not found",
        )

    occupied = (
        db.query(BookingSeat.seat_number)
        .join(Booking, Booking.id == BookingSeat.booking_id)
        .filter(
            BookingSeat.scheduled_trip_id == scheduled_trip_id,
            Booking.status == "confirmed",
        )
        .order_by(BookingSeat.seat_number.asc())
        .all()
    )

    return [row[0] for row in occupied]