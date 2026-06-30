# app/services/email_service.py

import os
import resend
from fastapi import HTTPException
import logging

logger = logging.getLogger("OnixLingo.Email")

# Cargar la llave directamente (asegÃºrate de que load_dotenv() se ejecutÃ³ en main.py)
def send_password_reset_email(to_email: str, token: str):
    """EnvÃ­a el correo con el link mÃ¡gico usando Resend y el dominio verificado"""
    
    # ðŸ”¥ DINÃMICO: Aseguramos que la llave se asigne justo antes de enviar
    resend_key = os.getenv("RESEND_API_KEY")
    if not resend_key:
        logger.error("âŒ ERROR: RESEND_API_KEY no configurada en variables de entorno.")
        raise HTTPException(status_code=500, detail="Error de configuraciÃ³n de correo.")
    
    resend.api_key = resend_key
    
    frontend_url = os.getenv("FRONTEND_URL", "https://onixlingo.onixu.company")
    frontend_url = frontend_url.rstrip('/') 
    reset_link = f"{frontend_url}/reset-password?token={token}"

    try:
        response = resend.Emails.send({
            "from": "Soporte OnixLingo <soporte@onixu.company>",
            "to": to_email,
            "subject": "RecuperaciÃ³n de ContraseÃ±a - OnixLingo",
            "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F1623; color: #f1f5f9; padding: 40px; border-radius: 10px; border: 1px solid #1e293b;">
                <h2 style="color: #0d9488; text-align: center; margin-bottom: 30px;">OnixLingo AI</h2>
                <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseÃ±a de tu cuenta.</p>
                <p style="font-size: 16px; margin-bottom: 30px;">Haz clic en el siguiente botÃ³n para configurar una nueva contraseÃ±a. Este enlace expira en 15 minutos.</p>
                <div style="text-align: center;">
                    <a href="{reset_link}" style="display: inline-block; padding: 14px 28px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 0px; font-weight: bold; font-size: 16px;">Restablecer ContraseÃ±a</a>
                </div>
                <p style="font-size: 12px; color: #64748b; margin-top: 40px; text-align: center;">
                    Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu cuenta sigue protegida.
                </p>
            </div>
            """
        })
        logger.info(f"ðŸ“§ Correo de recuperaciÃ³n enviado a {to_email}")
        return response
    except Exception as e:
        logger.error(f"âŒ Error al enviar correo vÃ­a Resend: {e}")
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo de recuperaciÃ³n.")

def send_welcome_email(to_email: str, username: str):
    """EnvÃ­a el correo de bienvenida a nuevos usuarios usando Resend."""
    
    resend_key = os.getenv("RESEND_API_KEY")
    if not resend_key:
        logger.error("âŒ ERROR: RESEND_API_KEY no configurada en variables de entorno.")
        return # No lanzamos error para no bloquear el registro
    
    resend.api_key = resend_key
    frontend_url = os.getenv("FRONTEND_URL", "https://onixlingo.onixu.company").rstrip('/')
    
    try:
        response = resend.Emails.send({
            "from": "Bienvenido a OnixLingo <soporte@onixu.company>",
            "to": to_email,
            "subject": "Â¡Bienvenido a OnixLingo AI! ðŸš€",
            "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F1623; color: #f1f5f9; padding: 40px; border-radius: 10px; border: 1px solid #1e293b;">
                <!-- ESPACIO PARA EL LOGO (Reemplazar src cuando se tenga la URL) -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://via.placeholder.com/150x50/0d9488/ffffff?text=ONIXLINGO+LOGO" alt="OnixLingo Logo" style="max-width: 150px; height: auto;" />
                </div>
                
                <h2 style="color: #0d9488; text-align: center; margin-bottom: 20px;">Â¡Hola, {username}!</h2>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Tu cuenta ha sido creada exitosamente. Estamos emocionados de tenerte en <strong>OnixLingo AI</strong>, tu nueva plataforma inteligente para dominar idiomas.
                </p>
                
                <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="color: #f1f5f9; margin-top: 0; text-align: center;">Descubre nuestros planes diseÃ±ados para tu Ã©xito:</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #94a3b8; margin: 0 0 5px 0;">ðŸŒ± Nivel FREE</h4>
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">Acceso a lecciones bÃ¡sicas y funcionalidades introductorias para empezar tu aprendizaje sin costo.</p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #3b82f6; margin: 0 0 5px 0;">ðŸš€ Nivel PRO</h4>
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">Tutores IA personalizados, lecciones avanzadas, salas de lectura y evaluaciÃ³n de pronunciaciÃ³n avanzada.</p>
                    </div>
                    
                    <div>
                        <h4 style="color: #f59e0b; margin: 0 0 5px 0;">ðŸ’Ž Nivel EXECUTIVE / TITANIUM</h4>
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">La experiencia definitiva. Negociaciones B2B, salas de reuniones virtuales completas y acceso ilimitado a todas nuestras IAs especializadas.</p>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="{frontend_url}/login" style="display: inline-block; padding: 14px 30px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Ir a la plataforma</a>
                </div>
                
                <p style="font-size: 12px; color: #64748b; margin-top: 40px; text-align: center;">
                    Si tienes alguna duda, escrÃ­benos a soporte@onixu.company
                </p>
            </div>
            """
        })
        logger.info(f"ðŸ“§ Correo de bienvenida enviado a {to_email}")
        return response
    except Exception as e:
        logger.error(f"âŒ Error al enviar correo de bienvenida vÃ­a Resend a {to_email}: {e}")

