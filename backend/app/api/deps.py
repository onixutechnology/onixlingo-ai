# backend/app/api/deps.py
from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
import logging

# ✅ CORRECCIÓN: Importamos desde settings.py
from app.core.settings import settings
from app.database import get_db
from app.db import models

# Logger para ver por qué falla el token
logger = logging.getLogger("OnixLingo.Auth")

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
        # En auth.py guardamos el ID en 'sub', así que aquí leemos el ID
        token_sub = payload.get("sub")
        
        if token_sub is None:
            logger.error("❌ Token inválido: No contiene 'sub'")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Credenciales no válidas (sin sub)",
            )
            
    except (JWTError, ValidationError) as e:
        logger.error(f"❌ Error al decodificar JWT: {e}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"No se pudieron validar las credenciales: {str(e)}",
        )
        
    # ✅ CORRECCIÓN CLAVE: Buscar por ID si 'sub' es un número (lo que envía auth.py)
    user = None
    
    # Intentamos convertir a entero porque auth.py envía user.id
    try:
        user_id = int(token_sub)
        user = db.query(models.User).filter(models.User.id == user_id).first()
    except ValueError:
        # Si no es número, intentamos por username/email (fallback)
        user = db.query(models.User).filter(models.User.username == token_sub).first()
        if not user:
            user = db.query(models.User).filter(models.User.email == token_sub).first()
    
    if not user:
        logger.warning(f"⚠️ Usuario ID {token_sub} no encontrado en DB.")
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
        
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        # Auto-activación de emergencia (opcional, útil si tienes problemas de activación)
        # current_user.is_active = True
        # return current_user
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user