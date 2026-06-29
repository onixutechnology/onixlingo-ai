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
    phone: Optional[str] = None
    country_code: Optional[str] = None
    password: Optional[str] = None 

class MembershipSchema(BaseModel):
    tier: str
    valid_until: Optional[datetime]
    status: str

class StatsSchema(BaseModel):
    joined_at: datetime
    total_xp: int
    streak_days: int
    eloquence_points: int

class UserProfileResponse(BaseModel):
    id: str
    username: str
    role: str
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    country_code: str
    avatar_url: Optional[str] = None
    membership: MembershipSchema
    referral_code: str
    stats: StatsSchema
    chess_elo: int
    chess_tactical_elo: int

class TicketCreate(BaseModel):
    subject: str
    message: str
    priority: str = "normal"

# --- ENDPOINTS ---
@router.get("/me", response_model=UserProfileResponse)
def read_user_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    total_xp = 0
    if current_user.progress:
        for lesson in current_user.progress:
            total_xp += lesson.score

    # Asegurar que tiene un código de referido
    if not current_user.referral_code:
        current_user.referral_code = f"ONX-{datetime.now().year}-USR{current_user.id}"
        db.add(current_user)
        db.commit()

    return {
        "id": str(current_user.id),
        "username": current_user.username,
        "role": current_user.role or "user",
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "country_code": current_user.country_code or "MX",
        "avatar_url": None,
        "membership": {
            "tier": current_user.tier or "free",
            "valid_until": current_user.valid_until,
            "status": "active" if current_user.is_active else "expired"
        },
        "referral_code": current_user.referral_code,
        "stats": {
            "joined_at": current_user.created_at,
            "total_xp": total_xp,
            "streak_days": current_user.streak_days or 0,
            "eloquence_points": current_user.eloquence_points or 0
        },
        "chess_elo": current_user.chess_elo if current_user.chess_elo is not None else 1200,
        "chess_tactical_elo": current_user.chess_tactical_elo if current_user.chess_tactical_elo is not None else 800
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
        current_user.full_name = user_in.full_name

    if user_in.phone is not None:
        current_user.phone = user_in.phone

    if user_in.country_code is not None:
        current_user.country_code = user_in.country_code.upper()

    if user_in.password is not None and len(user_in.password) >= 6:
        current_user.hashed_password = get_password_hash(user_in.password)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return read_user_me(current_user=current_user, db=db)

@router.post("/support-tickets")
def create_support_ticket(
    payload: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.db.models import SupportTicket
    new_ticket = SupportTicket(
        user_id=current_user.id,
        subject=payload.subject,
        message=payload.message,
        priority=payload.priority,
        status="open"
    )
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return {"status": "success", "ticket_id": new_ticket.id}
