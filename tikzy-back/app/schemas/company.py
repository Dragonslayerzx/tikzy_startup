from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class VehicleSummary(BaseModel):
    id: int
    internal_code: str
    plate_number: str
    brand: str
    model: str
    bus_type: str
    seats_capacity: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class OperatorSummary(BaseModel):
    id: int
    full_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    rating: float
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class CompanyBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    slug: str = Field(..., min_length=2, max_length=180)

    description: Optional[str] = None
    logo_url: Optional[str] = None

    rating: float = 0.0
    reviews_count: int = 0

    support_phone: Optional[str] = None
    support_email: Optional[str] = None

    is_active: bool = True


class CompanyCreate(CompanyBase):
    pass


class CompanyUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    slug: Optional[str] = Field(default=None, min_length=2, max_length=180)

    description: Optional[str] = None
    logo_url: Optional[str] = None

    rating: Optional[float] = None
    reviews_count: Optional[int] = None

    support_phone: Optional[str] = None
    support_email: Optional[str] = None

    is_active: Optional[bool] = None


class CompanyResponse(CompanyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    vehicles: List[VehicleSummary] = []
    operators: List[OperatorSummary] = []

    model_config = ConfigDict(from_attributes=True)


class CompanyListItem(BaseModel):
    id: int
    name: str
    slug: str
    logo_url: Optional[str] = None
    rating: float
    reviews_count: int
    is_active: bool
    vehicles_count: int
    operators_count: int

    model_config = ConfigDict(from_attributes=True)