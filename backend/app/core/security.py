from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt 
from passlib.context import CryptContext 
# 👇 IMPORTAMOS LA CONFIGURACIÓN CENTRALIZADA
from app.core.settings import settings 

# Configuración de Hashing (Passwords)
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña plana coincide con el hash de la DB."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera un hash seguro para guardar en la DB."""
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea el JWT (JSON Web Token) usando la clave de settings.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        # 👇 Usamos settings aquí
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"sub": str(subject), "exp": expire}
    
    # 👇 Usamos settings.SECRET_KEY y settings.ALGORITHM
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt