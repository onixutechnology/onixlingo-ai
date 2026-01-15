# backend/app/db/base.py
from sqlalchemy.orm import declarative_base

# Aquí definimos la Base para que models.py pueda importarla sin errores
Base = declarative_base()