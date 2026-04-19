from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, Field


class ManualSaleCreateRequest(BaseModel):
    customer_name: str = Field(..., min_length=2, max_length=150)
    customer_phone: Optional[str] = Field(default=None, max_length=30)
    customer_email: Optional[str] = Field(default=None, max_length=150)
    passenger_count: int = Field(..., ge=1, le=10)
    seat_numbers: list[str]
    payment_method: str = Field(default="cash", max_length=30)
    notes: Optional[str] = Field(default=None, max_length=255)


class ManualSaleResponse(BaseModel):
    booking_id: int
    ticket_code: str
    scheduled_trip_id: int
    customer_name: str
    customer_phone: Optional[str] = None
    customer_email: Optional[str] = None
    passenger_count: int
    seat_numbers: list[str]
    total_amount: Decimal
    status: str
    payment_method: str
    created_at: datetime