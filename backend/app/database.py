import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, Integer, String, ForeignKey

# 1. DETECCIÓN INTELIGENTE DE BASE DE DATOS
# Si existe la variable DATABASE_URL (Render), usa esa. Si no, usa el archivo local.
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    # Fix para SQLAlchemy que requiere postgresql:// en vez de postgres://
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configuración por defecto (Local)
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./onixlingo.db"
    connect_args = {"check_same_thread": False}  # Solo para SQLite
else:
    connect_args = {}  # Postgres no necesita esto

# 2. CREAR EL MOTOR
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 3. MODELOS (Tablas)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    progress = relationship("Progress", back_populates="owner")

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(String)
    stars = Column(Integer)
    owner = relationship("User", back_populates="progress")

# 4. FUNCIONES UTILITARIAS
def create_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()