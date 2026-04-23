from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta

from app.database import get_db
from app.db.models import User
from app.core.security import get_current_user, get_password_hash

router = APIRouter()

# --- SCHEMAS ---
class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None  # 🔥 Agregado para actualizar contraseña

class MembershipSchema(BaseModel):
    tier: str
    valid_until: datetime
    status: str

class StatsSchema(BaseModel):
    joined_at: datetime
    total_xp: int

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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_xp = 0
    if current_user.progress:
        for lesson in current_user.progress:
            total_xp += (lesson.stars * 150)

    tier_name = "titanium" if getattr(current_user, 'is_pro', False) else "free"
    # Fallback si el modelo no tiene valid_until
    valid_until = getattr(current_user, 'valid_until', current_user.created_at + timedelta(days=365))
    ref_code = getattr(current_user, 'referral_code', f"ONX-{datetime.now().year}-USR{current_user.id}")

    return {
        "id": str(current_user.id),
        "full_name": getattr(current_user, 'username', current_user.email.split('@')[0]),
        "email": current_user.email,
        "avatar_url": None,
        "membership": {
            "tier": tier_name,
            "valid_until": valid_until,
            "status": "active" if getattr(current_user, 'is_active', True) else "expired"
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
    if user_in.email is not None and user_in.email != current_user.email:
        existing_email = db.query(User).filter(User.email == user_in.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Este correo ya está en uso.")
        current_user.email = user_in.email

    if user_in.full_name is not None:
        current_user.username = user_in.full_name

    if user_in.password is not None and len(user_in.password) >= 6:
        current_user.hashed_password = get_password_hash(user_in.password)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return read_user_me(current_user=current_user, db=db)
