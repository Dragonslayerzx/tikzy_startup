from sqlalchemy import Column, DateTime, ForeignKey, Integer, Float, func
from app.core.database import Base


class VehicleLocation(Base):
    __tablename__ = "vehicle_locations"

    id = Column(Integer, primary_key=True, index=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id", ondelete="CASCADE"), nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)