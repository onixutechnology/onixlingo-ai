from app.core.security import verify_password
from sqlalchemy import create_engine, text

DATABASE_URL = 'postgresql://postgres:xQLy5KXBhJniGO89DXWy9bloIaDZItsRkreCyCI9G3NKtcc1AtrfVJ3kHimXl9J9@178.104.254.28:5433/postgres'
engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        result = conn.execute(text("SELECT hashed_password FROM users WHERE username='j2022eico2'"))
        row = result.fetchone()
        if row:
            hash_val = row[0]
            print('Hash in DB:', hash_val)
            print('Verifies with ExecutivePassword2026! :', verify_password('ExecutivePassword2026!', hash_val))
        else:
            print("User j2022eico2 not found.")
except Exception as e:
    print(f"Error: {e}")
