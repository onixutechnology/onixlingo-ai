from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GEMINI_API_KEY: str
    PROJECT_NAME: str = "Language AI Tutor"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    
    # Esta configuración ignora variables extra en el .env (como DEBUG=True)
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore" 
    )

settings = Settings()