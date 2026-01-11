import os
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db, User

# Importamos la lógica de seguridad
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter()
logger = logging.getLogger("OnixLingo.Auth")

# --- ⚙️ CONFIGURACIÓN INTELIGENTE ---
# Detectamos si estamos en producción (Render/Vercel) o en Localhost.
# En Localhost NO podemos usar secure=True porque corre en HTTP.
IS_PRODUCTION = os.getenv("RENDER") is not None or os.getenv("VERCEL") is not None
COOKIE_NAME = "access_token"

logger.info(f"Modo de Seguridad Cookies: {'🔐 PRODUCCIÓN (Secure)' if IS_PRODUCTION else '🚧 DESARROLLO (No Secure)'}")

# --- DTOs (Modelos de Datos) ---
class UserCreate(BaseModel):
    username: str
    email: Optional[EmailStr] = None # Validación de formato email
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- ENDPOINTS ---

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
    # 1. Buscar usuario
    db_user = db.query(User).filter(User.username == user.username).first()
    
    # 2. Verificar password
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # 3. Generar Token JWT
    access_token = create_access_token(subject=db_user.username)

    # 4. 🍪 GUARDAR COOKIE (Configuración Dinámica)
    response.set_cookie(
        key=COOKIE_NAME,
        value=f"Bearer {access_token}",
        httponly=True,   
        # 👇 AQUÍ ESTÁ LA MAGIA: False en localhost, True en Prod
        secure=IS_PRODUCTION, 
        samesite="lax",
        path="/",        # 👈 IMPORTANTE: Para que esté disponible en toda la app
        max_age=60 * 60 * 24 # 24 horas
    )

    # 5. Preparar respuesta
    progress_map = {p.lesson_id: {"stars": p.stars} for p in db_user.progress}
    
    return {
        "message": "Autenticado", 
        "username": db_user.username,
        # "role": db_user.role, # 💡 SUGERENCIA: Si tienes un campo de rol/premium, agrégalo aquí
        "progress": progress_map
    }

@router.post("/logout")
def logout(response: Response):
    """
    Elimina la cookie de sesión.
    Los parámetros deben ser IDÉNTICOS a los de creación para que funcione.
    """
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        # 👇 Debe coincidir con el login
        secure=IS_PRODUCTION, 
        samesite="lax",
        path="/" # 👈 Debe coincidir con el login
    )
    return {"message": "Sesión cerrada correctamente"}