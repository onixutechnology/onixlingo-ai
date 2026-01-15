# backend/app/schemas.py
from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Dict
from enum import Enum

# --- ENUMS (Vital para tus 3 bloques) ---
class LessonType(str, Enum):
    STANDARD = "standard"  # Dashboard Normal
    PRO = "pro"            # Dashboard Pro
    VOCAB = "vocab"        # Vocabulary

# --- ESQUEMAS DE USUARIO ---
class UserCreate(BaseModel):
    username: str
    email: Optional[str] = None
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# --- ESQUEMAS DE PROGRESO ---

# 1. INPUT: Lo que recibes del Frontend al terminar lección
class ProgressUpdate(BaseModel):
    # username: str  <-- ELIMINADO POR SEGURIDAD (Usaremos current_user)
    lesson_id: str
    lesson_type: LessonType # ¡Necesario para saber qué desbloquear después!
    
    current_step: int
    total_steps: int
    score: int              # 0-100 (El backend calculará las estrellas con esto)
    stars: Optional[int] = 0 

# 2. OUTPUT: Lo que envías al Frontend para pintar el mapa
class ProgressRead(BaseModel):
    lesson_id: str
    lesson_type: LessonType
    
    status: str           # 'locked', 'active', 'completed'
    is_unlocked: bool     # Booleano rápido para la UI (candado abierto/cerrado)
    
    stars: int            # 0 a 3
    score: int            # 0 a 100
    
    current_step: int
    total_steps: int
    percentage: int       # 0 a 100

    # Configuración para leer desde SQLAlchemy
    model_config = ConfigDict(from_attributes=True) 

# 3. DASHBOARD MAP: Para enviar TODO el mapa de una sola vez
class DashboardMap(BaseModel):
    standard: List[ProgressRead]
    pro: List[ProgressRead]
    vocab: List[ProgressRead]
    total_xp: int

# Información básica de la lección (Metadatos)
class LessonMeta(BaseModel):
    id: str
    title: str
    total_steps: int