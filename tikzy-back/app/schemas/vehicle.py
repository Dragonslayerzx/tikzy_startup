from pydantic import BaseModel


class VehicleCreate(BaseModel):
    plate: str
    model: str
    color: str
    operator_id: int


class VehicleResponse(VehicleCreate):
    id: int

    class Config:
        from_attributes = True