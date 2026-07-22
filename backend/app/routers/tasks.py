from typing import Literal

from fastapi import APIRouter, Depends, Query, status

from app.core.dependencies import get_current_user
from app.models.task import TaskCreate, TaskPublic, TaskUpdate
from app.models.user import UserPublic
from app.services import task_service

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.post("", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
async def create_task(
    payload: TaskCreate,
    current_user: UserPublic = Depends(get_current_user),
):
    return await task_service.create_task(current_user.id, payload)


@router.get("", response_model=list[TaskPublic])
async def list_tasks(
    search: str | None = Query(default=None, description="Search tasks by title"),
    category: str | None = Query(default=None),
    priority: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    sort_by: Literal["created_at", "due_date", "priority"] = Query(default="created_at"),
    order: Literal["asc", "desc"] = Query(default="desc"),
    current_user: UserPublic = Depends(get_current_user),
):
    return await task_service.list_tasks(
        user_id=current_user.id,
        search=search,
        category=category,
        priority=priority,
        status=status_filter,
        sort_by=sort_by,
        order=order,
    )


@router.get("/{task_id}", response_model=TaskPublic)
async def get_task(
    task_id: str,
    current_user: UserPublic = Depends(get_current_user),
):
    return await task_service.get_task(current_user.id, task_id)


@router.patch("/{task_id}", response_model=TaskPublic)
async def update_task(
    task_id: str,
    payload: TaskUpdate,
    current_user: UserPublic = Depends(get_current_user),
):
    return await task_service.update_task(current_user.id, task_id, payload)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: str,
    current_user: UserPublic = Depends(get_current_user),
):
    await task_service.delete_task(current_user.id, task_id)