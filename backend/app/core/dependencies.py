from bson import ObjectId
from bson.errors import InvalidId
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError

from app.core.security import decode_token
from app.database import users_collection
from app.models.user import UserPublic

bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> UserPublic:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        user_id = decode_token(credentials.credentials, expected_type="access")
        object_id = ObjectId(user_id)
    except (JWTError, InvalidId):
        raise credentials_error

    user = await users_collection.find_one({"_id": object_id})
    if user is None:
        raise credentials_error

    return UserPublic(id=str(user["_id"]), name=user["name"], email=user["email"])