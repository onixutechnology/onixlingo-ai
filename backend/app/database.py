# backend/app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1. DETECCIÓN INTELIGENTE DE BASE DE DATOS
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./onixlingo.db"
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

# 2. CREAR EL MOTOR (ENGINE)
engine = create_engine(DATABASE_URL, connect_args=connect_args)

# 3. SESIÓN DE DATOS
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. FUNCIONES DE GESTIÓN
def create_db():
    """
    Genera las tablas si no existen.
    Importante: Importamos Base y models DENTRO de la función para 
    evitar el error de importación circular al inicio.
    """
    from app.db.base import Base
    import app.db.models  # Esto registra los modelos (User, Progress) en Base
    
    Base.metadata.create_all(bind=engine)

def get_db():
    """Inyector de dependencia para sesiones seguras."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()