import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    # --- PROYECTO ---
    PROJECT_NAME: str = "OnixLingo Enterprise"
    API_V1_STR: str = "/api/v1"
    
    # --- SEGURIDAD (JWT) ---
    # Genera una nueva con: openssl rand -hex 32
    SECRET_KEY: str = os.getenv("SECRET_KEY", "tu_clave_secreta_super_segura_para_dev")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8 # 8 días

    # --- BASE DE DATOS (Render vs Local) ---
    # Si Render nos da DATABASE_URL, la usamos. Si no, usamos SQLite local.
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./onixlingo.db")

    # --- STRIPE (Pagos) ---
    STRIPE_API_KEY: str = os.getenv("STRIPE_API_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    
    # URLs para redirigir al usuario tras el pago
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000") 

    # --- CORS (Vercel) ---
    # Lista de dominios permitidos separados por coma
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://onixlingo-bckend.onrender.com",
        "https://onixlingo-ai-nknb.vercel.app", # Tu URL actual
    ]

    # Validación estricta: carga .env si existe (local), sino usa variables de entorno (Render)
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore" # Ignora variables extra en el .env
    )

settings = Settings()