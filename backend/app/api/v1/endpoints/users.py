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

from pydantic import BaseModel, EmailStr, Field

class TicketCreate(BaseModel):
    subject: str = Field(..., max_length=150)
    message: str = Field(..., max_length=1000)
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
    
    # Send email notification via Resend
    if current_user.email:
        try:
            import os, resend
            resend_key = os.getenv("RESEND_API_KEY")
            if resend_key:
                resend.api_key = resend_key
                frontend_url = os.getenv("FRONTEND_URL", "https://onixlingo.onixu.company").rstrip('/')
                
                resend.Emails.send({
                    "from": "OnixLingo Soporte <soporte@onixu.company>",
                    "to": current_user.email,
                    "subject": f"Hemos recibido tu ticket: {payload.subject}",
                    "html": f"""
                    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0F1623;color:#f1f5f9;padding:40px;border-radius:10px;border:1px solid #1e293b;">
                        <h1 style="color:#6366f1;font-size:24px;margin-top:0;">Hemos recibido tu solicitud</h1>
                        <p style="font-size:16px;line-height:1.6;">Hola <strong>{current_user.username}</strong>,</p>
                        <p style="font-size:16px;line-height:1.6;">
                            Confirmamos la recepción de tu ticket <strong>#{new_ticket.id}</strong> ("{payload.subject}").
                        </p>
                        <p style="font-size:16px;line-height:1.6;">Nuestro equipo de soporte está revisando tu caso y nos pondremos en contacto contigo lo antes posible a través de este mismo correo.</p>
                        
                        <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;">
                            <p style="margin:0;font-size:13px;color:#94a3b8;">Tu mensaje:</p>
                            <p style="margin:8px 0 0 0;font-size:14px;color:#e2e8f0;font-style:italic;">"{payload.message}"</p>
                        </div>
                        
                        <div style="text-align:center;margin-top:30px;">
                            <a href="{frontend_url}/dashboard" 
                               style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;">
                                Ir a mi Dashboard
                            </a>
                        </div>
                    </div>
                    """
                })
        except Exception as e:
            import logging
            logging.getLogger("OnixLingo.Users").warning(f"Error sending ticket confirmation email: {e}")

    return {"status": "success", "ticket_id": new_ticket.id}

@router.get("/me/gamification")
def get_user_gamification(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.gamification_service import GamificationService
    total_xp = 0
    if current_user.progress:
        for lesson in current_user.progress:
            total_xp += lesson.score
            
    return GamificationService.get_gamification_stats(total_xp)
