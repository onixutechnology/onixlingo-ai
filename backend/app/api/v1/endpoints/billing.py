import os
import stripe
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_db
from app.db.models import User
# ✅ CORRECCIÓN: Importamos desde deps.py para usar la lógica segura
from app.api.deps import get_current_active_user

router = APIRouter()

# Configurar variables de entorno
stripe.api_key = os.getenv("STRIPE_API_KEY")
FRONTEND_URL = os.getenv("NEXT_PUBLIC_BASE_URL", "https://onixlingo.onixu.company")
PRICE_ID_PRO = os.getenv("STRIPE_PRICE_ID_PRO")

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
    current_user.tier = "titanium" # Aseguramos el tier
    
    # Actualizar Referidor
    referrer_valid_until = referrer.valid_until if referrer.valid_until and referrer.valid_until > now else now
    referrer.valid_until = referrer_valid_until + timedelta(days=30)
    
    db.commit()
    
    return {"message": "¡Código aplicado! Se han añadido 30 días Premium a tu cuenta."}

@router.post("/create-portal-session")
def create_stripe_session(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Decide a dónde mandar al usuario: a pagar por primera vez (Checkout) 
    o a gestionar su suscripción existente (Billing Portal).
    """
    try:
        # Validaciones de seguridad para no chocar si faltan las llaves
        if not stripe.api_key:
            raise ValueError("Falta configurar STRIPE_API_KEY en el backend.")
            
        # ESCENARIO 1: El usuario YA es cliente de Stripe (Gestionar Suscripción)
        if current_user.stripe_customer_id:
            session = stripe.billing_portal.Session.create(
                customer=current_user.stripe_customer_id,
                return_url=f"{FRONTEND_URL}/dashboard/profile"
            )
            return {"url": session.url}

        # ESCENARIO 2: El usuario NUNCA ha pagado (Checkout)
        else:
            if not PRICE_ID_PRO:
                raise ValueError("Falta configurar STRIPE_PRICE_ID_PRO en el backend.")

            session = stripe.checkout.Session.create(
                success_url=f"{FRONTEND_URL}/dashboard/pro?success=true",
                cancel_url=f"{FRONTEND_URL}/dashboard/profile?canceled=true",
                payment_method_types=["card"],
                mode="subscription",
                billing_address_collection="auto",
                customer_email=current_user.email,
                client_reference_id=str(current_user.id), # 🔥 CRÍTICO: Esto conecta el pago con el usuario en la DB
                line_items=[
                    {
                        "price": PRICE_ID_PRO,
                        "quantity": 1,
                    },
                ],
                subscription_data={
                    "trial_period_days": 7, # 🎁 Tus 7 días gratis
                    "metadata": {
                        "userId": str(current_user.id), 
                    },
                },
                allow_promotion_codes=True,
            )
            return {"url": session.url}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=f"Error de Stripe: {e.user_message}")
    except ValueError as ve:
        print(f"⚠️ Error de Configuración: {str(ve)}")
        raise HTTPException(status_code=500, detail=str(ve))
    except Exception as e:
        print(f"❌ Error crítico en portal de pagos: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor conectando con pagos.")