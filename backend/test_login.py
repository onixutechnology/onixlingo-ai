import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.db.models import User
from app.core.security import verify_password

def test_login(email, password):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"[{email}] ❌ Usuario no encontrado en BD")
            return
            
        print(f"[{email}] ✅ Usuario encontrado. Hash en BD: {user.hashed_password[:15]}...")
        
        is_valid = verify_password(password, user.hashed_password)
        if is_valid:
            print(f"[{email}] ✅ CONTRASEÑA CORRECTA")
        else:
            print(f"[{email}] ❌ CONTRASEÑA INCORRECTA")
            
    finally:
        db.close()

if __name__ == "__main__":
    test_login("j2022eico2@gmail.com", "Jacob12345")
    test_login("moralesmorenojacob0@gmail.com", "Jacob12345")
    test_login("onixutechnology@gmail.com", "Onixuad9.87mi-n")
