from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class BookingBase(BaseModel):
    scheduled_trip_id: int
    customer_name: str = Field(..., min_length=2, max_length=150)
    customer_email: Optional[EmailStr] = None
    customer_phone: Optional[str] = Field(default=None, max_length=30)
    passenger_count: int = Field(default=1, ge=1)
    seat_numbers: list[str] = Field(default_factory=list)


class BookingCreate(BookingBase):
    pass


class BookingUpdateStatus(BaseModel):
    status: str = Field(..., min_length=1, max_length=30)


class BookingSeatResponse(BaseModel):
    id: int
    vehicle_seat_id: int
    seat_number: str

    model_config = ConfigDict(from_attributes=True)


class BookingResponse(BaseModel):
    id: int
    scheduled_trip_id: int
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None
    passenger_count: int
    total_amount: Decimal
    status: str
    seats: list[BookingSeatResponse]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)