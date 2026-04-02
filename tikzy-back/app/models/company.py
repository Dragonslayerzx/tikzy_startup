from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.core.database import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False, unique=True, index=True)
    slug = Column(String(180), nullable=False, unique=True, index=True)

    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)

    rating = Column(Float, nullable=False, default=0.0)
    reviews_count = Column(Integer, nullable=False, default=0)

    support_phone = Column(String(30), nullable=True)
    support_email = Column(String(150), nullable=True)

    is_active = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    vehicles = relationship(
        "Vehicle",
        back_populates="company",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )

    operators = relationship(
        "Operator",
        back_populates="company",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )