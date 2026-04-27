import enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import relationship
from app.db.base import Base

# --- ENUMS ---
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
    
    # 🔥 Sistema de Suscripciones y Stripe
    is_pro = Column(Boolean, default=False) 
    tier = Column(String, default="free") 
    valid_until = Column(DateTime(timezone=True), nullable=True) 
    stripe_customer_id = Column(String, unique=True, index=True, nullable=True) 
    
    # 🔥 Sistema de Referidos
    referral_code = Column(String, unique=True, index=True, nullable=True) 

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relaciones
    progress = relationship("Progress", back_populates="owner", cascade="all, delete-orphan")
    achievements = relationship("UserAchievement", back_populates="user", cascade="all, delete-orphan")
    chess_progress = relationship("ChessProgress", back_populates="user", cascade="all, delete-orphan")


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(String, index=True, nullable=False)
    lesson_type = Column(String, default="standard") 
    
    # 🌍 NUEVO: Idioma del progreso (en, fr, zh)
    language = Column(String, default="en", index=True)

    stars = Column(Integer, default=0)
    score = Column(Integer, default=0)
    current_step = Column(Integer, default=0)
    total_steps = Column(Integer, default=1)
    status = Column(String, default="locked") 
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    owner = relationship("User", back_populates="progress")

    @property
    def is_unlocked(self) -> bool:
        return self.status in ["active", "completed"]

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

# =====================================================================
# ♟️ MODELOS DE AJEDREZ (CHESS ACADEMY)
# =====================================================================

class ChessLesson(Base):
    __tablename__ = "chess_lessons"

    id = Column(String, primary_key=True, index=True)
    module_id = Column(String, index=True, nullable=False) 
    title = Column(String, nullable=False)
    instruction = Column(Text, nullable=False)
    fen = Column(String, nullable=False) 
    solution = Column(String, nullable=False) 
    hint = Column(Text)
    explanation = Column(Text)

class ChessProgress(Base):
    __tablename__ = "chess_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(String, ForeignKey("chess_lessons.id"), nullable=False)
    
    # 🌍 NUEVO: Idioma del progreso de ajedrez
    language = Column(String, default="en", index=True)

    status = Column(String, default="completed")
    earned_xp = Column(Integer, default=25)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relación inversa
    user = relationship("User", back_populates="chess_progress")