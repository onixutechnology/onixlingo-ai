from datetime import datetime, timedelta
from typing import Optional, Union, Any

# Nuevas importaciones necesarias para validar el usuario
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from passlib.context import CryptContext 
from sqlalchemy.orm import Session

# Importaciones de tu app
from app.core.settings import settings 
from app.database import get_db
from app.db.models import User

# Configuración de Hashing (Passwords)
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# Configuración de OAuth2 (Apunta a tu ruta de login para la documentación de FastAPI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

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
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"sub": str(subject), "exp": expire}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """
    Extrae el token de la petición, lo descifra y devuelve el objeto User completo de la base de datos.
    Esta es la función que te faltaba.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # Decodificamos el token usando tu SECRET_KEY
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    # Buscamos al usuario en la base de datos usando el ID extraído del token
    user = db.query(User).filter(User.id == user_id).first()
    
    if user is None:
        raise credentials_exception
        
    return user
