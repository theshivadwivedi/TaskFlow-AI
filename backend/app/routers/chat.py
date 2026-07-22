from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user
from app.models.chat import ChatRequest, ChatResponse
from app.models.user import UserPublic
from app.services import ai_service, task_service

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(
    payload: ChatRequest,
    current_user: UserPublic = Depends(get_current_user),
):
    tasks = await task_service.list_tasks(current_user.id)
    reply = await ai_service.answer_question(payload.message, tasks)
    return ChatResponse(reply=reply)