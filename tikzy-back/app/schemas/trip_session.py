from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TripSessionStartRequest(BaseModel):
    scheduled_trip_id: int
    vehicle_id: int


class TripSessionResponse(BaseModel):
    id: int
    scheduled_trip_id: int
    operator_id: int
    vehicle_id: int
    status: str
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    started_at: datetime
    ended_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TripSessionDashboardResponse(BaseModel):
    trip_session_id: int
    scheduled_trip_id: int
    operator_id: int
    operator_name: str

    vehicle_id: int
    vehicle_internal_code: str
    vehicle_plate_number: str
    total_capacity: int

    route_id: int
    origin_city: str
    destination_city: str
    next_stop: str
    next_stop_minutes: int
    distance_km: float

    current_occupancy: int
    occupancy_percent: int

    departure_time: str
    arrival_time: str
    status: str
    started_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TripSessionEndResponse(BaseModel):
    message: str
    trip_session: TripSessionResponse