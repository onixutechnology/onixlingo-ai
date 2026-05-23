import sys
import logging
from datetime import datetime
from sqlalchemy.orm import Session

# Import backend modules
from app.database import SessionLocal, engine
from app.db.models import User, BetaCode
from app.core.security import get_password_hash

# Configurar logs
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("OnixLingo.Seeder")

def inject_test_users():
    db: Session = SessionLocal()
    
    try:
        # 1. Obtener códigos beta no utilizados para asociarlos a los perfiles
        unused_codes = db.query(BetaCode).filter(BetaCode.is_used == False).limit(2).all()
        if len(unused_codes) < 2:
            logger.warning("⚠️ No se encontraron suficientes códigos beta libres en la tabla. Buscando usados para re-asignar...")
            # Fallback en caso de que todos estén marcados como usados
            unused_codes = db.query(BetaCode).limit(2).all()
            
        code_free = unused_codes[0].code
        code_pro = unused_codes[1].code
        
        now = datetime.utcnow()
        
        # 2. INYECTAR USUARIO FREE (j2022eico2@gmail.com)
        user_free = db.query(User).filter(User.email == "j2022eico2@gmail.com").first()
        if not user_free:
            user_free = User(
                username="j2022eico2",
                email="j2022eico2@gmail.com",
                hashed_password=get_password_hash("Jacob12345"),
                beta_code=code_free,
                tier="free",
                is_pro=False,
                country_code="MX",
                created_at=now
            )
            db.add(user_free)
            logger.info(f"🆕 Creando usuario FREE: j2022eico2@gmail.com con código {code_free}")
        else:
            user_free.tier = "free"
            user_free.is_pro = False
            user_free.beta_code = code_free
            logger.info(f"🔄 Actualizando usuario FREE: j2022eico2@gmail.com con código {code_free}")
            
        # Marcar código como consumido
        unused_codes[0].is_used = True
        unused_codes[0].used_by_email = "j2022eico2@gmail.com"
        unused_codes[0].used_at = now

        # 3. INYECTAR USUARIO PRO (moralesmorenojacob0@gmail.com)
        user_pro = db.query(User).filter(User.email == "moralesmorenojacob0@gmail.com").first()
        if not user_pro:
            user_pro = User(
                username="moralesjacob0",
                email="moralesmorenojacob0@gmail.com",
                hashed_password=get_password_hash("Jacob12345"),
                beta_code=code_pro,
                tier="pro",
                is_pro=True,
                country_code="MX",
                created_at=now
            )
            db.add(user_pro)
            logger.info(f"🆕 Creando usuario PRO: moralesmorenojacob0@gmail.com con código {code_pro}")
        else:
            user_pro.tier = "pro"
            user_pro.is_pro = True
            user_pro.beta_code = code_pro
            logger.info(f"🔄 Actualizando usuario PRO: moralesmorenojacob0@gmail.com con código {code_pro}")

        # Marcar código como consumido
        unused_codes[1].is_used = True
        unused_codes[1].used_by_email = "moralesmorenojacob0@gmail.com"
        unused_codes[1].used_at = now
        
        # 4. GUARDAR EN DB
        db.commit()
        logger.info("✅ Inyección completada exitosamente en PostgreSQL.")
        
    except Exception as e:
        db.rollback()
        logger.error(f"❌ Error durante la inyección de usuarios: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    inject_test_users()
