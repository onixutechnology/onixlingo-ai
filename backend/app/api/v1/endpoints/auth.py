import os
import logging
from typing import Optional
from datetime import timedelta
import jwt

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_  # 🚀 IMPORTANTE: Para permitir búsqueda múltiple
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.db.models import User 
from app.core.settings import settings
from app.core.security import verify_password, get_password_hash, create_access_token

# Importamos nuestro nuevo servicio de correos
from app.services.email_service import send_password_reset_email

router = APIRouter()
logger = logging.getLogger("OnixLingo.Auth")

COOKIE_NAME = "access_token"

# ==============================================================================
# --- DTOs (Modelos de Datos) ---
# ==============================================================================

class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None 
    password: str

class UserLogin(BaseModel):
    username: str # El frontend manda "username", pero ahora puede contener un correo
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ==============================================================================
# --- ENDPOINTS CORE (Registro, Login, Logout) ---
# ==============================================================================

@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # 1. Verificar si existe
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="El usuario ya existe.")
    
    # 2. Hashear password
    hashed_password = get_password_hash(user.password)
    
    # 3. Guardar usuario
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"message": "Cuenta creada exitosamente", "user_id": db_user.id}
    except Exception as e:
        db.rollback()
        logger.error(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")


@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    # 1. Buscar usuario 🚀 (AHORA ACEPTA USERNAME O EMAIL)
    db_user = db.query(User).filter(
        or_(
            User.username == user.username,
            User.email == user.username
        )
    ).first()
    
    # 2. Verificar password
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # 3. Generar Token JWT
    access_token = create_access_token(subject=db_user.username)

    # 4. 🍪 GUARDAR COOKIE
    response.set_cookie(
        key=COOKIE_NAME,
        value=f"Bearer {access_token}",
        httponly=True, 
        secure=True, 
        samesite="none", 
        path="/", 
        max_age=60 * 60 * 24 # 24 horas
    )

    # 5. Preparar respuesta
    progress_map = {}
    if db_user.progress:
        progress_map = {p.lesson_id: {"stars": p.stars} for p in db_user.progress}
        
    return {
        "message": "Autenticado", 
        "username": db_user.username,
        "access_token": access_token,
        "progress": progress_map
    }


@router.post("/logout")
def logout(response: Response):
    """Elimina la cookie de sesión."""
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=True, 
        samesite="none", 
        path="/" 
    )
    return {"message": "Sesión cerrada correctamente"}


# ==============================================================================
# --- ENDPOINTS RECUPERACIÓN DE CONTRASEÑA (RESEND) ---
# ==============================================================================

@router.post("/forgot-password", status_code=200)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Genera un token de un solo uso y envía el correo mediante Resend"""
    # 1. Buscar si el usuario existe por correo
    user = db.query(User).filter(User.email == request.email).first()
    
    # 🛡️ SEGURIDAD: Respondemos lo mismo exista o no el correo para evitar escaneo de emails
    if not user:
        return {"message": "Si el correo está registrado, recibirás un enlace de recuperación."}
    
    # 2. Generar un JWT temporal (Expira en 15 minutos)
    reset_token = create_access_token(
        subject=str(user.id), 
        expires_delta=timedelta(minutes=15)
    )
    
    # 3. Enviar el correo
    send_password_reset_email(to_email=user.email, token=reset_token)
    return {"message": "Si el correo está registrado, recibirás un enlace de recuperación."}


@router.post("/reset-password", status_code=200)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Valida el token mágico y cambia la contraseña en la DB"""
    try:
        # 1. Decodificar el token
        payload = jwt.decode(
            request.token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=400, detail="Token inválido")
            
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=400, detail="El enlace ha expirado. Solicita uno nuevo.")
    except jwt.PyJWTError:
        raise HTTPException(status_code=400, detail="Token inválido o corrupto")

    # 2. Buscar al usuario
    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # 3. Hashear la nueva contraseña y guardar
    user.hashed_password = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Contraseña actualizada con éxito."}
