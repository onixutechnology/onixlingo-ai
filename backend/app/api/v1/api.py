from fastapi import APIRouter
from app.api.v1.endpoints import ai, billing

api_router = APIRouter()

# Centralización de routers si usas api.py como tu enrutador principal
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(billing.router, prefix="/billing", tags=["Billing & Referrals"])
