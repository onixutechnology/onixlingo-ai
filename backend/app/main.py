import logging
import stripe
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# --- IMPORTACIONES LOCALES ---
from app.core.settings import settings
from app.database import create_db

# --- IMPORTAMOS LOS ROUTERS ---
from app.api.v1.endpoints import auth, lessons, progress, ai

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
# 🛡️ MIDDLEWARE CORS (CORREGIDO CON TU URL DE VERCEL)
# ==============================================================================
origins = [
    "http://localhost:3000",                  # Desarrollo Local
    "http://127.0.0.1:3000",                  # Alternativa Local
    
    # 👇 TUS DOMINIOS DE VERCEL (Agregados desde tu imagen)
    "https://onixlingo-ai-nknb.vercel.app",       # Tu despliegue específico actual
    "https://onixlingo-ai.vercel.app",            # Tu alias de producción principal
    "https://onixlingo-ai-nknb-git-main-jacobs-projects-4ad490ce.vercel.app", # Preview URL (Opcional, pero útil)
    
    # Dominio futuro (si compras uno)
    "https://www.onixlingo.com",              
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Permitir solo dominios de confianza
    allow_credentials=True,      # Permitir Cookies/Tokens
    allow_methods=["*"],         # Permitir GET, POST, OPTIONS, PUT, DELETE
    allow_headers=["*"],         # Permitir todos los headers
)

# ==============================================================================
# 💳 ROUTER ESPECIAL: STRIPE WEBHOOK
# ==============================================================================
@app.post("/api/v1/webhooks/stripe", tags=["Payments"], include_in_schema=False)
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    """
    Maneja las notificaciones asíncronas de Stripe (ej: pago exitoso).
    """
    logger = logging.getLogger("OnixLingo.Payments")
    payload = await request.body()

    if not stripe.api_key or not ENDPOINT_SECRET:
        logger.error("❌ [STRIPE CONFIG] Faltan claves en variables de entorno.")
        raise HTTPException(status_code=500, detail="Server Configuration Error")

    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, ENDPOINT_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # ✅ LÓGICA DE NEGOCIO: PAGO EXITOSO
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        user_id = session.get("metadata", {}).get("userId")
        user_email = session.get("customer_details", {}).get("email")
        amount_total = session.get("amount_total", 0) / 100 

        logger.info(f"💰 [STRIPE SUCCESS] Usuario: {user_email} (ID: {user_id}) pagó ${amount_total}")

        # Aquí conectarías con tu servicio de usuarios para activar PRO
        
    return {"status": "success", "event_type": event['type']}


# ==============================================================================
# 🔗 CONEXIÓN DE RUTAS (ROUTERS)
# ==============================================================================
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(progress.router, prefix="/api/v1", tags=["Analytics & Progress"])
app.include_router(lessons.router, prefix="/api/v1/lessons", tags=["Lessons"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI Engine"])

@app.get("/", tags=["System"])
def health_check():
    return {
        "system": "OnixLingo Enterprise Kernel",
        "status": "OPERATIONAL 🟢",
        "cors_enabled_for": origins
    }