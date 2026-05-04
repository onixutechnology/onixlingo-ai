# app/schemas/domain_schemas.py
"""
Pydantic v2 — Create / Update / Response schemas for the four
critical OnixLingo domains: Matchmaking, B2B Tenant, AI Chat, GDPR.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, EmailStr, Field, field_validator


# ─────────────────────────────────────────
# SHARED BASE
# ─────────────────────────────────────────

class TimestampMixin(BaseModel):
    created_at: datetime
    updated_at: Optional[datetime] = None


# ══════════════════════════════════════════
# 1. MATCHMAKING QUEUE (Chess PvP)
# ══════════════════════════════════════════

class TimeControlLiteral(str):
    """String alias; mirrors chess_pvp_models.TimeControlType."""

VALID_TIME_CONTROLS = {"bullet", "blitz", "rapid", "classical"}


class MatchmakingQueueCreate(BaseModel):
    """Payload sent by the client to enter the matchmaking queue."""
    time_control: str = Field(
        ...,
        description="One of: bullet | blitz | rapid | classical",
        examples=["blitz"],
    )
    elo_rating: int = Field(
        ...,
        ge=100,
        le=3500,
        description="Current ELO of the requesting user for this time control.",
    )
    elo_range: int = Field(
        default=100,
        ge=50,
        le=800,
        description="Initial ±ELO search window. Expands automatically over time.",
    )

    @field_validator("time_control")
    @classmethod
    def validate_time_control(cls, v: str) -> str:
        if v not in VALID_TIME_CONTROLS:
            raise ValueError(f"time_control must be one of {VALID_TIME_CONTROLS}")
        return v


class MatchmakingQueueResponse(BaseModel):
    """Returned immediately after joining the queue."""
    id: uuid.UUID
    user_id: uuid.UUID
    time_control: str
    elo_rating: int
    elo_range: int
    queued_at: datetime
    status: str = Field(
        default="queued",
        description="queued | matched | cancelled",
    )

    model_config = {"from_attributes": True}


class MatchmakingMatchedResponse(BaseModel):
    """Pushed via WebSocket when an opponent is found."""
    match_id: uuid.UUID
    opponent_username: str
    opponent_elo: int
    your_color: str          # "white" | "black"
    time_control: str
    initial_time_sec: int
    increment_sec: int
    started_at: datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════
# 2. COMPANY — B2B TENANT
# ══════════════════════════════════════════

VALID_PLAN_TIERS = {"starter", "growth", "enterprise", "titanium"}


class CompanyCreate(BaseModel):
    """SuperAdmin or self-serve registration payload."""
    name: str = Field(..., min_length=2, max_length=255, examples=["Acme Corp"])
    slug: str = Field(
        ...,
        min_length=2,
        max_length=100,
        pattern=r"^[a-z0-9-]+$",
        description="URL-safe identifier. Lowercase letters, numbers and hyphens only.",
        examples=["acme-corp"],
    )
    domain: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Company email domain for SSO auto-join (e.g. acme.com).",
        examples=["acme.com"],
    )
    plan_tier: str = Field(default="starter", examples=["enterprise"])
    country_code: Optional[str] = Field(default=None, max_length=3, examples=["MX"])
    timezone: str = Field(default="UTC", examples=["America/Mexico_City"])
    max_seats: int = Field(default=10, ge=1, le=100_000)
    languages: List[str] = Field(
        default=["en"],
        description="Languages licensed for this tenant. Values: en | fr | zh | chess",
    )

    @field_validator("plan_tier")
    @classmethod
    def validate_plan(cls, v: str) -> str:
        if v not in VALID_PLAN_TIERS:
            raise ValueError(f"plan_tier must be one of {VALID_PLAN_TIERS}")
        return v

    @field_validator("languages")
    @classmethod
    def validate_languages(cls, v: List[str]) -> List[str]:
        allowed = {"en", "fr", "zh", "chess"}
        invalid = set(v) - allowed
        if invalid:
            raise ValueError(f"Invalid language codes: {invalid}. Allowed: {allowed}")
        return list(set(v))


class CompanyUpdate(BaseModel):
    """PATCH payload — all fields optional."""
    name: Optional[str] = Field(default=None, max_length=255)
    domain: Optional[str] = Field(default=None, max_length=255)
    plan_tier: Optional[str] = None
    country_code: Optional[str] = Field(default=None, max_length=3)
    timezone: Optional[str] = None
    max_seats: Optional[int] = Field(default=None, ge=1)
    is_active: Optional[bool] = None
    languages: Optional[List[str]] = None
    logo_url: Optional[str] = Field(default=None, max_length=512)
    metadata_json: Optional[Dict[str, Any]] = None


class CompanyResponse(TimestampMixin):
    id: uuid.UUID
    name: str
    slug: str
    domain: Optional[str]
    plan_tier: str
    is_active: bool
    max_seats: int
    country_code: Optional[str]
    timezone: str
    logo_url: Optional[str]

    model_config = {"from_attributes": True}


class CompanyDetailResponse(CompanyResponse):
    """Extended response with aggregated metrics — used in B2B dashboard."""
    total_employees: int = 0
    active_learners_7d: int = 0
    avg_lesson_completion_pct: float = 0.0
    mandatory_completion_pct: float = 0.0
    top_weakness_categories: List[str] = []
    total_ai_tokens_used: int = 0
    licenses_count: int = 0

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════
# 3. CHAT SESSION — AI TUTOR
# ══════════════════════════════════════════

VALID_LANGUAGES = {"en", "fr", "zh"}


class ChatSessionCreate(BaseModel):
    """Payload to start a new AI tutor conversation."""
    language: str = Field(
        ...,
        description="Target learning language: en | fr | zh",
        examples=["en"],
    )
    title: Optional[str] = Field(
        default=None,
        max_length=255,
        description="Optional session title shown in history sidebar.",
        examples=["Practice subjunctive mood"],
    )
    context: Optional[Dict[str, Any]] = Field(
        default=None,
        description=(
            "Optional context to pre-load the AI: "
            '{"lesson_id": "...", "topic": "past_tense", "scenario": "job_interview"}'
        ),
    )

    @field_validator("language")
    @classmethod
    def validate_language(cls, v: str) -> str:
        if v not in VALID_LANGUAGES:
            raise ValueError(f"language must be one of {VALID_LANGUAGES}")
        return v


class ChatSessionUpdate(BaseModel):
    """PATCH — only title is mutable by the user."""
    title: Optional[str] = Field(default=None, max_length=255)
    is_active: Optional[bool] = None


class ChatMessageCreate(BaseModel):
    """Single user message sent to the AI tutor."""
    content: str = Field(..., min_length=1, max_length=8_000)
    audio_url: Optional[str] = Field(
        default=None,
        max_length=512,
        description="S3/GCS URL of a recorded audio clip for pronunciation eval.",
    )


class ChatMessageResponse(BaseModel):
    id: uuid.UUID
    session_id: uuid.UUID
    role: str                           # "user" | "assistant" | "system"
    content: str
    audio_url: Optional[str]
    tokens_used: int
    metadata_json: Dict[str, Any] = {}
    created_at: datetime

    model_config = {"from_attributes": True}


class ChatSessionResponse(TimestampMixin):
    id: uuid.UUID
    user_id: uuid.UUID
    language: str
    title: Optional[str]
    token_count: int
    is_active: bool
    closed_at: Optional[datetime]
    messages: List[ChatMessageResponse] = []

    model_config = {"from_attributes": True}


class ChatSessionSummaryResponse(BaseModel):
    """Lightweight version for the session history list — no messages."""
    id: uuid.UUID
    language: str
    title: Optional[str]
    token_count: int
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════
# 4. GDPR DELETION REQUEST
# ══════════════════════════════════════════

VALID_REQUEST_TYPES = {"erasure", "portability", "rectification", "restriction", "access"}


class GDPRDeletionRequestCreate(BaseModel):
    """
    Submitted by an authenticated user from their Account Settings page,
    or by an unauthenticated individual via the public legal portal
    (in which case requester_email must match their account email).
    """
    request_type: str = Field(
        ...,
        description=(
            "erasure (Art.17) | portability (Art.20) | "
            "rectification (Art.16) | restriction (Art.18) | access (Art.15)"
        ),
        examples=["erasure"],
    )
    reason: Optional[str] = Field(
        default=None,
        max_length=2_000,
        description="Optional human-readable reason provided by the data subject.",
    )
    requester_email: EmailStr = Field(
        ...,
        description="Must match the email on file; kept for audit post-erasure.",
    )

    @field_validator("request_type")
    @classmethod
    def validate_request_type(cls, v: str) -> str:
        if v not in VALID_REQUEST_TYPES:
            raise ValueError(f"request_type must be one of {VALID_REQUEST_TYPES}")
        return v


class GDPRDeletionRequestUpdate(BaseModel):
    """Staff-only PATCH: update status or attach export URL."""
    status: Optional[str] = Field(
        default=None,
        description="in_review | completed | rejected",
    )
    rejection_reason: Optional[str] = Field(default=None, max_length=2_000)
    export_url: Optional[str] = Field(
        default=None,
        max_length=512,
        description="Pre-signed URL to the data export archive (portability requests).",
    )


class GDPRDeletionRequestResponse(BaseModel):
    id: uuid.UUID
    user_id: Optional[uuid.UUID]
    request_type: str
    status: str
    requester_email: str
    reason: Optional[str]
    due_date: datetime
    completed_at: Optional[datetime]
    rejection_reason: Optional[str]
    export_url: Optional[str]
    created_at: datetime
    updated_at: Optional[datetime]

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════
# CONVENIENCE RE-EXPORTS
# ══════════════════════════════════════════

__all__ = [
    # Matchmaking
    "MatchmakingQueueCreate",
    "MatchmakingQueueResponse",
    "MatchmakingMatchedResponse",
    # B2B
    "CompanyCreate",
    "CompanyUpdate",
    "CompanyResponse",
    "CompanyDetailResponse",
    # AI Chat
    "ChatSessionCreate",
    "ChatSessionUpdate",
    "ChatMessageCreate",
    "ChatMessageResponse",
    "ChatSessionResponse",
    "ChatSessionSummaryResponse",
    # GDPR
    "GDPRDeletionRequestCreate",
    "GDPRDeletionRequestUpdate",
    "GDPRDeletionRequestResponse",
]
