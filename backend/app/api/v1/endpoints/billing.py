import os
import json
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_db
from app.db.models import User, PromoCoupon
from app.api.deps import get_current_active_user

# --- PADDLE SDK IMPORTS ---
from paddle_billing import Client, Environment, Options
from paddle_billing.Notifications import Secret, Verifier

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


class CouponRedeem(BaseModel):
    code: str


def seed_coupons_if_empty(db: Session):
    # Eliminar cupones antiguos simples si existen
    db.query(PromoCoupon).filter(PromoCoupon.code.like("ONIX-TITANIUM-%")).delete(synchronize_session=False)
    db.commit()
    
    count = db.query(PromoCoupon).count()
    if count == 0:
        complex_codes = [
            "TZ89P2M4QX", "L5V9K1R3WB", "J7C4N8T2FD", "Y3M9P6S1ZG", "H8X2W4B9LQ",
            "F1K7D3N9RC", "B5V9J4P2MS", "W3S8T2C4NK", "G9Y1M6R3PD", "Q8Z2K4V9LB",
            "D7F1J3N9TC", "X5P9V2M4SK", "R8W2K4B9YD", "L3V9N1P3MG", "J7C4T8R2KD",
            "Y9M3S6P1ZF", "N5K7D2P9RC", "V8S2J4B9ML", "A4P8T2C9NK", "E9Y1M6R3PD",
            "U8Z2K4V9LB", "I7F1J3N9TC", "O5P9V2M4SK", "P8W2K4B9YD", "S3V9N1P3MG",
            "Z7C4T8R2KD", "K9M3S6P1ZF", "C5K7D2P9RC", "M8S2J4B9ML", "B3P8T2C4NK",
            "F9Y1M6R3PD", "H8Z2K4V9LB", "L7F1J3N9TC", "W5P9V2M4SK", "Y8W2K4B9YD",
            "X3V9N1P3MG", "Q7C4T8R2KD", "R9M3S6P1ZF", "D5K7D2P9RC", "G8S2J4B9ML",
            "P3P8T2C4NK", "T9Y1M6R3PD", "V8Z2K4V9LB", "N7F1J3N9TC", "J5P9V2M4SK",
            "K8W2K4B9YD", "S3V9N1P3MX", "M7C4T8R2KX", "F9M3S6P1ZX", "H5K7D2P9RX"
        ]
        coupons = [PromoCoupon(code=code, is_used=False) for code in complex_codes]
        db.add_all(coupons)
        db.commit()


