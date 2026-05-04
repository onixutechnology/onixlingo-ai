# app/models/gamification_models.py
import uuid, enum
from sqlalchemy import (Column, String, Integer, Float, Boolean, DateTime,
    Text, ForeignKey, Enum as SAEnum, JSON, UniqueConstraint, Index)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class QuestFrequency(str, enum.Enum):
    DAILY="daily"; WEEKLY="weekly"; SEASONAL="seasonal"

class LeagueType(str, enum.Enum):
    BRONZE="bronze"; SILVER="silver"; GOLD="gold"
    PLATINUM="platinum"; DIAMOND="diamond"; MASTER="master"

class ItemType(str, enum.Enum):
    BOARD_SKIN="board_skin"; AVATAR_FRAME="avatar_frame"
    TITLE="title"; EMOJI_SET="emoji_set"; PIECE_SET="piece_set"

class FriendStatus(str, enum.Enum):
    PENDING="pending"; ACCEPTED="accepted"; BLOCKED="blocked"


# ── QUESTS ───────────────────────────────────

class DailyQuest(Base):
    __tablename__ = "daily_quests"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    frequency   = Column(SAEnum(QuestFrequency), nullable=False, default=QuestFrequency.DAILY, index=True)
    xp_reward   = Column(Integer, default=50)
    gem_reward  = Column(Integer, default=0)
    requirement = Column(JSON, default={})   # {"type":"complete_lessons","count":3}
    language    = Column(String(5), nullable=True)
    is_active   = Column(Boolean, default=True, index=True)
    valid_from  = Column(DateTime(timezone=True), nullable=True)
    valid_until = Column(DateTime(timezone=True), nullable=True, index=True)

    progress = relationship("QuestProgress", back_populates="quest", cascade="all, delete-orphan")


class QuestProgress(Base):
    __tablename__ = "quest_progress"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(UUID(as_uuid=True), ForeignKey("users.id",       ondelete="CASCADE"), nullable=False, index=True)
    quest_id     = Column(UUID(as_uuid=True), ForeignKey("daily_quests.id",ondelete="CASCADE"), nullable=False, index=True)
    current_val  = Column(Integer, default=0)
    target_val   = Column(Integer, nullable=False)
    completed    = Column(Boolean, default=False, index=True)
    claimed      = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at   = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user  = relationship("User",       foreign_keys=[user_id])
    quest = relationship("DailyQuest", back_populates="progress")
    __table_args__ = (UniqueConstraint("user_id","quest_id", name="uq_quest_progress"),)


# ── LEAGUES & LEADERBOARDS ───────────────────

class League(Base):
    __tablename__ = "leagues"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(128), nullable=False)
    tier        = Column(SAEnum(LeagueType), nullable=False, index=True)
    season_slug = Column(String(64), nullable=False, index=True)
    starts_at   = Column(DateTime(timezone=True), nullable=False)
    ends_at     = Column(DateTime(timezone=True), nullable=False, index=True)
    max_members = Column(Integer, default=30)

    members = relationship("LeagueMember", back_populates="league", cascade="all, delete-orphan")


