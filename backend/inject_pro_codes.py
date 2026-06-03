# backend/inject_pro_codes.py
# Inserta 10 códigos PRO exclusivos en la base de datos
import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("[WARNING] No DATABASE_URL encontrado. Usando SQLite local.")
    DATABASE_URL = "sqlite:///./onixlingo.db"

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

# 10 códigos PRO exclusivos predefinidos
PRO_CODES = [
    "ONX-PRO-2026-ALPHA",
    "ONX-PRO-2026-BRAVO",
    "ONX-PRO-2026-DELTA",
    "ONX-PRO-2026-ECHO",
    "ONX-PRO-2026-FOXT",
    "ONX-PRO-2026-GOLF",
    "ONX-PRO-2026-HOTEL",
    "ONX-PRO-2026-INDIA",
    "ONX-PRO-2026-JULIA",
    "ONX-PRO-2026-KILO",
]

def inject_pro_codes():
    inserted = []
    skipped = []

    with engine.connect() as conn:
        for code in PRO_CODES:
            try:
                # Verificar si ya existe
                existing = conn.execute(
                    text("SELECT code FROM beta_codes WHERE code = :code"),
                    {"code": code}
                ).fetchone()

                if existing:
                    skipped.append(code)
                    print(f"[SKIP] Ya existe: {code}")
                else:
                    conn.execute(
                        text("INSERT INTO beta_codes (code, is_used, used_by_email, used_at) VALUES (:code, :used, :email, :at)"),
                        {"code": code, "used": False, "email": None, "at": None}
                    )
                    conn.commit()
                    inserted.append(code)
                    print(f"[OK]   Insertado: {code}")
            except Exception as e:
                conn.rollback()
                print(f"[ERROR] {code}: {e}")

    print(f"\n{'='*55}")
    print(f"  ONIXLINGO - CODIGOS PRO EXCLUSIVOS")
    print(f"  Generados el: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*55}")
    print(f"  Estos códigos otorgan acceso PRO completo al registro.")
    print(f"  Cada código es de un solo uso.")
    print(f"{'='*55}\n")
    for i, code in enumerate(PRO_CODES, 1):
        status = "✓ DISPONIBLE" if code in inserted else ("✓ YA EXISTIA" if code in skipped else "✗ ERROR")
        print(f"  {i:02d}. {code}  [{status}]")
    print(f"\n  Total insertados: {len(inserted)}")
    print(f"  Total omitidos (ya existían): {len(skipped)}")

if __name__ == "__main__":
    inject_pro_codes()
