import asyncio
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine
from app.db.base import Base
# Import all models to ensure they are registered with Base.metadata
from app.db.models import *

def create_tables():
    print("Creando nuevas tablas en la base de datos (AIPracticeLog)...")
    Base.metadata.create_all(bind=engine)
    print("¡Tablas creadas/actualizadas con éxito!")

if __name__ == "__main__":
    create_tables()
