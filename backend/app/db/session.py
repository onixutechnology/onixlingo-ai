# backend/app/db/session.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL DE LA BASE DE DATOS
# Para producción (Render) usarás: "postgresql://usuario:pass@host/db"
# Para local usaremos SQLite por ahora para que no te falle:
SQLALCHEMY_DATABASE_URL = "sqlite:///./onixlingo.db" 

# Crear el motor
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Crear la sesión (SessionLocal es lo que usaremos para consultas)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos
Base = declarative_base()

# Dependencia para obtener la DB en cada request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()