from __future__ import annotations
from typing import Generator
from fastapi import Header, HTTPException, Depends
from sqlalchemy.orm import Session

from ..db.session import SessionLocal
from ..db import models


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db), x_telegram_user_id: str | None = Header(default=None), dev_user: str | None = Header(default=None)) -> models.User:
    # In production, validate Telegram initData (omitted for prototype)
    telegram_id = x_telegram_user_id or dev_user
    if not telegram_id:
        raise HTTPException(status_code=401, detail="Missing X-Telegram-User-Id header (dev mode)")

    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    if not user:
        # create a new user with defaults
        user = models.User(telegram_id=telegram_id, coins=1000, tickets=1, ton=0.0)
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
