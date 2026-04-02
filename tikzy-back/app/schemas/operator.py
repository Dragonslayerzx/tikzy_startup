from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OperatorBase(BaseModel):
    company_id: int
    full_name: str = Field(..., min_length=2, max_length=150)
    identity_number: Optional[str] = Field(default=None, max_length=50)
    email: Optional[str] = Field(default=None, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)
    license_number: Optional[str] = Field(default=None, max_length=80)
    rating: float = 0.0
    is_active: bool = True


class OperatorCreate(OperatorBase):
    pass


class OperatorUpdate(BaseModel):
    company_id: Optional[int] = None
    full_name: Optional[str] = Field(default=None, min_length=2, max_length=150)
    identity_number: Optional[str] = Field(default=None, max_length=50)
    email: Optional[str] = Field(default=None, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)
    license_number: Optional[str] = Field(default=None, max_length=80)
    rating: Optional[float] = None
    is_active: Optional[bool] = None


class OperatorResponse(OperatorBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)