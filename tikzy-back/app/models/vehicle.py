from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    operator_id = Column(
        Integer,
        ForeignKey("operators.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    internal_code = Column(String(50), nullable=False, unique=True, index=True)
    plate_number = Column(String(20), nullable=False, unique=True, index=True)

    brand = Column(String(80), nullable=False)
    model = Column(String(120), nullable=False)
    bus_type = Column(String(80), nullable=False, default="Ejecutivo")

    seats_capacity = Column(Integer, nullable=False, default=40)
    amenities = Column(Text, nullable=True)

    color = Column(String(50), nullable=True)
    year = Column(Integer, nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    company = relationship("Company", back_populates="vehicles")
    operator = relationship("Operator", back_populates="vehicles")
    scheduled_trips = relationship("ScheduledTrip", back_populates="vehicle")
    seats = relationship(
        "VehicleSeat",
        back_populates="vehicle",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )