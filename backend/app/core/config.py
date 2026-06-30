import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "CityOS AI Backend"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # CORS
    CORS_ORIGINS: List[AnyHttpUrl] = []
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    # Firebase
    FIREBASE_CREDENTIALS_PATH: str | None = None
    FIREBASE_PROJECT_ID: str | None = None
    FIREBASE_PRIVATE_KEY: str | None = None
    FIREBASE_CLIENT_EMAIL: str | None = None

    # AI Models
    GEMINI_API_KEY: str | None = None

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True, extra="ignore")

    def validate_setup(self):
        """Validate required environment variables for Phase B."""
        # For Phase A, we just warn. In Phase B, we raise exceptions.
        if not self.FIREBASE_CREDENTIALS_PATH and not self.FIREBASE_PROJECT_ID:
            print("WARNING: Firebase credentials not fully configured. Using mocks.")
        if not self.GEMINI_API_KEY:
            print("WARNING: GEMINI_API_KEY is missing. AI reasoning will be disabled.")

settings = Settings()
settings.validate_setup()
