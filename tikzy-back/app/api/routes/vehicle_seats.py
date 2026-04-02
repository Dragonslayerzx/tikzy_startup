from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.booking_seat import BookingSeat
from app.models.scheduled_trip import ScheduledTrip
from app.models.vehicle import Vehicle
from app.models.vehicle_seat import VehicleSeat
from app.schemas.vehicle_seat import (
    ScheduledTripSeatMapItem,
    VehicleSeatBulkCreate,
    VehicleSeatCreate,
    VehicleSeatResponse,
)

router = APIRouter(prefix="/vehicle-seats", tags=["Vehicle Seats"])


@router.get("/vehicle/{vehicle_id}", response_model=list[VehicleSeatResponse])
def get_vehicle_seats(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return (
        db.query(VehicleSeat)
        .filter(VehicleSeat.vehicle_id == vehicle_id)
        .order_by(VehicleSeat.row_number.asc(), VehicleSeat.column_label.asc())
        .all()
    )


@router.post("/", response_model=VehicleSeatResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle_seat(payload: VehicleSeatCreate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == payload.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    existing = (
        db.query(VehicleSeat)
        .filter(
            VehicleSeat.vehicle_id == payload.vehicle_id,
            VehicleSeat.seat_number == payload.seat_number,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Seat number already exists for this vehicle")

    seat = VehicleSeat(**payload.model_dump())
    db.add(seat)
    db.commit()
    db.refresh(seat)
    return seat


@router.post("/vehicle/{vehicle_id}/bulk", response_model=list[VehicleSeatResponse], status_code=status.HTTP_201_CREATED)
def bulk_create_vehicle_seats(vehicle_id: int, payload: VehicleSeatBulkCreate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    if not payload.seats:
        raise HTTPException(status_code=400, detail="At least one seat is required")

    existing_count = db.query(VehicleSeat).filter(VehicleSeat.vehicle_id == vehicle_id).count()
    if existing_count > 0:
        raise HTTPException(
            status_code=400,
            detail="This vehicle already has seats configured",
        )

    if len(payload.seats) > vehicle.seats_capacity:
        raise HTTPException(
            status_code=400,
            detail="Provided seats exceed vehicle capacity",
        )

    seen = set()
    created = []

    for item in payload.seats:
        normalized = item.seat_number.strip().upper()
        if normalized in seen:
            raise HTTPException(status_code=400, detail=f"Duplicate seat number: {normalized}")
        seen.add(normalized)

        seat = VehicleSeat(
            vehicle_id=vehicle_id,
            seat_number=normalized,
            row_number=item.row_number,
            column_label=item.column_label.strip().upper(),
            seat_type=item.seat_type,
            position=item.position,
            is_active=item.is_active,
        )
        db.add(seat)
        created.append(seat)

    db.commit()

    for seat in created:
        db.refresh(seat)

    return created


@router.get("/scheduled-trip/{scheduled_trip_id}/map", response_model=list[ScheduledTripSeatMapItem])
def get_scheduled_trip_seat_map(scheduled_trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(ScheduledTrip).filter(ScheduledTrip.id == scheduled_trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Scheduled trip not found")

    seats = (
        db.query(VehicleSeat)
        .filter(VehicleSeat.vehicle_id == trip.vehicle_id)
        .order_by(VehicleSeat.row_number.asc(), VehicleSeat.column_label.asc())
        .all()
    )

    occupied_rows = (
        db.query(BookingSeat.vehicle_seat_id)
        .join(BookingSeat.booking)
        .filter(
            BookingSeat.scheduled_trip_id == scheduled_trip_id,
            BookingSeat.booking.has(status="confirmed"),
        )
        .all()
    )
    occupied_ids = {row[0] for row in occupied_rows}

    result = []
    for seat in seats:
        result.append(
            ScheduledTripSeatMapItem(
                vehicle_seat_id=seat.id,
                seat_number=seat.seat_number,
                row_number=seat.row_number,
                column_label=seat.column_label,
                seat_type=seat.seat_type,
                position=seat.position,
                is_active=seat.is_active,
                is_occupied=seat.id in occupied_ids,
            )
        )

    return result