from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.company import Company
from app.models.operator import Operator
from app.schemas.operator import OperatorCreate, OperatorResponse, OperatorUpdate

router = APIRouter(prefix="/operators", tags=["Operators"])


@router.get("/", response_model=list[OperatorResponse])
def get_operators(
    company_id: int | None = Query(default=None),
    active_only: bool = Query(default=False),
    db: Session = Depends(get_db),
):
    query = db.query(Operator)

    if company_id is not None:
        query = query.filter(Operator.company_id == company_id)

    if active_only:
        query = query.filter(Operator.is_active.is_(True))

    return query.order_by(Operator.full_name.asc()).all()


@router.get("/{operator_id}", response_model=OperatorResponse)
def get_operator(operator_id: int, db: Session = Depends(get_db)):
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operator not found",
        )
    return operator


@router.post("/", response_model=OperatorResponse, status_code=status.HTTP_201_CREATED)
def create_operator(payload: OperatorCreate, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == payload.company_id).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if payload.identity_number:
        existing_identity = (
            db.query(Operator)
            .filter(Operator.identity_number == payload.identity_number)
            .first()
        )
        if existing_identity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An operator with that identity number already exists",
            )

    if payload.email:
        existing_email = db.query(Operator).filter(Operator.email == payload.email).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An operator with that email already exists",
            )

    if payload.license_number:
        existing_license = (
            db.query(Operator)
            .filter(Operator.license_number == payload.license_number)
            .first()
        )
        if existing_license:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An operator with that license number already exists",
            )

    operator = Operator(**payload.model_dump())
    db.add(operator)
    db.commit()
    db.refresh(operator)
    return operator


@router.put("/{operator_id}", response_model=OperatorResponse)
def update_operator(
    operator_id: int,
    payload: OperatorUpdate,
    db: Session = Depends(get_db),
):
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operator not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "company_id" in update_data:
        company = db.query(Company).filter(Company.id == update_data["company_id"]).first()
        if not company:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Company not found",
            )

    if "identity_number" in update_data and update_data["identity_number"]:
        existing_identity = (
            db.query(Operator)
            .filter(
                Operator.identity_number == update_data["identity_number"],
                Operator.id != operator_id,
            )
            .first()
        )
        if existing_identity:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An operator with that identity number already exists",
            )

    if "email" in update_data and update_data["email"]:
        existing_email = (
            db.query(Operator)
            .filter(Operator.email == update_data["email"], Operator.id != operator_id)
            .first()
        )
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An operator with that email already exists",
            )

    if "license_number" in update_data and update_data["license_number"]:
        existing_license = (
            db.query(Operator)
            .filter(
                Operator.license_number == update_data["license_number"],
                Operator.id != operator_id,
            )
            .first()
        )
        if existing_license:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An operator with that license number already exists",
            )

    for field, value in update_data.items():
        setattr(operator, field, value)

    db.commit()
    db.refresh(operator)
    return operator


@router.delete("/{operator_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_operator(operator_id: int, db: Session = Depends(get_db)):
    operator = db.query(Operator).filter(Operator.id == operator_id).first()
    if not operator:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Operator not found",
        )

    db.delete(operator)
    db.commit()
    return None