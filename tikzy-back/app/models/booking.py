from sqlalchemy import Column, DateTime, ForeignKey, Integer, Numeric, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    scheduled_trip_id = Column(
        Integer,
        ForeignKey("scheduled_trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    customer_name = Column(String(150), nullable=False)
    customer_email = Column(String(150), nullable=True, index=True)
    customer_phone = Column(String(30), nullable=True)

    passenger_count = Column(Integer, nullable=False, default=1)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0)

    status = Column(String(30), nullable=False, default="pending_payment")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    scheduled_trip = relationship("ScheduledTrip", back_populates="bookings")
    booking_seats = relationship(
        "BookingSeat",
        back_populates="booking",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )