# app/models/cms_legal_models.py
import uuid, enum
from sqlalchemy import (Column, String, Integer, Float, Boolean, DateTime,
    Text, ForeignKey, Enum as SAEnum, JSON, SmallInteger, UniqueConstraint, Index)
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


# ─────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────

class CourseLanguage(str, enum.Enum):
    ENGLISH = "en"; FRENCH = "fr"; CHINESE = "zh"
    CHESS   = "chess"   # Chess Academy "language"

class CourseDifficulty(str, enum.Enum):
    BEGINNER     = "beginner"
    ELEMENTARY   = "elementary"
    INTERMEDIATE = "intermediate"
    UPPER_INT    = "upper_intermediate"
    ADVANCED     = "advanced"
    MASTER       = "master"

class LessonType(str, enum.Enum):
    VIDEO        = "video"
    READING      = "reading"
    AUDIO        = "audio"
    QUIZ         = "quiz"
    SPEAKING     = "speaking"      # pronunciation exercise
    FLASHCARD    = "flashcard"     # SRS session
    CHESS_PUZZLE = "chess_puzzle"

class GDPRRequestType(str, enum.Enum):
    ERASURE          = "erasure"           # Right to be forgotten
    PORTABILITY      = "portability"       # Data export
    RECTIFICATION    = "rectification"     # Correct inaccurate data
    RESTRICTION      = "restriction"       # Restrict processing
    ACCESS           = "access"            # Data subject access request

class GDPRRequestStatus(str, enum.Enum):
    PENDING    = "pending"
    IN_REVIEW  = "in_review"
    COMPLETED  = "completed"
    REJECTED   = "rejected"

class PIIFieldType(str, enum.Enum):
    PHONE_NUMBER   = "phone_number"
    HOME_ADDRESS   = "home_address"
    NATIONAL_ID    = "national_id"
    TAX_ID         = "tax_id"
    PASSPORT       = "passport"
    BANK_ACCOUNT   = "bank_account"


# ─────────────────────────────────────────
# 1. COURSE
# ─────────────────────────────────────────

class Course(Base):
    __tablename__ = "courses"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug            = Column(String(128), unique=True, nullable=False, index=True)
    title           = Column(String(255), nullable=False)
    description     = Column(Text, nullable=True)
    language        = Column(SAEnum(CourseLanguage), nullable=False, index=True)
    difficulty      = Column(SAEnum(CourseDifficulty), nullable=False, index=True)
    cover_image_url = Column(String(512), nullable=True)
    promo_video_url = Column(String(512), nullable=True)
    cefr_target     = Column(String(4), nullable=True)       # "B2", "C1", etc.
    is_published    = Column(Boolean, default=False, index=True)
    is_premium      = Column(Boolean, default=True,  index=True)
    sort_order      = Column(SmallInteger, default=0)
    total_xp        = Column(Integer, default=0)             # sum of all lesson XP rewards
    metadata_json   = Column(JSON, default={})               # tags, exam_alignment, etc.
    created_by_id   = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    created_by = relationship("User", foreign_keys=[created_by_id])
    modules    = relationship("Module", back_populates="course",
                              cascade="all, delete-orphan", order_by="Module.sort_order")

    __table_args__ = (
        Index("ix_course_lang_diff",    "language", "difficulty"),
        Index("ix_course_lang_pub",     "language", "is_published"),
    )


# ─────────────────────────────────────────
# 2. MODULE
# ─────────────────────────────────────────

class Module(Base):
    __tablename__ = "modules"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    course_id   = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    sort_order  = Column(SmallInteger, default=0, index=True)
    is_locked   = Column(Boolean, default=False)     # locked until previous module completed
    xp_bonus    = Column(Integer, default=0)         # bonus XP for completing entire module
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    course   = relationship("Course", back_populates="modules")
    lessons  = relationship("Lesson", back_populates="module",
                            cascade="all, delete-orphan", order_by="Lesson.sort_order")

    __table_args__ = (
        UniqueConstraint("course_id", "sort_order", name="uq_module_course_order"),
    )


# ─────────────────────────────────────────
# 3. LESSON
# ─────────────────────────────────────────

class Lesson(Base):
    __tablename__ = "lessons"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    module_id        = Column(UUID(as_uuid=True), ForeignKey("modules.id", ondelete="CASCADE"), nullable=False, index=True)
    title            = Column(String(255), nullable=False)
    lesson_type      = Column(SAEnum(LessonType), nullable=False, index=True)
    sort_order       = Column(SmallInteger, default=0, index=True)
    duration_seconds = Column(Integer, nullable=True)
    xp_reward        = Column(Integer, default=10)
    is_published     = Column(Boolean, default=False, index=True)
    is_free_preview  = Column(Boolean, default=False, index=True)
    # Content storage
    content_json     = Column(JSON, default={})       # slides, questions, puzzle FEN, etc.
    video_url        = Column(String(512), nullable=True)
    audio_url        = Column(String(512), nullable=True)
    transcript       = Column(Text, nullable=True)
    # Metadata
    passing_score    = Column(Float, nullable=True)   # for quiz type (0–100)
    max_attempts     = Column(SmallInteger, nullable=True)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())

    module        = relationship("Module", back_populates="lessons")
    prerequisites = relationship("LessonPrerequisite",
                                 foreign_keys="LessonPrerequisite.lesson_id",
                                 back_populates="lesson",
                                 cascade="all, delete-orphan")
    dropouts      = relationship("LessonDropout", back_populates="lesson", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("module_id", "sort_order", name="uq_lesson_module_order"),
        Index("ix_lesson_type_pub", "lesson_type", "is_published"),
    )


