from __future__ import annotations

import enum
from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, Enum, String, func
from sqlalchemy.dialects.sqlite import JSON
from sqlmodel import Field, SQLModel


class Visibility(str, enum.Enum):
    private = "private"
    link = "link"
    public_anon = "public_anon"


class ModerationStatus(str, enum.Enum):
    ok = "ok"
    flagged = "flagged"
    removed = "removed"


class ReactionType(str, enum.Enum):
    heart = "heart"
    thanks = "thanks"
    star = "star"


class Story(SQLModel, table=True):
    __tablename__ = "stories"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(default="Untitled Story", max_length=255)
    text: str = Field(default="", sa_column=Column(String, nullable=False, server_default=""))
    raw_transcript: str = Field(default="", sa_column=Column(String, nullable=False, server_default=""))
    abstract: Optional[str] = Field(default=None, max_length=512)
    audio_url: str = Field(nullable=False)
    visibility: Visibility = Field(default=Visibility.private, sa_column=Column(Enum(Visibility)))
    age_range: Optional[str] = Field(default=None, max_length=32)
    city: Optional[str] = Field(default=None, max_length=64)
    tags: List[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False, server_default="[]"))
    share_token: Optional[str] = Field(
        default=None,
        sa_column=Column(String, unique=True, index=True, nullable=True),
    )
    consent_choice: Optional[str] = Field(default=None)
    consent_timestamp: Optional[datetime] = None
    moderation_status: ModerationStatus = Field(
        default=ModerationStatus.ok,
        sa_column=Column(Enum(ModerationStatus), server_default=ModerationStatus.ok.value),
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now(), "onupdate": func.now()},
    )


class Reaction(SQLModel, table=True):
    __tablename__ = "reactions"

    id: Optional[int] = Field(default=None, primary_key=True)
    story_id: int = Field(foreign_key="stories.id")
    type: ReactionType = Field(sa_column=Column(Enum(ReactionType)))
    client_hash: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False, sa_column_kwargs={"server_default": func.utcnow()})


class Report(SQLModel, table=True):
    __tablename__ = "reports"

    id: Optional[int] = Field(default=None, primary_key=True)
    story_id: int = Field(foreign_key="stories.id")
    reason: str = Field(max_length=500)
    client_hash: str = Field(index=True)
    handled: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        sa_column_kwargs={"server_default": func.now()},
    )
