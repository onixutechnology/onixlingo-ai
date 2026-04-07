# backend/app/database.py
import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. CARGAR ENTORNO ANTES DE LEER VARIABLES 
# 🔥 Esto soluciona que scripts externos (como seed_chess) caigan en SQLite
load_dotenv()

logger = logging.getLogger("OnixLingo.Database")

# 2. DETECCIÓN INTELIGENTE DE BASE DE DATOS
DATABASE_URL = os.getenv("DATABASE_URL")

# Corrección obligatoria para SQLAlchemy 1.4+ (Render inyecta postgres://)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. CREAR EL MOTOR (ENGINE) DEPENDIENDO DEL ENTORNO
if not DATABASE_URL:
    logger.warning("⚠️ No se encontró DATABASE_URL. Usando SQLite local.")
    DATABASE_URL = "sqlite:///./onixlingo.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    db_host = DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else "Desconocido"
    logger.info(f"🔌 Conectando a PostgreSQL (Neon) en: {db_host}")
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # 🚀 VITAL PARA NEON: Evita errores 500 por desconexión de inactividad
        pool_size=5,         # Mantiene hasta 5 conexiones abiertas
        max_overflow=10      # Permite 10 extras si hay un pico de usuarios
    )

# 4. SESIÓN DE DATOS
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. FUNCIONES DE GESTIÓN
def create_db():
    """
    Genera las tablas si no existen.
    Importante: Importamos Base y models DENTRO de la función para 
    evitar el error de importación circular al inicio.
    """
    from app.db.base import Base
    import app.db.models  # 🔥 Registra TODOS los modelos (User, Progress, ChessLesson...)
    
    Base.metadata.create_all(bind=engine)

def get_db():
    """Inyector de dependencia para sesiones seguras."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
