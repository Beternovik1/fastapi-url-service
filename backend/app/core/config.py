import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str = os.getenv("MONGO_URL")
    DB_NAME: str = os.getenv("DB_NAME")

    class Config:
        env_file = ".env"
    
settings = Settings()