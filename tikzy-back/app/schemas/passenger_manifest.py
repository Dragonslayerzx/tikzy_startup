from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class PassengerManifestItem(BaseModel):
    booking_id: int
    ticket_code: str
    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

    passenger_count: int
    seat_numbers: list[str]
    primary_seat: Optional[str] = None

    status: str
    is_boarded: bool
    total_amount: Decimal
    booked_at: datetime
    boarded_at: Optional[datetime] = None


class PassengerManifestResponse(BaseModel):
    trip_session_id: int
    scheduled_trip_id: int
    route_origin: str
    route_destination: str
    departure_time: str
    vehicle_label: str

    total_passengers: int
    boarded_count: int
    boarding_percent: int

    passengers: list[PassengerManifestItem]