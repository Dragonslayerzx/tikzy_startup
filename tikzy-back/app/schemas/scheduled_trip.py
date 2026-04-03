from datetime import date, datetime, time
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ScheduledTripBase(BaseModel):
    company_id: int
    vehicle_id: int
    operator_id: Optional[int] = None
    route_id: int

    travel_date: date
    departure_time: time
    arrival_time: time

    price: Decimal = Decimal("0.00")
    currency: str = Field(default="HNL", min_length=1, max_length=10)

    meeting_point: Optional[str] = Field(default=None, max_length=255)
    service_type: str = Field(default="direct", min_length=1, max_length=50)
    available_seats: int = 0

    status: str = Field(default="scheduled", min_length=1, max_length=30)


class ScheduledTripCreate(ScheduledTripBase):
    pass


class ScheduledTripUpdate(BaseModel):
    company_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    operator_id: Optional[int] = None
    route_id: Optional[int] = None

    travel_date: Optional[date] = None
    departure_time: Optional[time] = None
    arrival_time: Optional[time] = None

    price: Optional[Decimal] = None
    currency: Optional[str] = Field(default=None, min_length=1, max_length=10)

    meeting_point: Optional[str] = Field(default=None, max_length=255)
    service_type: Optional[str] = Field(default=None, min_length=1, max_length=50)
    available_seats: Optional[int] = None

    status: Optional[str] = Field(default=None, min_length=1, max_length=30)


class ScheduledTripResponse(ScheduledTripBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScheduledTripSearchItem(BaseModel):
    id: int

    company_id: int
    company_name: str
    company_logo_url: Optional[str] = None
    company_rating: float

    vehicle_id: int
    vehicle_label: str
    bus_type: str

    route_id: int
    origin_city: str
    destination_city: str

    travel_date: date
    departure_time: time
    arrival_time: time

    estimated_duration_minutes: int
    meeting_point: Optional[str] = None
    service_type: str

    price: Decimal
    currency: str
    available_seats: int
    status: str

    model_config = ConfigDict(from_attributes=True)