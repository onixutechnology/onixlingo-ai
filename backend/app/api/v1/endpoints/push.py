from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import os

from app.database import get_db
from app.db import models
from app.api.deps import get_current_user

router = APIRouter()

class PushKeys(BaseModel):
    p256dh: str
    auth: str

class PushSubscriptionCreate(BaseModel):
    endpoint: str
    keys: PushKeys

@router.post("/subscribe")
def subscribe_to_push(
    subscription: PushSubscriptionCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Guarda la suscripción push del navegador en la base de datos.
    """
    # Check if endpoint already exists
    existing_sub = db.query(models.PushSubscription).filter(
        models.PushSubscription.endpoint == subscription.endpoint
    ).first()
    
    if existing_sub:
        # Update user and keys if it changed
        existing_sub.user_id = current_user.id
        existing_sub.p256dh = subscription.keys.p256dh
        existing_sub.auth = subscription.keys.auth
    else:
        new_sub = models.PushSubscription(
            user_id=current_user.id,
            endpoint=subscription.endpoint,
            p256dh=subscription.keys.p256dh,
            auth=subscription.keys.auth
        )
        db.add(new_sub)
        
    db.commit()
    return {"status": "success", "message": "Suscripción guardada correctamente"}

@router.post("/unsubscribe")
def unsubscribe_from_push(
    endpoint: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Elimina una suscripción específica
    """
    sub = db.query(models.PushSubscription).filter(
        models.PushSubscription.endpoint == endpoint,
        models.PushSubscription.user_id == current_user.id
    ).first()
    
    if sub:
        db.delete(sub)
        db.commit()
        return {"status": "success", "message": "Suscripción eliminada"}
        
    return {"status": "not_found"}

@router.get("/vapid-public-key")
def get_vapid_public_key():
    """
    Devuelve la llave pública para que el frontend pueda suscribirse
    """
    public_key = os.getenv("VAPID_PUBLIC_KEY")
    if not public_key:
        raise HTTPException(status_code=500, detail="VAPID_PUBLIC_KEY no está configurada")
    return {"public_key": public_key}
