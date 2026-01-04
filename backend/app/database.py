import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Boolean, func
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

# 1. DETECCIÓN INTELIGENTE DE BASE DE DATOS
# Prioridad: Variable de entorno (Render/Prod) -> Archivo Local (Dev)
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    # Fix para compatibilidad con SQLAlchemy recientes en Heroku/Render
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configuración por defecto (SQLite para desarrollo local rápido)
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

# --- MODELOS (TABLAS "ENTERPRISE READY") ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True) # Nuevo: Identidad real
    hashed_password = Column(String, nullable=False)
    
    # Metadatos de Cuenta Corporativa
    is_active = Column(Boolean, default=True) # Para desactivar usuarios sin borrar
    role = Column(String, default="student")  # 'student', 'admin', 'teacher'
    created_at = Column(DateTime(timezone=True), server_default=func.now()) # Auditoría de registro

    # Relaciones
    progress = relationship("Progress", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}')>"

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(String, index=True, nullable=False)
    
    # Métricas de Rendimiento
    stars = Column(Integer, default=0) # Gamificación (0-3)
    score = Column(Integer, default=0) # Precisión académica (0-100)
    
    # Auditoría Temporal (CRÍTICO PARA RACHAS/STREAKS)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    owner = relationship("User", back_populates="progress")

    def __repr__(self):
        return f"<Progress(user={self.user_id}, lesson='{self.lesson_id}', stars={self.stars})>"

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