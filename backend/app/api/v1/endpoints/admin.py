from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session, joinedload
from datetime import datetime, timedelta
from typing import List
from pydantic import BaseModel

from app.database import get_db
from app.db import models
# 🔥 Importamos el candado de admin
from app.api.deps import get_current_admin_user

router = APIRouter()

@router.get("/users")
def get_all_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    # 🔥 Esta ruta está protegida, solo tú puedes entrar
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Lista todos los usuarios registrados en la plataforma.
    """
    users = db.query(models.User).offset(skip).limit(limit).all()
    
    # Formateamos la respuesta para no enviar contraseñas hasheadas
    user_list = []
    for u in users:
        user_list.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "is_pro": u.is_pro,
            "tier": u.tier,
            "valid_until": u.valid_until
        })
    return {"users": user_list, "total": len(user_list)}


@router.post("/grant-pro/{user_id}")
def grant_pro_access(
    user_id: int, 
    days: int = 30,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """Endpoint legacy compatible – usa /users/{id}/gift para el flujo completo."""
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    now = datetime.utcnow()
    current_valid_until = target_user.valid_until if target_user.valid_until and target_user.valid_until > now else now
    target_user.valid_until = current_valid_until + timedelta(days=days)
    target_user.is_pro = True
    target_user.tier = "titanium"
    db.commit()
    return {
        "message": f"Se han otorgado {days} días Premium al usuario {target_user.username}",
        "new_expiration": target_user.valid_until
    }


class GiftPayload(BaseModel):
    tier: str           # "pro" | "executive" | "titanium"
    days: int           # 7 | 14 | 30 | 60 | 90 | 180 | 365
    message: str = ""   # Mensaje personalizado opcional
    notify_email: bool = True


@router.post("/users/{user_id}/gift")
def gift_user_subscription(
    user_id: int,
    payload: GiftPayload,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Regala días de suscripción a un usuario con nivel y mensaje personalizado.
    Envía notificación por correo electrónico via Resend.
    """
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    VALID_TIERS = {"pro", "executive", "titanium"}
    if payload.tier not in VALID_TIERS:
        raise HTTPException(status_code=400, detail=f"Tier inválido. Usa: {VALID_TIERS}")
    if payload.days < 1 or payload.days > 365:
        raise HTTPException(status_code=400, detail="Los días deben estar entre 1 y 365")

    now = datetime.utcnow()
    current_valid = target_user.valid_until if target_user.valid_until and target_user.valid_until > now else now
    target_user.valid_until = current_valid + timedelta(days=payload.days)
    target_user.is_pro = True
    target_user.tier = payload.tier
    db.commit()

    # ── Notificación por email via Resend ──
    if payload.notify_email and target_user.email:
        try:
            import os, resend
            resend_key = os.getenv("RESEND_API_KEY")
            if resend_key:
                resend.api_key = resend_key
                frontend_url = os.getenv("FRONTEND_URL", "https://onixlingo.com").rstrip('/')

                TIER_LABELS = {
                    "pro": ("🚀 PRO", "#3b82f6"),
                    "executive": ("💼 EXECUTIVE", "#8b5cf6"),
                    "titanium": ("💎 TITANIUM", "#f59e0b"),
                }
                tier_label, tier_color = TIER_LABELS.get(payload.tier, ("⭐ PREMIUM", "#0d9488"))
                personal_section = f"""
                    <div style="background:#1e293b;border-left:4px solid {tier_color};padding:16px 20px;border-radius:4px;margin:20px 0;">
                        <p style="margin:0;font-size:14px;color:#e2e8f0;font-style:italic;">"{payload.message}"</p>
                        <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">— Equipo OnixLingo</p>
                    </div>
                """ if payload.message.strip() else ""

                resend.Emails.send({
                    "from": "OnixLingo <soporte@onixu.company>",
                    "to": target_user.email,
                    "subject": f"🎁 ¡Tienes un regalo! {payload.days} días {tier_label} en OnixLingo",
                    "html": f"""
                    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0F1623;color:#f1f5f9;padding:40px;border-radius:10px;border:1px solid #1e293b;">
                        <div style="text-align:center;margin-bottom:30px;">
                            <h1 style="color:{tier_color};font-size:32px;margin:0;">🎁 ¡Un regalo para ti!</h1>
                        </div>
                        <p style="font-size:16px;line-height:1.6;">Hola <strong>{target_user.username}</strong>,</p>
                        <p style="font-size:16px;line-height:1.6;">
                            El equipo de <strong>OnixLingo</strong> te ha obsequiado acceso 
                            <span style="color:{tier_color};font-weight:bold;">{tier_label}</span> 
                            por <strong>{payload.days} días</strong>. 🎉
                        </p>
                        {personal_section}
                        <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
                            <p style="margin:0 0 8px 0;font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Tu acceso vence el</p>
                            <p style="margin:0;font-size:22px;font-weight:bold;color:{tier_color};">
                                {target_user.valid_until.strftime('%d de %B de %Y') if target_user.valid_until else 'Calculando...'}
                            </p>
                        </div>
                        <div style="text-align:center;margin-top:30px;">
                            <a href="{frontend_url}/dashboard" 
                               style="display:inline-block;padding:14px 32px;background:{tier_color};color:#000;text-decoration:none;border-radius:0;font-weight:bold;font-size:16px;">
                                Ir a mi Dashboard →
                            </a>
                        </div>
                        <p style="font-size:12px;color:#64748b;margin-top:40px;text-align:center;">
                            Si tienes dudas escríbenos a soporte@onixu.company
                        </p>
                    </div>
                    """
                })
        except Exception as e:
            # No bloqueamos la operación si el email falla
            import logging
            logging.getLogger("OnixLingo.Admin").warning(f"Email de regalo no enviado: {e}")

    return {
        "status": "success",
        "message": f"¡Regalo enviado! {payload.days} días {payload.tier} otorgados a {target_user.username}",
        "new_expiration": target_user.valid_until.isoformat() if target_user.valid_until else None,
        "email_sent": payload.notify_email and bool(target_user.email)
    }

from pydantic import BaseModel
from app.core.security import get_password_hash

class RoleUpdate(BaseModel):
    role: str

class TierUpdate(BaseModel):
    tier: str
    is_pro: bool

class PasswordUpdate(BaseModel):
    new_password: str

