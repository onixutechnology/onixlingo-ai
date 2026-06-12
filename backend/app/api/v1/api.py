from fastapi import APIRouter

# Importamos exactamente los archivos que tienes en tu carpeta endpoints
from app.api.v1.endpoints import (
    auth,
    users,
    lessons,
    progress,
    billing,
    ai,
    speech,
    analytics,
    avatar,
    exercises,
    admin,
    voclessons,
    chess # 🔥 NUEVO: Importamos el módulo chess
)

api_router = APIRouter()

# 🔐 Autenticación y Usuarios
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# 📚 Core LMS (Lecciones y Progreso)
api_router.include_router(lessons.router, prefix="/lessons", tags=["Lessons"])
api_router.include_router(voclessons.router, prefix="/voclessons", tags=["Vocab Lessons"])
api_router.include_router(progress.router, prefix="/progress", tags=["Progress"])
api_router.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])

# ♟️ Ajedrez Cognitivo
api_router.include_router(chess.router, prefix="/chess", tags=["Chess"])

# 💳 Pagos
api_router.include_router(billing.router, prefix="/billing", tags=["Billing"])

# 🤖 Inteligencia Artificial y Voz
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(speech.router, prefix="/speech", tags=["Speech"])

# 📊 Analíticas y Extras
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(avatar.router, prefix="/avatar", tags=["Avatar"])

# 🛡️ PANEL DE ADMINISTRACIÓN (Acceso restringido)
api_router.include_router(admin.router, prefix="/admin", tags=["Admin Dashboard"])