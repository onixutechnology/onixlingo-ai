import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.db.base import Base

# --- ENUMS ---
# Lo mantenemos para uso interno, pero no para la definición de la tabla
class LessonType(str, enum.Enum):
    STANDARD = "standard"
    PRO = "pro"
    VOCAB = "vocab"

# --- MODELOS ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="student")
    is_pro = Column(Boolean, default=False) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    progress = relationship("Progress", back_populates="owner", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(String, index=True, nullable=False)
    
    # 🔥 CORRECCIÓN AQUÍ: Usamos String en lugar de Enum para evitar errores de base de datos
    lesson_type = Column(String, default="standard") 

    stars = Column(Integer, default=0)
    score = Column(Integer, default=0)
    current_step = Column(Integer, default=0)
    total_steps = Column(Integer, default=1)
    status = Column(String, default="locked") 
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    owner = relationship("User", back_populates="progress")

    # ✅ EL TRUCO MAESTRO: Esta propiedad dinámica evita que la API colapse.
    # El Frontend recibirá 'is_unlocked' como si fuera una columna real.
    @property
    def is_unlocked(self) -> bool:
        return self.status in ["active", "completed"]

    # ✅ NUEVO AJUSTE: Propiedad dinámica para enviar el porcentaje que exige el Frontend
    @property
    def percentage(self) -> int:
        if self.total_steps and self.total_steps > 0:
            return int((self.current_step / self.total_steps) * 100)
        return 0


class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    achievement_code = Column(String, index=True)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="achievements")