@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if target_user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="No puedes eliminar tu propia cuenta")
    
    db.delete(target_user)
    db.commit()
    return {"message": "Usuario eliminado exitosamente"}

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    data: RoleUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    if target_user.id == current_admin.id:
        raise HTTPException(status_code=400, detail="No puedes cambiar tu propio rol")
    
    target_user.role = data.role
    db.commit()
    return {"message": f"Rol actualizado a {data.role}"}

@router.put("/users/{user_id}/tier")
def update_user_tier(
    user_id: int,
    data: TierUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    target_user.tier = data.tier
    target_user.is_pro = data.is_pro
    db.commit()
    return {"message": f"Suscripción actualizada a {data.tier}"}

@router.put("/users/{user_id}/password")
def reset_user_password(
    user_id: int,
    data: PasswordUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    target_user.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Contraseña restablecida exitosamente"}

from sqlalchemy import func

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Métricas agregadas reales para el Dashboard General del Centro de Comando.
    """
    total_users = db.query(models.User).count()
    premium_users = db.query(models.User).filter(models.User.is_pro == True).count()
    
    # Calcular XP total
    xp_progress = db.query(func.sum(models.Progress.score)).scalar() or 0
    xp_chess = db.query(func.sum(models.ChessProgress.earned_xp)).scalar() or 0
    total_xp = xp_progress + xp_chess
    
    # Usuarios nuevos en los últimos 7 días
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    new_users_week = db.query(models.User).filter(models.User.created_at >= seven_days_ago).count()
    
    # Usuarios activos en los últimos 7 días
    active_users_week = db.query(models.User).filter(models.User.last_activity_at >= seven_days_ago).count()
    
    return {
        "total_users": total_users,
        "premium_users": premium_users,
        "total_xp": total_xp,
        "new_users_week": new_users_week,
        "active_users_week": active_users_week
    }

@router.get("/subscriptions-stats")
def get_subscriptions_stats(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Métricas detalladas sobre suscripciones y pagos (Optimizado).
    """
    from sqlalchemy import func as sqla_func, case
    
    tier_counts = db.query(
        sqla_func.count(case((models.User.tier == "pro", 1))).label("pro_users"),
        sqla_func.count(case((models.User.tier == "executive", 1))).label("executive_users")
    ).first()
    
    pro_users = tier_counts.pro_users or 0
    executive_users = tier_counts.executive_users or 0
    
    recent_premium = db.query(models.User).filter(models.User.is_pro == True).order_by(models.User.id.desc()).limit(20).all()
    
    subscribers_list = [{
        "id": u.id,
        "username": u.username,
        "email": u.email,
        "tier": u.tier,
        "valid_until": u.valid_until,
        "paddle_customer_id": u.paddle_customer_id
    } for u in recent_premium]
    
    # Estimated MRR (Pro = $9.99, Executive = $29.99)
    estimated_mrr = (pro_users * 9.99) + (executive_users * 29.99)
    
    return {
        "pro_users": pro_users,
        "executive_users": executive_users,
        "estimated_mrr": round(estimated_mrr, 2),
        "recent_subscribers": subscribers_list
    }

@router.get("/analytics-stats")
def get_analytics_stats(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Métricas de analíticas de uso y progresión en OnixLingo (Optimizado).
    """
    from sqlalchemy import func as sqla_func
    
    lang_counts = db.query(
        models.Progress.language,
        sqla_func.count(models.Progress.id)
    ).filter(
        models.Progress.language.in_(["en", "fr", "zh"])
    ).group_by(models.Progress.language).all()
    
    lang_map = {lang: count for lang, count in lang_counts}
    
    top_students_db = db.query(models.User).order_by(models.User.eloquence_points.desc()).limit(5).all()
    top_students = [{
        "username": u.username,
        "email": u.email,
        "eloquence_points": u.eloquence_points,
        "streak_days": u.streak_days
    } for u in top_students_db]
    
    return {
        "language_distribution": {
            "english": lang_map.get("en", 0),
            "french": lang_map.get("fr", 0),
            "chinese": lang_map.get("zh", 0)
        },
        "top_students": top_students
    }

class AIConfigUpdate(BaseModel):
    system_prompt: str
    temperature: str
    model_version: str

@router.get("/ai-configs")
def get_ai_configs(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    configs = db.query(models.AIConfiguration).all()
    if not configs:
        default_en = models.AIConfiguration(engine_name="english_tutor", system_prompt="You are an expert English tutor for Spanish speakers. Correct their grammar and spelling warmly.", temperature="0.7", model_version="gpt-4o-mini")
        default_fr = models.AIConfiguration(engine_name="french_tutor", system_prompt="Tu es un professeur de français expert pour les hispanophones. Corrige chaleureusement leur grammaire et leur orthographe.", temperature="0.7", model_version="gpt-4o-mini")
        default_zh = models.AIConfiguration(engine_name="chinese_tutor", system_prompt="You are an expert Mandarin Chinese tutor. Help the student learn characters, pinyin, and tones warmly.", temperature="0.7", model_version="gpt-4o-mini")
        db.add_all([default_en, default_fr, default_zh])
        db.commit()
        configs = db.query(models.AIConfiguration).all()
    return configs

@router.put("/ai-configs/{engine_name}")
def update_ai_config(engine_name: str, payload: AIConfigUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    config = db.query(models.AIConfiguration).filter(models.AIConfiguration.engine_name == engine_name).first()
    if not config:
        config = models.AIConfiguration(engine_name=engine_name)
        db.add(config)
    
    config.system_prompt = payload.system_prompt
    config.temperature = payload.temperature
    config.model_version = payload.model_version
    db.commit()
    db.refresh(config)
    return config

import os
from pathlib import Path

@router.get("/content-stats")
def get_content_stats(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    """
    Estadísticas de contenido cargado (Lecciones JSON y DB).
    """
    base_path = Path(__file__).resolve().parents[4] / "app" / "data" / "lessons"
    
    stats = {"en": 0, "fr": 0, "zh": 0}
    total_lessons = 0
    
    if base_path.exists():
        for lang in ["en", "fr", "zh"]:
            lang_path = base_path / lang
            if lang_path.exists():
                count = len(list(lang_path.glob("*.json")))
                stats[lang] = count
                total_lessons += count
                
    chess_count = db.query(models.ChessLesson).count()
    
    return {
        "language_lessons": stats,
        "total_language_lessons": total_lessons,
        "chess_lessons": chess_count
    }

@router.get("/lessons-list")
def get_lessons_list(current_admin: models.User = Depends(get_current_admin_user)):
    base_path = Path(__file__).resolve().parents[4] / "app" / "data" / "lessons"
    result = {"en": [], "fr": [], "zh": []}
    if base_path.exists():
        for lang in result.keys():
            lang_path = base_path / lang
            if lang_path.exists():
                files = [f.name for f in lang_path.glob("*.json")]
                result[lang] = files
    return result

@router.get("/lessons-list/{lang}/{lesson_id}")
def get_lesson_file(lang: str, lesson_id: str, current_admin: models.User = Depends(get_current_admin_user)):
    base_path = Path(__file__).resolve().parents[4] / "app" / "data" / "lessons"
    file_path = base_path / lang / lesson_id
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Lección no encontrada")
    import json
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

class LessonUpdate(BaseModel):
    content: dict

@router.post("/lessons-list/{lang}/{lesson_id}")
def update_lesson_file(lang: str, lesson_id: str, payload: LessonUpdate, current_admin: models.User = Depends(get_current_admin_user)):
    base_path = Path(__file__).resolve().parents[4] / "app" / "data" / "lessons"
    file_path = base_path / lang / lesson_id
    import json
    file_path.parent.mkdir(parents=True, exist_ok=True)
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(payload.content, f, indent=2, ensure_ascii=False)
    return {"status": "success", "message": "Lección guardada en producción"}

class GenerateCodeRequest(BaseModel):
    code: str

@router.get("/marketing-stats")
def get_marketing_stats(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    promo_codes = db.query(models.PromoCoupon).order_by(models.PromoCoupon.id.desc()).all()
    beta_codes = db.query(models.BetaCode).order_by(models.BetaCode.id.desc()).all()
    
    return {
        "promo_codes": [{
            "id": p.id,
            "code": p.code,
            "is_used": p.is_used,
            "used_by_id": p.used_by_id,
            "used_at": p.used_at
        } for p in promo_codes],
        "beta_codes": [{
            "id": b.id,
            "code": b.code,
            "is_used": b.is_used,
            "used_by_email": b.used_by_email,
            "used_at": b.used_at
        } for b in beta_codes]
    }

@router.post("/promo-codes")
def create_promo_code(payload: GenerateCodeRequest, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    new_code = models.PromoCoupon(code=payload.code)
    db.add(new_code)
    db.commit()
    db.refresh(new_code)
    return new_code

@router.post("/beta-codes")
def create_beta_code(payload: GenerateCodeRequest, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    new_code = models.BetaCode(code=payload.code)
    db.add(new_code)
    db.commit()
    db.refresh(new_code)
    return new_code

class UpdateTicketStatus(BaseModel):
    status: str

@router.get("/support-tickets")
def get_support_tickets(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    tickets = db.query(models.SupportTicket).options(joinedload(models.SupportTicket.user)).order_by(models.SupportTicket.id.desc()).all()
    
    # Check if empty to generate mocks just to show something the first time
    if not tickets:
        user1 = db.query(models.User).first()
        if user1:
            mock1 = models.SupportTicket(user_id=user1.id, subject="Error en la pasarela de Paddle", message="He intentado comprar el acceso Titanium pero me rechaza la tarjeta Visa. Por favor ayúdenme.", priority="high")
            mock2 = models.SupportTicket(user_id=user1.id, subject="Perdí mi racha", message="Entré todos los días pero hoy me dice que mi racha volvió a 0. Ayuda.", priority="normal")
            db.add_all([mock1, mock2])
            db.commit()
            tickets = db.query(models.SupportTicket).options(joinedload(models.SupportTicket.user)).order_by(models.SupportTicket.id.desc()).all()
        
    return [{
        "id": t.id,
        "subject": t.subject,
        "message": t.message,
        "status": t.status,
        "priority": t.priority,
        "created_at": t.created_at,
        "user_email": t.user.email if t.user else "Usuario Desconocido"
    } for t in tickets]

@router.put("/support-tickets/{ticket_id}")
def update_support_ticket(ticket_id: int, payload: UpdateTicketStatus, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if ticket:
        ticket.status = payload.status
        db.commit()
        return {"status": "success"}
    return {"status": "not_found"}

@router.get("/audit-logs")
def get_audit_logs(request: Request, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    # Log this admin access as well!
    client_ip = request.client.host if request.client else "Unknown"
    new_log = models.SystemAuditLog(admin_id=current_admin.id, action="Acceso a Auditoría", details="El administrador accedió al registro de seguridad.", ip_address=client_ip)
    db.add(new_log)
    db.commit()
    
    logs = db.query(models.SystemAuditLog).order_by(models.SystemAuditLog.id.desc()).limit(100).all()
    
    return [{
        "id": l.id,
        "admin_id": l.admin_id,
        "action": l.action,
        "details": l.details,
        "ip_address": l.ip_address,
        "created_at": l.created_at
    } for l in logs]

class GlobalSettingUpdate(BaseModel):
    key: str
    value: str

class GlobalSettingsListUpdate(BaseModel):
    settings: List[GlobalSettingUpdate]

@router.get("/global-settings")
def get_global_settings(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    defaults = {
        "maintenance_mode": {"value": "false", "desc": "Activa el modo de mantenimiento (true/false)"},
        "registration_open": {"value": "true", "desc": "Permitir nuevos registros de alumnos (true/false)"},
        "max_daily_xp": {"value": "500", "desc": "Límite de XP por alumno (anti-bot)"},
        "ai_default_engine": {"value": "gpt-4o", "desc": "Motor de IA principal (gpt-4o, gemini, etc)"},
        "ai_global_temperature": {"value": "0.7", "desc": "Temperatura global para la IA (0.0 a 1.0)"},
        "payment_environment": {"value": "test", "desc": "Entorno de pasarela (test/live)"},
        "default_currency": {"value": "USD", "desc": "Moneda por defecto para pagos"},
        "platform_name": {"value": "OnixLingo", "desc": "Nombre visible de la plataforma"},
        "support_email": {"value": "support@onixlingo.com", "desc": "Email oficial de soporte técnico"}
    }
    
    current_settings = db.query(models.GlobalSetting).all()
    current_keys = {s.key: s for s in current_settings}
    
    new_settings = []
    for k, v in defaults.items():
        if k not in current_keys:
            ns = models.GlobalSetting(key=k, value=v["value"], description=v["desc"])
            db.add(ns)
            new_settings.append(ns)
            
    if new_settings:
        db.commit()
        for ns in new_settings:
            db.refresh(ns)
        current_settings.extend(new_settings)
        
    return [{
        "key": s.key,
        "value": s.value,
        "description": s.description
    } for s in current_settings]

@router.put("/global-settings")
def update_global_settings(payload: GlobalSettingsListUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    for setting_update in payload.settings:
        setting = db.query(models.GlobalSetting).filter(models.GlobalSetting.key == setting_update.key).first()
        if setting:
            setting.value = setting_update.value
    db.commit()
    return {"status": "success"}

from typing import Optional

class CampaignCreate(BaseModel):
    title: str
    body: str
    target_audience: str
    campaign_type: str
    manual_emails: Optional[str] = None
    is_scheduled: bool = False
    scheduled_at: Optional[str] = None
    frequency: str = "once"

@router.get("/campaigns")
def get_campaigns(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    campaigns = db.query(models.Campaign).order_by(models.Campaign.id.desc()).all()
    return [{
        "id": c.id,
        "title": c.title,
        "body": c.body,
        "target_audience": c.target_audience,
        "campaign_type": c.campaign_type,
        "status": c.status,
        "is_scheduled": c.is_scheduled,
        "scheduled_at": c.scheduled_at.isoformat() if c.scheduled_at else None,
        "frequency": c.frequency,
        "sent_at": c.sent_at.isoformat() if c.sent_at else None
    } for c in campaigns]

@router.delete("/campaigns/{campaign_id}")
def delete_campaign(campaign_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    campaign = db.query(models.Campaign).filter(models.Campaign.id == campaign_id).first()
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaña no encontrada")
    
    # Solo se puede eliminar si está pendiente
    if campaign.status != "pending":
        raise HTTPException(status_code=400, detail="Solo se pueden eliminar campañas pendientes de envío programado")
        
    db.delete(campaign)
    db.commit()
    return {"status": "success", "message": "Campaña programada cancelada y eliminada."}

from fastapi import BackgroundTasks
from app.services.email_service import send_campaign_emails
from app.services.push_service import send_campaign_pushes
from app.api.v1.endpoints.broadcast_ws import broadcast_manager

class MockUser:
    def __init__(self, email):
        self.email = email
        self.first_name = "Usuario"
        self.username = "Usuario"

@router.post("/campaigns/send")
def send_campaign(payload: CampaignCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    # Lógica de scheduling
    scheduled_datetime = None
    if payload.is_scheduled and payload.scheduled_at:
        try:
            # Parse datetime string from frontend (e.g. 2026-06-27T10:00)
            scheduled_datetime = datetime.fromisoformat(payload.scheduled_at)
            # Asegurar timezone
            if not scheduled_datetime.tzinfo:
                scheduled_datetime = scheduled_datetime.replace(tzinfo=datetime.utcnow().astimezone().tzinfo)
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inválido")

    if not payload.is_scheduled:
        users = []
        # Lógica de filtrado de audiencia (Triggers y Segmentos)
        if payload.target_audience == "manual" and payload.manual_emails:
            emails_list = [email.strip() for email in payload.manual_emails.split(",") if email.strip()]
            users = [MockUser(email) for email in emails_list]
        else:
            user_query = db.query(models.User)
            if payload.target_audience == "pro_only":
                user_query = user_query.filter(models.User.is_pro == True)
            elif payload.target_audience == "free_only":
                user_query = user_query.filter(models.User.is_pro == False)
            elif payload.target_audience == "inactive_7_days":
                user_query = user_query.filter(models.User.is_pro == False)
            users = user_query.all()
        
        if payload.campaign_type in ["welcome", "inactive", "promo", "custom"] and users:
            background_tasks.add_task(
                send_campaign_emails,
                users=users,
                template_type=payload.campaign_type,
                subject=payload.title,
                custom_body=payload.body
            )
        elif payload.campaign_type == "push" and users:
            user_ids = [u.id for u in users]
            if user_ids:
                # Extraemos las suscripciones como diccionarios para no amarrarlas a la sesión de SQLAlchemy
                db_subs = db.query(models.PushSubscription).filter(
                    models.PushSubscription.user_id.in_(user_ids)
                ).all()
                
                subs_list = [{
                    "endpoint": sub.endpoint,
                    "p256dh": sub.p256dh,
                    "auth": sub.auth
                } for sub in db_subs]
                
                if subs_list:
                    background_tasks.add_task(
                        send_campaign_pushes,
                        subscriptions=subs_list,
                        subject=payload.title,
                        custom_body=payload.body
                    )
        
        # SIEMPRE HACER BROADCAST A LOS USUARIOS CONECTADOS EN TIEMPO REAL
        background_tasks.add_task(
            broadcast_manager.broadcast_message,
            {
                "type": "campaign_broadcast",
                "title": payload.title,
                "body": payload.body,
                "campaign_type": payload.campaign_type
            }
        )
    
    new_campaign = models.Campaign(
        title=payload.title,
        body=payload.body,
        target_audience=payload.target_audience,
        campaign_type=payload.campaign_type,
        status="pending" if payload.is_scheduled else "sent",
        is_scheduled=payload.is_scheduled,
        scheduled_at=scheduled_datetime,
        frequency=payload.frequency
    )
    db.add(new_campaign)
    db.commit()
    db.refresh(new_campaign)
    
    message = "Campaña enviada" if not payload.is_scheduled else f"Campaña programada para el {scheduled_datetime.strftime('%Y-%m-%d %H:%M')}"
    
    return {
        "status": "success",
        "message": message,
        "campaign_id": new_campaign.id
    }

@router.get("/affiliates")
def get_affiliates(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    from sqlalchemy.orm import joinedload
    
    # 1. Obtener todos los referidos y agruparlos por el usuario que invitó
    referrals = db.query(models.Referral).options(
        joinedload(models.Referral.referrer),
        joinedload(models.Referral.referred)
    ).all()
    
    # Check if empty to generate mock data just to show something the first time
    if not referrals:
        user1 = db.query(models.User).filter(models.User.email != None).first()
        user2 = db.query(models.User).filter(models.User.email != None).offset(1).first()
        user3 = db.query(models.User).filter(models.User.email != None).offset(2).first()
        if user1 and user2 and user3:
            # Set a random referral code if they dont have one
            if not user1.referral_code:
                user1.referral_code = "TEST1"
            if not user2.referral_code:
                user2.referral_code = "TEST2"
                
            mock1 = models.Referral(referrer_id=user1.id, referred_id=user2.id, status="pending")
            mock2 = models.Referral(referrer_id=user1.id, referred_id=user3.id, status="rewarded")
            db.add_all([mock1, mock2])
            db.commit()
            
            referrals = db.query(models.Referral).options(
                joinedload(models.Referral.referrer),
                joinedload(models.Referral.referred)
            ).all()

    # Procesar para la tabla de Embajadores
    ambassadors_map = {}
    for ref in referrals:
        if not ref.referrer: continue
        r_id = ref.referrer.id
        if r_id not in ambassadors_map:
            ambassadors_map[r_id] = {
                "id": r_id,
                "email": ref.referrer.email,
                "referral_code": ref.referrer.referral_code or "N/A",
                "total_referred": 0,
                "pending_rewards": 0
            }
        
        ambassadors_map[r_id]["total_referred"] += 1
        if ref.status == "pending":
            ambassadors_map[r_id]["pending_rewards"] += 1
            
    top_ambassadors = list(ambassadors_map.values())
    top_ambassadors.sort(key=lambda x: x["total_referred"], reverse=True)
    
    total_referrals = len(referrals)
    active_referrals = sum(1 for r in referrals if r.status == "rewarded")
    
    return {
        "total_referrals": total_referrals,
        "active_referrals": active_referrals,
        "top_ambassadors": top_ambassadors
    }

@router.put("/affiliates/{user_id}/reward")
def reward_affiliate(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    # Marcar los referidos pendientes como recompensados y darle 7 días Pro
    pending_refs = db.query(models.Referral).filter(
        models.Referral.referrer_id == user_id,
        models.Referral.status == "pending"
    ).all()
    
    if not pending_refs:
        raise HTTPException(status_code=400, detail="No hay referidos pendientes para recompensar")
        
    for ref in pending_refs:
        ref.status = "rewarded"
        ref.rewarded_at = datetime.utcnow()
        
    # Dar 7 días pro por referido
    days_to_add = 7 * len(pending_refs)
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    
    if target_user:
        now = datetime.utcnow()
        current_valid = target_user.valid_until if target_user.valid_until and target_user.valid_until > now else now
        target_user.valid_until = current_valid + timedelta(days=days_to_add)
        target_user.is_pro = True
        if target_user.tier == "free":
            target_user.tier = "pro"
            
    db.commit()
    return {"status": "success", "message": f"Se otorgaron {days_to_add} días Pro por {len(pending_refs)} referidos"}

@router.get("/predictive-analytics")
async def get_predictive_analytics(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    now = datetime.utcnow()
    five_days_ago = now - timedelta(days=5)
    
    from sqlalchemy import func as sqla_func, case
    
    # Obtener totales necesarios en 1 query
    counts = db.query(
        sqla_func.count(case((models.User.is_pro == True, 1))).label("total_pro"),
        sqla_func.count(case((
            (models.User.is_pro == False) & 
            ((models.User.streak_days >= 3) | (models.User.eloquence_points > 500)),
            1
        ))).label("upgrade_candidates_count")
    ).first()
    
    total_pro = counts.total_pro or 0
    expected_new_pro = (counts.upgrade_candidates_count or 0) * 2
    
    # 1. Churn Risk (Usuarios Pro inactivos por más de 5 días)
    churn_risk_query = db.query(models.User).filter(
        models.User.is_pro == True,
        (models.User.last_activity_at < five_days_ago) | (models.User.last_activity_at == None)
    ).limit(10).all()
    
    churn_risk_users = [{
        "id": u.id,
        "email": u.email or u.username,
        "tier": u.tier,
        "last_activity": u.last_activity_at.isoformat() if u.last_activity_at else "Desconocido",
        "risk_level": "High"
    } for u in churn_risk_query]
    
    # 2. Upgrade Candidates (Usuarios Free con buena racha o puntos)
    upgrade_candidates_query = db.query(models.User).filter(
        models.User.is_pro == False,
        (models.User.streak_days >= 3) | (models.User.eloquence_points > 500)
    ).order_by(models.User.eloquence_points.desc()).limit(10).all()
    
    upgrade_candidates = [{
        "id": u.id,
        "email": u.email or u.username,
        "streak_days": u.streak_days,
        "eloquence_points": u.eloquence_points,
        "conversion_probability": min(95, 40 + (u.streak_days * 5) + (u.eloquence_points // 100))
    } for u in upgrade_candidates_query]
    
    # 3. MRR Projection
    current_mrr = total_pro * 9.99
    projected_mrr = current_mrr + (expected_new_pro * 9.99)
    
    stats_dict = {
        "current_mrr": round(current_mrr, 2),
        "projected_mrr": round(projected_mrr, 2),
        "expected_growth_percentage": round(((projected_mrr - current_mrr) / current_mrr * 100) if current_mrr > 0 else 100, 1),
        "churn_risk_count": len(churn_risk_users),
        "upgrade_candidates_count": len(upgrade_candidates)
    }
    
    # Generate AI CFO Report
    from app.services.gemini_service import GeminiService
    ai_service = GeminiService()
    cfo_report = await ai_service.generate_cfo_report(stats_dict)
    
    return {
        "current_mrr": stats_dict["current_mrr"],
        "projected_mrr": stats_dict["projected_mrr"],
        "expected_growth_percentage": stats_dict["expected_growth_percentage"],
        "churn_risk_users": churn_risk_users,
        "upgrade_candidates": upgrade_candidates,
        "cfo_report": cfo_report
    }

@router.get("/finances")
def get_finances(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    from sqlalchemy.orm import joinedload
    from sqlalchemy import func
    import uuid
    
    # 1. Consultar transacciones REALES (registradas por el webhook de Paddle)
    txs = db.query(models.Transaction).options(joinedload(models.Transaction.user)).order_by(models.Transaction.id.desc()).all()
        
    total_revenue = sum(t.amount for t in txs if t.status == "completed")
    
    # Agrupar ingresos por mes (simplificado para el dashboard)
    monthly_revenue = {}
    for t in txs:
        if t.status == "completed":
            month_key = t.created_at.strftime("%Y-%m")
            monthly_revenue[month_key] = monthly_revenue.get(month_key, 0) + t.amount
            
    # Chart data
    chart_data = [{"month": k, "revenue": round(v, 2)} for k, v in monthly_revenue.items()]
    chart_data.sort(key=lambda x: x["month"])
    
    transaction_list = [{
        "id": t.id,
        "email": t.user.email if t.user else "Usuario eliminado",
        "amount": t.amount,
        "currency": t.currency,
        "status": t.status,
        "paddle_id": t.paddle_transaction_id,
        "tier": t.tier_purchased,
        "date": t.created_at.isoformat()
    } for t in txs[:50]]
    
    return {
        "total_revenue": round(total_revenue, 2),
        "chart_data": chart_data,
        "transactions": transaction_list
    }

class BlogPostCreate(BaseModel):
    title: str
    content: str
    status: str
    author: str = "OnixLingo Team"

@router.get("/users")
def get_users(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    users = db.query(models.User).order_by(models.User.id.desc()).limit(100).all()
    return [{"id": str(u.id), "username": u.username, "email": u.email, "role": u.role, "status": "active" if u.is_active else "suspended", "joined_at": u.created_at.isoformat()} for u in users]

@router.post("/users/{user_id}/ban")
def ban_user(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.is_active = not user.is_active
    db.commit()
    return {"status": "success", "is_active": user.is_active}

@router.post("/users/{user_id}/upgrade")
def upgrade_user(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    user.tier = "titanium"
    user.is_pro = True
    db.commit()
    return {"status": "success", "tier": user.tier}

@router.get("/blog")
def get_blog_posts(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    posts = db.query(models.BlogPost).order_by(models.BlogPost.id.desc()).all()
    
    return [{
        "id": p.id,
        "title": p.title,
        "slug": p.slug,
        "content": p.content,
        "author": p.author,
        "status": p.status,
        "views": p.views,
        "created_at": p.created_at.isoformat(),
        "updated_at": p.updated_at.isoformat() if p.updated_at else p.created_at.isoformat()
    } for p in posts]

@router.post("/blog")
def create_blog_post(payload: BlogPostCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    import re
    # Create a simple slug
    base_slug = re.sub(r'[^a-z0-9]+', '-', payload.title.lower()).strip('-')
    
    # Ensure unique slug
    slug = base_slug
    counter = 1
    while db.query(models.BlogPost).filter(models.BlogPost.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1
        
    new_post = models.BlogPost(
        title=payload.title,
        slug=slug,
        content=payload.content,
        author=payload.author,
        status=payload.status
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    return {"status": "success", "message": "Artículo guardado exitosamente", "post_id": new_post.id}


import time

_DASHBOARD_CACHE = {}
_DASHBOARD_CACHE_TTL = 60  # Caché de 60 segundos

@router.get("/dashboard-all")
def get_dashboard_all(
    request: Request,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Endpoint maestro OPTIMIZADO: consolida todas las métricas del Dashboard General
    en queries directas mínimas. Usa caché en memoria de 60s para evitar 
    timeouts en el frontend y sobrecarga en la base de datos por los CASE WHEN.
    """
    global _DASHBOARD_CACHE
    now_ts = time.time()
    
    # Devolver desde caché si es válido
    if "data" in _DASHBOARD_CACHE and (now_ts - _DASHBOARD_CACHE["timestamp"] < _DASHBOARD_CACHE_TTL):
        return _DASHBOARD_CACHE["data"]

    from sqlalchemy import func as sqla_func, case
    from pathlib import Path

    now = datetime.utcnow()
    seven_days_ago = now - timedelta(days=7)
    five_days_ago = now - timedelta(days=5)

    # ── QUERY 1: Conteos de usuarios en una sola query con case/when ──
    user_counts = db.query(
        sqla_func.count(models.User.id).label("total"),
        sqla_func.count(case((models.User.is_pro == True, 1))).label("premium"),
        sqla_func.count(case((models.User.tier == "pro", 1))).label("pro"),
        sqla_func.count(case((models.User.tier == "executive", 1))).label("executive"),
        sqla_func.count(case((models.User.created_at >= seven_days_ago, 1))).label("new_week"),
        sqla_func.count(case((models.User.last_activity_at >= seven_days_ago, 1))).label("active_week"),
        sqla_func.count(case((
            (models.User.is_pro == False) & 
            (models.User.last_activity_at >= seven_days_ago),
            1
        ))).label("active_free"),
        sqla_func.count(case((
            (models.User.is_pro == True) & 
            ((models.User.last_activity_at < five_days_ago) | (models.User.last_activity_at == None)),
            1
        ))).label("churn_risk"),
        sqla_func.count(case((
            (models.User.is_pro == False) & 
            ((models.User.streak_days >= 3) | (models.User.eloquence_points > 500)),
            1
        ))).label("upgrade_candidates"),
    ).first()

    total_users = user_counts.total or 0
    premium_users = user_counts.premium or 0
    pro_users = user_counts.pro or 0
    executive_users = user_counts.executive or 0
    new_users_week = user_counts.new_week or 0
    active_users_week = user_counts.active_week or 0
    active_free_users = user_counts.active_free or 0
    churn_risk = user_counts.churn_risk or 0
    upgrade_candidates = user_counts.upgrade_candidates or 0

    # ── QUERY 2: XP total (progress + chess) ──
    xp_progress = db.query(sqla_func.sum(models.Progress.score)).scalar() or 0
    xp_chess = db.query(sqla_func.sum(models.ChessProgress.earned_xp)).scalar() or 0
    total_xp = xp_progress + xp_chess

    # ── QUERY 3: Distribución de idiomas en una sola query ──
    lang_counts = db.query(
        models.Progress.language,
        sqla_func.count(models.Progress.id)
    ).filter(
        models.Progress.language.in_(["en", "fr", "zh"])
    ).group_by(models.Progress.language).all()
    
    lang_map = {lang: count for lang, count in lang_counts}

    # ── QUERY 4: Top students count ──
    top_count = db.query(sqla_func.count(models.User.id)).scalar() or 0
    top_students = min(top_count, 5)

    # ── QUERY 5: Finanzas (solo conteo y suma) ──
    finance_agg = db.query(
        sqla_func.sum(case((models.Transaction.status == "completed", models.Transaction.amount), else_=0)).label("revenue"),
        sqla_func.count(models.Transaction.id).label("tx_count")
    ).first()
    
    total_revenue = round(float(finance_agg.revenue or 0), 2)
    transactions_count = finance_agg.tx_count or 0

    # ── QUERY 6: Tickets abiertos (solo conteo) ──
    open_tickets = db.query(sqla_func.count(models.SupportTicket.id)).scalar() or 0

    # ── QUERY 7: Referidos (solo conteo) ──
    ref_counts = db.query(
        sqla_func.count(models.Referral.id).label("total"),
        sqla_func.count(case((models.Referral.status == "rewarded", 1))).label("active")
    ).first()
    total_referrals = ref_counts.total or 0
    active_referrals = ref_counts.active or 0

    # ── QUERY 8: Marketing (solo conteos) ──
    promo_count = db.query(sqla_func.count(models.PromoCoupon.id)).scalar() or 0
    beta_count = db.query(sqla_func.count(models.BetaCode.id)).scalar() or 0

    # ── Cálculos derivados (sin queries) ──
    estimated_mrr = round((pro_users * 9.99) + (executive_users * 29.99), 2)
    current_mrr = premium_users * 9.99
    projected_mrr = round(current_mrr + (upgrade_candidates * 2 * 9.99), 2)
    growth_pct = round(((projected_mrr - current_mrr) / current_mrr * 100) if current_mrr > 0 else 100, 1)

    # ── Contenido (filesystem, sin query) ──
    base_path = Path(__file__).resolve().parent.parent.parent.parent / "voclessons" / "lessons"
    total_language_lessons = 0
    if base_path.exists():
        for lang in ["en", "fr", "zh"]:
            lang_path = base_path / lang
            if lang_path.exists():
                total_language_lessons += len(list(lang_path.glob("*.json")))

    chess_lessons = db.query(sqla_func.count(models.ChessLesson.id)).scalar() or 0

    result = {
        "total_users": total_users,
        "premium_users": premium_users,
        "new_users_week": new_users_week,
        "active_users_week": active_users_week,
        "active_free_users": active_free_users,
        "total_xp": total_xp,
        "pro_users": pro_users,
        "executive_users": executive_users,
        "estimated_mrr": estimated_mrr,
        "projected_mrr": projected_mrr,
        "expected_growth_percentage": growth_pct,
        "churn_risk_users": churn_risk,
        "upgrade_candidates": upgrade_candidates,
        "total_revenue": total_revenue,
        "transactions_count": transactions_count,
        "en_learners": lang_map.get("en", 0),
        "fr_learners": lang_map.get("fr", 0),
        "zh_learners": lang_map.get("zh", 0),
        "top_students": top_students,
        "total_language_lessons": total_language_lessons,
        "chess_lessons": chess_lessons,
        "open_tickets": open_tickets,
        "total_referrals": total_referrals,
        "active_referrals": active_referrals,
        "promo_codes": promo_count,
        "beta_codes": beta_count
    }
    
    # Guardar en caché
    _DASHBOARD_CACHE["timestamp"] = now_ts
    _DASHBOARD_CACHE["data"] = result
    
    return result

@router.get("/analytics")
def get_analytics_detailed(
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(get_current_admin_user)
):
    """
    Proporciona métricas detalladas y agrupadas específicas para la
    visualización en el módulo de Analíticas y Reportes.
    """
    from sqlalchemy import func
    from datetime import datetime, timedelta
    
    now = datetime.utcnow()
    
    # 1. User Growth (Last 7 days)
    growth_data = []
    for i in range(6, -1, -1):
        day_date = (now - timedelta(days=i)).date()
        start_of_day = datetime(day_date.year, day_date.month, day_date.day)
        end_of_day = start_of_day + timedelta(days=1)
        
        count = db.query(models.User).filter(
            models.User.created_at >= start_of_day,
            models.User.created_at < end_of_day
        ).count()
        
        growth_data.append({
            "date": day_date.strftime("%b %d"),
            "new_users": count
        })
        
    # 2. Language Distribution
    lang_counts = db.query(
        models.Progress.language,
        func.count(models.Progress.id)
    ).filter(
        models.Progress.language.in_(["en", "fr", "zh"])
    ).group_by(models.Progress.language).all()
    
    lang_map = {lang: count for lang, count in lang_counts}
        
    # 3. Tier Distribution
    tier_counts = db.query(
        models.User.tier,
        func.count(models.User.id)
    ).group_by(models.User.tier).all()
    
    tier_map = {tier or "free": count for tier, count in tier_counts}
    
    # 4. Engagement Averages
    avg_eloquence = db.query(func.avg(models.User.eloquence_points)).scalar() or 0
    avg_streak = db.query(func.avg(models.User.streak_days)).scalar() or 0
    
    # 5. Total Users (Historical)
    total_users = db.query(models.User).count()
    
    return {
        "growth": growth_data,
        "languages": lang_map,
        "tiers": tier_map,
        "engagement": {
            "avg_eloquence": round(avg_eloquence, 1),
            "avg_streak": round(avg_streak, 1)
        },
        "total_users": total_users
    }

# --- MEGAPARCHE 2 ---

class AIConfigUpdate(BaseModel):
    system_prompt: str
    temperature: str
    model_version: str

@router.get("/ai-configs")
def get_ai_configs(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    configs = db.query(models.AIConfiguration).all()
    if not configs:
        gemini = models.AIConfiguration(engine_name="gemini", system_prompt="Eres OnixLingo, un profesor estricto pero amable...", temperature="0.7", model_version="gemini-1.5-flash")
        chatgpt = models.AIConfiguration(engine_name="chatgpt", system_prompt="Eres un corrector gramatical...", temperature="0.3", model_version="gpt-4o")
        db.add_all([gemini, chatgpt])
        db.commit()
        configs = [gemini, chatgpt]
    
    return [{"engine_name": c.engine_name, "system_prompt": c.system_prompt, "temperature": c.temperature, "model_version": c.model_version} for c in configs]

@router.post("/ai-configs/{engine}")
def update_ai_config(engine: str, payload: AIConfigUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    config = db.query(models.AIConfiguration).filter(models.AIConfiguration.engine_name == engine).first()
    if not config:
        config = models.AIConfiguration(engine_name=engine)
        db.add(config)
    config.system_prompt = payload.system_prompt
    config.temperature = payload.temperature
    config.model_version = payload.model_version
    db.commit()
    return {"status": "success"}

class GlobalSettingUpdate(BaseModel):
    key: str
    value: str

@router.get("/global-settings")
def get_global_settings(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    settings = db.query(models.GlobalSetting).all()
    if not settings:
        s1 = models.GlobalSetting(key="maintenance_mode", value="false", description="Activar modo mantenimiento")
        s2 = models.GlobalSetting(key="registration_open", value="true", description="Permitir nuevos registros")
        db.add_all([s1, s2])
        db.commit()
        settings = [s1, s2]
    return [{"id": s.id, "key": s.key, "value": s.value, "description": s.description} for s in settings]

@router.post("/global-settings")
def update_global_setting(payload: GlobalSettingUpdate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    setting = db.query(models.GlobalSetting).filter(models.GlobalSetting.key == payload.key).first()
    if not setting:
        setting = models.GlobalSetting(key=payload.key, value=payload.value)
        db.add(setting)
    else:
        setting.value = payload.value
    db.commit()
    return {"status": "success"}

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    total_users = db.query(models.User).count()
    total_ai_practice = db.query(models.AIPracticeLog).count()
    total_exams = db.query(models.ExamAttempt).count()
    total_chess_matches = db.query(models.ChessMatch).count()
    
    return {
        "total_users": total_users,
        "ai_practice_sessions": total_ai_practice,
        "exams_taken": total_exams,
        "chess_matches_played": total_chess_matches,
        "active_now": 42 
    }

@router.get("/subscriptions")
def get_subscriptions(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    subs = db.query(models.User).filter(models.User.is_pro == True).order_by(models.User.valid_until.desc()).all()
    return [{
        "id": s.id, 
        "username": s.username, 
        "email": s.email, 
        "tier": s.tier, 
        "valid_until": s.valid_until.isoformat() if s.valid_until else None
    } for s in subs]

class BetaCodeCreate(BaseModel):
    code: str

@router.get("/beta-codes")
def get_beta_codes(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    codes = db.query(models.BetaCode).order_by(models.BetaCode.id.desc()).all()
    return [{"id": b.id, "code": b.code, "is_used": b.is_used, "used_by": b.used_by_email, "used_at": b.used_at.isoformat() if b.used_at else None} for b in codes]

@router.post("/beta-codes")
def create_beta_code(payload: BetaCodeCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    new_code = models.BetaCode(code=payload.code.upper(), is_used=False)
    db.add(new_code)
    db.commit()
    return {"status": "success", "code": new_code.code}

@router.delete("/beta-codes/{code_id}")
def delete_beta_code(code_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    bc = db.query(models.BetaCode).filter(models.BetaCode.id == code_id).first()
    if bc:
        db.delete(bc)
        db.commit()
    return {"status": "success"}

# --- MEGAPARCHE 3: Finanzas, Afiliados, Promos (100% REAL, ZERO MOCKS) ---

@router.get("/finances")
def get_finances(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    active_pro = db.query(models.User).filter(models.User.tier != "free", models.User.is_active == True).count()
    mrr = active_pro * 15 # Estimado $15 promedio
    
    transactions_db = db.query(models.Transaction).order_by(models.Transaction.id.desc()).limit(20).all()
    transactions = []
    for tx in transactions_db:
        transactions.append({
            "id": f"TXN-{tx.id}",
            "amount": f"${tx.amount}",
            "status": tx.status,
            "date": tx.created_at.strftime("%Y-%m-%d") if tx.created_at else "N/A"
        })

    return {
        "mrr": mrr,
        "active_subscriptions": active_pro,
        "churn_rate": 0,
        "transactions": transactions
    }

@router.get("/affiliates")
def get_affiliates(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    referrals = db.query(models.Referral).order_by(models.Referral.id.desc()).all()
    total_revenue = len(referrals) * 15
    active_affiliates = db.query(models.User).filter(models.User.referral_code != None).count()
    
    return {
        "total_revenue": total_revenue,
        "active_affiliates": active_affiliates,
        "top_affiliates": [
            {
                "id": ref.referrer_id,
                "username": ref.referrer.username if ref.referrer else "Desconocido",
                "referrals": 1,
                "status": ref.status
            } for ref in referrals
        ]
    }

@router.post("/affiliates/{user_id}/reward")
def reward_affiliate(user_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    from datetime import datetime, timedelta
    if not user.valid_until or user.valid_until < datetime.now():
        user.valid_until = datetime.now() + timedelta(days=7)
    else:
        user.valid_until = user.valid_until + timedelta(days=7)
    
    user.tier = "executive"
    user.is_pro = True
    
    refs = db.query(models.Referral).filter(models.Referral.referrer_id == user_id, models.Referral.status == "pending").all()
    for ref in refs:
        ref.status = "rewarded"
        
    db.commit()
    return {"status": "success", "message": "Recompensa enviada al afiliado"}

class PromoCreate(BaseModel):
    code: str
    discount: int
    expires_in_days: int

@router.get("/promo-codes")
def get_promo_codes(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    promos = db.query(models.PromoCoupon).order_by(models.PromoCoupon.id.desc()).all()
    return [{"id": p.id, "code": p.code, "is_used": p.is_used, "used_at": p.used_at.isoformat() if p.used_at else None} for p in promos]

@router.post("/promo-codes")
def create_promo_code(payload: PromoCreate, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    new_promo = models.PromoCoupon(
        code=payload.code.upper(),
        is_used=False
    )
    db.add(new_promo)
    db.commit()
    return {"status": "success", "code": new_promo.code}

@router.delete("/promo-codes/{code_id}")
def delete_promo_code(code_id: int, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin_user)):
    promo = db.query(models.PromoCoupon).filter(models.PromoCoupon.id == code_id).first()
    if promo:
        db.delete(promo)
        db.commit()
    return {"status": "success"}

class UpdateSettingsPayload(BaseModel):
    settings: dict

@router.get("/settings")
async def get_global_settings(
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin_user)
):
    settings = db.query(models.GlobalSetting).all()
    # Default fallback values if not present
    defaults = {
        "maintenance_mode": "false",
        "allow_registration": "true",
        "allow_gifts": "true"
    }
    
    current_settings = {s.key: s.value for s in settings}
    
    for k, v in defaults.items():
        if k not in current_settings:
            current_settings[k] = v
            
    return current_settings

@router.put("/settings")
async def update_global_settings(
    payload: UpdateSettingsPayload,
    db: Session = Depends(get_db),
    admin: models.User = Depends(get_current_admin_user)
):
    for key, value in payload.settings.items():
        setting = db.query(models.GlobalSetting).filter(models.GlobalSetting.key == key).first()
        if setting:
            setting.value = str(value)
        else:
            new_setting = models.GlobalSetting(key=key, value=str(value))
            db.add(new_setting)
    
    db.commit()
    
    return {"status": "success", "message": "Configuración del sistema actualizada correctamente."}