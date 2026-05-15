import os
import logging
import random
import string
from typing import Optional
from datetime import datetime, timedelta
import jwt

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_ # 🚀 IMPORTANTE: Para permitir búsqueda múltiple
from pydantic import BaseModel, EmailStr

from app.database import get_db
from app.db.models import User 
from app.config import settings 
from app.core.security import verify_password, get_password_hash, create_access_token

# Importamos nuestro nuevo servicio de correos
from app.services.email_service import send_password_reset_email

router = APIRouter()
logger = logging.getLogger("OnixLingo.Auth")

COOKIE_NAME = "access_token"

# ==============================================================================
# --- FUNCIONES AUXILIARES ---
# ==============================================================================

def generate_referral_code(username: str) -> str:
    """Genera un código único tipo ONX-2026-USR-X9F2"""
    year = datetime.utcnow().year
    prefix = username[:3].upper() if len(username) >= 3 else username.upper().ljust(3, 'X')
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ONX-{year}-{prefix}-{random_suffix}"

# ==============================================================================
# --- DTOs (Modelos de Datos) ---
# ==============================================================================

class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None 
    password: str
    invited_by_code: Optional[str] = None # 🔥 NUEVO: Código de quien lo invitó

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
    # 1. Verificar si existe el usuario o el correo
    existing_user = db.query(User).filter(
        or_(
            User.username == user.username,
            User.email == user.email
        )
    ).first()

    if existing_user:
        if existing_user.username == user.username:
            raise HTTPException(status_code=400, detail="El nombre de usuario ya está en uso.")
        if existing_user.email == user.email:
            raise HTTPException(status_code=400, detail="El correo electrónico ya está registrado.")

    # 2. Hashear password y generar código de referido propio
    hashed_password = get_password_hash(user.password)
    new_referral_code = generate_referral_code(user.username)
    
    # 3. Preparar el nuevo usuario
    db_user = User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        referral_code=new_referral_code,
        tier="free",
        is_pro=False
    )

    # 🔥 4. LÓGICA DE RECOMPENSAS (Si fue invitado por alguien)
    if user.invited_by_code:
        referrer = db.query(User).filter(User.referral_code == user.invited_by_code).first()
        if referrer:
            now = datetime.utcnow()
            
            # Premiar al que invitó (+30 días)
            ref_valid = referrer.valid_until if referrer.valid_until and referrer.valid_until > now else now
            referrer.valid_until = ref_valid + timedelta(days=30)
            
            # Premiar al nuevo usuario (Entra como Titanium 30 días)
            db_user.valid_until = now + timedelta(days=30)
            db_user.tier = "titanium"
            db_user.is_pro = True
            logger.info(f"🎁 Referido aplicado: {referrer.username} y {db_user.username} ganan 30 días.")

    # 5. Guardar en base de datos
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {
            "message": "Cuenta creada exitosamente", 
            "user_id": db_user.id,
            "referral_code": db_user.referral_code
        }
    except Exception as e:
        db.rollback()
        logger.error(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Error interno del servidor")

@router.post("/login")
def login(user: UserLogin, response: Response, db: Session = Depends(get_db)):
    # 1. Buscar usuario (AHORA ACEPTA USERNAME O EMAIL)
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

    # 4. GUARDAR COOKIE (Optimizado para subdominios)
    # Importante: No usamos httponly=True para que el apiClient pueda leerlo y enviarlo en el header
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=False, 
        secure=True, 
        samesite="lax", 
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
        httponly=False,
        secure=True, 
        samesite="lax", 
        path="/" 
    )
    return {"message": "Sesión cerrada correctamente"}

# ==============================================================================
# --- ENDPOINTS RECUPERACIÓN DE CONTRASEÑA (RESEND) ---
# ==============================================================================

@router.post("/forgot-password", status_code=200)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Genera un token de un solo uso y envía el correo mediante Resend"""
    user = db.query(User).filter(User.email == request.email).first()
    
    if not user:
        return {"message": "Si el correo está registrado, recibirás un enlace de recuperación."}
    
    reset_token = create_access_token(
        subject=str(user.id), 
        expires_delta=timedelta(minutes=15)
    )
    
    send_password_reset_email(to_email=user.email, token=reset_token)
    return {"message": "Si el correo está registrado, recibirás un enlace de recuperación."}

@router.post("/reset-password", status_code=200)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Valida el token mágico y cambia la contraseña en la DB"""
    try:
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

    try:
        uid = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Identificador de usuario inválido en el token.")

    user = db.query(User).filter(User.id == uid).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.hashed_password = get_password_hash(request.new_password)
    db.commit()

    return {"message": "Contraseña actualizada con éxito."}