# ─────────────────────────────────────────
# 4. LESSON PREREQUISITES
# ─────────────────────────────────────────

class LessonPrerequisite(Base):
    """
    DAG edge: lesson_id cannot be started until required_lesson_id
    has been completed with a score >= min_passing_score.
    """
    __tablename__ = "lesson_prerequisites"

    id                 = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    lesson_id          = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"),
                                nullable=False, index=True)
    required_lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"),
                                nullable=False, index=True)
    min_passing_score  = Column(Float, nullable=True)   # NULL = just completion required
    created_at         = Column(DateTime(timezone=True), server_default=func.now())

    lesson          = relationship("Lesson", foreign_keys=[lesson_id],          back_populates="prerequisites")
    required_lesson = relationship("Lesson", foreign_keys=[required_lesson_id])

    __table_args__ = (
        UniqueConstraint("lesson_id", "required_lesson_id", name="uq_lesson_prereq"),
    )


# ─────────────────────────────────────────
# 5. GDPR DELETION REQUESTS
# ─────────────────────────────────────────

class GDPRDeletionRequest(Base):
    """
    Tracks all GDPR data subject requests.
    Erasure requests trigger a background job that anonymizes the user record
    and purges linked PII within 30 days per GDPR Art. 17.
    """
    __tablename__ = "gdpr_deletion_requests"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
                             nullable=True, index=True)   # nullable: user may already be deleted
    request_type    = Column(SAEnum(GDPRRequestType), nullable=False, index=True)
    status          = Column(SAEnum(GDPRRequestStatus), nullable=False,
                             default=GDPRRequestStatus.PENDING, index=True)
    requester_email = Column(String(320), nullable=False)   # kept for audit even post-erasure
    reason          = Column(Text, nullable=True)
    handled_by_id   = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
                             nullable=True, index=True)   # staff member
    due_date        = Column(DateTime(timezone=True), nullable=False, index=True)   # request_date + 30 days
    completed_at    = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(Text, nullable=True)
    export_url      = Column(String(512), nullable=True)    # signed S3 URL for portability requests
    audit_log       = Column(JSON, default=[])              # [{timestamp, action, actor}]
    created_at      = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    user       = relationship("User", foreign_keys=[user_id])
    handled_by = relationship("User", foreign_keys=[handled_by_id])

    __table_args__ = (
        Index("ix_gdpr_status_due",  "status", "due_date"),
        Index("ix_gdpr_type_status", "request_type", "status"),
    )


# ─────────────────────────────────────────
# 6. LOGIN HISTORY
# ─────────────────────────────────────────

class LoginHistory(Base):
    """
    Security audit trail for every authentication event.
    Retained for 12 months then purged by a scheduled job.
    """
    __tablename__ = "login_history"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
                          nullable=False, index=True)
    ip_address   = Column(INET, nullable=True)
    user_agent   = Column(String(512), nullable=True)
    device_type  = Column(String(32), nullable=True)         # "mobile","desktop","tablet"
    os           = Column(String(64), nullable=True)
    browser      = Column(String(64), nullable=True)
    country_code = Column(String(4), nullable=True, index=True)
    city         = Column(String(128), nullable=True)
    success      = Column(Boolean, nullable=False, default=True, index=True)
    failure_reason = Column(String(128), nullable=True)      # "bad_password","2fa_failed","account_locked"
    auth_method  = Column(String(32), default="password")    # "password","google_oauth","magic_link"
    session_token_hash = Column(String(128), nullable=True)  # bcrypt of JWT jti (for revocation)
    logged_in_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    logged_out_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_login_user_date",    "user_id", "logged_in_at"),
        Index("ix_login_ip_success",   "ip_address", "success"),
        Index("ix_login_country_date", "country_code", "logged_in_at"),
    )


# ─────────────────────────────────────────
# 7. ENCRYPTED PII
# ─────────────────────────────────────────

class EncryptedPII(Base):
    """
    Stores sensitive user data encrypted at the application layer
    (e.g. AES-256-GCM via cryptography.fernet or AWS KMS).

    The `ciphertext` column holds the encrypted blob; the plaintext is
    NEVER stored. Decryption happens in-process only when explicitly
    requested (e.g. for tax or billing compliance).

    One row per field type per user — simplifies targeted erasure for GDPR.
    """
    __tablename__ = "encrypted_pii"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
                             nullable=False, index=True)
    field_type      = Column(SAEnum(PIIFieldType), nullable=False, index=True)
    ciphertext      = Column(Text, nullable=False)           # base64-encoded encrypted blob
    key_version     = Column(String(64), nullable=False)     # KMS key alias + version, e.g. "kms/v3"
    iv_b64          = Column(String(64), nullable=True)      # initialization vector (if not embedded)
    is_verified     = Column(Boolean, default=False)         # e.g. phone OTP-verified
    last_accessed_at = Column(DateTime(timezone=True), nullable=True)   # audit: when was it decrypted?
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        UniqueConstraint("user_id", "field_type", name="uq_encrypted_pii_user_field"),
        Index("ix_pii_key_version", "key_version"),   # for bulk re-encryption on key rotation
    )
