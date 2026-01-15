# backend/app/api/deps.py
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

# ✅ CORRECCIÓN: Importamos desde settings.py (no config.py)
from app.core.settings import settings
from app.database import get_db
from app.db import models

# Configura el esquema de OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> models.User:
    """
    Valida el token JWT y recupera el usuario de la DB.
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username_or_email = payload.get("sub")
        
        if username_or_email is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Credenciales no válidas",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No se pudieron validar las credenciales",
        )
        
    # Buscamos por username (ajusta a email si tu token guarda email)
    user = db.query(models.User).filter(models.User.username == username_or_email).first()
    
    if not user:
        # Intento secundario por email
        user = db.query(models.User).filter(models.User.email == username_or_email).first()

    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user