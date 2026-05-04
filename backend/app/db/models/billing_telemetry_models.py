# app/models/billing_telemetry_models.py
import uuid, enum
from sqlalchemy import (Column, String, Integer, Float, Boolean, DateTime,
    Text, ForeignKey, Enum as SAEnum, JSON, BigInteger, UniqueConstraint, Index)
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


class SubscriptionStatus(str, enum.Enum):
    ACTIVE    = "active"
    TRIALING  = "trialing"
    PAST_DUE  = "past_due"
    CANCELED  = "canceled"
    PAUSED    = "paused"

class InvoiceStatus(str, enum.Enum):
    DRAFT  = "draft"
    ISSUED = "issued"
    PAID   = "paid"
    VOID   = "void"

class WebhookEventType(str, enum.Enum):
    SUBSCRIPTION_CREATED  = "subscription.created"
    SUBSCRIPTION_UPDATED  = "subscription.updated"
    SUBSCRIPTION_CANCELED = "subscription.canceled"
    PAYMENT_SUCCEEDED     = "payment.succeeded"
    PAYMENT_FAILED        = "payment.failed"
    REFUND_CREATED        = "refund.created"

class AIProvider(str, enum.Enum):
    OPENAI    = "openai"
    ANTHROPIC = "anthropic"
    GOOGLE    = "google"
    AZURE     = "azure"


# ── 1. USER BILLING PROFILE ──────────────────
# 1-to-1 extension of `users`. Keeps billing concerns isolated.

class UserBillingProfile(Base):
    __tablename__ = "user_billing_profiles"

    id                      = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id                 = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
                                     unique=True, nullable=False, index=True)
    paddle_customer_id      = Column(String(128), unique=True, nullable=True, index=True)
    paddle_subscription_id  = Column(String(128), unique=True, nullable=True, index=True)
    subscription_status     = Column(SAEnum(SubscriptionStatus), nullable=True, index=True)
    plan_id                 = Column(String(128), nullable=True)
    trial_ends_at           = Column(DateTime(timezone=True), nullable=True, index=True)
    current_period_start    = Column(DateTime(timezone=True), nullable=True)
    current_period_end      = Column(DateTime(timezone=True), nullable=True, index=True)
    cancel_at_period_end    = Column(Boolean, default=False)
    affiliate_code          = Column(String(64), unique=True, nullable=True, index=True)
    referred_by_user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
                                     nullable=True, index=True)
    created_at              = Column(DateTime(timezone=True), server_default=func.now())
    updated_at              = Column(DateTime(timezone=True), onupdate=func.now())

    user        = relationship("User", foreign_keys=[user_id], back_populates="billing_profile")
    referred_by = relationship("User", foreign_keys=[referred_by_user_id])
    invoices    = relationship("Invoice",       back_populates="billing_profile", cascade="all, delete-orphan")
    payouts     = relationship("AffiliatePayout", back_populates="billing_profile", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_billing_paddle_sub", "paddle_subscription_id", "subscription_status"),
    )


# ── 2. INVOICES ──────────────────────────────

class Invoice(Base):
    __tablename__ = "invoices"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    billing_profile_id  = Column(UUID(as_uuid=True), ForeignKey("user_billing_profiles.id", ondelete="CASCADE"),
                                 nullable=False, index=True)
    paddle_invoice_id   = Column(String(128), unique=True, nullable=True, index=True)
    amount_usd          = Column(Float, nullable=False)
    tax_usd             = Column(Float, default=0.0)
    currency            = Column(String(10), default="USD")
    status              = Column(SAEnum(InvoiceStatus), nullable=False, default=InvoiceStatus.DRAFT, index=True)
    pdf_url             = Column(String(512), nullable=True)
    line_items          = Column(JSON, default=[])   # [{description, amount, qty}]
    period_start        = Column(DateTime(timezone=True), nullable=True)
    period_end          = Column(DateTime(timezone=True), nullable=True)
    paid_at             = Column(DateTime(timezone=True), nullable=True)
    created_at          = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    billing_profile = relationship("UserBillingProfile", back_populates="invoices")

    __table_args__ = (Index("ix_invoice_status_date", "status", "created_at"),)


# ── 3. PADDLE WEBHOOK LOGS ───────────────────

class PaddleWebhookLog(Base):
    __tablename__ = "paddle_webhook_logs"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    event_id       = Column(String(128), unique=True, nullable=False, index=True)  # Paddle's event_id
    event_type     = Column(SAEnum(WebhookEventType), nullable=False, index=True)
    payload        = Column(JSON, nullable=False)
    signature_valid = Column(Boolean, nullable=False, default=False)
    processed      = Column(Boolean, default=False, index=True)
    error_message  = Column(Text, nullable=True)
    received_at    = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    processed_at   = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (Index("ix_webhook_type_processed", "event_type", "processed"),)


# ── 4. AI TOKENS USAGE ───────────────────────

