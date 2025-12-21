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

class HabitCreate(HabitBase):
    pass

class HabitLogBase(BaseModel):
    date: datetime
    completed_at: datetime

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
