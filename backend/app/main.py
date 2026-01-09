import logging
import stripe
import os # <--- 1. NUEVO: Para leer el sistema
from dotenv import load_dotenv # <--- 2. NUEVO: Para leer el archivo .env

from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.settings import settings
from app.database import create_db

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai 

# 3. CARGAMOS LAS VARIABLES DE ENTORNO DEL ARCHIVO .env
load_dotenv()

# ==============================================================================
# 🔐 CONFIGURACIÓN DE STRIPE (MODO SEGURO)
# ==============================================================================

# 4. AHORA LEEMOS DESDE EL ARCHIVO OCULTO (Ya no escribimos la clave aquí)
stripe.api_key = os.getenv("STRIPE_API_KEY") 
ENDPOINT_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# ==============================================================================
# ⚙️ CONFIGURACIÓN DEL SERVIDOR
# ==============================================================================

# 1. Configuración de Logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger("OnixLingo.Core")

# 2. Inicialización de DB
try:
    create_db()
    logger.info("✅ [DB] Base de datos conectada.")
except Exception as e:
    logger.critical(f"❌ [DB] Error crítico: {e}")

# 3. App Setup
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="OnixLingo Enterprise LMS API",
    version="8.0.0-titanium",
    docs_url="/docs"
)

# 4. Middleware (CORS - FIX PARA RENDER)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# 💳 ROUTER ESPECIAL: STRIPE WEBHOOK
# ==============================================================================
@app.post("/api/v1/webhooks/stripe", tags=["Payments"])
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """
    Escucha eventos de Stripe para desbloquear usuarios automáticamente.
    """
    payload = await request.body()

    # Verificación de seguridad: Si no hay claves configuradas, fallamos gracefuly
    if not stripe.api_key or not ENDPOINT_SECRET:
        logger.error("❌ [STRIPE] Faltan las claves en el archivo .env")
        raise HTTPException(status_code=500, detail="Configuration Error")

    try:
        # Verificar que el evento viene realmente de Stripe
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, ENDPOINT_SECRET
        )
    except ValueError as e:
        logger.error(f"❌ [STRIPE] Payload inválido: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"❌ [STRIPE] Firma inválida. ¿Cambiaste el ENDPOINT_SECRET?: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # ✅ MANEJO DEL PAGO EXITOSO
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Datos del usuario
        user_id = session.get("metadata", {}).get("userId")
        user_email = session.get("customer_details", {}).get("email")

        logger.info(f"💰 [STRIPE] Pago recibido de: {user_email} (ID: {user_id})")

        # ---------------------------------------------------------------------
        # AQUÍ LA LÓGICA DE BASE DE DATOS (Desbloqueo)
        # ---------------------------------------------------------------------
        # Ejemplo futuro: db.users.update_one({"_id": user_id}, {"$set": {"is_premium": True}})
        
        logger.info(f"🔓 [DB] Usuario {user_id} actualizado a PREMIUM exitosamente.")

    return {"status": "success"}


# ==============================================================================
# 🔗 CONEXIÓN DE RUTAS (ROUTERS EXISTENTES)
# ==============================================================================
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(progress.router, prefix="/api/v1", tags=["Analytics & Progress"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])

@app.get("/")
def health_check():
    return {
        "system": "OnixLingo Enterprise Kernel",
        "status": "OPERATIONAL",
        "version": "8.0.0-titanium"
    }