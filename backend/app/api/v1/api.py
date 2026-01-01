from fastapi import APIRouter
from app.api.v1.endpoints import ai

api_router = APIRouter()

# Aquí conectamos el archivo ai.py que creamos arriba
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])