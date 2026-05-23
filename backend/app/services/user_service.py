# backend/app/services/user_service.py
from sqlalchemy.orm import Session
from app.db import models

def get_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def set_pro_status(db: Session, user_id: int, is_pro: bool = True, tier: str = "pro"):
    """
    Busca al usuario por ID y activa su estado PRO y tier.
    """
    user = get_by_id(db, user_id)
    if user:
        user.is_pro = is_pro
        user.tier = tier
        # Opcional: Aquí podrías registrar la fecha de inicio de suscripción si tuvieras el campo
        db.commit()
        db.refresh(user)
        return user
    return None