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
from google.oauth2 import id_token
from google.auth.transport import requests

from app.database import get_db
from app.db.models import User, BetaCode
from app.config import settings 
from app.core.security import verify_password, get_password_hash, create_access_token

# Importamos nuestro nuevo servicio de correos
from app.services.email_service import send_password_reset_email, send_welcome_email

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
    email: EmailStr # Correo institucional obligatorio
    password: str
    invited_by_code: Optional[str] = None # Código de acceso único opcional

class UserLogin(BaseModel):
    username: str # El frontend manda "username", pero ahora puede contener un correo
    password: str

class GoogleAuthRequest(BaseModel):
    token: str

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
    # 1. Verificar si el código de acceso único existe y está disponible (si fue provisto)
    beta_code_record = None
    clean_code = user.invited_by_code.strip() if user.invited_by_code else None
    
    if clean_code:
        beta_code_record = db.query(BetaCode).filter(BetaCode.code == clean_code).first()
        if not beta_code_record:
            raise HTTPException(
                status_code=400,
                detail="El código de acceso ingresado no es válido."
            )
        
        if beta_code_record.is_used:
            raise HTTPException(
                status_code=400,
                detail="El código de acceso ingresado ya ha sido utilizado."
            )

    # 2. Verificar si existe el usuario o el correo
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

    # 3. Hashear password y generar código de referido propio
    hashed_password = get_password_hash(user.password)
    new_referral_code = generate_referral_code(user.username)
    
    # 4. Preparar el nuevo usuario con acceso Executive por 1 año
    now = datetime.utcnow()
    tier_value = "free"
    is_pro_value = False
    valid_until_value = None
    
    if clean_code:
        tier_value = "executive"
        is_pro_value = True
        valid_until_value = now + timedelta(days=365)

    db_user = User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password,
        referral_code=new_referral_code,
        beta_code=clean_code,
        tier=tier_value,
        is_pro=is_pro_value,
        valid_until=valid_until_value
    )

    # 5. Guardar en base de datos y marcar el código como usado
    try:
        db.add(db_user)
        # Marcar el código de acceso como utilizado si fue provisto
        if beta_code_record:
            beta_code_record.is_used = True
            beta_code_record.used_by_email = user.email
            beta_code_record.used_at = now
        
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"🎉 Registro exitoso: Usuario '{db_user.username}' registrado{' con código de acceso ' + clean_code if clean_code else ' sin código de acceso'}.")
        
        # Enviar correo de bienvenida (no bloquea el registro si falla)
        send_welcome_email(to_email=db_user.email, username=db_user.username)
        
        return {
            "message": "Cuenta creada exitosamente", 
            "user_id": db_user.id,
            "referral_code": db_user.referral_code
        }
    except Exception as e:
        db.rollback()
        logger.error(f"DB Error durante registro: {e}")
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

@router.post("/google")
def authenticate_google(payload: GoogleAuthRequest, response: Response, db: Session = Depends(get_db)):
    google_client_id = os.getenv("GOOGLE_CLIENT_ID")
    if not google_client_id:
        logger.error("❌ GOOGLE_CLIENT_ID no configurado en las variables de entorno.")
        raise HTTPException(
            status_code=500,
            detail="Error de configuración en el servidor de autenticación."
        )

    try:
        id_info = id_token.verify_oauth2_token(
            payload.token,
            requests.Request(),
            google_client_id
        )
        if id_info["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            raise ValueError("Issuer inválido.")
    except Exception as e:
        logger.warning(f"⚠️ Error al verificar token de Google: {e}")
        raise HTTPException(
            status_code=401,
            detail="Token de Google inválido o expirado."
        )

    email = id_info.get("email")
    name = id_info.get("name")
    
    if not email:
        raise HTTPException(
            status_code=400,
            detail="El token de Google no contiene un correo electrónico válido."
        )

    db_user = db.query(User).filter(User.email == email).first()
    now = datetime.utcnow()

    if not db_user:
        base_username = email.split("@")[0].lower()
        username_suggested = base_username
        col_index = 1
        while db.query(User).filter(User.username == username_suggested).first():
            username_suggested = f"{base_username}{col_index}"
            col_index += 1

        google_beta_code = f"GOOGLE-OAUTH-{username_suggested.upper()}"
        beta_code_record = db.query(BetaCode).filter(BetaCode.code == google_beta_code).first()
        if not beta_code_record:
            beta_code_record = BetaCode(
                code=google_beta_code,
                is_used=True,
                used_by_email=email,
                used_at=now
            )
            db.add(beta_code_record)
        else:
            beta_code_record.is_used = True
            beta_code_record.used_by_email = email
            beta_code_record.used_at = now

        db_user = User(
            username=username_suggested,
            email=email,
            hashed_password="OAUTH_LOGIN_GOOGLE_ACCOUNT",
            full_name=name,
            referral_code=generate_referral_code(username_suggested),
            beta_code=google_beta_code,
            tier="free",
            is_pro=False,
            valid_until=None
        )
        db.add(db_user)
        try:
            db.commit()
            db.refresh(db_user)
            logger.info(f"🎉 Registro de Google automático exitoso: Usuario '{db_user.username}'.")
            
            # Enviar correo de bienvenida
            send_welcome_email(to_email=db_user.email, username=db_user.username)
        except Exception as db_err:
            db.rollback()
            logger.error(f"Error al registrar usuario de Google en DB: {db_err}")
            raise HTTPException(
                status_code=500,
                detail="Error interno al crear cuenta de usuario."
            )
    else:
        if not db_user.beta_code:
            google_beta_code = f"GOOGLE-OAUTH-{db_user.username.upper()}"
            beta_code_record = db.query(BetaCode).filter(BetaCode.code == google_beta_code).first()
            if not beta_code_record:
                beta_code_record = BetaCode(
                    code=google_beta_code,
                    is_used=True,
                    used_by_email=email,
                    used_at=now
                )
                db.add(beta_code_record)
            db_user.beta_code = google_beta_code
            db.commit()

    access_token = create_access_token(subject=db_user.username)

    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        httponly=False,
        secure=True,
        samesite="lax",
        path="/",
        max_age=60 * 60 * 24
    )

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