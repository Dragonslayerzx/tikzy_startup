from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company import Company
from app.models.operator import Operator
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleResponse, VehicleUpdate

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.get("/", response_model=list[VehicleResponse])
def get_vehicles(
    company_id: int | None = Query(default=None),
    operator_id: int | None = Query(default=None),
    active_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    query = db.query(Vehicle)

    if company_id is not None:
        query = query.filter(Vehicle.company_id == company_id)

    if operator_id is not None:
        query = query.filter(Vehicle.operator_id == operator_id)

    if active_only:
        query = query.filter(Vehicle.is_active.is_(True))

    return query.order_by(Vehicle.id.asc()).all()


@router.get("/{vehicle_id}", response_model=VehicleResponse)
def get_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )
    return vehicle


@router.post("/", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def create_vehicle(payload: VehicleCreate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == payload.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
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

    existing_internal_code = (
        db.query(Vehicle)
        .filter(Vehicle.internal_code == payload.internal_code)
        .first()
    )
    if existing_internal_code:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A vehicle with that internal code already exists",
        )

    existing_plate = (
        db.query(Vehicle)
        .filter(Vehicle.plate_number == payload.plate_number)
        .first()
    )
    if existing_plate:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A vehicle with that plate number already exists",
        )

    vehicle = Vehicle(**payload.model_dump())
    db.add(vehicle)
    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.put("/{vehicle_id}", response_model=VehicleResponse)
def update_vehicle(
    vehicle_id: int,
    payload: VehicleUpdate,
    db: Session = Depends(get_db),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    new_company_id = update_data.get("company_id", vehicle.company_id)
    new_operator_id = update_data.get("operator_id", vehicle.operator_id)

    if "company_id" in update_data:
        company = db.query(Company).filter(Company.id == new_company_id).first()
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
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

    if "internal_code" in update_data and update_data["internal_code"]:
        existing_internal_code = (
            db.query(Vehicle)
            .filter(
                Vehicle.internal_code == update_data["internal_code"],
                Vehicle.id != vehicle_id,
            )
            .first()
        )
        if existing_internal_code:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A vehicle with that internal code already exists",
            )

    if "plate_number" in update_data and update_data["plate_number"]:
        existing_plate = (
            db.query(Vehicle)
            .filter(
                Vehicle.plate_number == update_data["plate_number"],
                Vehicle.id != vehicle_id,
            )
            .first()
        )
        if existing_plate:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A vehicle with that plate number already exists",
            )

    for field, value in update_data.items():
        setattr(vehicle, field, value)

    db.commit()
    db.refresh(vehicle)
    return vehicle


@router.delete("/{vehicle_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(vehicle_id: int, db: Session = Depends(get_db)):
    vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found",
        )

    db.delete(vehicle)
    db.commit()
    return None