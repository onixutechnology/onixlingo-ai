from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db import models
from app.services.email_service import send_gift_email

class AdminService:
    @staticmethod
    def gift_subscription(db: Session, target_user: models.User, days: int, tier: str, message: str, notify_email: bool) -> dict:
        """
        Otorga días de suscripción a un usuario y envía un correo electrónico.
        """
        now = datetime.utcnow()
        current_valid = target_user.valid_until if target_user.valid_until and target_user.valid_until > now else now
        target_user.valid_until = current_valid + timedelta(days=days)
        target_user.is_pro = True
        target_user.tier = tier
        db.commit()
        db.refresh(target_user)

        email_sent = False
        valid_until_str = target_user.valid_until.strftime('%d de %B de %Y') if target_user.valid_until else 'Calculando...'

        if notify_email and target_user.email:
            response = send_gift_email(
                to_email=target_user.email,
                username=target_user.username,
                days=days,
                tier=tier,
                message=message,
                valid_until=valid_until_str
            )
            email_sent = response is not None

        return {
            "status": "success",
            "message": f"¡Regalo enviado! {days} días {tier} otorgados a {target_user.username}",
            "new_expiration": target_user.valid_until.isoformat() if target_user.valid_until else None,
            "email_sent": email_sent
        }
