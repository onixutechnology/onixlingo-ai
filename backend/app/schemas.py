# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional, List, Dict

# --- ESQUEMAS DE USUARIO ---
class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- ESQUEMAS DE PROGRESO (DASHBOARD PRO) ---

# Lo que recibimos del Frontend al guardar avance
class ProgressUpdate(BaseModel):
    username: str
    lesson_id: str
    current_step: int
    total_steps: int
    stars: Optional[int] = 0

# Lo que enviamos al Frontend para pintar la barra
class ProgressRead(BaseModel):
    lesson_id: str
    status: str
    current_step: int
    total_steps: int
    percentage: int

# Información básica de la lección
class LessonMeta(BaseModel):
    id: str
    title: str
    total_steps: int