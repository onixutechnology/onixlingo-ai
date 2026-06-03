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
    
    # 🔥 Sistema de Verificación Beta
    beta_code = Column(String, nullable=True) 
    
    # 🔥 Sistema de Suscripciones (Ahora con Paddle)
    is_pro = Column(Boolean, default=False) 
    tier = Column(String, default="free") 
    valid_until = Column(DateTime(timezone=True), nullable=True) 
    paddle_customer_id = Column(String, unique=True, index=True, nullable=True) 
    paddle_subscription_id = Column(String, unique=True, index=True, nullable=True)
    
    # 🔥 Sistema de Referidos
    referral_code = Column(String, unique=True, index=True, nullable=True) 
    
    # 🔥 Identidad y Contacto
    full_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # 🔥 Gamificación: Rachas (Streaks) y Elocuencia
    streak_days = Column(Integer, default=0)
    eloquence_points = Column(Integer, default=0)
    country_code = Column(String, default="MX") # 🔥 NUEVO: Filtro por países
    chess_elo = Column(Integer, default=1200, nullable=False)
    chess_tactical_elo = Column(Integer, default=800, nullable=False)
    last_activity_at = Column(DateTime(timezone=True), nullable=True)

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
    difficulty_completed = Column(String, default="easy")
    tickets_earned = Column(Integer, default=1)
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

# =====================================================================
# ♟️ PvP CHESS PERSISTENCE
# =====================================================================

class ChessMatch(Base):
    __tablename__ = "chess_matches"

    id = Column(String, primary_key=True, index=True)
    white_player_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    black_player_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    current_fen = Column(String, default="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
    status = Column(String, default="active") # active, completed, draw
    winner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    white_time_ms = Column(Integer, default=600000) # 10 min
    black_time_ms = Column(Integer, default=600000)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ChessMove(Base):
    __tablename__ = "chess_moves"

    id = Column(Integer, primary_key=True, index=True)
    match_id = Column(String, ForeignKey("chess_matches.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    move_san = Column(String, nullable=False)
    move_uci = Column(String, nullable=False)
    fen_after = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class MatchmakingQueue(Base):
    __tablename__ = "matchmaking_queue"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    time_control = Column(String, nullable=False)  # bullet, blitz, rapid, classical
    elo_rating = Column(Integer, nullable=False)
    elo_range = Column(Integer, default=100)
    queued_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", foreign_keys=[user_id])


class PromoCoupon(Base):
    __tablename__ = "promo_coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    used_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    used_at = Column(DateTime(timezone=True), nullable=True)


class BetaCode(Base):
    __tablename__ = "beta_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    used_by_email = Column(String, nullable=True)
    used_at = Column(DateTime(timezone=True), nullable=True)


class SpeechPracticeLog(Base):
    __tablename__ = "speech_practice_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ExamAttempt(Base):
    __tablename__ = "exam_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exam_id = Column(String, index=True, nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    finished_at = Column(DateTime(timezone=True), nullable=True)
    score = Column(Integer, default=0)
    time_limit_seconds = Column(Integer, default=7200) 
    status = Column(String, default="active") # active, completed, expired

    user = relationship("User")

