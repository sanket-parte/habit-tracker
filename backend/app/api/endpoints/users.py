from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.schemas.user import User as UserSchema, UserCreate
from app.models.user import User
from app.core import security

router = APIRouter()

@router.post("/", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: UserCreate,
) -> Any:
    """
    Create new user.
    """
    user = User(
        email=user_in.email,
        username=user_in.username,
        hashed_password=security.get_password_hash(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
