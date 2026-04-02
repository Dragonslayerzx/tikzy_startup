from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Time,
    func,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class ScheduledTrip(Base):
    __tablename__ = "scheduled_trips"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    operator_id = Column(
        Integer,
        ForeignKey("operators.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    route_id = Column(
        Integer,
        ForeignKey("routes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    travel_date = Column(Date, nullable=False, index=True)
    departure_time = Column(Time, nullable=False)
    arrival_time = Column(Time, nullable=False)

    price = Column(Numeric(10, 2), nullable=False, default=0)
    currency = Column(String(10), nullable=False, default="HNL")

    meeting_point = Column(String(255), nullable=True)
    service_type = Column(String(50), nullable=False, default="direct")
    available_seats = Column(Integer, nullable=False, default=0)

    status = Column(String(30), nullable=False, default="scheduled")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    company = relationship("Company", back_populates="scheduled_trips")
    vehicle = relationship("Vehicle", back_populates="scheduled_trips")
    operator = relationship("Operator", back_populates="scheduled_trips")
    route = relationship("Route", back_populates="scheduled_trips")

    bookings = relationship(
        "Booking",
        back_populates="scheduled_trip",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    booking_seats = relationship(
        "BookingSeat",
        back_populates="scheduled_trip",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )