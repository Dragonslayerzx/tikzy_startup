from typing import Optional

from pydantic import BaseModel, Field


class UserUpdateMe(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    phone: Optional[str] = Field(default=None, max_length=30)