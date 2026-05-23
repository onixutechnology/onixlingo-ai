# backend/test_query.py
import os
import random
import string
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
url = os.getenv("DATABASE_URL")
if not url:
    url = "sqlite:///./onixlingo.db"

if url.startswith("postgres://"):
    url = url.replace("postgres://", "postgresql://", 1)

db_host = url.split('@')[-1] if '@' in url else url
print(f"[INFO] Connecting to: {db_host}")

connect_args = {}
if "postgresql" in url:
    connect_args = {"connect_timeout": 5}

engine = create_engine(url, connect_args=connect_args)

print("[INFO] Creating 50 random codes...")
codes = set()
while len(codes) < 50:
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    codes.add(f"ONX-2026-USR-{suffix}")
print(f"[INFO] Generated {len(codes)} unique code candidates.")

print("[INFO] Connecting to DB with engine.begin()...")
try:
    with engine.begin() as conn:
        print("[INFO] Connection established successfully.")
        # Ensure beta_codes table exists
        try:
            print("[INFO] Querying existing beta_codes to see if table exists...")
            result = conn.execute(text("SELECT code FROM beta_codes")).fetchall()
            existing = {row[0] for row in result}
            print(f"[INFO] Table exists. Found {len(existing)} existing codes.")
        except Exception as e:
            print(f"[WARNING] beta_codes table does not exist or has errors. Creating it. Error: {e}")
            if "postgresql" in url:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS beta_codes (
                        id SERIAL PRIMARY KEY,
                        code VARCHAR UNIQUE NOT NULL,
                        is_used BOOLEAN DEFAULT FALSE,
                        used_by_email VARCHAR,
                        used_at TIMESTAMP
                    )
                """))
            else:
                conn.execute(text("""
                    CREATE TABLE IF NOT EXISTS beta_codes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        code TEXT UNIQUE NOT NULL,
                        is_used BOOLEAN DEFAULT FALSE,
                        used_by_email TEXT,
                        used_at DATETIME
                    )
                """))
            existing = set()
            print("[SUCCESS] Table beta_codes created/verified.")

        # Insert new codes
        inserted = 0
        for c in codes:
            if c not in existing:
                conn.execute(text("""
                    INSERT INTO beta_codes (code, is_used, used_by_email, used_at)
                    VALUES (:code, :is_used, :used_by_email, :used_at)
                """), {"code": c, "is_used": False, "used_by_email": None, "used_at": None})
                inserted += 1
        print(f"[SUCCESS] Inserted {inserted} new codes!")

    # Fetch unused codes for output
    with engine.begin() as conn:
        result = conn.execute(text("SELECT code FROM beta_codes WHERE is_used = FALSE LIMIT 50")).fetchall()
        unused_codes = [row[0] for row in result]

    # Write files
    for path in ["codigos_autorizacion.txt", "../codigos_autorizacion.txt"]:
        abs_path = os.path.abspath(path)
        with open(abs_path, "w", encoding="utf-8") as f:
            f.write("=====================================================\n")
            f.write("      ONIXLINGO - CODIGOS DE ACCESO INSTITUCIONAL    \n")
            f.write(f"      Generados el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=====================================================\n")
            f.write("Estos codigos son OBLIGATORIOS tanto para registrarse\n")
            f.write("como para autorizar el inicio de sesion.\n")
            f.write("Una vez utilizado por un usuario, quedara vinculado\n")
            f.write("a su correo electronico.\n")
            f.write("-----------------------------------------------------\n\n")
            for idx, c in enumerate(unused_codes, 1):
                f.write(f"{idx:02d}. {c}\n")
        print(f"[SUCCESS] Written codes to: {abs_path}")

except Exception as e:
    print(f"[ERROR] Transaction failed: {e}")
