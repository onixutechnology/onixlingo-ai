from dotenv import load_dotenv
load_dotenv()

import os
import json
import logging
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# --- IMPORTACIONES LOCALES ---
from app.config import settings
from app.database import create_db, get_db
from app.services import user_service
from app.datachess.seed_chess import generate_lessons 

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai, users, speech, chess_ws, billing, avatar, exercises, admin
from app.api.v1.endpoints import chess as chess_endpoints
from app.api import chess 

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    logger = logging.getLogger("OnixLingo.Core")
    try:
        create_db()
        logger.info("[DB] Base de datos conectada y esquemas sincronizados.")
        logger.info("[DB] Verificando e inyectando lecciones de ajedrez...")
        generate_lessons()
        logger.info("[DB] Ajedrez sincronizado y listo para jugar.")
    except Exception as e:
        logger.critical(f"[DB] Error critico al conectar DB: {e}")
    yield
    logger.info("[SYSTEM] Apagando sistema OnixLingo...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="OnixLingo Enterprise LMS API",
    version="8.0.0-titanium",
    docs_url="/docs",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS, 
    allow_origin_regex=r"(https://.*\.vercel\.app|http://localhost:\d+|http://127\.0\.0\.1:\d+)", 
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"], 
    allow_headers=["*"],
    expose_headers=["*"]
)

# 🔥 CORRECCIÓN: Webhook de Paddle optimizado para Integer IDs
@app.post("/api/v1/webhooks/paddle", tags=["Payments"], include_in_schema=False)
async def paddle_webhook(
    request: Request, 
    db: Session = Depends(get_db)
):
    logger = logging.getLogger("OnixLingo.Payments")
    
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = payload.get("event_type")
    
    if event_type == "transaction.completed":
        data = payload.get("data", {})
        custom_data = data.get("custom_data", {})
        
        try:
            # Forzamos la conversión a int() tal como lo exige el modelo User
            user_id = int(custom_data.get("internal_user_id"))
            
            tier = custom_data.get("tier")
            if not tier:
                items = data.get("items", [])
                price_id = ""
                product_id = ""
                if items:
                    price_obj = items[0].get("price", {})
                    price_id = price_obj.get("id", "").lower()
                    product_id = price_obj.get("product_id", "").lower()
                
                if "exec" in price_id or "exec" in product_id or "titanium" in price_id or "titanium" in product_id:
                    tier = "executive"
                else:
                    tier = "pro"
            
            updated_user = user_service.set_pro_status(db, user_id=user_id, is_pro=True, tier=tier)
            if updated_user:
                logger.info(f"✅ [UPGRADE] Usuario ID {user_id} actualizado a {tier.upper()} exitosamente vía Paddle.")
            else:
                logger.warning(f"⚠️ [WARNING] Usuario ID {user_id} pagó pero no se encontró en DB.")
                
        except (TypeError, ValueError):
            logger.error(f"❌ [PADDLE ERROR] El internal_user_id no es un entero válido: {custom_data.get('internal_user_id')}")
            return {"status": "error", "detail": "Invalid user ID"}
        except Exception as e:
            logger.error(f"❌ [DB ERROR] Fallo al actualizar estado PRO: {e}")

    return {"status": "success", "event_type": event_type}

# 🔗 CONEXIÓN DE RUTAS (ROUTERS)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users Profile"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Analytics & Progress"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(speech.router, prefix="/api/v1/speech", tags=["Speech Analysis"])
app.include_router(chess_endpoints.router, prefix="/api/v1/chess", tags=["Chess Academy"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["Billing & Subscriptions"])
app.include_router(avatar.router, prefix="/api/v1/avatar", tags=["AI Avatar Engine"])
app.include_router(exercises.router, prefix="/api/v1/exercises", tags=["Exercises"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin Panel"])

# ⚡ NUEVO: WEBSOCKET PARA AJEDREZ EN VIVO
app.include_router(chess_ws.router, prefix="/ws/chess/matches", tags=["WebSockets"])

@app.get("/", tags=["System"])
@app.head("/", include_in_schema=False)
def health_check():
    return {
        "system": "OnixLingo Enterprise Kernel",
        "status": "OPERATIONAL 🟢",
        "version": "Titanium 8.0",
        "domain_check": "Verified"
    }


# 🌍 Endpoint multilenguaje
@app.get("/api/v1/voclessons/{lesson_id}", tags=["Lessons"])
def get_voc_lesson(
    lesson_id: str, 
    lang: str = Query("en", description="Idioma de la lección (en, fr, zh)")
):
    # Ruta base absoluta para las lecciones
    base_path = Path(__file__).resolve().parent / "app" / "voclessons" / "lessons"
    
    # Intentamos primero con la carpeta del idioma, luego en la raíz de lessons
    file_options = [
        base_path / lang / f"{lesson_id}.json",
        base_path / f"{lesson_id}.json"
    ]

    for path in file_options:
        if path.exists():
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                logging.getLogger("OnixLingo").error(f"Error reading {path}: {e}")
                continue

    raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8020, reload=True)