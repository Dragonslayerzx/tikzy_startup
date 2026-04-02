from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.scheduled_trip import ScheduledTrip
from app.models.vehicle import Vehicle
from app.models.vehicle_location import VehicleLocation
from app.schemas.vehicle_location import VehicleLocationCreate, VehicleLocationResponse

router = APIRouter(prefix="/locations", tags=["Locations"])


@router.post("/", response_model=VehicleLocationResponse)
def create_location(location: VehicleLocationCreate, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == location.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db_location = VehicleLocation(
        vehicle_id=location.vehicle_id,
        latitude=location.latitude,
        longitude=location.longitude,
    )
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location


@router.get("/vehicle/{vehicle_id}", response_model=list[VehicleLocationResponse])
def get_vehicle_locations(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    return (
        db.query(VehicleLocation)
        .filter(VehicleLocation.vehicle_id == vehicle_id)
        .order_by(VehicleLocation.recorded_at.desc())
        .all()
    )


@router.get("/scheduled-trip/{scheduled_trip_id}", response_model=list[VehicleLocationResponse])
def get_scheduled_trip_locations(scheduled_trip_id: int, db: Session = Depends(get_db)):
    scheduled_trip = (
        db.query(ScheduledTrip)
        .filter(ScheduledTrip.id == scheduled_trip_id)
        .first()
    )
    if not scheduled_trip:
        raise HTTPException(status_code=404, detail="Scheduled trip not found")

    return (
        db.query(VehicleLocation)
        .filter(VehicleLocation.vehicle_id == scheduled_trip.vehicle_id)
        .order_by(VehicleLocation.recorded_at.desc())
        .all()
    )