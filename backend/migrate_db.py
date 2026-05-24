import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Cargar variables de entorno desde el archivo .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("❌ No se encontró DATABASE_URL en el archivo .env")
    exit(1)

# Corregir prefijo postgres:// a postgresql:// para SQLAlchemy
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

print(f"Conectando a la base de datos...")
engine = create_engine(DATABASE_URL)

commands = [
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS country_code VARCHAR DEFAULT 'MX'",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS chess_elo INTEGER DEFAULT 1200",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS chess_tactical_elo INTEGER DEFAULT 800",
    "ALTER TABLE users ADD COLUMN IF NOT EXISTS beta_code VARCHAR",
    "ALTER TABLE progress ADD COLUMN IF NOT EXISTS difficulty_completed VARCHAR DEFAULT 'easy'",
    "ALTER TABLE progress ADD COLUMN IF NOT EXISTS tickets_earned INTEGER DEFAULT 1"
]

with engine.connect() as conn:
    for cmd in commands:
        try:
            print(f"Ejecutando: {cmd}")
            conn.execute(text(cmd))
            conn.commit()
            print("Exito")
        except Exception as e:
            print(f"Error: {e}")