class LeagueMember(Base):
    __tablename__ = "league_members"
    id        = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    league_id = Column(UUID(as_uuid=True), ForeignKey("leagues.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id   = Column(UUID(as_uuid=True), ForeignKey("users.id",   ondelete="CASCADE"), nullable=False, index=True)
    xp_earned = Column(Integer, default=0)
    rank      = Column(Integer, nullable=True)
    promoted  = Column(Boolean, nullable=True)

    league = relationship("League", back_populates="members")
    user   = relationship("User", foreign_keys=[user_id])
    __table_args__ = (
        UniqueConstraint("league_id","user_id", name="uq_league_member"),
        Index("ix_league_member_xp", "league_id", "xp_earned"),
    )


# ── VIRTUAL INVENTORY ────────────────────────

class VirtualItem(Base):
    __tablename__ = "virtual_items"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name        = Column(String(255), nullable=False)
    item_type   = Column(SAEnum(ItemType), nullable=False, index=True)
    rarity      = Column(String(32), default="common", index=True)
    description = Column(Text, nullable=True)
    asset_url   = Column(String(512), nullable=True)
    gem_cost    = Column(Integer, nullable=True)
    is_premium  = Column(Boolean, default=False, index=True)
    metadata_json = Column(JSON, default={})

    owned_by = relationship("UserInventory", back_populates="item", cascade="all, delete-orphan")


class UserInventory(Base):
    __tablename__ = "user_inventory"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id     = Column(UUID(as_uuid=True), ForeignKey("users.id",       ondelete="CASCADE"), nullable=False, index=True)
    item_id     = Column(UUID(as_uuid=True), ForeignKey("virtual_items.id",ondelete="CASCADE"), nullable=False, index=True)
    is_equipped = Column(Boolean, default=False, index=True)
    acquired_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User",        foreign_keys=[user_id])
    item = relationship("VirtualItem", back_populates="owned_by")
    __table_args__ = (UniqueConstraint("user_id","item_id", name="uq_user_item"),)


# ── STREAKS & HEARTS ─────────────────────────

class UserStreak(Base):
    __tablename__ = "user_streaks"
    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id         = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    current_streak  = Column(Integer, default=0)
    longest_streak  = Column(Integer, default=0)
    last_activity   = Column(DateTime(timezone=True), nullable=True)
    freeze_used     = Column(Boolean, default=False)
    freeze_count    = Column(Integer, default=0)
    updated_at      = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])


class UserEnergy(Base):
    __tablename__ = "user_energy"
    id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id       = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    hearts        = Column(Integer, default=5)
    max_hearts    = Column(Integer, default=5)
    refill_at     = Column(DateTime(timezone=True), nullable=True, index=True)
    gems          = Column(Integer, default=0)
    xp_total      = Column(Integer, default=0)
    updated_at    = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", foreign_keys=[user_id])


# ── FRIENDS ──────────────────────────────────

class Friendship(Base):
    __tablename__ = "friendships"
    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    addressee_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    status       = Column(SAEnum(FriendStatus), nullable=False, default=FriendStatus.PENDING, index=True)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now())

    requester = relationship("User", foreign_keys=[requester_id])
    addressee = relationship("User", foreign_keys=[addressee_id])
    __table_args__ = (
        UniqueConstraint("requester_id","addressee_id", name="uq_friendship_pair"),
        Index("ix_friendship_status", "addressee_id", "status"),
    )


# ── DIRECT MESSAGES ──────────────────────────

class DirectMessage(Base):
    __tablename__ = "direct_messages"
    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id   = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    content     = Column(Text, nullable=False)
    is_read     = Column(Boolean, default=False, index=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    sender   = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    __table_args__ = (Index("ix_dm_conversation", "sender_id", "receiver_id"),)


# ── FORUMS ───────────────────────────────────

class ForumThread(Base):
    __tablename__ = "forum_threads"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    author_id  = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    title      = Column(String(512), nullable=False)
    body       = Column(Text, nullable=False)
    language   = Column(String(5), nullable=True, index=True)
    category   = Column(String(64), nullable=True, index=True)
    is_pinned  = Column(Boolean, default=False, index=True)
    is_locked  = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    author  = relationship("User", foreign_keys=[author_id])
    replies = relationship("ForumReply", back_populates="thread", cascade="all, delete-orphan")


class ForumReply(Base):
    __tablename__ = "forum_replies"
    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    thread_id  = Column(UUID(as_uuid=True), ForeignKey("forum_threads.id", ondelete="CASCADE"), nullable=False, index=True)
    author_id  = Column(UUID(as_uuid=True), ForeignKey("users.id",         ondelete="SET NULL"), nullable=True,  index=True)
    body       = Column(Text, nullable=False)
    upvotes    = Column(Integer, default=0)
    is_solution = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    thread = relationship("ForumThread", back_populates="replies")
    author = relationship("User", foreign_keys=[author_id])
