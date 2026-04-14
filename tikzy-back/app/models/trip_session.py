from sqlalchemy import (
    Column,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import relationship

from app.core.database import Base


class TripSession(Base):
    __tablename__ = "trip_sessions"

    id = Column(Integer, primary_key=True, index=True)

    scheduled_trip_id = Column(
        Integer,
        ForeignKey("scheduled_trips.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    operator_id = Column(
        Integer,
        ForeignKey("operators.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    status = Column(String(30), nullable=False, default="active", index=True)

    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)

    started_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ended_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    scheduled_trip = relationship("ScheduledTrip", back_populates="trip_sessions")
    operator = relationship("Operator")
    vehicle = relationship("Vehicle")