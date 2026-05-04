# app/models/b2b_models.py

import uuid
import enum
from datetime import datetime
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text,
    ForeignKey, Enum as SAEnum, JSON, UniqueConstraint, Index
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base


# ─────────────────────────────────────────
# ENUMS
# ─────────────────────────────────────────

class CompanyPlanTier(str, enum.Enum):
    STARTER    = "starter"
    GROWTH     = "growth"
    ENTERPRISE = "enterprise"
    TITANIUM   = "titanium"

class RoleType(str, enum.Enum):
    SUPER_ADMIN      = "super_admin"
    COMPANY_MANAGER  = "company_manager"
    EMPLOYEE         = "employee"
    LEARNER          = "learner"

class LicenseStatus(str, enum.Enum):
    ACTIVE    = "active"
    EXPIRED   = "expired"
    SUSPENDED = "suspended"
    PENDING   = "pending"

class ApprovalStatus(str, enum.Enum):
    PENDING  = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


# ─────────────────────────────────────────
# COMPANY (TENANT)
# ─────────────────────────────────────────

class Company(Base):
    __tablename__ = "companies"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name           = Column(String(255), nullable=False, index=True)
    slug           = Column(String(100), unique=True, nullable=False, index=True)
    domain         = Column(String(255), unique=True, nullable=True, index=True)
    logo_url       = Column(String(512), nullable=True)
    plan_tier      = Column(SAEnum(CompanyPlanTier), nullable=False, default=CompanyPlanTier.STARTER)
    is_active      = Column(Boolean, default=True, index=True)
    max_seats      = Column(Integer, default=10)
    country_code   = Column(String(10), nullable=True)
    timezone       = Column(String(64), default="UTC")
    metadata_json  = Column(JSON, default={})
    created_at     = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at     = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    departments     = relationship("Department",      back_populates="company", cascade="all, delete-orphan")
    licenses        = relationship("CompanyLicense",  back_populates="company", cascade="all, delete-orphan")
    expense_approvals = relationship("ExpenseApproval", back_populates="company")
    analytics_cache   = relationship("CompanyAnalyticsCache", back_populates="company", uselist=False)
    mandatory_courses = relationship("MandatoryCourse", back_populates="company", cascade="all, delete-orphan")
    roles             = relationship("CompanyRole",   back_populates="company", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_company_plan_active", "plan_tier", "is_active"),
    )


# ─────────────────────────────────────────
# DEPARTMENT
# ─────────────────────────────────────────

class Department(Base):
    __tablename__ = "departments"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id  = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    name        = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    manager_id  = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    company  = relationship("Company",     back_populates="departments")
    manager  = relationship("User",        foreign_keys=[manager_id])
    members  = relationship("CompanyRole", back_populates="department")

    __table_args__ = (
        UniqueConstraint("company_id", "name", name="uq_department_company_name"),
    )


# ─────────────────────────────────────────
# COMPANY LICENSE
# ─────────────────────────────────────────

class CompanyLicense(Base):
    __tablename__ = "company_licenses"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id      = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    paddle_plan_id  = Column(String(128), nullable=True, index=True)
    seats_total     = Column(Integer, nullable=False, default=10)
    seats_used      = Column(Integer, nullable=False, default=0)
    status          = Column(SAEnum(LicenseStatus), nullable=False, default=LicenseStatus.PENDING, index=True)
    starts_at       = Column(DateTime(timezone=True), nullable=False)
    expires_at      = Column(DateTime(timezone=True), nullable=False, index=True)
    languages       = Column(JSON, default=["en"])   # e.g. ["en", "fr", "zh"]
    features_json   = Column(JSON, default={})
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    company = relationship("Company", back_populates="licenses")


# ─────────────────────────────────────────
# COMPANY ROLE  (maps User → Company + Department + Role)
# ─────────────────────────────────────────

class CompanyRole(Base):
    __tablename__ = "company_roles"

    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id    = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id       = Column(UUID(as_uuid=True), ForeignKey("users.id",    ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(UUID(as_uuid=True), ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    role          = Column(SAEnum(RoleType), nullable=False, default=RoleType.EMPLOYEE, index=True)
    is_active     = Column(Boolean, default=True, index=True)
    assigned_at   = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    company    = relationship("Company",    back_populates="roles")
    user       = relationship("User",       foreign_keys=[user_id])
    department = relationship("Department", back_populates="members")

    __table_args__ = (
        UniqueConstraint("company_id", "user_id", name="uq_company_user_role"),
        Index("ix_company_role_active", "company_id", "is_active"),
    )


# ─────────────────────────────────────────
# EXPENSE APPROVAL
# ─────────────────────────────────────────

class ExpenseApproval(Base):
    __tablename__ = "expense_approvals"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id     = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    requester_id   = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    approver_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    amount_usd     = Column(Float, nullable=False)
    description    = Column(Text, nullable=True)
    status         = Column(SAEnum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True)
    receipt_url    = Column(String(512), nullable=True)
    reviewed_at    = Column(DateTime(timezone=True), nullable=True)
    created_at     = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    company   = relationship("Company", back_populates="expense_approvals")
    requester = relationship("User", foreign_keys=[requester_id])
    approver  = relationship("User", foreign_keys=[approver_id])


# ─────────────────────────────────────────
# MANDATORY COURSE
# ─────────────────────────────────────────

class MandatoryCourse(Base):
    __tablename__ = "mandatory_courses"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id  = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), nullable=False, index=True)
    course_id   = Column(UUID(as_uuid=True), ForeignKey("courses.id",   ondelete="CASCADE"), nullable=False, index=True)
    due_date    = Column(DateTime(timezone=True), nullable=True)
    for_roles   = Column(JSON, default=["employee"])   # list of RoleType values
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    company = relationship("Company", back_populates="mandatory_courses")
    course  = relationship("Course",  foreign_keys=[course_id])

    __table_args__ = (
        UniqueConstraint("company_id", "course_id", name="uq_mandatory_course"),
    )


# ─────────────────────────────────────────
# COMPANY ANALYTICS CACHE
# ─────────────────────────────────────────

class CompanyAnalyticsCache(Base):
    """
    Denormalized snapshot updated by a background Celery task (e.g. every 6 h).
    Avoids expensive aggregations on every dashboard load.
    """
    __tablename__ = "company_analytics_cache"

    id                       = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_id               = Column(UUID(as_uuid=True), ForeignKey("companies.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    total_employees          = Column(Integer, default=0)
    active_learners_7d       = Column(Integer, default=0)
    avg_lesson_completion_pct = Column(Float,  default=0.0)
    top_weakness_categories  = Column(JSON, default=[])   # e.g. ["subjunctive", "tones_zh"]
    mandatory_completion_pct  = Column(Float, default=0.0)
    total_ai_tokens_used      = Column(Integer, default=0)
    last_refreshed_at         = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    company = relationship("Company", back_populates="analytics_cache")
