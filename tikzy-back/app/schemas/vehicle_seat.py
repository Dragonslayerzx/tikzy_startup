from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class VehicleSeatBase(BaseModel):
    seat_number: str = Field(..., min_length=1, max_length=10)
    row_number: int = Field(..., ge=1)
    column_label: str = Field(..., min_length=1, max_length=2)
    seat_type: str = Field(default="standard", min_length=1, max_length=20)
    position: Optional[str] = Field(default=None, max_length=20)
    is_active: bool = True


class VehicleSeatCreate(VehicleSeatBase):
    vehicle_id: int


class VehicleSeatBulkItem(BaseModel):
    seat_number: str = Field(..., min_length=1, max_length=10)
    row_number: int = Field(..., ge=1)
    column_label: str = Field(..., min_length=1, max_length=2)
    seat_type: str = Field(default="standard", min_length=1, max_length=20)
    position: Optional[str] = Field(default=None, max_length=20)
    is_active: bool = True


class VehicleSeatBulkCreate(BaseModel):
    seats: list[VehicleSeatBulkItem]


class VehicleSeatResponse(VehicleSeatBase):
    id: int
    vehicle_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ScheduledTripSeatMapItem(BaseModel):
    vehicle_seat_id: int
    seat_number: str
    row_number: int
    column_label: str
    seat_type: str
    position: Optional[str] = None
    is_active: bool
    is_occupied: bool

    model_config = ConfigDict(from_attributes=True)