@router.post("/redeem-coupon")
def redeem_coupon(
    payload: CouponRedeem,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Canjea un cupón promocional para obtener 30 días de plan Titanium Pro gratis.
    """
    # Asegurar auto-seeding
    seed_coupons_if_empty(db)
    
    code_upper = payload.code.strip().upper()
    coupon = db.query(PromoCoupon).filter(PromoCoupon.code == code_upper).first()
    
    if not coupon:
        raise HTTPException(
            status_code=404, 
            detail="El cupón ingresado no es válido o no existe."
        )
        
    if coupon.is_used:
        raise HTTPException(
            status_code=400, 
            detail="Este cupón ya ha sido utilizado."
        )
        
    now = datetime.utcnow()
    
    # Marcar cupón como usado
    coupon.is_used = True
    coupon.used_by_id = current_user.id
    coupon.used_at = now
    
    # Activar plan Pro / Titanium por 30 días
    user_valid_until = current_user.valid_until if current_user.valid_until and current_user.valid_until > now else now
    current_user.valid_until = user_valid_until + timedelta(days=30)
    current_user.is_pro = True
    current_user.tier = "pro"
    
    db.commit()
    
    return {
        "message": "¡Cupón canjeado con éxito! Tu plan Titanium Pro se ha activado por 30 días.",
        "valid_until": current_user.valid_until.strftime("%Y-%m-%d %H:%M:%S")
    }


@router.post("/apply-referral")
def apply_referral_code(
    payload: ReferralApply,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Aplica un código de referido. Le da 30 días VIP al invitado y al dueño del código.
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
    current_user.tier = "pro" 
    
    # Actualizar Referidor
    referrer_valid_until = referrer.valid_until if referrer.valid_until and referrer.valid_until > now else now
    referrer.valid_until = referrer_valid_until + timedelta(days=30)
    
    db.commit()
    
    return {"message": "¡Código aplicado! Se han añadido 30 días Premium a tu cuenta."}


class DevUpgradeRequest(BaseModel):
    tier: str = "pro"

@router.post("/dev-activate-pro")
def dev_activate_pro(
    payload: DevUpgradeRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Entorno Local de Desarrollo: Activa instantáneamente el plan solicitado (pro o executive)
    para pruebas sin necesidad de pasarela configurada.
    """
    now = datetime.utcnow()
    current_user.is_pro = True
    current_user.tier = payload.tier.lower()
    current_user.valid_until = now + timedelta(days=30)
    db.commit()
    return {"message": f"¡Modo Desarrollo: Plan {payload.tier.upper()} activado exitosamente!"}


@router.post("/create-portal-session")
def create_paddle_portal_session(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Genera un enlace seguro para que el usuario gestione su suscripción en Paddle.
    """
    if not paddle_client:
        raise HTTPException(status_code=500, detail="Paddle no está configurado en el servidor.")

    customer_id = getattr(current_user, "paddle_customer_id", None)

    if not customer_id:
        raise HTTPException(status_code=400, detail="Aún no tienes una suscripción activa para gestionar.")

    try:
        from paddle_billing.Resources.CustomerPortalSessions.Operations import CreateCustomerPortalSession
        
        session_data = CreateCustomerPortalSession(
            customer_ids=[customer_id]
        )
        portal_session = paddle_client.customer_portal_sessions.create(session_data)
        
        return {"url": portal_session.urls.general.href}

    except Exception as e:
        print(f"❌ Error en portal de Paddle: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno conectando con el portal de pagos.")


@router.post("/webhook")
async def paddle_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Recibe las notificaciones en tiempo real de Paddle.
    """
    signature = request.headers.get("Paddle-Signature", "")
    body = await request.body()
    body_str = body.decode("utf-8")

    try:
        # 1. Validar firma usando la clase Verifier
        verifier = Verifier()
        event = verifier.verify(body_str, signature, Secret(PADDLE_WEBHOOK_SECRET))
    except Exception as e:
        print(f"⚠️ Alerta de Seguridad: Firma de Webhook Inválida -> {str(e)}")
        raise HTTPException(status_code=400, detail="Firma de Paddle inválida")

    event_type = event.event_type.value
    data = event.data

    try:
        # 2. Buscar usuario
        custom_data = getattr(data, "custom_data", {})
        internal_user_id = custom_data.get("internal_user_id") if custom_data else None

        user = None
        if internal_user_id:
            user = db.query(User).filter(User.username == internal_user_id).first()
            if not user:
                user = db.query(User).filter(User.id == internal_user_id).first()
        else:
            customer_id = getattr(data, "customer_id", None)
            if customer_id:
                user = db.query(User).filter(User.paddle_customer_id == customer_id).first()

        if not user:
            print(f"Usuario no encontrado para el evento: {event_type}")
            return {"status": "User not found"}

        # 3. Estados de suscripción
        if event_type in ["subscription.created", "subscription.activated", "subscription.updated", "transaction.completed"]:
            user.is_pro = True
            
            # Determinar el tier dinámicamente
            price_id = ""
            product_id = ""
            
            # 1. Intentar leer desde custom_data
            custom_data = getattr(data, "custom_data", {})
            tier = custom_data.get("tier") if custom_data else None
            
            # 2. Intentar leer desde los items del evento
            if not tier:
                items = getattr(data, "items", [])
                if items:
                    try:
                        price_id = items[0].price.id.lower()
                    except Exception:
                        pass
                
                # Intentar leer price_id directo
                if not price_id:
                    price_id = getattr(data, "price_id", "").lower() if hasattr(data, "price_id") else ""
                    
                if "exec" in price_id or "titanium" in price_id:
                    tier = "executive"
                else:
                    tier = "pro"
                    
            user.tier = tier
            user.paddle_customer_id = getattr(data, "customer_id", user.paddle_customer_id)
            user.paddle_subscription_id = getattr(data, "id", user.paddle_subscription_id)
            
        elif event_type in ["subscription.canceled", "subscription.past_due"]:
            user.is_pro = False
            user.tier = "free"

        db.commit()
        return {"status": "success"}

    except Exception as e:
        print(f"❌ Error procesando el webhook: {str(e)}")
        return {"status": "error_acknowledged"}
