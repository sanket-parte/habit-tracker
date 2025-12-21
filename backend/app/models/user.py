from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base
import uuid
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    habits = relationship("Habit", back_populates="owner")
