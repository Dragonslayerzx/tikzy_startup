from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)

    origin_city = Column(String(120), nullable=False, index=True)
    destination_city = Column(String(120), nullable=False, index=True)

    origin_terminal = Column(String(180), nullable=True)
    destination_terminal = Column(String(180), nullable=True)

    estimated_duration_minutes = Column(Integer, nullable=False, default=0)
    distance_km = Column(Float, nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    scheduled_trips = relationship(
        "ScheduledTrip",
        back_populates="route",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )