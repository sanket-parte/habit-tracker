from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class HabitBase(BaseModel):
    title: str
    description: Optional[str] = None
    frequency: str = "DAILY"
    time_of_day: str = "ANY"
    color: str = "#10b981"
    icon: str = "sprout"
    motivation: Optional[str] = None
    duration_minutes: Optional[int] = 2
    is_archived: bool = False

class HabitCreate(HabitBase):
    pass

class HabitUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    frequency: Optional[str] = None
    time_of_day: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    motivation: Optional[str] = None
    duration_minutes: Optional[int] = None
    is_archived: Optional[bool] = None

class HabitLogBase(BaseModel):
    date: datetime
    completed_at: datetime
    note: Optional[str] = None
    mood: Optional[str] = None

class HabitLogCreate(BaseModel):
    date: datetime
    note: Optional[str] = None
    mood: Optional[str] = None

class HabitLog(HabitLogBase):
    id: UUID
    habit_id: UUID

    class Config:
        from_attributes = True

class Habit(HabitBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    is_archived: bool
    current_streak: int = 0
    is_completed_today: bool = False
    logs: list[HabitLog] = []

    class Config:
        from_attributes = True
