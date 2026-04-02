from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.operator import Operator
from app.models.vehicle import Vehicle
from app.models.trip import Trip
from app.schemas.trip import TripCreate, TripResponse, TripStatusUpdate

router = APIRouter(prefix="/trips", tags=["Trips"])

ALLOWED_STATUSES = {"pending", "active", "completed", "cancelled"}


@router.post("/", response_model=TripResponse)
def create_trip(trip: TripCreate, db: Session = Depends(get_db)):
    operator = db.query(Operator).filter(Operator.id == trip.operator_id).first()
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")

    vehicle = db.query(Vehicle).filter(Vehicle.id == trip.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    db_trip = Trip(
        operator_id=trip.operator_id,
        vehicle_id=trip.vehicle_id,
        start_lat=trip.start_lat,
        start_lng=trip.start_lng,
        status="pending",
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip


@router.get("/", response_model=list[TripResponse])
def get_trips(db: Session = Depends(get_db)):
    return db.query(Trip).all()


@router.get("/{trip_id}", response_model=TripResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.patch("/{trip_id}/status", response_model=TripResponse)
def update_trip_status(trip_id: int, payload: TripStatusUpdate, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")

    trip.status = payload.status

    if payload.status in {"completed", "cancelled"}:
        trip.end_lat = payload.end_lat
        trip.end_lng = payload.end_lng

    db.commit()
    db.refresh(trip)
    return trip