from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status
from jose import JWTError

from app.core.security import (
    create_access_token,
    create_refresh_token,
    create_reset_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.database import users_collection
from app.models.user import UserCreate, UserLogin, UserPublic


async def signup(payload: UserCreate) -> tuple[str, str, UserPublic]:
    existing = await users_collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    doc = {
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "created_at": datetime.now(timezone.utc),
    }
    result = await users_collection.insert_one(doc)
    user_id = str(result.inserted_id)

    user_public = UserPublic(id=user_id, name=payload.name, email=payload.email)
    return create_access_token(user_id), create_refresh_token(user_id), user_public


async def login(payload: UserLogin) -> tuple[str, str, UserPublic]:
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password",
    )

    user = await users_collection.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise invalid_credentials

    user_id = str(user["_id"])
    user_public = UserPublic(id=user_id, name=user["name"], email=user["email"])
    return create_access_token(user_id), create_refresh_token(user_id), user_public


async def refresh_access_token(refresh_token: str) -> str:
    try:
        user_id = decode_token(refresh_token, expected_type="refresh")
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )
    return create_access_token(user_id)


async def request_password_reset(email: str) -> str | None:
    """Returns a reset token if the user exists, else None.
    Caller must respond the same way either way (don't leak account existence)."""
    user = await users_collection.find_one({"email": email})
    if not user:
        return None
    return create_reset_token(str(user["_id"]))


async def reset_password(token: str, new_password: str) -> None:
    try:
        user_id = decode_token(token, expected_type="reset")
        object_id = ObjectId(user_id)
    except (JWTError, InvalidId):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link",
        )

    result = await users_collection.update_one(
        {"_id": object_id},
        {"$set": {"password_hash": hash_password(new_password)}},
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid reset link")