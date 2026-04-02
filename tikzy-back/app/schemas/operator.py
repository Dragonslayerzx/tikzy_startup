from pydantic import BaseModel


class OperatorCreate(BaseModel):
    name: str
    email: str
    phone: str


class OperatorResponse(OperatorCreate):
    id: int

    class Config:
        from_attributes = True