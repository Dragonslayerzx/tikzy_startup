from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class BookingSeat(Base):
    __tablename__ = "booking_seats"

    id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    scheduled_trip_id = Column(
        Integer,
        ForeignKey("scheduled_trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    vehicle_seat_id = Column(
        Integer,
        ForeignKey("vehicle_seats.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    seat_number = Column(String(10), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    booking = relationship("Booking", back_populates="booking_seats")
    scheduled_trip = relationship("ScheduledTrip", back_populates="booking_seats")
    vehicle_seat = relationship("VehicleSeat", back_populates="booking_seats")

    __table_args__ = (
        UniqueConstraint(
            "scheduled_trip_id",
            "vehicle_seat_id",
            name="uq_scheduled_trip_vehicle_seat",
        ),
    )