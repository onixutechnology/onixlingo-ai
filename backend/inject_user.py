# backend/inject_user.py
import os
import random
import string
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from app.core.security import get_password_hash

load_dotenv()
url = os.getenv("DATABASE_URL")
if not url:
    url = "sqlite:///./onixlingo.db"

if url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql://", 1)

db_host = url.split('@')[-1] if '@' in url else url
print(f"[INFO] Connecting to database: {db_host}")
engine = create_engine(url)

email = "jeicomorales1@gmail.com"
username = "jeicomorales1"
password_plana = "Jacob12345"

print(f"[INFO] Preparing registration for user '{email}'...")

try:
    with engine.begin() as conn:
        # 1. Obtener o crear un codigo beta valido no usado
        res_code = conn.execute(text("SELECT code FROM beta_codes WHERE is_used = FALSE LIMIT 1")).fetchone()
        if not res_code:
            # Crear un codigo en caliente si no hay ninguno disponible
            code = "ONX-2026-USR-JEIC"
            conn.execute(text("""
                INSERT INTO beta_codes (code, is_used, used_by_email, used_at)
                VALUES (:code, :is_used, :used_by_email, :used_at)
                ON CONFLICT (code) DO NOTHING
            """), {"code": code, "is_used": True, "used_by_email": email, "used_at": datetime.utcnow()})
        else:
            code = res_code[0]
            conn.execute(text("""
                UPDATE beta_codes 
                SET is_used = TRUE, used_by_email = :email, used_at = :now 
                WHERE code = :code
            """), {"email": email, "now": datetime.utcnow(), "code": code})

        print(f"[INFO] Beta code linked to account: {code}")

        # 2. Generar hash de contraseña con el algoritmo del sistema
        hashed_pw = get_password_hash(password_plana)
        
        # 3. Generar codigo de referido unico
        suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
        referral = f"ONX-2026-JEI-{suffix}"

        # 4. Verificar si el usuario ya existe en la tabla de users
        res_user = conn.execute(text("SELECT id FROM users WHERE email = :email OR username = :username"), 
                                {"email": email, "username": username}).fetchone()
        
        now = datetime.utcnow()
        valid_until = now + timedelta(days=365)

        if res_user:
            user_id = res_user[0]
            print(f"[INFO] User already exists (ID: {user_id}). Upgrading profile and password...")
            conn.execute(text("""
                UPDATE users 
                SET hashed_password = :hashed, beta_code = :code, is_pro = TRUE, tier = 'titanium', valid_until = :valid_until
                WHERE id = :id
            """), {
                "hashed": hashed_pw,
                "code": code,
                "valid_until": valid_until,
                "id": user_id
            })
            print("[SUCCESS] Existing user successfully updated and authorized!")
        else:
            print("[INFO] Creating new user profile from scratch...")
            conn.execute(text("""
                INSERT INTO users (username, email, hashed_password, referral_code, beta_code, tier, is_pro, valid_until, is_active, role)
                VALUES (:username, :email, :hashed, :referral, :code, 'titanium', TRUE, :valid_until, TRUE, 'student')
            """), {
                "username": username,
                "email": email,
                "hashed": hashed_pw,
                "referral": referral,
                "code": code,
                "valid_until": valid_until
            })
            print("[SUCCESS] New user successfully created and authorized!")

except Exception as e:
    print(f"[ERROR] Failed to inject user: {e}")
