import sys
from sqlalchemy.orm import Session

# Importamos tu configuración
from app.database import SessionLocal, engine
from app.db import models
from app.core.security import get_password_hash

def crear_super_admin():
    db = SessionLocal()
    try:
        email = "onixutechnology@gmail.com"
        username = "OnixuAdmin"
        password_plana = "Onixuad9.87mi-n"

        # Verificar si ya existe
        user_exists = db.query(models.User).filter(models.User.email == email).first()
        if user_exists:
            print(f"⚠️ El usuario {email} ya existe. Actualizando a rol 'admin' y forzando nueva contraseña...")
            user_exists.role = "admin"
            user_exists.is_pro = True
            user_exists.tier = "titanium"
            
            # 🔥 FORZAMOS LA NUEVA CONTRASEÑA SEGURA
            hashed_pw = get_password_hash(password_plana)
            user_exists.hashed_password = hashed_pw
            
            db.commit()
            print("✅ Actualizado con éxito. Ya puedes iniciar sesión con la nueva contraseña.")
            return

        print("🔨 Creando Super Administrador desde cero...")

        # Hasheamos la contraseña
        hashed_pw = get_password_hash(password_plana)

        nuevo_admin = models.User(
            email=email,
            username=username,
            hashed_password=hashed_pw,
            role="admin",        # 🔥 El permiso divino
            is_active=True,
            is_pro=True,         # Lo hacemos Titanium por defecto
            tier="titanium"
        )

        db.add(nuevo_admin)
        db.commit()
        db.refresh(nuevo_admin)
        print(f"👑 ¡ÉXITO! Super Admin creado: {email}")

    except Exception as e:
        print(f"❌ Error al inyectar admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Iniciando inyección en la base de datos...")
    crear_super_admin()