class AITokensUsage(Base):
    """
    Per-request token accounting. Aggregated by a Celery task
    into UserBillingProfile for rate-limit enforcement.
    """
    __tablename__ = "ai_tokens_usage"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"),
                             nullable=False, index=True)
    provider        = Column(SAEnum(AIProvider), nullable=False, index=True)
    model_name      = Column(String(64), nullable=False)   # "gpt-4o", "claude-3-5-sonnet", ...
    feature         = Column(String(64), nullable=False, index=True)  # "chat_tutor","pronunciation","srs_gen"
    prompt_tokens   = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens    = Column(Integer, default=0)
    cost_usd        = Column(Float, default=0.0)
    latency_ms      = Column(Integer, nullable=True)
    session_id      = Column(UUID(as_uuid=True), nullable=True, index=True)  # optional ChatSession ref
    created_at      = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_ai_tokens_user_date",    "user_id", "created_at"),
        Index("ix_ai_tokens_feature_date", "feature", "created_at"),
    )


# ── 5. AFFILIATE PAYOUTS ─────────────────────

class AffiliatePayout(Base):
    __tablename__ = "affiliate_payouts"

    id                  = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    billing_profile_id  = Column(UUID(as_uuid=True), ForeignKey("user_billing_profiles.id", ondelete="CASCADE"),
                                 nullable=False, index=True)
    referred_user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
                                 nullable=True, index=True)
    commission_usd      = Column(Float, nullable=False)
    commission_pct      = Column(Float, default=20.0)   # percentage of referred plan
    source_invoice_id   = Column(UUID(as_uuid=True), ForeignKey("invoices.id", ondelete="SET NULL"),
                                 nullable=True, index=True)
    is_paid             = Column(Boolean, default=False, index=True)
    paid_at             = Column(DateTime(timezone=True), nullable=True)
    payout_method       = Column(String(64), nullable=True)   # "paddle_transfer","wise","crypto"
    created_at          = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    billing_profile = relationship("UserBillingProfile", back_populates="payouts")
    referred_user   = relationship("User",    foreign_keys=[referred_user_id])
    source_invoice  = relationship("Invoice", foreign_keys=[source_invoice_id])

    __table_args__ = (Index("ix_payout_paid", "is_paid", "created_at"),)


# ── 6. UX CLICK EVENTS ───────────────────────

class UXClickEvent(Base):
    """
    Lightweight front-end telemetry. Batched inserts via a queue.
    Used for heatmaps and funnel analysis.
    """
    __tablename__ = "ux_click_events"

    id           = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
                          nullable=True, index=True)
    session_key  = Column(String(64), nullable=True, index=True)   # anonymous session
    page_path    = Column(String(512), nullable=False, index=True)
    element_id   = Column(String(256), nullable=True, index=True)
    element_tag  = Column(String(64),  nullable=True)
    x_pct        = Column(Float, nullable=True)   # % of viewport width
    y_pct        = Column(Float, nullable=True)   # % of viewport height
    viewport_w   = Column(Integer, nullable=True)
    viewport_h   = Column(Integer, nullable=True)
    user_agent   = Column(String(512), nullable=True)
    ip_address   = Column(INET, nullable=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    __table_args__ = (
        Index("ix_click_page_date",    "page_path", "created_at"),
        Index("ix_click_element_date", "element_id", "created_at"),
    )


# ── 7. LESSON DROPOUTS ───────────────────────

class LessonDropout(Base):
    """
    Records the exact second a user abandoned a lesson.
    Powers "resume lesson" prompts and content-quality signals.
    """
    __tablename__ = "lesson_dropouts"

    id               = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id          = Column(UUID(as_uuid=True), ForeignKey("users.id",   ondelete="CASCADE"), nullable=False, index=True)
    lesson_id        = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    dropout_second   = Column(Integer, nullable=False)       # second in the lesson timeline
    lesson_duration  = Column(Integer, nullable=True)        # total lesson seconds
    completion_pct   = Column(Float, nullable=True)
    last_slide_index = Column(Integer, nullable=True)
    device_type      = Column(String(32), nullable=True)     # "mobile","desktop","tablet"
    reason_code      = Column(String(64), nullable=True)     # "app_backgrounded","error","voluntary"
    created_at       = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user   = relationship("User",   foreign_keys=[user_id])
    lesson = relationship("Lesson", foreign_keys=[lesson_id])

    __table_args__ = (
        Index("ix_dropout_lesson_date", "lesson_id", "created_at"),
        Index("ix_dropout_user_lesson", "user_id",   "lesson_id"),
    )


# ── 8. CLIENT CRASH LOGS ─────────────────────

class ClientCrashLog(Base):
    """
    Frontend error boundary + unhandledrejection reports.
    Sent automatically from the Next.js error boundary component.
    """
    __tablename__ = "client_crash_logs"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id       = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"),
                           nullable=True, index=True)
    error_type    = Column(String(128), nullable=False, index=True)   # "TypeError","ChunkLoadError", ...
    error_message = Column(Text, nullable=False)
    stack_trace   = Column(Text, nullable=True)
    component_stack = Column(Text, nullable=True)
    page_path     = Column(String(512), nullable=True, index=True)
    app_version   = Column(String(32),  nullable=True, index=True)
    browser       = Column(String(128), nullable=True)
    os            = Column(String(128), nullable=True)
    extra_context = Column(JSON, default={})    # Redux state snapshot, feature flags, etc.
    resolved      = Column(Boolean, default=False, index=True)
    created_at    = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", foreign_keys=[user_id])

    __table_args__ = (
        Index("ix_crash_type_version", "error_type", "app_version"),
        Index("ix_crash_resolved",     "resolved",   "created_at"),
    )
