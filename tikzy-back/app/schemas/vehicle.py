from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class VehicleBase(BaseModel):
    company_id: int
    operator_id: Optional[int] = None

    internal_code: str = Field(..., min_length=1, max_length=50)
    plate_number: str = Field(..., min_length=1, max_length=20)

    brand: str = Field(..., min_length=1, max_length=80)
    model: str = Field(..., min_length=1, max_length=120)
    bus_type: str = Field(default="Ejecutivo", min_length=1, max_length=80)

    seats_capacity: int = 40
    amenities: Optional[str] = None

    color: Optional[str] = Field(default=None, max_length=50)
    year: Optional[int] = None

    is_active: bool = True


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    company_id: Optional[int] = None
    operator_id: Optional[int] = None

    internal_code: Optional[str] = Field(default=None, min_length=1, max_length=50)
    plate_number: Optional[str] = Field(default=None, min_length=1, max_length=20)

    brand: Optional[str] = Field(default=None, min_length=1, max_length=80)
    model: Optional[str] = Field(default=None, min_length=1, max_length=120)
    bus_type: Optional[str] = Field(default=None, min_length=1, max_length=80)

    seats_capacity: Optional[int] = None
    amenities: Optional[str] = None

    color: Optional[str] = Field(default=None, max_length=50)
    year: Optional[int] = None

    is_active: Optional[bool] = None


class VehicleResponse(VehicleBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)