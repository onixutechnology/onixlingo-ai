from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import jwt # Requiere: pip install python-jose[cryptography]
from passlib.context import CryptContext # Requiere: pip install passlib[bcrypt]
import os
from dotenv import load_dotenv

load_dotenv()

# 🔐 CONFIGURACIÓN
# Intenta leer de .env, si no hay, usa una clave por defecto (SOLO PARA DEV)
SECRET_KEY = os.getenv("SECRET_KEY", "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 Horas de sesión

# Configuración de Hashing (Passwords)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña plana coincide con el hash de la DB."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera un hash seguro para guardar en la DB."""
    return pwd_context.hash(password)

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea el JWT (JSON Web Token) que enviaremos en la cookie.
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    # El token contiene el 'sub' (subject/usuario) y 'exp' (expiración)
    to_encode = {"sub": str(subject), "exp": expire}
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt