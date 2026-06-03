import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from passlib.context import CryptContext

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("[ERROR] Variable DATABASE_URL no encontrada.")
    exit(1)

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Datos de los usuarios a crear o actualizar
users_data = [
    {
        "username": "admin",
        "email": "admin@ditucen.com",
        "password": "AdminPassword2026!",
        "role": "admin",
        "tier": "executive",
        "is_pro": True
    },
    {
        "username": "user_free",
        "email": "free@onixlingo.com",
        "password": "FreePassword2026!",
        "role": "student",
        "tier": "free",
        "is_pro": False
    },
    {
        "username": "user_pro",
        "email": "pro@onixlingo.com",
        "password": "ProPassword2026!",
        "role": "student",
        "tier": "pro",
        "is_pro": True
    },
    {
        "username": "j2022eico2",  # Este es el usuario existente que elevamos a Executive
        "email": "j2022eico2@gmail.com",
        "password": "ExecutivePassword2026!",
        "role": "student",
        "tier": "executive",
        "is_pro": True
    }
]

# Códigos beta ejecutivos a inyectar
executive_codes = [
    "ONX-EXEC-2026-TITAN",
    "ONX-EXEC-2026-SUMMIT",
    "ONX-EXEC-2026-CLEVEL",
    "ONX-EXEC-2026-ELITE",
    "ONX-EXEC-2026-LEGACY"
]

with engine.connect() as conn:
    print("--- CREACIÓN / ACTUALIZACIÓN DE USUARIOS DE PRUEBA ---")
    now = datetime.utcnow()
    valid_until = now + timedelta(days=365)
    
    for u in users_data:
        try:
            # Comprobar si el usuario existe por username
            res = conn.execute(text("SELECT id FROM users WHERE username = :name"), {"name": u["username"]})
            row = res.fetchone()
            
            hashed = get_password_hash(u["password"])
            
            if row:
                # Actualizar credenciales y membresía
                conn.execute(
                    text("""
                        UPDATE users 
                        SET email = :email, 
                            hashed_password = :hash, 
                            role = :role, 
                            tier = :tier, 
                            is_pro = :is_pro, 
                            valid_until = :valid 
                        WHERE username = :name
                    """),
                    {
                        "email": u["email"],
                        "hash": hashed,
                        "role": u["role"],
                        "tier": u["tier"],
                        "is_pro": u["is_pro"],
                        "valid": valid_until if u["is_pro"] else None,
                        "name": u["username"]
                    }
                )
                print(f"[ACTUALIZADO] Usuario '{u['username']}' listo con Plan {u['tier'].upper()}.")
            else:
                # Crear nuevo usuario
                conn.execute(
                    text("""
                        INSERT INTO users (username, email, hashed_password, role, tier, is_pro, valid_until, is_active)
                        VALUES (:name, :email, :hash, :role, :tier, :is_pro, :valid, True)
                    """),
                    {
                        "name": u["username"],
                        "email": u["email"],
                        "hash": hashed,
                        "role": u["role"],
                        "tier": u["tier"],
                        "is_pro": u["is_pro"],
                        "valid": valid_until if u["is_pro"] else None
                    }
                )
                print(f"[CREADO] Nuevo usuario '{u['username']}' con Plan {u['tier'].upper()}.")
        except Exception as err:
            print(f"[ERROR] Al procesar usuario '{u['username']}': {err}")
            
    print("\n--- INYECCIÓN DE CÓDIGOS BETA EXECUTIVE (TITANIUM) ---")
    for code in executive_codes:
        try:
            # Comprobar si ya existe
            res_code = conn.execute(text("SELECT code FROM beta_codes WHERE code = :code"), {"code": code})
            row_code = res_code.fetchone()
            
            if not row_code:
                conn.execute(
                    text("INSERT INTO beta_codes (code, is_used, used_by_email, used_at) VALUES (:code, False, NULL, NULL)"),
                    {"code": code}
                )
                print(f"[INJECTED] Código Executive: {code}")
            else:
                # Asegurar que esté libre y no usado
                conn.execute(
                    text("UPDATE beta_codes SET is_used = False, used_by_email = NULL, used_at = NULL WHERE code = :code"),
                    {"code": code}
                )
                print(f"[LIBERADO] Código Executive (existente): {code}")
        except Exception as code_err:
            print(f"[ERROR] Al procesar código '{code}': {code_err}")
            
    conn.commit()
    print("\n[PROCESO COMPLETADO EXITOSAMENTE]")
