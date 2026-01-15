# backend/app/database.py
import os
import enum 
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Boolean, func, Enum
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# 1. DETECCIÓN INTELIGENTE DE BASE DE DATOS
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    # Fix para compatibilidad con SQLAlchemy recientes en Heroku/Render
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configuración por defecto (SQLite para desarrollo local)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./onixlingo.db"
    connect_args = {"check_same_thread": False} 
else:
    connect_args = {} 

# 2. CREAR EL MOTOR (ENGINE)
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 3. SESIÓN DE DATOS
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. BASE DECLARATIVA
Base = declarative_base()

# --- DEFINICIÓN DE ENUMS ---
class LessonType(str, enum.Enum):
    STANDARD = "standard"
    PRO = "pro"
    VOCAB = "vocab"

# --- MODELOS (TABLAS "ENTERPRISE READY") ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    
    # Metadatos de Cuenta Corporativa
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student")  # 'student', 'admin', 'teacher'
    is_pro = Column(Boolean, default=False)   # ¡IMPORTANTE! Para saber si puede ver contenido Pro
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    progress = relationship("Progress", back_populates="owner", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    lesson_id = Column(String, index=True, nullable=False) # Ej: 'pro-b1-1'
    
    # 🔥 NUEVO: CRUCIAL PARA TUS 3 BLOQUES
    lesson_type = Column(Enum(LessonType), default=LessonType.STANDARD) 

    # --- MÉTRICAS PRO ---
    stars = Column(Integer, default=0) # Gamificación (0-3)
    score = Column(Integer, default=0) # Precisión académica (0-100)
    
    # Nuevos campos para Dashboard Titanium
    current_step = Column(Integer, default=0) # Dónde se quedó
    total_steps = Column(Integer, default=1)  # Total de slides
    status = Column(String, default="locked") # 'locked', 'active', 'completed'
    
    # Auditoría Temporal
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    owner = relationship("User", back_populates="progress")

    def __repr__(self):
        return f"<Progress(user={self.user_id}, lesson='{self.lesson_id}', type='{self.lesson_type}')>"

# 🔥 NUEVA TABLA: SISTEMA DE TROFEOS
class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    achievement_code = Column(String, index=True) # Ej: "first_perfect_score"
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="achievements")

# 5. FUNCIONES UTILITARIAS DE GESTIÓN

def create_db():
    """Genera las tablas si no existen."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Inyector de dependencia para sesiones seguras."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()