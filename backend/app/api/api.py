from fastapi import APIRouter
from app.api.endpoints import users, habits, auth

api_router = APIRouter()
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(habits.router, prefix="/habits", tags=["habits"])
api_router.include_router(auth.router, tags=["login"])
