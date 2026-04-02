from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    plate = Column(String, unique=True, nullable=False)
    model = Column(String, nullable=False)
    color = Column(String, nullable=False)

    operator_id = Column(Integer, ForeignKey("operators.id"))