# backend/app/core/settings.py
import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # --- GENERAL ---
    PROJECT_NAME: str = "OnixLingo Enterprise"
    API_V1_STR: str = "/api/v1"
    
    # --- SEGURIDAD (Obligatorio para deps.py) ---
    SECRET_KEY: str = os.getenv("SECRET_KEY", "cambia_esto_por_una_clave_segura_en_produccion")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 días

    # --- GOOGLE GEMINI ---
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # --- CORS ---
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://onixlingo-ai.vercel.app",
        "https://onixlingo-ai-nknb.vercel.app",
    ]

    # --- CONFIGURACIÓN ---
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

settings = Settings()