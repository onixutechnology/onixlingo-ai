BASE_HTML = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
    <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #4f46e5; padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 2px;">ONIXLINGO</h1>
        </div>
        <div style="padding: 40px 32px; line-height: 1.6;">
            {content}
        </div>
        <div style="background-color: #f1f5f9; padding: 24px; text-align: center; font-size: 12px; color: #64748b;">
            <p>Has recibido este correo porque eres miembro de OnixLingo.</p>
            <p>© 2026 OnixLingo. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
"""

WELCOME_TEMPLATE = BASE_HTML.format(content="""
    <h2 style="margin-top: 0; color: #1e293b;">¡Bienvenido a OnixLingo, {username}! 👋</h2>
    <p>Estamos emocionados de tenerte a bordo en nuestra plataforma de IA para el aprendizaje de idiomas.</p>
    <p>Con OnixLingo, tendrás acceso a tutores de inteligencia artificial 24/7, listos para ayudarte a mejorar tus habilidades conversacionales.</p>
    <div style="text-align: center; margin: 32px 0;">
        <a href="https://onixlingo.com/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Comenzar a Practicar</a>
    </div>
    <p>Si tienes alguna pregunta, nuestro equipo de soporte está siempre disponible.</p>
""")

INACTIVE_TEMPLATE = BASE_HTML.format(content="""
    <h2 style="margin-top: 0; color: #1e293b;">¡Te extrañamos, {username}! 🥺</h2>
    <p>Hemos notado que no has ingresado a OnixLingo en los últimos días. Tus tutores de IA te están esperando para seguir practicando.</p>
    <p>La consistencia es la clave para dominar un nuevo idioma. ¡Regresa hoy y completa una sesión rápida de 10 minutos!</p>
    <div style="text-align: center; margin: 32px 0;">
        <a href="https://onixlingo.com/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Retomar mi aprendizaje</a>
    </div>
""")

PROMO_TEMPLATE = BASE_HTML.format(content="""
    <h2 style="margin-top: 0; color: #1e293b;">¡Oferta Especial Exclusiva! 🚀</h2>
    <p>Hola {username},</p>
    <p>{body}</p>
    <div style="text-align: center; margin: 32px 0;">
        <a href="https://onixlingo.com/pricing" style="background-color: #eab308; color: #854d0e; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Ver Planes Pro</a>
    </div>
    <p>¡No pierdas esta oportunidad de acelerar tu aprendizaje al máximo nivel!</p>
""")

CUSTOM_TEMPLATE = BASE_HTML.format(content="""
    <h2 style="margin-top: 0; color: #1e293b;">Hola {username},</h2>
    <div style="margin-top: 20px;">
        {body}
    </div>
""")

def get_template(template_type: str, username: str, custom_body: str = "") -> str:
    if template_type == "welcome":
        return WELCOME_TEMPLATE.replace("{username}", username)
    elif template_type == "inactive":
        return INACTIVE_TEMPLATE.replace("{username}", username)
    elif template_type == "promo":
        return PROMO_TEMPLATE.replace("{username}", username).replace("{body}", custom_body.replace('\n', '<br>'))
    else:
        return CUSTOM_TEMPLATE.replace("{username}", username).replace("{body}", custom_body.replace('\n', '<br>'))