from app.services.email_templates import get_template

def send_campaign_emails(users: list, template_type: str, subject: str, custom_body: str = ""):
    """EnvÃ­a correos en lote a una lista de usuarios (max 100 por lote)."""
    resend_key = os.getenv("RESEND_API_KEY")
    if not resend_key:
        logger.error("âŒ ERROR: RESEND_API_KEY no configurada.")
        return 0
        
    resend.api_key = resend_key
    sender = "OnixLingo <soporte@onixu.company>"
    
    emails_to_send = []
    for user in users:
        html_content = get_template(
            template_type=template_type,
            username=user.first_name or user.username or "Estudiante",
            custom_body=custom_body
        )
        emails_to_send.append({
            "from": sender,
            "to": [user.email],
            "subject": subject,
            "html": html_content
        })
        
    batch_size = 100
    sent_count = 0
    for i in range(0, len(emails_to_send), batch_size):
        batch = emails_to_send[i:i + batch_size]
        try:
            resend.Batch.send(batch)
            sent_count += len(batch)
            logger.info(f"âœ… Lote de {len(batch)} correos de campaÃ±a enviado.")
        except Exception as e:
            logger.error(f"âŒ Error al enviar lote de campaÃ±a: {e}")
            
    return sent_count

def send_gift_email(to_email: str, username: str, days: int, tier: str, message: str, valid_until: str):
    """EnvÃ­a el correo de regalo de suscripciÃ³n a un usuario."""
    resend_key = os.getenv("RESEND_API_KEY")
    if not resend_key:
        logger.error("âŒ ERROR: RESEND_API_KEY no configurada.")
        return None

    resend.api_key = resend_key
    frontend_url = os.getenv("FRONTEND_URL", "https://onixlingo.onixu.company").rstrip('/')

    TIER_LABELS = {
        "pro": ("ðŸš€ PRO", "#3b82f6"),
        "executive": ("ðŸ’¼ EXECUTIVE", "#8b5cf6"),
        "titanium": ("ðŸ’Ž TITANIUM", "#f59e0b"),
    }
    tier_label, tier_color = TIER_LABELS.get(tier, ("â­ PREMIUM", "#0d9488"))
    
    personal_section = f"""
        <div style="background:#1e293b;border-left:4px solid {tier_color};padding:16px 20px;border-radius:4px;margin:20px 0;">
            <p style="margin:0;font-size:14px;color:#e2e8f0;font-style:italic;">"{message}"</p>
            <p style="margin:8px 0 0 0;font-size:11px;color:#94a3b8;">â€” Equipo OnixLingo</p>
        </div>
    """ if message and message.strip() else ""

    try:
        response = resend.Emails.send({
            "from": "OnixLingo <soporte@onixu.company>",
            "to": to_email,
            "subject": f"ðŸŽ Â¡Tienes un regalo! {days} dÃ­as {tier_label} en OnixLingo",
            "html": f"""
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0F1623;color:#f1f5f9;padding:40px;border-radius:10px;border:1px solid #1e293b;">
                <div style="text-align:center;margin-bottom:30px;">
                    <h1 style="color:{tier_color};font-size:32px;margin:0;">ðŸŽ Â¡Un regalo para ti!</h1>
                </div>
                <p style="font-size:16px;line-height:1.6;">Hola <strong>{username}</strong>,</p>
                <p style="font-size:16px;line-height:1.6;">
                    El equipo de <strong>OnixLingo</strong> te ha obsequiado acceso 
                    <span style="color:{tier_color};font-weight:bold;">{tier_label}</span> 
                    por <strong>{days} dÃ­as</strong>. ðŸŽ‰
                </p>
                {personal_section}
                <div style="background:#1e293b;border-radius:8px;padding:20px;margin:20px 0;text-align:center;">
                    <p style="margin:0 0 8px 0;font-size:13px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Tu acceso vence el</p>
                    <p style="margin:0;font-size:22px;font-weight:bold;color:{tier_color};">
                        {valid_until}
                    </p>
                </div>
                <div style="text-align:center;margin-top:30px;">
                    <a href="{frontend_url}/dashboard" 
                        style="display:inline-block;padding:14px 32px;background:{tier_color};color:#000;text-decoration:none;border-radius:0;font-weight:bold;font-size:16px;">
                        Ir a mi Dashboard â†’
                    </a>
                </div>
                <p style="font-size:12px;color:#64748b;margin-top:40px;text-align:center;">
                    Si tienes dudas escrÃ­benos a soporte@onixu.company
                </p>
            </div>
            """
        })
        logger.info(f"ðŸ“§ Correo de regalo enviado a {to_email}")
        return response
    except Exception as e:
        logger.error(f"âŒ Error al enviar correo de regalo: {e}")
        return None
