from app.core.security import get_password_hash
from sqlalchemy import create_engine, text

DATABASE_URL = 'postgresql://postgres:xQLy5KXBhJniGO89DXWy9bloIaDZItsRkreCyCI9G3NKtcc1AtrfVJ3kHimXl9J9@178.104.254.28:5433/postgres'
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        with conn.begin(): # Transaction
            conn.execute(
                text("UPDATE users SET hashed_password = :h WHERE username = 'j2022eico2'"),
                {"h": get_password_hash("ExecutivePassword2026!")}
            )
            conn.execute(
                text("UPDATE users SET hashed_password = :h WHERE username = 'admin'"),
                {"h": get_password_hash("AdminPassword2026!")}
            )
        print("Contraseñas restablecidas correctamente en la base de datos PostgreSQL.")
except Exception as e:
    print(f"Error: {e}")
