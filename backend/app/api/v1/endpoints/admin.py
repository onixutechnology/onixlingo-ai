from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List

from app.database import get_db
from app.db import models
# 🔥 Importamos el candado de admin
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/users")
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    # 🔥 Esta ruta está protegida, solo tú puedes entrar
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Lista todos los usuarios registrados en la plataforma.
    """
    users = db.query(models.User).offset(skip).limit(limit).all()
    
    # Formateamos la respuesta para no enviar contraseñas hasheadas
    user_list = []
    for u in users:
        user_list.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "is_pro": u.is_pro,
            "tier": u.tier,
            "valid_until": u.valid_until
        })
    return {"users": user_list, "total": len(user_list)}


@router.post("/grant-pro/{user_id}")
def grant_pro_access(
    user_id: int, 
    days: int = 30, # Por defecto regala 30 días
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Otorga días de suscripción OnixPro manualmente a un usuario.
    Ideal para cupones, promociones o soporte técnico.
    """
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    now = datetime.utcnow()
    current_valid_until = target_user.valid_until if target_user.valid_until and target_user.valid_until > now else now
    
    # Sumamos los días
    target_user.valid_until = current_valid_until + timedelta(days=days)
    target_user.is_pro = True
    target_user.tier = "titanium"
    
    db.commit()
    
    return {
        "message": f"Se han otorgado {days} días Premium al usuario {target_user.username}",
        "new_expiration": target_user.valid_until
    }