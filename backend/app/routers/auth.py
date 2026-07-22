from fastapi import APIRouter, Depends, status

from app.core.dependencies import get_current_user
from app.models.user import (
    ForgotPasswordRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserCreate,
    UserLogin,
    UserPublic,
)
from app.services import auth_service
from app.services.email_service import send_password_reset_email

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(payload: UserCreate):
    access_token, refresh_token, user = await auth_service.signup(payload)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin):
    access_token, refresh_token, user = await auth_service.login(payload)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user)


@router.post("/refresh")
async def refresh(refresh_token: str):
    new_access_token = await auth_service.refresh_access_token(refresh_token)
    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(payload: ForgotPasswordRequest):
    reset_token = await auth_service.request_password_reset(payload.email)
    if reset_token:
        await send_password_reset_email(payload.email, reset_token)
    return {"message": "If an account with that email exists, a reset link has been sent."}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(payload: ResetPasswordRequest):
    await auth_service.reset_password(payload.token, payload.new_password)
    return {"message": "Password has been reset successfully."}


@router.get("/me", response_model=UserPublic)
async def get_me(current_user: UserPublic = Depends(get_current_user)):
    return current_user