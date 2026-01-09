from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from app.database import get_db, User
import logging

router = APIRouter()
logger = logging.getLogger("OnixLingo.Auth")
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

# --- DTOs (Modelos) ---
class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- ENDPOINTS ---
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == user.username).first():
        raise HTTPException(status_code=400, detail="El usuario ya existe.")
    
    hashed_password = pwd_context.hash(user.password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    
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
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales inválidas")
    
    # Mapeo de progreso
    progress_map = {p.lesson_id: {"stars": p.stars} for p in db_user.progress}
    return {
        "message": "Autenticado", 
        "username": db_user.username, 
        "progress": progress_map
    }