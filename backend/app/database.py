from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = AsyncIOMotorClient(settings.mongo_uri)
db = client[settings.mongo_db_name]

users_collection = db["users"]
tasks_collection = db["tasks"]


async def init_indexes():
    """Call once on startup — ensures fast lookups and enforces uniqueness at the DB level."""
    await users_collection.create_index("email", unique=True)
    await tasks_collection.create_index("user_id")