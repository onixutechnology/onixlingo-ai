from typing import List, Optional, Any
from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime

# ==============================================================================
# 1. INPUT: Lo que recibes del Frontend al terminar lección
# ==============================================================================
class ProgressUpdate(BaseModel):
    lesson_id: str
    lesson_type: str  # "standard", "pro", "vocab" (Str simple para evitar errores)
    
    current_step: int
    total_steps: int = 10 # Default seguro
    
    score: int        # 0 a 100
    stars: Optional[int] = 0
    difficulty_completed: Optional[str] = "easy"

# ==============================================================================
# 2. OUTPUT: Lo que envías al Frontend (Lectura inteligente)
# ==============================================================================
class ProgressRead(BaseModel):
    id: int
    user_id: int
    lesson_id: str
    lesson_type: str
    
    status: str       # 'locked', 'active', 'completed'
    stars: int
    score: int
    
    current_step: int
    total_steps: int
    difficulty_completed: Optional[str] = "easy"
    tickets_earned: Optional[int] = 1
    language: Optional[str] = "en"
    updated_at: Optional[datetime] = None

    # --- CAMPOS COMPUTADOS (El frontend los espera, pero la DB no los tiene) ---
    is_unlocked: bool = False
    percentage: int = 0

    class Config:
        from_attributes = True # Clave para leer objetos de SQLAlchemy

    # 🔥 MAGIA: Calculamos estos campos automáticamente antes de enviar la respuesta
    @model_validator(mode='after')
    def compute_frontend_fields(self):
        # 1. Calcular si está desbloqueada
        self.is_unlocked = self.status in ["active", "completed"]
        
        # 2. Calcular porcentaje de avance
        if self.total_steps > 0:
            calc = int((self.current_step / self.total_steps) * 100)
            self.percentage = min(calc, 100) # Tope en 100%
        else:
            self.percentage = 0
            
        # 3. Si está completada, forzamos 100% (visual)
        if self.status == 'completed':
            self.percentage = 100
            
        return self

# ==============================================================================
# 3. MAPA COMPLETO (Dashboard)
# ==============================================================================
class DashboardMap(BaseModel):
    standard: List[ProgressRead] = []
    pro: List[ProgressRead] = []
    vocab: List[ProgressRead] = []
    
    total_xp: int = 0

    class Config:
        from_attributes = True