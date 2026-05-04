# app/models/chess_pvp_models.py
import uuid, enum
from sqlalchemy import (Column, String, Integer, Float, Boolean, DateTime,
    Text, ForeignKey, Enum as SAEnum, JSON, SmallInteger, UniqueConstraint, Index)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class TimeControlType(str, enum.Enum):
    BULLET="bullet"; BLITZ="blitz"; RAPID="rapid"; CLASSICAL="classical"

class MatchResult(str, enum.Enum):
    WHITE_WINS="1-0"; BLACK_WINS="0-1"
    DRAW="1/2-1/2"; ABORTED="aborted"; IN_PROGRESS="*"

class AnticheatSeverity(str, enum.Enum):
    INFO="info"; WARNING="warning"; CRITICAL="critical"


class ChessMatch(Base):
    __tablename__ = "chess_matches"
    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    white_player_id  = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    black_player_id  = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    time_control     = Column(SAEnum(TimeControlType), nullable=False, index=True)
    initial_time_sec = Column(Integer, nullable=False)
    increment_sec    = Column(Integer, default=0)
    result           = Column(SAEnum(MatchResult), default=MatchResult.IN_PROGRESS, index=True)
    termination      = Column(String(64), nullable=True)   # "checkmate","timeout","resign","draw_agreement"
    pgn              = Column(Text, nullable=True)
    fen_final        = Column(String(128), nullable=True)
    white_clock_ms   = Column(Integer, nullable=True)
    black_clock_ms   = Column(Integer, nullable=True)
    white_elo_before = Column(Integer, nullable=True)
    black_elo_before = Column(Integer, nullable=True)
    white_elo_delta  = Column(Integer, nullable=True)
    black_elo_delta  = Column(Integer, nullable=True)
    is_rated         = Column(Boolean, default=True, index=True)
    analysis_done    = Column(Boolean, default=False)
    started_at       = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    ended_at         = Column(DateTime(timezone=True), nullable=True)

    white_player   = relationship("User", foreign_keys=[white_player_id])
    black_player   = relationship("User", foreign_keys=[black_player_id])
    moves          = relationship("ChessMove",      back_populates="match", cascade="all, delete-orphan", order_by="ChessMove.move_number")
    spectators     = relationship("MatchSpectator", back_populates="match", cascade="all, delete-orphan")
    anticheat_logs = relationship("AntiCheatLog",   back_populates="match", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_chessmatch_players",      "white_player_id", "black_player_id"),
        Index("ix_chessmatch_result_rated", "result", "is_rated"),
    )


class ChessMove(Base):
    __tablename__ = "chess_moves"
    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id       = Column(UUID(as_uuid=True), ForeignKey("chess_matches.id", ondelete="CASCADE"), nullable=False, index=True)
    move_number    = Column(SmallInteger, nullable=False)
    color          = Column(String(5),   nullable=False)
    san            = Column(String(16),  nullable=False)
    uci            = Column(String(8),   nullable=False)
    fen_after      = Column(String(128), nullable=True)
    clock_ms_left  = Column(Integer, nullable=True)
    time_spent_ms  = Column(Integer, nullable=True)
    engine_eval    = Column(Float,   nullable=True)
    best_move_uci  = Column(String(8), nullable=True)
    classification = Column(String(20), nullable=True)   # "best","excellent","inaccuracy","blunder"
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    match = relationship("ChessMatch", back_populates="moves")
    __table_args__ = (
        UniqueConstraint("match_id","move_number","color", name="uq_move_match_number_color"),
        Index("ix_chessmove_match", "match_id", "move_number"),
    )


class EloHistory(Base):
    __tablename__ = "elo_history"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id",         ondelete="CASCADE"),  nullable=False, index=True)
    match_id     = Column(UUID(as_uuid=True), ForeignKey("chess_matches.id", ondelete="SET NULL"), nullable=True,  index=True)
    time_control = Column(SAEnum(TimeControlType), nullable=False, index=True)
    elo_before   = Column(Integer, nullable=False)
    elo_after    = Column(Integer, nullable=False)
    delta        = Column(Integer, nullable=False)
    recorded_at  = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user  = relationship("User",       foreign_keys=[user_id])
    match = relationship("ChessMatch", foreign_keys=[match_id])
    __table_args__ = (Index("ix_elo_user_tc", "user_id", "time_control"),)


class MatchSpectator(Base):
    __tablename__ = "match_spectators"
    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id  = Column(UUID(as_uuid=True), ForeignKey("chess_matches.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id   = Column(UUID(as_uuid=True), ForeignKey("users.id",         ondelete="CASCADE"), nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())
    left_at   = Column(DateTime(timezone=True), nullable=True)

    match = relationship("ChessMatch", back_populates="spectators")
    user  = relationship("User", foreign_keys=[user_id])
    __table_args__ = (UniqueConstraint("match_id","user_id", name="uq_spectator_match_user"),)


class AntiCheatLog(Base):
    __tablename__ = "anticheat_logs"
    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    match_id         = Column(UUID(as_uuid=True), ForeignKey("chess_matches.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id",         ondelete="CASCADE"), nullable=False, index=True)
    severity         = Column(SAEnum(AnticheatSeverity), nullable=False, default=AnticheatSeverity.INFO, index=True)
    engine_match_pct = Column(Float, nullable=True)
    flags_json       = Column(JSON, default={})
    reviewed         = Column(Boolean, default=False, index=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    match = relationship("ChessMatch", back_populates="anticheat_logs")
    user  = relationship("User", foreign_keys=[user_id])
    __table_args__ = (Index("ix_anticheat_sev_rev", "severity", "reviewed"),)


class MatchmakingQueue(Base):
    __tablename__ = "matchmaking_queue"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    time_control = Column(SAEnum(TimeControlType), nullable=False, index=True)
    elo_rating   = Column(Integer, nullable=False)
    elo_range    = Column(Integer, default=100)
    queued_at    = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", foreign_keys=[user_id])
