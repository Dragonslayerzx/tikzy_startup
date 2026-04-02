from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.operator import Operator
from app.schemas.operator import OperatorCreate, OperatorResponse

router = APIRouter(prefix="/operators", tags=["Operators"])


@router.post("/", response_model=OperatorResponse)
def create_operator(operator: OperatorCreate, db: Session = Depends(get_db)):
    db_operator = Operator(**operator.dict())
    db.add(db_operator)
    db.commit()
    db.refresh(db_operator)
    return db_operator


@router.get("/", response_model=list[OperatorResponse])
def get_operators(db: Session = Depends(get_db)):
    return db.query(Operator).all()