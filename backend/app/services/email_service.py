# app/services/email_service.py

import os
import resend
from fastapi import HTTPException
import logging

logger = logging.getLogger("OnixLingo.Email")

# Cargar la llave directamente (asegúrate de que load_dotenv() se ejecutó en main.py)
resend.api_key = os.getenv("RESEND_API_KEY")

def send_password_reset_email(to_email: str, token: str):
    """Envía el correo con el link mágico usando Resend"""
    
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    # ⚠️ NOTA DE DESARROLLO: 
    # Mientras estés en el plan gratis de Resend y no verifiques un dominio propio, 
    # SOLO puedes enviar correos a la dirección de email con la que creaste tu cuenta de Resend.
    # El remitente debe ser 'onboarding@resend.dev'.

    try:
        response = resend.Emails.send({
            "from": "OnixLingo Security <onboarding@resend.dev>",
            "to": to_email,
            "subject": "Recuperación de Contraseña - OnixLingo",
            "html": f"""
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F1623; color: #f1f5f9; padding: 40px; border-radius: 10px; border: 1px solid #1e293b;">
                    <h2 style="color: #6366f1; text-align: center; margin-bottom: 30px;">OnixLingo Titanium</h2>
                    <p style="font-size: 16px;">Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                    <p style="font-size: 16px; margin-bottom: 30px;">Haz clic en el siguiente botón para configurar una nueva contraseña. Este enlace expira en 15 minutos.</p>
                    <div style="text-align: center;">
                        <a href="{reset_link}" style="display: inline-block; padding: 14px 28px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Restablecer Contraseña</a>
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
