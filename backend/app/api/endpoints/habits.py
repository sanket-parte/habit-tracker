from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.models.habit import Habit
from app.models.user import User
from app.schemas.habit import Habit as HabitSchema, HabitCreate

router = APIRouter()

# Remove get_default_user and use current_user

@router.get("/", response_model=List[HabitSchema])
def read_habits(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Retrieve habits.
    """
    habits = db.query(Habit).filter(Habit.user_id == current_user.id).offset(skip).limit(limit).all()
    
    # Calculate streaks
    from datetime import datetime, timedelta
    
    today = datetime.now().date()
    
    for habit in habits:
        streak = 0
        sorted_logs = sorted(habit.logs, key=lambda x: x.date, reverse=True)
        
        # Get unique dates of logs (normalized to date only)
        log_dates = {log.date.date() for log in sorted_logs}
        
        # Check consecutive days backwards from today
        check_date = today
        
        # If not done today, start checking from yesterday to keep streak alive
        if check_date not in log_dates:
            check_date = today - timedelta(days=1)
            
        while check_date in log_dates:
            streak += 1
            check_date -= timedelta(days=1)
            
            
        habit.current_streak = streak
        
        # Check if completed today
        # Check if completed today / this week
        if habit.frequency == "WEEKLY":
             start_of_week = today - timedelta(days=today.weekday())
             # Check if any log date is >= start_of_week
             is_done = any(log.date.date() >= start_of_week for log in habit.logs)
             habit.is_completed_today = is_done
        else:
             # Daily
             if check_date == today and today in log_dates:
                  habit.is_completed_today = True
             elif today in log_dates:
                  habit.is_completed_today = True
             else:
                  habit.is_completed_today = False
        
    return habits

@router.post("/", response_model=HabitSchema)
def create_habit(
    *,
    db: Session = Depends(deps.get_db),
    habit_in: HabitCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Create new habit.
    """
    habit = Habit(
        **habit_in.model_dump(),
        user_id=current_user.id
    )
    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit

@router.post("/{habit_id}/log", response_model=Any)
def complete_habit(
    *,
    db: Session = Depends(deps.get_db),
    habit_id: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Log a habit completion.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    # Check ownership
    if habit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    from app.models.habit import HabitLog
    from sqlalchemy.sql import func
    from datetime import datetime, time
    
    # Check Frequency Restrictions
    if habit.frequency == "DAILY":
        period_start = datetime.combine(datetime.now().date(), time.min)
        error_msg = "Habit already completed today"
    elif habit.frequency == "WEEKLY":
        today = datetime.now().date()
        start_of_week = today - timedelta(days=today.weekday()) # Monday
        period_start = datetime.combine(start_of_week, time.min)
        error_msg = "Habit already completed this week"
    else:
        # Default to Daily if unknown
        period_start = datetime.combine(datetime.now().date(), time.min)
        error_msg = "Habit already completed today"

    existing_log = db.query(HabitLog).filter(
        HabitLog.habit_id == habit_id,
        HabitLog.date >= period_start
    ).first()
    
    if existing_log:
        raise HTTPException(status_code=400, detail=error_msg)
    
    # Create Log
    log = HabitLog(habit_id=habit.id, date=func.now())
    db.add(log)
    
    # Gamification
    current_user.xp += 10
    
    xp_needed = current_user.level * 100
    if current_user.xp >= xp_needed:
        current_user.level += 1
        current_user.xp = 0 
        
    db.add(current_user)
    db.commit()
    
    return {"status": "success", "xp_gained": 10, "new_level": current_user.level}

@router.put("/{habit_id}", response_model=HabitSchema)
def update_habit(
    *,
    db: Session = Depends(deps.get_db),
    habit_id: str,
    habit_in: HabitCreate,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Update habit.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    if habit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    update_data = habit_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(habit, field, value)

    db.add(habit)
    db.commit()
    db.refresh(habit)
    return habit

@router.delete("/{habit_id}", response_model=Any)
def delete_habit(
    *,
    db: Session = Depends(deps.get_db),
    habit_id: str,
    current_user: User = Depends(deps.get_current_user),
) -> Any:
    """
    Delete habit.
    """
    habit = db.query(Habit).filter(Habit.id == habit_id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    if habit.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db.delete(habit)
    db.commit()
    return {"status": "success"}
