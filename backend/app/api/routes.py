from __future__ import annotations
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core.config import get_settings
from ..db import models
from .deps import get_db, get_current_user

router = APIRouter()
settings = get_settings()


@router.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "app": settings.APP_NAME}


@router.get("/content/texts/{locale}")
def get_texts(locale: str, db: Session = Depends(get_db)):
    rows = db.query(models.ContentText).filter(models.ContentText.locale == locale).all()
    return {r.key: r.text for r in rows}


@router.get("/content/images/{locale}")
def get_images(locale: str, db: Session = Depends(get_db)):
    rows = db.query(models.ContentImage).filter(models.ContentImage.locale == locale).all()
    return {r.key: r.url for r in rows}


@router.get("/me")
def get_me(user: models.User = Depends(get_current_user)):
    return {
        "telegram_id": user.telegram_id,
        "language": user.language,
        "coins": user.coins,
        "ton": user.ton,
        "tickets": user.tickets,
        "streak_days": user.streak_days,
        "onboarding_completed": user.onboarding_completed,
    }


@router.post("/me/onboarding/complete")
def complete_onboarding(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    user.onboarding_completed = True
    db.add(user)
    db.commit()
    return {"ok": True}


@router.post("/economy/convert/coins-to-ticket")
def convert_coins_to_ticket(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    if user.coins < settings.COINS_PER_TICKET:
        raise HTTPException(status_code=400, detail="Not enough coins")
    user.coins -= settings.COINS_PER_TICKET
    user.tickets += 1
    db.add(user)
    db.commit()
    return {"tickets": user.tickets, "coins": user.coins}


@router.get("/inventory")
def get_inventory(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    items = db.query(models.InventoryItem).filter(models.InventoryItem.user_id == user.id).all()
    return [
        {
            "id": i.id,
            "item_key": i.item_key,
            "slot": i.slot,
            "rarity": i.rarity,
            "is_new": i.is_new,
        }
        for i in items
    ]


@router.post("/inventory/mark-seen")
def inventory_mark_seen(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    items = db.query(models.InventoryItem).filter(models.InventoryItem.user_id == user.id, models.InventoryItem.is_new == True).all()  # noqa: E712
    for i in items:
        i.is_new = False
        db.add(i)
    db.commit()
    return {"ok": True}


@router.get("/tasks")
def list_tasks(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # join user_tasks with tasks
    uts = (
        db.query(models.UserTask)
        .filter(models.UserTask.user_id == user.id)
        .all()
    )
    # ensure tasks exist for new users by seeding active tasks
    if not uts:
        all_tasks = db.query(models.Task).filter(models.Task.active == True).all()  # noqa: E712
        for t in all_tasks:
            db.add(models.UserTask(user_id=user.id, task_id=t.id, status="active"))
        db.commit()
        uts = (
            db.query(models.UserTask)
            .filter(models.UserTask.user_id == user.id)
            .all()
        )
    result = []
    for ut in uts:
        t = ut.task
        result.append({
            "user_task_id": ut.id,
            "task_key": t.task_key,
            "title_key": t.title_key,
            "description_key": t.description_key,
            "status": ut.status,
            "reward_coins": t.reward_coins,
            "reward_tickets": t.reward_tickets,
        })
    return result


@router.post("/tasks/{user_task_id}/claim")
def claim_task(user_task_id: int, db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    ut = db.query(models.UserTask).filter(models.UserTask.id == user_task_id, models.UserTask.user_id == user.id).first()
    if not ut or ut.status != "completed":
        raise HTTPException(status_code=400, detail="Task not ready to claim")
    t = ut.task
    user.coins += t.reward_coins
    user.tickets += t.reward_tickets
    ut.status = "claimed"
    db.add_all([user, ut])
    db.commit()
    return {"coins": user.coins, "tickets": user.tickets}


@router.post("/roulette/spin")
def roulette_spin(db: Session = Depends(get_db), user: models.User = Depends(get_current_user)):
    # pay with ticket or grant free every interval
    now = datetime.utcnow()
    # naive free ticket grant: if last_login_at older than interval, add 1 ticket
    if user.last_login_at is None or now - user.last_login_at > timedelta(seconds=settings.FREE_TICKET_INTERVAL_SECONDS):
        user.tickets += 1
    if user.tickets < 1:
        raise HTTPException(status_code=400, detail="No tickets")

    user.tickets -= 1

    # determine a reward using roulette_config probabilities
    configs = db.query(models.RouletteConfig).all()
    if not configs:
        # fallback rewards
        configs = [
            models.RouletteConfig(reward_key="coins_100", probability=0.6),
            models.RouletteConfig(reward_key="ticket_1", probability=0.2),
            models.RouletteConfig(reward_key="item_head_1", probability=0.2),
        ]
    import random
    r = random.random()
    cumulative = 0.0
    chosen = configs[-1]
    for c in configs:
        cumulative += c.probability
        if r <= cumulative:
            chosen = c
            break

    # apply reward
    reward = {"type": "none"}
    if chosen.reward_key.startswith("coins_"):
        amount = int(chosen.reward_key.split("_")[1])
        user.coins += amount
        reward = {"type": "coins", "amount": amount}
    elif chosen.reward_key.startswith("ticket_"):
        amount = int(chosen.reward_key.split("_")[1])
        user.tickets += amount
        reward = {"type": "ticket", "amount": amount}
    elif chosen.reward_key.startswith("item_"):
        _, slot, idx = chosen.reward_key.split("_")
        item_key = f"{slot}_{idx}"
        inv = models.InventoryItem(user_id=user.id, item_key=item_key, slot=slot, rarity="common", is_new=True)
        db.add(inv)
        reward = {"type": "item", "slot": slot, "item_key": item_key}

    user.last_login_at = now
    db.add(user)
    db.commit()
    db.refresh(user)

    return {"reward": reward, "coins": user.coins, "tickets": user.tickets}


@router.get("/stats/summary")
def stats_summary(db: Session = Depends(get_db)):
    users = db.query(models.User).count()
    # basic DAU/WAU/MAU approximations from last_login_at
    now = datetime.utcnow()
    dau = db.query(models.User).filter(models.User.last_login_at >= now - timedelta(days=1)).count()
    wau = db.query(models.User).filter(models.User.last_login_at >= now - timedelta(days=7)).count()
    mau = db.query(models.User).filter(models.User.last_login_at >= now - timedelta(days=30)).count()
    return {"users": users, "dau": dau, "wau": wau, "mau": mau}
