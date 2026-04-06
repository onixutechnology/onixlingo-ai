import os
import json
import logging
import stripe
from pathlib import Path
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Request, Header, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# --- IMPORTACIONES LOCALES ---
from app.core.settings import settings
from app.database import create_db, get_db
from app.services import user_service

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai
from app.api import chess 

# 1. CARGA DE ENTORNO
load_dotenv()

# ==============================================================================
# 🔐 CONFIGURACIÓN DE STRIPE
# ==============================================================================
stripe.api_key = os.getenv("STRIPE_API_KEY")
ENDPOINT_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# ==============================================================================
# ⚙️ CONFIGURACIÓN DEL CICLO DE VIDA (LIFESPAN)
# ==============================================================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP ---
    logging.basicConfig(
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        level=logging.INFO
    )
    logger = logging.getLogger("OnixLingo.Core")
    try:
        create_db()
        logger.info("✅ [DB] Base de datos conectada y esquemas sincronizados.")
    except Exception as e:
        logger.critical(f"❌ [DB] Error crítico al conectar DB: {e}")
    yield
    # --- SHUTDOWN ---
    logger.info("🛑 [SYSTEM] Apagando sistema OnixLingo...")


# ==============================================================================
# 🚀 INICIALIZACIÓN DE LA APP
# ==============================================================================
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="OnixLingo Enterprise LMS API",
    version="8.0.0-titanium",
    docs_url="/docs",
    lifespan=lifespan
)

# ==============================================================================
# 🛡️ MIDDLEWARE CORS (CONFIGURACIÓN ESTRICTA + VERCEL PREVIEWS)
# ==============================================================================
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://onixlingo.onixu.company",       # 🚀 Tu dominio oficial corporativo
    "https://www.onixlingo.onixu.company",   # Cobertura para usuarios que escriban 'www'
    "https://onixlingo-bckend.onrender.com"  # Dominio del backend (útil para pruebas en /docs)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    # 🪄 MAGIA: Permite cualquier subdominio temporal generado por Vercel
    allow_origin_regex=r"https://.*\.vercel\.app", 
    allow_credentials=True, # Obligatorio para manejar las cookies de sesión
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================================================================
# 💳 ROUTER ESPECIAL: STRIPE WEBHOOK (LÓGICA COMPLETA)
# ==============================================================================
@app.post("/api/v1/webhooks/stripe", tags=["Payments"], include_in_schema=False)
async def stripe_webhook(
    request: Request, 
    stripe_signature: str = Header(None),
    db: Session = Depends(get_db)
):
    """Recibe la confirmación de pago de Stripe y activa el plan PRO."""
    logger = logging.getLogger("OnixLingo.Payments")
    payload = await request.body()

    # 1. Validación de seguridad
    if not stripe.api_key or not ENDPOINT_SECRET:
        logger.error("❌ [STRIPE] Faltan claves de configuración.")
        raise HTTPException(status_code=500, detail="Server Configuration Error")

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, ENDPOINT_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 2. Lógica de Activación
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        # Recuperamos los datos que enviamos desde el Frontend (metadata)
        user_id_str = session.get("metadata", {}).get("userId")
        user_email = session.get("customer_details", {}).get("email")

        logger.info(f"💰 [STRIPE] Pago recibido de: {user_email} (ID: {user_id_str})")

        if user_id_str:
            try:
                # Convertir ID a entero y llamar al servicio
                user_id = int(user_id_str)
                updated_user = user_service.set_pro_status(db, user_id=user_id, is_pro=True)
                if updated_user:
                    logger.info(f"✅ [UPGRADE] Usuario {user_email} actualizado a PRO exitosamente.")
                else:
                    logger.warning(f"⚠️ [WARNING] Usuario ID {user_id} pagó pero no se encontró en DB.")
            except Exception as e:
                logger.error(f"❌ [DB ERROR] Fallo al actualizar estado PRO: {e}")

    return {"status": "success", "event_type": event['type']}


# ==============================================================================
# 🔗 CONEXIÓN DE RUTAS (ROUTERS)
# ==============================================================================

# 1. Auth
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

# 2. Progress (Mapas, Puntuación, Trofeos)
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Analytics & Progress"])

# 3. Lessons (Contenido Standard y Pro)
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])

# 4. AI (Avatar, Chatbot)
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])

# 🔥 5. Chess Academy
app.include_router(chess.router, prefix="/api/v1", tags=["Chess Academy"])


# ==============================================================================
# 🛠️ UTILIDADES Y ROOT
# ==============================================================================
@app.get("/", tags=["System"])
def health_check():
    return {
        "system": "OnixLingo Enterprise Kernel",
        "status": "OPERATIONAL 🟢",
        "version": "Titanium 8.0"
    }

# Endpoint para servir JSONs de Vocabulario de forma robusta
@app.get("/api/v1/voclessons/{lesson_id}", tags=["Lessons"])
def get_voc_lesson(lesson_id: str):
    # Detecta la carpeta raíz del backend (donde está main.py -> app -> backend)
    base_dir = Path(__file__).resolve().parent 
    
    # Ruta: backend/app/voclessons/lessons/{id}.json
    file_path = base_dir / "voclessons" / "lessons" / f"{lesson_id}.json"
    
    if file_path.exists():
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
            
    # Fallback por si la estructura cambia levemente en producción
    file_path_alt = base_dir.parent / "app" / "voclessons" / "lessons" / f"{lesson_id}.json"
    if file_path_alt.exists():
        with open(file_path_alt, "r", encoding="utf-8") as f:
            return json.load(f)

    raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")
