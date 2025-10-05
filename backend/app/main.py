from __future__ import annotations
from datetime import datetime, timedelta
import os
import random
from fastapi import FastAPI, Depends, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .db import Base, engine, get_db
from . import models
from .schemas import UserOut, InventoryItemOut, TaskOut, ShopItemOut, RouletteSpinResult, ContentBundle
from .utils.telegram import verify_telegram_auth


def create_app() -> FastAPI:
    app = FastAPI(title="Datum Empire API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def on_startup():
        Base.metadata.create_all(bind=engine)
        with Session(engine) as db:
            seed(db)

    @app.get("/health")
    def health():
        return {"status": "ok"}

    # Telegram auth dependency
    def get_current_user(db: Session = Depends(get_db), x_telegram_init_data: str | None = Header(default=None)) -> models.User:
        dev_mode = os.getenv("DEV_MODE", "true").lower() == "true"
        if dev_mode:
            user = db.query(models.User).first()
            if not user:
                user = create_user(db, username="dev")
            return user

        if not x_telegram_init_data:
            raise HTTPException(status_code=401, detail="Missing Telegram init data")
        bot_token = os.getenv("BOT_TOKEN", "")
        if not bot_token or not verify_telegram_auth(x_telegram_init_data, bot_token):
            raise HTTPException(status_code=401, detail="Invalid Telegram auth")
        # In a real app, parse user from init data
        user = db.query(models.User).first()
        if not user:
            user = create_user(db, username="tguser")
        return user

    @app.get("/content", response_model=ContentBundle)
    def get_content(locale: str = Query(default="en"), db: Session = Depends(get_db)):
        texts = {t.key: t.text for t in db.query(models.LocalizationText).filter(models.LocalizationText.locale == locale)}
        images = {i.key: i.url for i in db.query(models.AssetImage).filter(models.AssetImage.locale == locale)}
        return ContentBundle(locale=locale, texts=texts, images=images)

    @app.get("/me", response_model=UserOut)
    def me(user: models.User = Depends(get_current_user)):
        return user

    @app.post("/streak/claim", response_model=UserOut)
    def claim_streak(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        now = datetime.utcnow()
        if user.last_login_at:
            delta = now.date() - user.last_login_at.date()
            if delta.days == 1:
                user.streak_days += 1
            elif delta.days > 1:
                user.streak_days = 1
        else:
            user.streak_days = 1
        reward = streak_reward(user.streak_days)
        user.coins += reward
        user.last_login_at = now
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @app.get("/inventory", response_model=list[InventoryItemOut])
    def get_inventory(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        items = db.query(models.InventoryItem).filter(models.InventoryItem.user_id == user.id).all()
        return items

    @app.post("/inventory/ack")
    def ack_inventory_new(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        db.query(models.InventoryItem).filter(models.InventoryItem.user_id == user.id, models.InventoryItem.is_new == True).update({models.InventoryItem.is_new: False})
        db.commit()
        return {"ok": True}

    @app.get("/tasks", response_model=list[TaskOut])
    def get_tasks(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        return db.query(models.Task).filter(models.Task.user_id == user.id).all()

    @app.post("/tasks/{task_id}/claim", response_model=UserOut)
    def claim_task(task_id: int, user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user.id).first()
        if not task or task.claimed or task.status != models.TaskStatus.completed:
            raise HTTPException(status_code=400, detail="Task not claimable")
        user.coins += task.reward_coins
        user.tickets += task.reward_tickets
        task.claimed = True
        db.add_all([user, task])
        db.commit()
        db.refresh(user)
        return user

    @app.post("/convert/coins-to-ticket", response_model=UserOut)
    def convert_to_ticket(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        if user.coins < 900:
            raise HTTPException(status_code=400, detail="Not enough coins")
        user.coins -= 900
        user.tickets += 1
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @app.get("/shop", response_model=list[ShopItemOut])
    def get_shop(db: Session = Depends(get_db)):
        return db.query(models.ShopItem).filter(models.ShopItem.active == True).all()

    @app.post("/roulette/spin", response_model=RouletteSpinResult)
    def roulette_spin(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        now = datetime.utcnow()
        use_ticket = True
        if user.tickets > 0:
            user.tickets -= 1
        else:
            if user.free_ticket_at and user.free_ticket_at <= now:
                use_ticket = False
                user.free_ticket_at = now + timedelta(hours=4)
            else:
                raise HTTPException(status_code=400, detail="No tickets")

        outcome = weighted_outcome(db)
        result_item = None
        if outcome.type == models.OutcomeType.coins:
            user.coins += outcome.amount
        elif outcome.type == models.OutcomeType.ticket:
            user.tickets += outcome.amount
        else:
            item = models.InventoryItem(user_id=user.id, item_type=outcome.item_type or models.ItemType.head, name=outcome.name)
            db.add(item)
            db.flush()
            result_item = item

        if not user.free_ticket_at:
            user.free_ticket_at = now + timedelta(hours=4)

        db.add(user)
        db.commit()
        db.refresh(user)

        return RouletteSpinResult(
            result_type=outcome.type.value,
            amount=outcome.amount,
            item=(InventoryItemOut.model_validate(result_item) if result_item else None),
            coins=user.coins,
            tickets=user.tickets,
            freeTicketAt=user.free_ticket_at,
        )

    @app.get("/network/friends")
    def friends(user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
        friends = db.query(models.Friend).filter(models.Friend.user_id == user.id).all()
        return {"friends": [f.friend_user_id for f in friends]}

    @app.get("/network/leaderboard")
    def leaderboard(db: Session = Depends(get_db)):
        top = db.query(models.User).order_by(models.User.coins.desc()).limit(50).all()
        return {"leaders": [{"username": u.username or f"user{u.id}", "coins": u.coins} for u in top]}

    @app.get("/admin/stats")
    def admin_stats(db: Session = Depends(get_db)):
        dau = db.query(models.Event).count()  # placeholder
        purchases = db.query(models.Event).filter(models.Event.type == models.EventType.purchase).count()
        return {"dau": dau, "purchases": purchases}

    @app.get("/admin/export")
    def admin_export(fmt: str = Query(default="json"), db: Session = Depends(get_db)):
        users = db.query(models.User).all()
        data = [{"id": u.id, "username": u.username, "coins": u.coins, "ton": u.ton, "tickets": u.tickets} for u in users]
        if fmt == "csv":
            import io, csv
            buf = io.StringIO()
            writer = csv.DictWriter(buf, fieldnames=list(data[0].keys()) if data else ["id","username","coins","ton","tickets"])
            writer.writeheader()
            writer.writerows(data)
            return buf.getvalue()
        return {"users": data}

    return app


app = create_app()


def streak_reward(days: int) -> int:
    if days <= 10:
        return 50
    if days <= 30:
        return 100
    return 200


def create_user(db: Session, username: str | None = None) -> models.User:
    code = f"R{random.randint(1000, 9999)}"
    user = models.User(username=username, referral_code=code, tickets=5, coins=500)
    db.add(user)
    db.commit()
    db.refresh(user)
    # initial tasks
    tasks = [
        models.Task(user_id=user.id, title="Win your first spin", reward_coins=100),
        models.Task(user_id=user.id, title="Invite a friend", reward_tickets=1),
    ]
    db.add_all(tasks)
    db.commit()
    return user


def seed(db: Session):
    if not db.query(models.ShopItem).first():
        db.add_all([
            models.ShopItem(sku="coins_1k", title="1,000 Coins", type=models.ShopItemType.coins, price_ton=0.1, gives_coins=1000),
            models.ShopItem(sku="tickets_5", title="5 Tickets", type=models.ShopItemType.tickets, price_ton=0.2, gives_tickets=5),
            models.ShopItem(sku="more_chance_1", title="More Chance Lv1", type=models.ShopItemType.more_chance, price_ton=0.3),
        ])
        db.commit()
    if not db.query(models.RouletteOutcome).first():
        db.add_all([
            models.RouletteOutcome(name="50 Coins", type=models.OutcomeType.coins, amount=50, weight=5.0),
            models.RouletteOutcome(name="100 Coins", type=models.OutcomeType.coins, amount=100, weight=3.0),
            models.RouletteOutcome(name="Ticket +1", type=models.OutcomeType.ticket, amount=1, weight=1.5),
            models.RouletteOutcome(name="Head Module", type=models.OutcomeType.item, amount=1, item_type=models.ItemType.head, weight=1.0),
            models.RouletteOutcome(name="Arms Module", type=models.OutcomeType.item, amount=1, item_type=models.ItemType.arms, weight=1.0),
        ])
        db.commit()
    if not db.query(models.LocalizationText).first():
        texts = {
            "loading.title": "Datum Empire",
            "loading.start": "Start Game",
            "loading.early": "Early Access",
            "onboarding.title1": "Build your Empire",
            "onboarding.title2": "Spin the Wheel",
            "onboarding.title3": "Collect Modules",
            "home.moreChance": "More Chance",
            "home.autoCollect": "Auto Collect",
            "roulette.start": "Start for 1 ticket",
            "inventory.title": "Inventory",
            "tasks.title": "Tasks",
            "shop.title": "Shop",
            "network.title": "Network",
        }
        for k, v in texts.items():
            db.add(models.LocalizationText(key=k, locale="en", text=v))
        db.commit()


def weighted_outcome(db: Session) -> models.RouletteOutcome:
    outcomes = db.query(models.RouletteOutcome).all()
    weights = [o.weight for o in outcomes]
    return random.choices(outcomes, weights=weights, k=1)[0]
