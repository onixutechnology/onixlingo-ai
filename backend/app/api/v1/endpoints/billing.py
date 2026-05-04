import os
import json
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_db
from app.db.models import User
from app.api.deps import get_current_active_user

# --- PADDLE SDK IMPORTS ---
from paddle_billing import Client, Environment, Options
from paddle_billing.Notifications import Secret, WebhookVerifier

router = APIRouter()

# --- CONFIGURACIÓN DE PADDLE ---
PADDLE_API_KEY = os.getenv("PADDLE_API_KEY", "")
PADDLE_WEBHOOK_SECRET = os.getenv("PADDLE_WEBHOOK_SECRET", "")
PADDLE_ENV = os.getenv("PADDLE_ENVIRONMENT", "sandbox")
FRONTEND_URL = os.getenv("NEXT_PUBLIC_BASE_URL", "https://onixlingo.onixu.company")

# Inicializar Cliente de Paddle
if PADDLE_API_KEY:
    paddle_env = Environment.SANDBOX if PADDLE_ENV == "sandbox" else Environment.PRODUCTION
    paddle_client = Client(PADDLE_API_KEY, options=Options(paddle_env))
else:
    paddle_client = None


class ReferralApply(BaseModel):
    referral_code: str

@router.post("/apply-referral")
def apply_referral_code(
    payload: ReferralApply,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Aplica un código de referido. Le da 30 días VIP al invitado y al dueño del código.
    (La lógica se mantiene intacta)
    """
    referrer = db.query(User).filter(User.referral_code == payload.referral_code).first()
    
    if not referrer:
        raise HTTPException(status_code=404, detail="Código de referido inválido o no existe.")
        
    if referrer.id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes usar tu propio código.")
        
    now = datetime.utcnow()
    
    # Actualizar Invitado
    user_valid_until = current_user.valid_until if current_user.valid_until and current_user.valid_until > now else now
    current_user.valid_until = user_valid_until + timedelta(days=30)
    current_user.is_pro = True
    current_user.tier = "titanium" 
    
    # Actualizar Referidor
    referrer_valid_until = referrer.valid_until if referrer.valid_until and referrer.valid_until > now else now
    referrer.valid_until = referrer_valid_until + timedelta(days=30)
    
    db.commit()
    
    return {"message": "¡Código aplicado! Se han añadido 30 días Premium a tu cuenta."}


@router.post("/create-portal-session")
def create_paddle_portal_session(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Genera un enlace seguro para que el usuario gestione su suscripción en Paddle 
    (Cancelar plan, actualizar tarjeta, ver facturas).
    """
    if not paddle_client:
        raise HTTPException(status_code=500, detail="Paddle no está configurado en el servidor.")

    # Extraemos el ID de cliente de Paddle desde la base de datos
    customer_id = getattr(current_user, "paddle_customer_id", None)

    if not customer_id:
        raise HTTPException(status_code=400, detail="Aún no tienes una suscripción activa para gestionar.")

    try:
        from paddle_billing.Resources.CustomerPortalSessions.Operations import CreateCustomerPortalSession
        
        # Le pedimos a Paddle que nos genere un link seguro de 1 solo uso
        session_data = CreateCustomerPortalSession(
            customer_ids=[customer_id]
        )
        portal_session = paddle_client.customer_portal_sessions.create(session_data)
        
        return {"url": portal_session.urls.general.href}

    except Exception as e:
        print(f"❌ Error en portal de Paddle: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno conectando con el portal de pagos.")


# 🔥 NUEVO ENDPOINT CRÍTICO: WEBHOOKS DE PADDLE
@router.post("/webhook")
async def paddle_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Recibe las notificaciones en tiempo real de Paddle cuando un pago es exitoso,
    falla o se cancela la suscripción.
    """
    signature = request.headers.get("Paddle-Signature", "")
    body = await request.body()
    body_str = body.decode("utf-8")

    try:
        # 1. Validar criptográficamente que la petición viene de Paddle y no de un atacante
        verifier = WebhookVerifier()
        event = verifier.verify(body_str, signature, Secret(PADDLE_WEBHOOK_SECRET))
    except Exception as e:
        print(f"⚠️ Alerta de Seguridad: Firma de Webhook Inválida -> {str(e)}")
        raise HTTPException(status_code=400, detail="Firma de Paddle inválida")

    event_type = event.event_type.value
    data = event.data

    try:
        # 2. Buscar usuario en la base de datos
        # Recuerda que en el frontend pasamos `internal_user_id` en el `customData`
        custom_data = getattr(data, "custom_data", {})
        internal_user_id = custom_data.get("internal_user_id") if custom_data else None

        user = None
        if internal_user_id:
            # Primero intentamos por username (si es el que guardaste en localstorage)
            user = db.query(User).filter(User.username == internal_user_id).first()
            # Si no, intentamos por UUID/String ID
            if not user:
                user = db.query(User).filter(User.id == internal_user_id).first()
        else:
            # Fallback: Buscar por el customer_id de Paddle si ya lo teníamos registrado
            customer_id = getattr(data, "customer_id", None)
            if customer_id:
                user = db.query(User).filter(User.paddle_customer_id == customer_id).first()

        if not user:
            print(f"Usuario no encontrado para el evento: {event_type}")
            return {"status": "User not found, but webhook acknowledged"}

        # 3. MANEJO DE ESTADOS DE SUSCRIPCIÓN
        if event_type in ["subscription.created", "subscription.activated", "subscription.updated", "transaction.completed"]:
            user.is_pro = True
            user.tier = "titanium"
            # Guardamos los IDs de Paddle para poder generarle el portal de cancelación después
            user.paddle_customer_id = getattr(data, "customer_id", user.paddle_customer_id)
            user.paddle_subscription_id = getattr(data, "id", user.paddle_subscription_id)
            
        elif event_type in ["subscription.canceled", "subscription.past_due"]:
            user.is_pro = False
            user.tier = "free"

        db.commit()
        return {"status": "success"}

    except Exception as e:
        print(f"❌ Error procesando el webhook: {str(e)}")
        # Devolvemos 200 OK a Paddle para que no reintente infinitamente si hay un error en nuestra DB
        return {"status": "error_acknowledged"}