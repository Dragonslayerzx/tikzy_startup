from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.company import Company
from app.schemas.company import (
    CompanyCreate,
    CompanyListItem,
    CompanyResponse,
    CompanyUpdate,
)

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("/", response_model=List[CompanyListItem])
def get_companies(
    active_only: bool = Query(default=False),
    search: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Company).options(
        joinedload(Company.vehicles),
        joinedload(Company.operators),
    )

    if active_only:
        query = query.filter(Company.is_active.is_(True))

    if search:
        search_value = f"%{search.strip()}%"
        query = query.filter(Company.name.ilike(search_value))

    companies = query.order_by(Company.name.asc()).all()

    result = []
    for company in companies:
        result.append(
            CompanyListItem(
                id=company.id,
                name=company.name,
                slug=company.slug,
                logo_url=company.logo_url,
                rating=company.rating,
                reviews_count=company.reviews_count,
                is_active=company.is_active,
                vehicles_count=len(company.vehicles),
                operators_count=len(company.operators),
            )
        )

    return result


@router.get("/active-options", response_model=List[CompanyListItem])
def get_active_company_options(db: Session = Depends(get_db)):
    companies = (
        db.query(Company)
        .options(joinedload(Company.vehicles), joinedload(Company.operators))
        .filter(Company.is_active.is_(True))
        .order_by(Company.name.asc())
        .all()
    )

    return [
        CompanyListItem(
            id=company.id,
            name=company.name,
            slug=company.slug,
            logo_url=company.logo_url,
            rating=company.rating,
            reviews_count=company.reviews_count,
            is_active=company.is_active,
            vehicles_count=len(company.vehicles),
            operators_count=len(company.operators),
        )
        for company in companies
    ]


@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = (
        db.query(Company)
        .options(
            joinedload(Company.vehicles),
            joinedload(Company.operators),
        )
        .filter(Company.id == company_id)
        .first()
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    return company


@router.post("/", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(payload: CompanyCreate, db: Session = Depends(get_db)):
    existing_by_name = db.query(Company).filter(Company.name == payload.name).first()
    if existing_by_name:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A company with that name already exists",
        )

    existing_by_slug = db.query(Company).filter(Company.slug == payload.slug).first()
    if existing_by_slug:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A company with that slug already exists",
        )

    company = Company(**payload.model_dump())
    db.add(company)
    db.commit()
    db.refresh(company)

    return company


@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: int,
    payload: CompanyUpdate,
    db: Session = Depends(get_db),
):
    company = db.query(Company).filter(Company.id == company_id).first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    update_data = payload.model_dump(exclude_unset=True)

    if "name" in update_data:
        existing_by_name = (
            db.query(Company)
            .filter(Company.name == update_data["name"], Company.id != company_id)
            .first()
        )
        if existing_by_name:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A company with that name already exists",
            )

    if "slug" in update_data:
        existing_by_slug = (
            db.query(Company)
            .filter(Company.slug == update_data["slug"], Company.id != company_id)
            .first()
        )
        if existing_by_slug:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A company with that slug already exists",
            )

    for field, value in update_data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)

    company = (
        db.query(Company)
        .options(
            joinedload(Company.vehicles),
            joinedload(Company.operators),
        )
        .filter(Company.id == company_id)
        .first()
    )

    return company


@router.delete("/{company_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.id == company_id).first()

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    db.delete(company)
    db.commit()
    return None