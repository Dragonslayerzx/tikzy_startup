from datetime import datetime
from pydantic import BaseModel


class TripCreate(BaseModel):
    operator_id: int
    vehicle_id: int
    start_lat: float | None = None
    start_lng: float | None = None


class TripStatusUpdate(BaseModel):
    status: str
    end_lat: float | None = None
    end_lng: float | None = None


class TripResponse(BaseModel):
    id: int
    operator_id: int
    vehicle_id: int
    start_lat: float | None = None
    start_lng: float | None = None
    end_lat: float | None = None
    end_lng: float | None = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True