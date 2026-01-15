from pydantic import BaseModel
from typing import Optional
from enum import Enum

# Esto asegura que el frontend solo envíe tipos válidos
class LessonType(str, Enum):
    STANDARD = "standard"  # a1-1, a1-2...
    PRO = "pro"            # pro-b1-1...
    VOCAB = "vocab"        # basics_mod_01...

# --- INPUT: Lo que recibes del Frontend al terminar lección ---
class ProgressUpdate(BaseModel):
    # username: str  <-- ELIMINADO: Lo tomaremos del token (current_user)
    lesson_id: str
    lesson_type: LessonType  # IMPORTANTE: Para saber en qué carpeta buscar la siguiente
    
    current_step: int
    total_steps: int
    
    score: int            # 0 a 100 (El backend calculará las estrellas basado en esto)
    stars: Optional[int] = 0 # Opcional, por si el frontend ya lo calculó visualmente

# --- OUTPUT: Lo que envías al Frontend para pintar el mapa ---
class ProgressRead(BaseModel):
    lesson_id: str
    lesson_type: LessonType
    
    status: str           # 'locked', 'active', 'completed'
    is_unlocked: bool     # Booleano rápido para que el Frontend sepa si poner candado o no
    
    stars: int            # 0, 1, 2, 3
    score: int            # Mejor puntaje histórico
    
    current_step: int
    total_steps: int
    percentage: int       # (current / total) * 100

    class Config:
        from_attributes = True # Necesario para leer desde SQLAlchemy

# --- EXTRA: Para enviar el mapa completo (Dashboard) ---
class DashboardMap(BaseModel):
    # Listas de progreso para pintar cada sección
    standard: list[ProgressRead]
    pro: list[ProgressRead]
    vocab: list[ProgressRead]
    
    total_xp: int         # Puntos totales del usuario para el gamification