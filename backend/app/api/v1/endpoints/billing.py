from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel

from app.database import get_db
from app.db.models import User
from app.core.security import get_current_user

router = APIRouter()

class ReferralApply(BaseModel):
    referral_code: str

@router.post("/apply-referral")
def apply_referral_code(
    payload: ReferralApply,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Aplica un código de referido. Le da 30 días de Titanium al invitado y al dueño del código.
    """
    # 1. Buscar al dueño del código
    referrer = db.query(User).filter(User.referral_code == payload.referral_code).first()
    
    if not referrer:
        raise HTTPException(status_code=404, detail="Código de referido inválido o no existe.")
        
    if referrer.id == current_user.id:
        raise HTTPException(status_code=400, detail="No puedes usar tu propio código.")
        
    # (Opcional) Aquí podrías verificar si el current_user ya usó un código antes para evitar abusos
    
    # 2. Lógica de recompensas: +30 días para ambos
    # Asumimos que tienes campos como 'tier' y 'valid_until' en tu modelo User en la DB.
    # Si current_user no tiene fecha válida, empezamos desde hoy.
    now = datetime.utcnow()
    
    # Actualizar Invitado (Current User)
    user_valid_until = current_user.valid_until if current_user.valid_until and current_user.valid_until > now else now
    current_user.valid_until = user_valid_until + timedelta(days=30)
    current_user.is_pro = True # O current_user.tier = 'titanium'
    
    # Actualizar Referidor (Dueño del código)
    referrer_valid_until = referrer.valid_until if referrer.valid_until and referrer.valid_until > now else now
    referrer.valid_until = referrer_valid_until + timedelta(days=30)
    
    db.commit()
    
    return {"message": "¡Código aplicado! Se han añadido 30 días Premium a tu cuenta."}

@router.post("/create-portal-session")
def create_stripe_portal(current_user: User = Depends(get_current_user)):
    """
    Genera el link seguro de Stripe para gestionar la tarjeta de crédito y la suscripción.
    """
    # IMPORTANTE: Aquí conectarás el SDK de Stripe en el futuro.
    # import stripe
    # stripe.api_key = settings.STRIPE_SECRET_KEY
    # session = stripe.billing_portal.Session.create(
    #     customer=current_user.stripe_customer_id,
    #     return_url="https://onixlingo.com/dashboard/profile"
    # )
    # return {"url": session.url}
    
    # Simulación temporal para que el Frontend funcione
    return {
        "url": "https://billing.stripe.com/p/session/test_simulacion_onixlingo"
    }
