from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID
import enum

class Frequency(str, enum.Enum):
    DAILY = "DAILY"
    WEEKLY = "WEEKLY"

class TimeOfDay(str, enum.Enum):
    ANY = "ANY"
    MORNING = "MORNING"
    AFTERNOON = "AFTERNOON"
    EVENING = "EVENING"

class Habit(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("user.id"), nullable=False)
    title = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    frequency = Column(String, default=Frequency.DAILY) 
    time_of_day = Column(String, default=TimeOfDay.ANY)
    color = Column(String, default="#10b981")
    icon = Column(String, default="sprout")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_archived = Column(Boolean, default=False)

    owner = relationship("User", back_populates="habits")
    logs = relationship("HabitLog", back_populates="habit", cascade="all, delete-orphan")

class HabitLog(Base):
    __tablename__ = "habit_log"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    habit_id = Column(UUID(as_uuid=True), ForeignKey("habit.id"), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    date = Column(DateTime(timezone=True), index=True) # separate date column for easier querying by day

    habit = relationship("Habit", back_populates="logs")
