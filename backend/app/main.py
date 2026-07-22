from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import init_indexes
from app.routers import auth, chat, tasks

app = FastAPI(title="AI To-Do Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup():
    await init_indexes()


app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(chat.router)


@app.get("/health")
async def health():
    return {"status": "ok"}