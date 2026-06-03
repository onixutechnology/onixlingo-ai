import os
import sys
from app.database import get_db
from app.db.models import User, BetaCode

def delete_google_users():
    db = next(get_db())
    
    print("Buscando usuarios de Google...")
    google_users = db.query(User).filter(User.hashed_password == 'OAUTH_LOGIN_GOOGLE_ACCOUNT').all()
    
    if not google_users:
        print("No se encontraron usuarios de Google.")
        return

    for user in google_users:
        print(f"Eliminando usuario: {user.username} ({user.email})")
        # Eliminar el beta code asociado si es de google
        if user.beta_code and user.beta_code.startswith("GOOGLE-OAUTH-"):
            beta_code = db.query(BetaCode).filter(BetaCode.code == user.beta_code).first()
            if beta_code:
                db.delete(beta_code)
        
        db.delete(user)
    
    db.commit()
    print("Usuarios de Google eliminados correctamente.")

if __name__ == "__main__":
    delete_google_users()
