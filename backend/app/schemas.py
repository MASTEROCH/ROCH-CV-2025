from __future__ import annotations
from datetime import datetime
from typing import Optional, Dict, List, Literal
from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: int
    username: Optional[str] = None
    coins: int
    ton: float
    tickets: int
    hasVisited: bool = Field(alias="has_visited")
    lastLoginAt: Optional[datetime] = Field(alias="last_login_at", default=None)
    streakDays: int = Field(alias="streak_days")
    freeTicketAt: Optional[datetime] = Field(alias="free_ticket_at", default=None)
    moreChanceLevel: int = Field(alias="more_chance_level")
    referralCode: str = Field(alias="referral_code")

    model_config = {
        "populate_by_name": True,
        "from_attributes": True,
    }


class InventoryItemOut(BaseModel):
    id: int
    item_type: str
    name: str
    rarity: str
    is_new: bool

    model_config = {"from_attributes": True}


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    reward_coins: int
    reward_tickets: int
    claimed: bool

    model_config = {"from_attributes": True}


class ShopItemOut(BaseModel):
    id: int
    sku: str
    title: str
    description: Optional[str]
    type: str
    price_ton: float
    price_coins: int
    gives_coins: int
    gives_tickets: int
    active: bool

    model_config = {"from_attributes": True}


class RouletteSpinResult(BaseModel):
    result_type: Literal["coins", "ticket", "item"]
    amount: int = 0
    item: Optional[InventoryItemOut] = None
    coins: int
    tickets: int
    freeTicketAt: Optional[datetime] = None


class ContentBundle(BaseModel):
    locale: str
    texts: Dict[str, str]
    images: Dict[str, str]
