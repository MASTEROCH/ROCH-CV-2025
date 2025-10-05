from __future__ import annotations
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Float, UniqueConstraint
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)  # internal id
    telegram_id = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    language = Column(String, default="en")
    coins = Column(Integer, default=0)
    ton = Column(Float, default=0.0)
    tickets = Column(Integer, default=0)

    streak_days = Column(Integer, default=0)
    last_login_at = Column(DateTime, default=datetime.utcnow)

    more_chance_level = Column(Integer, default=0)
    auto_collect_until = Column(DateTime, nullable=True)

    referral_code = Column(String, unique=True, index=True)
    referred_by = Column(String, nullable=True)
    referral_bonus_claimed = Column(Boolean, default=False)

    onboarding_completed = Column(Boolean, default=False)

    inventory_items = relationship("InventoryItem", back_populates="user", cascade="all, delete-orphan")
    user_tasks = relationship("UserTask", back_populates="user", cascade="all, delete-orphan")


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    item_key = Column(String, nullable=False)  # unique item identifier
    slot = Column(String, nullable=False)  # head, arms, body, legs
    rarity = Column(String, default="common")
    is_new = Column(Boolean, default=True)

    user = relationship("User", back_populates="inventory_items")

    __table_args__ = (
        UniqueConstraint("user_id", "item_key", name="uix_user_item"),
    )


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    task_key = Column(String, unique=True, nullable=False)
    title_key = Column(String, nullable=False)
    description_key = Column(String, nullable=False)
    reward_coins = Column(Integer, default=0)
    reward_tickets = Column(Integer, default=0)
    active = Column(Boolean, default=True)


class UserTask(Base):
    __tablename__ = "user_tasks"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    status = Column(String, default="active")  # active|completed|claimed

    user = relationship("User", back_populates="user_tasks")
    task = relationship("Task")

    __table_args__ = (
        UniqueConstraint("user_id", "task_id", name="uix_user_task"),
    )


class ContentText(Base):
    __tablename__ = "content_texts"

    id = Column(Integer, primary_key=True)
    locale = Column(String, index=True)
    key = Column(String, index=True)
    text = Column(String)

    __table_args__ = (
        UniqueConstraint("locale", "key", name="uix_locale_key"),
    )


class ContentImage(Base):
    __tablename__ = "content_images"

    id = Column(Integer, primary_key=True)
    locale = Column(String, index=True)
    key = Column(String, index=True)
    url = Column(String)  # can be absolute or served from frontend /public

    __table_args__ = (
        UniqueConstraint("locale", "key", name="uix_img_locale_key"),
    )


class RouletteConfig(Base):
    __tablename__ = "roulette_config"

    id = Column(Integer, primary_key=True)
    reward_key = Column(String, nullable=False)  # e.g., coins_100, ticket_1, item_head_1
    probability = Column(Float, nullable=False)  # sum to ~1.0


class ShopConfig(Base):
    __tablename__ = "shop_config"

    id = Column(Integer, primary_key=True)
    item_key = Column(String, unique=True, nullable=False)  # coins_pack_small, ticket_pack_5, more_chance
    price_ton = Column(Float, default=0.0)
    price_coins = Column(Integer, default=0)
    payload = Column(String, nullable=True)  # e.g., amount of coins/tickets or subscription duration


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    item_key = Column(String, nullable=False)
    amount_ton = Column(Float, default=0.0)
    amount_coins = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
