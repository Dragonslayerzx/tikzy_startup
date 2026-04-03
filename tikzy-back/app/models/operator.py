from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Operator(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    full_name = Column(String(150), nullable=False, index=True)
    identity_number = Column(String(50), nullable=True, unique=True, index=True)

    email = Column(String(150), nullable=True, unique=True, index=True)
    phone = Column(String(30), nullable=True)

    license_number = Column(String(80), nullable=True, unique=True, index=True)
    rating = Column(Float, nullable=False, default=0.0)

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    company = relationship("Company", back_populates="operators")
    vehicles = relationship("Vehicle", back_populates="operator")
    scheduled_trips = relationship("ScheduledTrip", back_populates="operator")