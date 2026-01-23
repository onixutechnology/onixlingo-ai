from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta

from app.database import get_db
from app.db.models import User
from app.core.security import get_current_user # Asumo que tienes esto, si no, te lo doy abajo.

router = APIRouter()

# --- SCHEMAS (Lo que entra y sale de la API) ---

# Esquema para actualizar datos
class UserUpdate(BaseModel):
    full_name: Optional[str] = None # En realidad actualizaremos username por ahora
    email: Optional[EmailStr] = None

# Esquema de Membresía
class MembershipSchema(BaseModel):
    tier: str
    valid_until: datetime
    status: str

# Esquema de Estadísticas
class StatsSchema(BaseModel):
    joined_at: datetime
    total_xp: int

# Esquema del Perfil Completo (Lo que espera tu Frontend)
class UserProfileResponse(BaseModel):
    id: str
    full_name: str
    email: Optional[str]
    avatar_url: Optional[str] = None
    membership: MembershipSchema
    referral_code: str
    stats: StatsSchema

# --- ENDPOINTS ---

@router.get("/me", response_model=UserProfileResponse)
def read_user_me(
    current_user: User = Depends(get_current_user), # Obtiene el usuario del Token
    db: Session = Depends(get_db)
):
    """
    Obtiene el perfil completo del usuario actual calculando XP y Datos.
    """
    
    # 1. Calcular XP Total desde la tabla Progress
    # Sumamos todas las estrellas * 100 (o la lógica que prefieras)
    total_xp = 0
    if current_user.progress:
        for lesson in current_user.progress:
            total_xp += (lesson.stars * 150) # Ejemplo: 150 XP por estrella

    # 2. Determinar Tier
    tier_name = "titanium" if current_user.is_pro else "free"
    
    # Fecha de expiración simulada (1 año desde el registro)
    # En un futuro, esto vendría de una tabla de suscripciones
    valid_until = current_user.created_at + timedelta(days=365)

    # 3. Generar Código de Referido (Basado en ID para ser consistente)
    # Ejemplo: ONIX-2026-USR1
    ref_code = f"ONIX-{datetime.now().year}-USR{current_user.id}"

    # 4. Construir Respuesta
    return {
        "id": str(current_user.id),
        "full_name": current_user.username, # Mapeamos username a full_name
        "email": current_user.email,
        "avatar_url": None, # Puedes agregar lógica de avatar luego
        "membership": {
            "tier": tier_name,
            "valid_until": valid_until,
            "status": "active" if current_user.is_active else "expired"
        },
        "referral_code": ref_code,
        "stats": {
            "joined_at": current_user.created_at,
            "total_xp": total_xp
        }
    }

@router.put("/me", response_model=UserProfileResponse)
def update_user_me(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Actualiza el perfil del usuario (Email y Nombre/Username).
    """
    
    # Actualizar Email
    if user_in.email is not None:
        # Verificar que no exista otro usuario con ese email
        existing_email = db.query(User).filter(User.email == user_in.email).first()
        if existing_email and existing_email.id != current_user.id:
            raise HTTPException(status_code=400, detail="Este correo ya está en uso.")
        current_user.email = user_in.email

    # Actualizar Nombre (Username)
    # OJO: Cambiar el username podría afectar el login si usan username para entrar.
    # Por ahora lo permitimos para que la UI funcione.
    if user_in.full_name is not None:
        current_user.username = user_in.full_name

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    # Retornar los datos actualizados (reusamos la lógica de lectura llamando a la función interna o reconstruyendo)
    # Para rápido, copiamos la lógica de respuesta:
    return read_user_me(current_user=current_user, db=db)