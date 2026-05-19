import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # --- GENERAL ---
    PROJECT_NAME: str = "OnixLingo Enterprise"
    API_V1_STR: str = "/api/v1"

    # --- SEGURIDAD ---
    # 👇 ESTA ES LA CLAVE QUE MANDA. Pon una cadena larga y fija.
    SECRET_KEY: str = "CLAVE_MAESTRA_FIJA_SUPER_SECRETA_ONIXLINGO_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 días

    # --- GOOGLE GEMINI ---
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GOOGLE_CLOUD_API_KEY: str = os.getenv("GOOGLE_CLOUD_API_KEY", "")

    # --- CORS ---
    # 🚀 LISTA MAESTRA DE DOMINIOS PERMITIDOS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://onixlingo.onixu.company",
        "https://www.onixlingo.onixu.company",
        "https://api.onixlingo.onixu.company",
        "https://onixlingo-ai.vercel.app",
        "https://onixlingo-ai-nknb.vercel.app"
    ]

    # --- CONFIGURACIÓN ---
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True
    )

settings = Settings()
