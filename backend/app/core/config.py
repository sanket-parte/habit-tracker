from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl, validator
from typing import List, Union

class Settings(BaseSettings):
    PROJECT_NAME: str = "Habit Tracker"
    API_V1_STR: str = "/api/v1"
    
    # BACKEND_CORS_ORIGINS is a JSON-formatted list of origins
    # e.g: '["http://localhost", "http://localhost:4200", "http://localhost:3000"]'
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"]

    SECRET_KEY: str = "supersecretkeychangeinproduction"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 1 week

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, str):
            import json
            return json.loads(v)
        return v

    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "habit_tracker"
    SQLALCHEMY_DATABASE_URI: str | None = None

    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: str | None, values: dict[str, any]) -> any:
        if isinstance(v, str):
            return v
        return str(f"postgresql://{values.get('POSTGRES_USER')}:{values.get('POSTGRES_PASSWORD')}@{values.get('POSTGRES_SERVER')}/{values.get('POSTGRES_DB')}")

    class Config:
        case_sensitive = True

settings = Settings()
