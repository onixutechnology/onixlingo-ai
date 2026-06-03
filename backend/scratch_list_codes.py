import os
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

try:
    with engine.connect() as conn:
        print("--- CONEXIÓN EXITOSA ---")
        
        # 1. Listar códigos de registro no usados
        res = conn.execute(text("SELECT code FROM beta_codes WHERE is_used = False LIMIT 10"))
        codes = [row[0] for row in res.fetchall()]
        print("\nCodigos beta de registro no usados (Top 10):")
        for i, c in enumerate(codes, 1):
            print(f"  {i}. {c}")
            
        # 2. Listar cupones promocionales no usados
        res_coupons = conn.execute(text("SELECT code FROM promo_coupons WHERE is_used = False LIMIT 10"))
        coupons = [row[0] for row in res_coupons.fetchall()]
        print("\nCupones promocionales de 30 dias no usados (Top 10):")
        for i, c in enumerate(coupons, 1):
            print(f"  {i}. {c}")

except Exception as e:
    print(f"Error al listar códigos: {e}")
