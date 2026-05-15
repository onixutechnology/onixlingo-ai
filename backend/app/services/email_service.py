# app/services/email_service.py

import os
import resend
from fastapi import HTTPException
import logging

logger = logging.getLogger("OnixLingo.Email")

# Cargar la llave directamente (asegúrate de que load_dotenv() se ejecutó en main.py)
def send_password_reset_email(to_email: str, token: str):
    """Envía el correo con el link mágico usando Resend y el dominio verificado"""
    
    # 🔥 DINÁMICO: Aseguramos que la llave se asigne justo antes de enviar
    resend_key = os.getenv("RESEND_API_KEY")
    if not resend_key:
        logger.error("❌ ERROR: RESEND_API_KEY no configurada en variables de entorno.")
        raise HTTPException(status_code=500, detail="Error de configuración de correo.")
    
    resend.api_key = resend_key
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    frontend_url = frontend_url.rstrip('/') 
    reset_link = f"{frontend_url}/reset-password?token={token}"

    try:
        response = resend.Emails.send({
            "from": "Soporte OnixLingo <soporte@onixu.company>",
            "to": to_email,
            "subject": "Recuperación de Contraseña - OnixLingo",
            "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F1623; color: #f1f5f9; padding: 40px; border-radius: 10px; border: 1px solid #1e293b;">
                <h2 style="color: #0d9488; text-align: center; margin-bottom: 30px;">OnixLingo AI</h2>
                <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                <p style="font-size: 16px; margin-bottom: 30px;">Haz clic en el siguiente botón para configurar una nueva contraseña. Este enlace expira en 15 minutos.</p>
                <div style="text-align: center;">
                    <a href="{reset_link}" style="display: inline-block; padding: 14px 28px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 0px; font-weight: bold; font-size: 16px;">Restablecer Contraseña</a>
                </div>
                <p style="font-size: 12px; color: #64748b; margin-top: 40px; text-align: center;">
                    Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu cuenta sigue protegida.
                </p>
            </div>
            """
        })
        logger.info(f"📧 Correo de recuperación enviado a {to_email}")
        return response
    except Exception as e:
        logger.error(f"❌ Error al enviar correo vía Resend: {e}")
        raise HTTPException(status_code=500, detail="No se pudo enviar el correo de recuperación.")
