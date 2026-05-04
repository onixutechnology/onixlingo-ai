# backend/main.py
import os
import json
import logging
import stripe
import uuid # 🔥 NUEVO: Necesario para manejar los nuevos IDs de la base de datos
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Request, Header, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# --- IMPORTACIONES LOCALES ---
from app.config import settings
from app.database import create_db, get_db
from app.services import user_service
from app.datachess.seed_chess import generate_lessons 

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai, users, speech, billing 
from app.api import chess 

load_dotenv()

# 🔐 CONFIGURACIÓN DE STRIPE
stripe.api_key = os.getenv("STRIPE_API_KEY")
ENDPOINT_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    logger = logging.getLogger("OnixLingo.Core")
    try:
        # 🔥 Esto leerá el base.py y creará todas las tablas de las Fases 1 y 2
        create_db()
        logger.info("✅ [DB] Base de datos conectada y esquemas sincronizados.")
        logger.info("⏳ [DB] Verificando e inyectando lecciones de ajedrez...")
        generate_lessons()
        logger.info("✅ [DB] Ajedrez sincronizado y listo para jugar.")
    except Exception as e:
        logger.critical(f"❌ [DB] Error crítico al conectar DB: {e}")
    yield
    logger.info("🛑 [SYSTEM] Apagando sistema OnixLingo...")

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
    allow_origin_regex=r"https://.*\.vercel\.app", 
    allow_credentials=True, 
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"], 
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.post("/api/v1/webhooks/stripe", tags=["Payments"], include_in_schema=False)
async def stripe_webhook(
    request: Request, 
    stripe_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    logger = logging.getLogger("OnixLingo.Payments")
    payload = await request.body()

    if not stripe.api_key or not ENDPOINT_SECRET:
        logger.error("❌ [STRIPE] Faltan claves de configuración.")
        raise HTTPException(status_code=500, detail="Server Configuration Error")

    try:
        event = stripe.Webhook.construct_event(payload, stripe_signature, ENDPOINT_SECRET)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id_str = session.get("metadata", {}).get("userId")
        user_email = session.get("customer_details", {}).get("email")
        logger.info(f"💰 [STRIPE] Pago recibido de: {user_email} (ID: {user_id_str})")

        if user_id_str:
            try:
                # 🔥 CORRECCIÓN CRÍTICA: Convertimos el string a UUID, no a int()
                user_id = uuid.UUID(user_id_str)
                updated_user = user_service.set_pro_status(db, user_id=user_id, is_pro=True)
                if updated_user:
                    logger.info(f"✅ [UPGRADE] Usuario {user_email} actualizado a PRO exitosamente.")
                else:
                    logger.warning(f"⚠️ [WARNING] Usuario ID {user_id} pagó pero no se encontró en DB.")
            except ValueError:
                logger.error(f"❌ [UUID ERROR] El ID recibido de Stripe no es un UUID válido: {user_id_str}")
            except Exception as e:
                logger.error(f"❌ [DB ERROR] Fallo al actualizar estado PRO: {e}")

    return {"status": "success", "event_type": event['type']}

# 🔗 CONEXIÓN DE RUTAS (ROUTERS)
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users Profile"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Analytics & Progress"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])
app.include_router(speech.router, prefix="/api/v1/speech", tags=["Speech Analysis"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["Billing & Referrals"]) 
app.include_router(chess.router, prefix="/api/v1", tags=["Chess Academy"])

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
    base_dir = Path(__file__).resolve().parent 
    
    # Intento 1: Busca en app/voclessons/lessons/{idioma}/archivo.json
    file_path = base_dir / "voclessons" / "lessons" / lang / f"{lesson_id}.json"
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
            
    # Intento 2: Ruta alternativa
    file_path_alt = base_dir.parent / "app" / "voclessons" / "lessons" / lang / f"{lesson_id}.json"
    if file_path_alt.exists():
        with open(file_path_alt, "r", encoding="utf-8") as f:
            return json.load(f)

    # Si no encuentra el archivo traducido, lanza un error 404
    raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found for language '{lang}'")