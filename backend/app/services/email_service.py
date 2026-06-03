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

def send_welcome_email(to_email: str, username: str):
    """Envía el correo de bienvenida a nuevos usuarios usando Resend."""
    
    resend_key = os.getenv("RESEND_API_KEY")
    if not resend_key:
        logger.error("❌ ERROR: RESEND_API_KEY no configurada en variables de entorno.")
        return # No lanzamos error para no bloquear el registro
    
    resend.api_key = resend_key
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip('/')
    
    try:
        response = resend.Emails.send({
            "from": "Bienvenido a OnixLingo <soporte@onixu.company>",
            "to": to_email,
            "subject": "¡Bienvenido a OnixLingo AI! 🚀",
            "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0F1623; color: #f1f5f9; padding: 40px; border-radius: 10px; border: 1px solid #1e293b;">
                <!-- ESPACIO PARA EL LOGO (Reemplazar src cuando se tenga la URL) -->
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://via.placeholder.com/150x50/0d9488/ffffff?text=ONIXLINGO+LOGO" alt="OnixLingo Logo" style="max-width: 150px; height: auto;" />
                </div>
                
                <h2 style="color: #0d9488; text-align: center; margin-bottom: 20px;">¡Hola, {username}!</h2>
                <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                    Tu cuenta ha sido creada exitosamente. Estamos emocionados de tenerte en <strong>OnixLingo AI</strong>, tu nueva plataforma inteligente para dominar idiomas.
                </p>
                
                <div style="background-color: #1e293b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="color: #f1f5f9; margin-top: 0; text-align: center;">Descubre nuestros planes diseñados para tu éxito:</h3>
                    
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #94a3b8; margin: 0 0 5px 0;">🌱 Nivel FREE</h4>
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">Acceso a lecciones básicas y funcionalidades introductorias para empezar tu aprendizaje sin costo.</p>
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <h4 style="color: #3b82f6; margin: 0 0 5px 0;">🚀 Nivel PRO</h4>
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">Tutores IA personalizados, lecciones avanzadas, salas de lectura y evaluación de pronunciación avanzada.</p>
                    </div>
                    
                    <div>
                        <h4 style="color: #f59e0b; margin: 0 0 5px 0;">💎 Nivel EXECUTIVE / TITANIUM</h4>
                        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">La experiencia definitiva. Negociaciones B2B, salas de reuniones virtuales completas y acceso ilimitado a todas nuestras IAs especializadas.</p>
                    </div>
                </div>

                <div style="text-align: center;">
                    <a href="{frontend_url}/login" style="display: inline-block; padding: 14px 30px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Ir a la plataforma</a>
                </div>
                
                <p style="font-size: 12px; color: #64748b; margin-top: 40px; text-align: center;">
                    Si tienes alguna duda, responde a este correo y nuestro equipo te ayudará.
                </p>
            </div>
            """
        })
        logger.info(f"📧 Correo de bienvenida enviado a {to_email}")
        return response
    except Exception as e:
        logger.error(f"❌ Error al enviar correo de bienvenida vía Resend: {e}")
        # No bloqueamos si el correo falla
        pass
