from __future__ import annotations
from datetime import datetime, timedelta
from typing import Optional
from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Boolean,
    ForeignKey,
    Float,
    UniqueConstraint,
    Enum,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column
from enum import Enum as PyEnum

from .db import Base


class ItemType(str, PyEnum):
    head = "head"
    arms = "arms"
    body = "body"
    legs = "legs"


class TaskStatus(str, PyEnum):
    active = "active"
    completed = "completed"


class OutcomeType(str, PyEnum):
    coins = "coins"
    ticket = "ticket"
    item = "item"


class EventType(str, PyEnum):
    login = "login"
    spin = "spin"
    purchase = "purchase"
    claim = "claim"
    referral_claim = "referral_claim"


class ShopItemType(str, PyEnum):
    coins = "coins"
    tickets = "tickets"
    subscription = "subscription"
    more_chance = "more_chance"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    telegram_id: Mapped[Optional[str]] = mapped_column(String(64), unique=True, index=True, nullable=True)
    username: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    referral_code: Mapped[str] = mapped_column(String(16), unique=True, index=True)
    referred_by: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)

    coins: Mapped[int] = mapped_column(Integer, default=0)
    ton: Mapped[float] = mapped_column(Float, default=0.0)
    tickets: Mapped[int] = mapped_column(Integer, default=5)

    has_visited: Mapped[bool] = mapped_column(Boolean, default=False)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)

    free_ticket_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    more_chance_level: Mapped[int] = mapped_column(Integer, default=0)
    auto_collect_until: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    inventory_items: Mapped[list[InventoryItem]] = relationship("InventoryItem", back_populates="user", cascade="all, delete-orphan")  # type: ignore
    tasks: Mapped[list[Task]] = relationship("Task", back_populates="user", cascade="all, delete-orphan")  # type: ignore


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    item_type: Mapped[ItemType] = mapped_column(Enum(ItemType), index=True)
    name: Mapped[str] = mapped_column(String(64))
    rarity: Mapped[str] = mapped_column(String(16), default="common")
    is_new: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship("User", back_populates="inventory_items")  # type: ignore


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(128))
    description: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.active, index=True)
    reward_coins: Mapped[int] = mapped_column(Integer, default=0)
    reward_tickets: Mapped[int] = mapped_column(Integer, default=0)
    claimed: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User] = relationship("User", back_populates="tasks")  # type: ignore


class ShopItem(Base):
    __tablename__ = "shop_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    sku: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(128))
    description: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    type: Mapped[ShopItemType] = mapped_column(Enum(ShopItemType), index=True)
    price_ton: Mapped[float] = mapped_column(Float, default=0.0)
    price_coins: Mapped[int] = mapped_column(Integer, default=0)
    gives_coins: Mapped[int] = mapped_column(Integer, default=0)
    gives_tickets: Mapped[int] = mapped_column(Integer, default=0)
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class RouletteOutcome(Base):
    __tablename__ = "roulette_outcomes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(64))
    type: Mapped[OutcomeType] = mapped_column(Enum(OutcomeType), index=True)
    amount: Mapped[int] = mapped_column(Integer, default=0)
    item_type: Mapped[Optional[ItemType]] = mapped_column(Enum(ItemType), nullable=True)
    weight: Mapped[float] = mapped_column(Float, default=1.0)


class Friend(Base):
    __tablename__ = "friends"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    friend_user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    __table_args__ = (UniqueConstraint('user_id', 'friend_user_id', name='uq_user_friend'),)


class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    type: Mapped[EventType] = mapped_column(Enum(EventType), index=True)
    amount: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)


class LocalizationText(Base):
    __tablename__ = "localization_texts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(128), index=True)
    locale: Mapped[str] = mapped_column(String(8), index=True)
    text: Mapped[str] = mapped_column(String(2048))
    __table_args__ = (UniqueConstraint('key', 'locale', name='uq_text_locale'),)


class AssetImage(Base):
    __tablename__ = "asset_images"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    key: Mapped[str] = mapped_column(String(128), index=True)
    locale: Mapped[str] = mapped_column(String(8), index=True)
    url: Mapped[str] = mapped_column(String(1024))
    __table_args__ = (UniqueConstraint('key', 'locale', name='uq_image_locale'),)
