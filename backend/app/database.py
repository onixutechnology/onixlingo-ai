# backend/app/database.py
import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# 1. CARGAR ENTORNO ANTES DE LEER VARIABLES
load_dotenv()

logger = logging.getLogger("OnixLingo.Database")

# 2. DETECCIÓN INTELIGENTE DE BASE DE DATOS
DATABASE_URL = os.getenv("DATABASE_URL")

# Corrección obligatoria para SQLAlchemy 1.4+ (Render/Coolify inyecta postgres://)
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. CREAR EL MOTOR (ENGINE) DEPENDIENDO DEL ENTORNO
if not DATABASE_URL:
    logger.warning("⚠️ No se encontró DATABASE_URL. Usando SQLite local.")
    DATABASE_URL = "sqlite:///./onixlingo.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    db_host = DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else "Desconocido"
    logger.info(f"🔌 Conectando a PostgreSQL en: {db_host}")
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # 🚀 VITAL: Evita errores 500 por desconexión de inactividad
        pool_size=5,         # Mantiene hasta 5 conexiones abiertas
        max_overflow=10      # Permite 10 extras si hay un pico de usuarios
    )

# 4. SESIÓN DE DATOS
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. FUNCIONES DE GESTIÓN
def create_db():
    """
    Genera las tablas si no existen leyendo desde base.py
    """
    from app.db.base import Base # 🔥 Llama a todas tus 150 tablas automáticamente
    from app.db.models import User, Progress, UserAchievement, ChessLesson, ChessProgress, ChessMatch, ChessMove, PromoCoupon, BetaCode, SpeechPracticeLog, ExamAttempt, AIConfiguration, SupportTicket, SystemAuditLog, GlobalSetting, Campaign, Referral, Transaction, BlogPost
    logger.info("🛠️ Construyendo el esquema de la base de datos...")
    Base.metadata.create_all(bind=engine)
    logger.info("✅ ¡Tablas construidas/verificadas con éxito!")

def get_db():
    """Inyector de dependencia para sesiones seguras."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()