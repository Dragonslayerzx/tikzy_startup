from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class TicketValidateRequest(BaseModel):
    qr_code: str


class TicketConfirmRequest(BaseModel):
    booking_id: int


class TicketSeatItem(BaseModel):
    seat_number: str


class TicketValidationResponse(BaseModel):
    booking_id: int
    ticket_code: str
    status: str
    is_boarded: bool

    customer_name: str
    customer_email: Optional[str] = None
    customer_phone: Optional[str] = None

    passenger_count: int
    seats: list[TicketSeatItem]
    total_amount: Decimal

    scheduled_trip_id: int
    origin_city: str
    destination_city: str
    departure_time: str
    arrival_time: str
    route_label: str

    validated_at: datetime | None = None