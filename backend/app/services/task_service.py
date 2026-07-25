from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from pymongo import ReturnDocument

from app.database import tasks_collection
from app.models.task import PRIORITY_RANK, TaskCreate, TaskPublic, TaskUpdate


def _doc_to_public(doc: dict) -> TaskPublic:
    return TaskPublic(
        id=str(doc["_id"]),
        title=doc["title"],
        description=doc.get("description"),
        category=doc.get("category"),
        due_date=doc.get("due_date"),
        priority=doc["priority"],
        status=doc["status"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


def _to_object_id(task_id: str) -> ObjectId:
    try:
        return ObjectId(task_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")


async def create_task(user_id: str, payload: TaskCreate) -> TaskPublic:
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": user_id,
        **payload.model_dump(),
        "created_at": now,
        "updated_at": now,
    }
    result = await tasks_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _doc_to_public(doc)


async def list_tasks(
    user_id: str,
    search: str | None = None,
    category: str | None = None,
    priority: str | None = None,
    status: str | None = None,
    sort_by: str = "created_at",
    order: str = "desc",
) -> list[TaskPublic]:
    query_filter: dict = {"user_id": user_id}

    if category:
        query_filter["category"] = category
    if priority:
        query_filter["priority"] = priority
    if status:
        query_filter["status"] = status
    if search:
        query_filter["title"] = {"$regex": search, "$options": "i"}

    cursor = tasks_collection.find(query_filter)
    docs = [doc async for doc in cursor]

    reverse = order == "desc"
    if sort_by == "priority":
        docs.sort(key=lambda d: PRIORITY_RANK.get(d["priority"], 0), reverse=reverse)
    else:
        docs.sort(
            key=lambda d: (d.get(sort_by) is None, d.get(sort_by)),
            reverse=reverse,
        )

    return [_doc_to_public(doc) for doc in docs]


async def get_task(user_id: str, task_id: str) -> TaskPublic:
    object_id = _to_object_id(task_id)
    doc = await tasks_collection.find_one({"_id": object_id, "user_id": user_id})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return _doc_to_public(doc)


async def update_task(user_id: str, task_id: str, payload: TaskUpdate) -> TaskPublic:
    object_id = _to_object_id(task_id)
    update_fields = {k: v for k, v in payload.model_dump(exclude_unset=True).items()}

    if not update_fields:
        return await get_task(user_id, task_id)

    update_fields["updated_at"] = datetime.now(timezone.utc)


    result = await tasks_collection.find_one_and_update(
        {"_id": object_id, "user_id": user_id},
        {"$set": update_fields},
        
        return_document=ReturnDocument.AFTER,
    )
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return _doc_to_public(result)


async def delete_task(user_id: str, task_id: str) -> None:
    object_id = _to_object_id(task_id)
    result = await tasks_collection.delete_one({"_id": object_id, "user_id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")