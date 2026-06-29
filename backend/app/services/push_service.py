# app/services/push_service.py

import os
import json
import logging
from pywebpush import webpush, WebPushException

logger = logging.getLogger("OnixLingo.Push")

def send_web_push(subscription_info: dict, payload_data: dict):
    """
    Envía una notificación web push usando VAPID.
    subscription_info: dict con endpoint, keys (p256dh, auth)
    payload_data: dict con title, body, icon, url, etc.
    """
    vapid_private_key = os.getenv("VAPID_PRIVATE_KEY")
    vapid_claims = {
        "sub": "mailto:soporte@onixu.company"
    }

    if not vapid_private_key:
        logger.error("❌ ERROR: VAPID_PRIVATE_KEY no está configurada en .env")
        return False

    try:
        webpush(
            subscription_info=subscription_info,
            data=json.dumps(payload_data),
            vapid_private_key=vapid_private_key,
            vapid_claims=vapid_claims
        )
        return True
    except WebPushException as ex:
        # Si el error es de expiración de suscripción (ej: HTTP 410 Gone o 404),
        # lo ideal sería eliminar la suscripción de la base de datos.
        # Aquí lo capturamos y logueamos.
        logger.error(f"❌ Error al enviar Web Push: {ex}")
        if ex.response and ex.response.status_code in [404, 410]:
            logger.warning("⚠️ La suscripción ha expirado o ya no es válida.")
            return "expired"
        return False
    except Exception as e:
        logger.error(f"❌ Error inesperado en Web Push: {e}")
        return False

def send_campaign_pushes(subscriptions: list, subject: str, custom_body: str = ""):
    """
    Envía notificaciones push en lote a una lista de suscripciones (como diccionarios).
    """
    from app.database import SessionLocal
    from app.db import models
    
    payload_data = {
        "title": subject,
        "body": custom_body or "Tienes una nueva notificación de OnixLingo.",
        "icon": "/icon512_maskable.png", 
        "badge": "/icon512_rounded.png",
        "url": "/"
    }
    
    sent_count = 0
    expired_endpoints = []
    
    for sub in subscriptions:
        sub_info = {
            "endpoint": sub["endpoint"],
            "keys": {
                "p256dh": sub["p256dh"],
                "auth": sub["auth"]
            }
        }
        
        result = send_web_push(sub_info, payload_data)
        if result == True:
            sent_count += 1
        elif result == "expired":
            expired_endpoints.append(sub["endpoint"])
            
    if expired_endpoints:
        db = SessionLocal()
        try:
            db.query(models.PushSubscription).filter(
                models.PushSubscription.endpoint.in_(expired_endpoints)
            ).delete(synchronize_session=False)
            db.commit()
            logger.info(f"🗑️ Eliminadas {len(expired_endpoints)} suscripciones push expiradas.")
        except Exception as e:
            logger.error(f"❌ Error al limpiar suscripciones expiradas: {e}")
            db.rollback()
        finally:
            db.close()
            
    return sent_count
