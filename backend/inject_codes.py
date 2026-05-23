# backend/inject_codes.py
import os
import random
import string
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# 1. Cargar variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("[WARNING] No se encontro DATABASE_URL en el archivo .env. Usando SQLite local.")
    DATABASE_URL = "sqlite:///./onixlingo.db"

# Corregir prefijo postgres:// a postgresql:// para SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

db_host = DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL
print(f"[INFO] Conectando a la base de datos en: {db_host}")

connect_args = {}
if "postgresql" in DATABASE_URL:
    connect_args = {"connect_timeout": 5}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

def generate_code() -> str:
    """Genera un código único en formato ONX-2026-USR-XXXX"""
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"ONX-2026-USR-{random_suffix}"

def inject():
    # 2. Generar 50 candidatos
    codes_to_inject = set()
    while len(codes_to_inject) < 50:
        candidate = generate_code()
        codes_to_inject.add(candidate)

    existing_codes = set()
    
    # 3. Conectar y leer códigos existentes en un solo lote
    with engine.connect() as conn:
        try:
            print("[INFO] Buscando codigos existentes...")
            query_check = text("SELECT code FROM beta_codes")
            result = conn.execute(query_check).fetchall()
            existing_codes = {row[0] for row in result}
            print(f"[INFO] Se encontraron {len(existing_codes)} codigos existentes en la base de datos.")
        except Exception as e:
            print(f"[WARNING] Error al consultar beta_codes: {e}. Realizando rollback e intentando crear tabla...")
            conn.rollback() # Limpiar estado de transaccion
            
            # Intentar crear la tabla
            try:
                if "postgresql" in DATABASE_URL:
                    conn.execute(text("""
                        CREATE TABLE IF NOT EXISTS beta_codes (
                            id SERIAL PRIMARY KEY,
                            code VARCHAR UNIQUE NOT NULL,
                            is_used BOOLEAN DEFAULT FALSE,
                            used_by_email VARCHAR,
                            used_at TIMESTAMP
                        );
                    """))
                else:
                    conn.execute(text("""
                        CREATE TABLE IF NOT EXISTS beta_codes (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            code TEXT UNIQUE NOT NULL,
                            is_used BOOLEAN DEFAULT FALSE,
                            used_by_email TEXT,
                            used_at DATETIME
                        );
                    """))
                conn.commit()
                print("[SUCCESS] Tabla beta_codes creada/verificada.")
            except Exception as ex:
                conn.rollback()
                print(f"[ERROR] No se pudo crear la tabla beta_codes: {ex}")

    # 4. Insertar los nuevos códigos
    inserted_count = 0
    skipped_count = 0
    final_codes = []

    with engine.connect() as conn:
        for code in codes_to_inject:
            if code not in existing_codes:
                try:
                    query_insert = text("""
                        INSERT INTO beta_codes (code, is_used, used_by_email, used_at) 
                        VALUES (:code, :is_used, :used_by_email, :used_at)
                    """)
                    conn.execute(query_insert, {
                        "code": code,
                        "is_used": False,
                        "used_by_email": None,
                        "used_at": None
                    })
                    conn.commit()
                    inserted_count += 1
                    final_codes.append(code)
                except Exception as e:
                    conn.rollback()
                    print(f"[ERROR] Fallo al insertar {code}: {e}")
            else:
                skipped_count += 1
                final_codes.append(code)

    print(f"[INFO] Inyeccion finalizada.")
    print(f"[INFO] Insertados exitosamente: {inserted_count}")
    print(f"[INFO] Omitidos (ya existian): {skipped_count}")

    # 5. Obtener los 50 códigos no utilizados para el archivo
    unused_codes = []
    try:
        with engine.connect() as conn:
            query_unused = text("SELECT code FROM beta_codes WHERE is_used = FALSE LIMIT 50")
            rows = conn.execute(query_unused).fetchall()
            unused_codes = [row[0] for row in rows]
    except Exception as e:
        print(f"[WARNING] No se pudieron leer codigos no usados: {e}")
        unused_codes = final_codes if final_codes else list(codes_to_inject)[:50]

    # 6. Escribir archivo codigos_autorizacion.txt
    paths = [
        "codigos_autorizacion.txt",
        "../codigos_autorizacion.txt"
    ]

    for path in paths:
        try:
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
            print(f"[SUCCESS] Archivo de codigos escrito en: {abs_path}")
        except Exception as e:
            print(f"[WARNING] No se pudo escribir el archivo en {path}: {e}")

if __name__ == "__main__":
    inject()
