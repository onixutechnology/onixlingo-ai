import asyncio
import logging
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.db import models
from app.services.email_service import send_campaign_emails
from app.services.push_service import send_campaign_pushes

logger = logging.getLogger("OnixLingo.Scheduler")

class MockUser:
    def __init__(self, email):
        self.email = email
        self.first_name = "Usuario"
        self.username = "Usuario"

async def process_scheduled_campaigns():
    """
    Función que revisa la BD en busca de campañas programadas
    pendientes cuya fecha programada ya se haya cumplido.
    """
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        # Buscar campañas pendientes donde scheduled_at <= now
        pending_campaigns = db.query(models.Campaign).filter(
            models.Campaign.status == "pending",
            models.Campaign.is_scheduled == True,
            models.Campaign.scheduled_at <= now
        ).all()

        for campaign in pending_campaigns:
            logger.info(f"⏳ Procesando campaña programada: {campaign.title} (ID: {campaign.id})")
            
            # Obtener usuarios
            users = []
            if campaign.target_audience == "manual":
                # Nota: Si quisieramos guardar manual_emails habría que agregarlo al modelo Campaign.
                # Por ahora ignoramos manual scheduled.
                logger.warning(f"Campaña {campaign.id} es manual. Omitiendo usuarios manuales no guardados.")
            else:
                user_query = db.query(models.User)
                if campaign.target_audience == "pro_only":
                    user_query = user_query.filter(models.User.is_pro == True)
                elif campaign.target_audience == "free_only":
                    user_query = user_query.filter(models.User.is_pro == False)
                elif campaign.target_audience == "inactive_7_days":
                    user_query = user_query.filter(models.User.is_pro == False)
                users = user_query.all()
            
            # Ejecutar el envío (síncrono aquí, porque estamos en background)
            if campaign.campaign_type in ["welcome", "inactive", "promo", "custom"] and users:
                send_campaign_emails(
                    users=users,
                    template_type=campaign.campaign_type,
                    subject=campaign.title,
                    custom_body=campaign.body
                )
            elif campaign.campaign_type == "push" and users:
                user_ids = [u.id for u in users]
                if user_ids:
                    db_subs = db.query(models.PushSubscription).filter(
                        models.PushSubscription.user_id.in_(user_ids)
                    ).all()
                    subs_list = [{
                        "endpoint": sub.endpoint,
                        "p256dh": sub.p256dh,
                        "auth": sub.auth
                    } for sub in db_subs]
                    
                    if subs_list:
                        send_campaign_pushes(
                            subscriptions=subs_list,
                            subject=campaign.title,
                            custom_body=campaign.body
                        )
            
            # Actualizar estado o reprogramar si es recurrente
            if campaign.frequency == "once":
                campaign.status = "sent"
                campaign.sent_at = now
            else:
                # Calcular la próxima fecha
                if campaign.frequency == "daily":
                    campaign.scheduled_at = campaign.scheduled_at + timedelta(days=1)
                elif campaign.frequency == "weekly":
                    campaign.scheduled_at = campaign.scheduled_at + timedelta(weeks=1)
                elif campaign.frequency == "monthly":
                    # Sumamos 30 días aprox, o el mismo día del siguiente mes
                    campaign.scheduled_at = campaign.scheduled_at + timedelta(days=30)
                
                campaign.sent_at = now
                # El status sigue siendo "pending" para la próxima vez
                
            db.commit()
            logger.info(f"✅ Campaña programada {campaign.id} procesada con éxito.")

    except Exception as e:
        logger.error(f"❌ Error al procesar campañas programadas: {e}")
    finally:
        db.close()

async def cron_loop():
    """
    Bucle infinito que se ejecutará en background.
    """
    logger.info("🕒 Motor CRON de OnixLingo iniciado.")
    try:
        while True:
            await process_scheduled_campaigns()
            # Esperar 60 segundos antes de volver a revisar
            await asyncio.sleep(60)
    except asyncio.CancelledError:
        logger.info("🛑 Motor CRON detenido (Shutting down).")
