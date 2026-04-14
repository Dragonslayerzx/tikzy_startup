from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import UserResponse
from app.schemas.user import UserUpdateMe

router = APIRouter(prefix="/users", tags=["Users"])


@router.put("/me", response_model=UserResponse)
def update_me(
    payload: UserUpdateMe,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.full_name = payload.full_name.strip()

    if payload.phone is not None:
        clean_phone = payload.phone.strip()
        current_user.phone = clean_phone if clean_phone else None

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user