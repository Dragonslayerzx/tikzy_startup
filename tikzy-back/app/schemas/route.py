from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class RouteBase(BaseModel):
    origin_city: str = Field(..., min_length=2, max_length=120)
    destination_city: str = Field(..., min_length=2, max_length=120)

    origin_terminal: Optional[str] = Field(default=None, max_length=180)
    destination_terminal: Optional[str] = Field(default=None, max_length=180)

    estimated_duration_minutes: int = 0
    distance_km: Optional[float] = None

    is_active: bool = True


class RouteCreate(RouteBase):
    pass


class RouteUpdate(BaseModel):
    origin_city: Optional[str] = Field(default=None, min_length=2, max_length=120)
    destination_city: Optional[str] = Field(default=None, min_length=2, max_length=120)

    origin_terminal: Optional[str] = Field(default=None, max_length=180)
    destination_terminal: Optional[str] = Field(default=None, max_length=180)

    estimated_duration_minutes: Optional[int] = None
    distance_km: Optional[float] = None

    is_active: Optional[bool] = None


class RouteResponse(RouteBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)