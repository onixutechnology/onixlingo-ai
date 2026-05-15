import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # --- PROYECTO ---
    PROJECT_NAME: str = "OnixLingo Enterprise"
    API_V1_STR: str = "/api/v1"

    # --- SEGURIDAD (JWT) ---
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tu_clave_secreta_super_segura_para_dev")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días

    # --- BASE DE DATOS ---
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./onixlingo.db")

    # --- PADDLE (Pagos) ---
    PADDLE_API_KEY: str = os.getenv("PADDLE_API_KEY", "")
    PADDLE_WEBHOOK_SECRET: str = os.getenv("PADDLE_WEBHOOK_SECRET", "")
    PADDLE_ENVIRONMENT: str = os.getenv("PADDLE_ENVIRONMENT", "sandbox")
    
    # --- URLs ---
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "https://onixlingo.onixu.company") 

    # --- CORS (DOMINIOS PERMITIDOS) ---
    BACKEND_CORS_ORIGINS: List[str] = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,http://127.0.0.1:3000,https://onixlingo.onixu.company,https://api.onixlingo.onixu.company"
    ).split(",")

    # --- STRIPE ---
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()