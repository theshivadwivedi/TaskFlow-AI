from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # MongoDB
    mongo_uri: str = "mongodb://localhost:27017"
    mongo_db_name: str = "todo_ai_app"

    # JWT
    jwt_secret_key: str = "change-me-in-.env"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    reset_token_expire_minutes: int = 15

    # AI
    gemini_api_key: str = ""
    groq_api_key: str = ""



    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    email_from: str = ""

    # App
    frontend_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"


settings = Settings()