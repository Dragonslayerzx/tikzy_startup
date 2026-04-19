from pydantic import BaseModel


class SeatMapSeatItem(BaseModel):
    seat_id: int
    seat_number: str
    row_number: int
    column_number: int | None = None
    position_type: str | None = None

    is_occupied: bool
    is_boarded: bool
    booking_id: int | None = None
    passenger_name: str | None = None
    booking_status: str | None = None


class SeatMapResponse(BaseModel):
    trip_session_id: int
    scheduled_trip_id: int
    vehicle_id: int
    vehicle_label: str
    total_seats: int
    occupied_seats: int
    boarded_seats: int
    available_seats: int
    seats: list[SeatMapSeatItem]