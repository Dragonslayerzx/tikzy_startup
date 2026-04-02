from datetime import datetime
from pydantic import BaseModel


class VehicleLocationCreate(BaseModel):
    vehicle_id: int
    latitude: float
    longitude: float


class VehicleLocationResponse(BaseModel):
    id: int
    vehicle_id: int
    latitude: float
    longitude: float
    recorded_at: datetime

    class Config:
        from_attributes = True