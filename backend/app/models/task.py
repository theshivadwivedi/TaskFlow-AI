from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"



PRIORITY_RANK = {"low": 1, "medium": 2, "high": 3}


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    category: Optional[str] = Field(default=None, max_length=50)
    due_date: Optional[datetime] = None
    priority: TaskPriority = TaskPriority.medium
    status: TaskStatus = TaskStatus.pending


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = Field(default=None, max_length=2000)
    category: Optional[str] = Field(default=None, max_length=50)
    due_date: Optional[datetime] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    


class TaskPublic(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    due_date: Optional[datetime] = None
    priority: TaskPriority
    status: TaskStatus
    created_at: datetime
    updated_at: datetime