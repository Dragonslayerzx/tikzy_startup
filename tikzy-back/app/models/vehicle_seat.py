from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, UniqueConstraint, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class VehicleSeat(Base):
    __tablename__ = "vehicle_seats"

    id = Column(Integer, primary_key=True, index=True)

    vehicle_id = Column(
        Integer,
        ForeignKey("vehicles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    seat_number = Column(String(10), nullable=False)
    row_number = Column(Integer, nullable=False, index=True)
    column_label = Column(String(2), nullable=False)

    seat_type = Column(String(20), nullable=False, default="standard")
    position = Column(String(20), nullable=True)  # window / aisle / middle
    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    vehicle = relationship("Vehicle", back_populates="seats")
    booking_seats = relationship(
        "BookingSeat",
        back_populates="vehicle_seat",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    __table_args__ = (
        UniqueConstraint("vehicle_id", "seat_number", name="uq_vehicle_seat_number"),
    )