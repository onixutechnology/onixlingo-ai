from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session
import logging

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
    # --- FALLBACK DE DESARROLLO ---
    if token == "mock-jwt-token":
        user = db.query(models.User).filter(models.User.role == "admin").first()
        if not user:
            user = db.query(models.User).first()
        if user:
            return user

    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_sub = payload.get("sub")
        
        if token_sub is None:
            logger.error("❌ Token inválido: No contiene 'sub'")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales no válidas (sin sub)",
                headers={"WWW-Authenticate": "Bearer"},
            )
            
    except (JWTError, ValidationError) as e:
        logger.error(f"❌ Error al decodificar JWT: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"No se pudieron validar las credenciales: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user = None
    token_str = str(token_sub)
    
    if token_str.isdigit():
        user = db.query(models.User).filter(models.User.id == int(token_str)).first()
    else:
        user = db.query(models.User).filter(models.User.username == token_str).first()
        if not user:
            user = db.query(models.User).filter(models.User.email == token_str).first()
    
    if not user:
        logger.warning(f"⚠️ Usuario '{token_sub}' no encontrado en DB.")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario no encontrado o sesión inválida")
        
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user

# 🔥 EL "CADENERO" VIP (NUEVO)
def get_current_pro_user(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """
    Verifica que el usuario tenga una suscripción activa (Pro o Titanium).
    Si es un usuario Free, bloquea la petición con un Error 403.
    """
    if not current_user.is_pro and current_user.tier not in ['pro', 'titanium']:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Esta acción requiere una suscripción OnixPro activa."
        )
    return current_user

# 🔥 EL "CADENERO" EXECUTIVE (NUEVO)
def get_current_executive_user(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """
    Verifica que el usuario tenga una suscripción Executive activa.
    Si no la tiene (Free o Pro), bloquea la petición con un Error 403.
    """
    is_admin = getattr(current_user, "role", "student") == "admin"
    if not is_admin and (current_user.tier != "executive" and current_user.tier != "titanium"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La conversación libre con IA (Speech Tutor) requiere la suscripción EXECUTIVE activa."
        )
    return current_user

# 🔥 EL "CADENERO" PARA ADMINISTRADORES
def get_current_admin_user(
    current_user: models.User = Depends(get_current_active_user),
) -> models.User:
    """
    Verifica que el usuario tenga el rol de 'admin'.
    Si no lo es, bloquea la petición con un Error 403.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso denegado. Se requieren privilegios de Administrador."
        )
    return current_user