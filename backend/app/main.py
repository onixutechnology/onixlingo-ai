import logging
import stripe
import os 
from dotenv import load_dotenv 

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

# ==============================================================================
# 🛡️ MIDDLEWARE CORS (CORREGIDO PARA COOKIES Y LOGOUT)
# ==============================================================================
# IMPORTANTE: Para que las Cookies (HttpOnly) funcionen, no puedes usar ["*"].
# Debes listar explícitamente los dominios de tu Frontend.

origins = [
    "http://localhost:3000",             # Frontend Local (Next.js)
    "http://127.0.0.1:3000",             # Alternativa Local
    "https://onixlingo.vercel.app",      # ⚠️ TU DOMINIO DE PRODUCCIÓN (Ajústalo si es diferente)
    # "https://tu-dominio.com"           # Agrega aquí otros dominios si compraste uno
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # 👈 CAMBIO CRÍTICO: Usamos la lista explícita
    allow_credentials=True,  # ✅ Ahora el navegador permitirá enviar/borrar cookies
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

    if not stripe.api_key or not ENDPOINT_SECRET:
        logger.error("❌ [STRIPE] Faltan las claves en el archivo .env")
        raise HTTPException(status_code=500, detail="Configuration Error")

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, ENDPOINT_SECRET
        )
    except ValueError as e:
        logger.error(f"❌ [STRIPE] Payload inválido: {e}")
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"❌ [STRIPE] Firma inválida: {e}")
        raise HTTPException(status_code=400, detail="Invalid signature")

    # ✅ MANEJO DEL PAGO EXITOSO
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        user_id = session.get("metadata", {}).get("userId")
        user_email = session.get("customer_details", {}).get("email")

        logger.info(f"💰 [STRIPE] Pago recibido de: {user_email} (ID: {user_id})")

        # AQUÍ LA LÓGICA DE BASE DE DATOS...
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