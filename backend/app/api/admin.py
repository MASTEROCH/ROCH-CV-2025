from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..core.config import get_settings
from ..db import models
from .deps import get_db

router = APIRouter(prefix="/admin")
settings = get_settings()


def require_admin(x_admin_secret: str | None = Header(default=None)):
    if x_admin_secret != settings.ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.get("/shop/items")
def shop_items(db: Session = Depends(get_db), _=Depends(require_admin)):
    return db.query(models.ShopConfig).all()


@router.post("/roulette/odds")
def update_roulette_odds(items: list[dict], db: Session = Depends(get_db), _=Depends(require_admin)):
    db.query(models.RouletteConfig).delete()
    for it in items:
        db.add(models.RouletteConfig(reward_key=it["reward_key"], probability=float(it["probability"])) )
    db.commit()
    return {"ok": True}
