# app/models/ai_learning_models.py

import uuid
import enum
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text,
    ForeignKey, Enum as SAEnum, JSON, SmallInteger, Index, UniqueConstraint
)
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


# ─────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────

class SupportedLanguage(str, enum.Enum):
    ENGLISH = "en"
    FRENCH  = "fr"
    CHINESE = "zh"

class CEFRLevel(str, enum.Enum):
    A1 = "A1"; A2 = "A2"
    B1 = "B1"; B2 = "B2"
    C1 = "C1"; C2 = "C2"

class SRSCardType(str, enum.Enum):
    VOCABULARY   = "vocabulary"
    GRAMMAR_RULE = "grammar_rule"
    PHRASE       = "phrase"
    KANJI        = "kanji"    # reused for Hanzi (Chinese characters)
    TONE_PAIR    = "tone_pair"

class ExamType(str, enum.Enum):
    TOEIC     = "toeic"
    TOEFL_IBT = "toefl_ibt"
    DELF      = "delf"
    HSK       = "hsk"

class MessageRole(str, enum.Enum):
    USER      = "user"
    ASSISTANT = "assistant"
    SYSTEM    = "system"


# ─────────────────────────────────────────
# CHAT SESSION
# ─────────────────────────────────────────

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    language     = Column(SAEnum(SupportedLanguage), nullable=False, index=True)
    title        = Column(String(255), nullable=True)
    context_json = Column(JSON, default={})      # lesson context, topic, scenario
    token_count  = Column(Integer, default=0)
    is_active    = Column(Boolean, default=True, index=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    closed_at    = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user     = relationship("User",        foreign_keys=[user_id])
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")

    __table_args__ = (
        Index("ix_chatsession_user_lang", "user_id", "language"),
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    session_id   = Column(UUID(as_uuid=True), ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role         = Column(SAEnum(MessageRole), nullable=False, index=True)
    content      = Column(Text, nullable=False)
    audio_url    = Column(String(512), nullable=True)    # optional TTS/STT audio
    tokens_used  = Column(SmallInteger, default=0)
    metadata_json = Column(JSON, default={})            # pronunciation scores, corrections
    created_at   = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    session = relationship("ChatSession", back_populates="messages")


# ─────────────────────────────────────────
# SPACED REPETITION (SRS)
# ─────────────────────────────────────────

class SpacedRepetitionItem(Base):
    """
    Implements SM-2 / FSRS algorithm fields.
    """
    __tablename__ = "spaced_repetition_items"

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id           = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    language          = Column(SAEnum(SupportedLanguage), nullable=False, index=True)
    card_type         = Column(SAEnum(SRSCardType), nullable=False, index=True)
    front             = Column(Text, nullable=False)   # question / word
    back              = Column(Text, nullable=False)   # answer / translation
    extra_json        = Column(JSON, default={})       # audio_url, image_url, example_sentence
    # SM-2 fields
    ease_factor       = Column(Float, default=2.5)
    interval_days     = Column(Integer, default=1)
    repetitions       = Column(Integer, default=0)
    due_at            = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    last_reviewed_at  = Column(DateTime(timezone=True), nullable=True)
    is_suspended      = Column(Boolean, default=False, index=True)
    created_at        = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_srs_user_due", "user_id", "due_at"),
        Index("ix_srs_user_lang_type", "user_id", "language", "card_type"),
    )


# ─────────────────────────────────────────
# PRONUNCIATION EVALUATION
# ─────────────────────────────────────────

class PronunciationEvaluation(Base):
    __tablename__ = "pronunciation_evaluations"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    language        = Column(SAEnum(SupportedLanguage), nullable=False, index=True)
    reference_text  = Column(Text, nullable=False)
    audio_url       = Column(String(512), nullable=False)   # S3 / GCS path
    overall_score   = Column(Float, nullable=True)          # 0–100
    phoneme_scores  = Column(JSON, default={})              # {"p": 0.9, "æ": 0.72, ...}
    tone_scores     = Column(JSON, default={})              # Chinese tones: {"1": 0.9, ...}
    fluency_score   = Column(Float, nullable=True)
    completeness_pct = Column(Float, nullable=True)
    feedback_text   = Column(Text, nullable=True)
    model_version   = Column(String(64), default="azure-stt-v3")
    created_at      = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_proneval_user_lang", "user_id", "language"),
    )


# ─────────────────────────────────────────
# USER WEAKNESSES  (Grammar Matrix)
# ─────────────────────────────────────────

class UserWeakness(Base):
    """
    AI-generated weakness matrix refreshed after every mock exam or
    after N chat sessions. Each row is one grammatical/skill category.
    """
    __tablename__ = "user_weaknesses"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    language         = Column(SAEnum(SupportedLanguage), nullable=False, index=True)
    category         = Column(String(128), nullable=False, index=True)  # "subjunctive_mood", "tones_3_4", ...
    subcategory      = Column(String(128), nullable=True)
    weakness_score   = Column(Float, nullable=False, default=1.0)       # 0 = strong, 1 = very weak
    error_count      = Column(Integer, default=0)
    attempt_count    = Column(Integer, default=0)
    last_seen_at     = Column(DateTime(timezone=True), server_default=func.now())
    ai_explanation   = Column(Text, nullable=True)
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        UniqueConstraint("user_id", "language", "category", name="uq_user_weakness_category"),
        Index("ix_weakness_score", "user_id", "weakness_score"),
    )


# ─────────────────────────────────────────
# MOCK EXAM RESULT
# ─────────────────────────────────────────

class MockExamResult(Base):
    __tablename__ = "mock_exam_results"

    id                 = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id            = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    exam_type          = Column(SAEnum(ExamType), nullable=False, index=True)
    total_score        = Column(Integer, nullable=False)
    max_score          = Column(Integer, nullable=False)
    section_scores     = Column(JSON, default={})       # {"listening": 280, "reading": 330}
    percentile         = Column(Float, nullable=True)
    answers_json       = Column(JSON, default=[])       # [{q_id, chosen, correct, time_ms}]
    weaknesses_flagged = Column(JSON, default=[])       # categories identified as weak
    duration_seconds   = Column(Integer, nullable=True)
    completed_at       = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_mockexam_user_type", "user_id", "exam_type"),
    )


# ─────────────────────────────────────────
# CEFR LEVEL RECORD
# ─────────────────────────────────────────

class UserCEFRLevel(Base):
    """
    Tracks the official CEFR level per language, updated after assessments.
    """
    __tablename__ = "user_cefr_levels"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    language     = Column(SAEnum(SupportedLanguage), nullable=False, index=True)
    level        = Column(SAEnum(CEFRLevel), nullable=False, index=True)
    confidence   = Column(Float, default=1.0)       # AI confidence in placement (0–1)
    assessed_by  = Column(String(64), default="ai") # "ai" | "teacher" | "exam"
    assessed_at  = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    expires_at   = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        UniqueConstraint("user_id", "language", name="uq_user_cefr_language"),
    )
