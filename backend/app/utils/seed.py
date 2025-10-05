from __future__ import annotations
from sqlalchemy.orm import Session
from ..db import models


def seed_content(db: Session) -> None:
    # Texts
    texts = {
        ("en", "loading_title"): "Datum Empire",
        ("en", "start_game"): "Start Game",
        ("en", "early_access"): "Early Access",
        ("en", "onboarding_continue"): "Continue",
        ("en", "onboarding_start"): "Start the Adventure",
        ("en", "home_more_chance"): "More Chance",
        ("en", "home_auto_collect"): "Auto Collect",
        ("en", "roulette_start"): "Start for 1 ticket",
        ("en", "inventory_title"): "Inventory",
        ("en", "tasks_title"): "Tasks",
        ("en", "shop_title"): "Shop",
        ("en", "network_title"): "Network",
        ("ru", "loading_title"): "Datum Empire",
        ("ru", "start_game"): "Начать игру",
        ("ru", "early_access"): "Ранний доступ",
        ("ru", "onboarding_continue"): "Продолжить",
        ("ru", "onboarding_start"): "В путь!",
        ("ru", "home_more_chance"): "More Chance",
        ("ru", "home_auto_collect"): "Auto Collect",
        ("ru", "roulette_start"): "Запустить за 1 билет",
        ("ru", "inventory_title"): "Инвентарь",
        ("ru", "tasks_title"): "Задачи",
        ("ru", "shop_title"): "Магазин",
        ("ru", "network_title"): "Сеть",
    }
    for (locale, key), text in texts.items():
        if not db.query(models.ContentText).filter(models.ContentText.locale == locale, models.ContentText.key == key).first():
            db.add(models.ContentText(locale=locale, key=key, text=text))

    # Roulette defaults
    if db.query(models.RouletteConfig).count() == 0:
        db.add_all([
            models.RouletteConfig(reward_key="coins_100", probability=0.55),
            models.RouletteConfig(reward_key="ticket_1", probability=0.2),
            models.RouletteConfig(reward_key="item_head_1", probability=0.15),
            models.RouletteConfig(reward_key="item_body_1", probability=0.1),
        ])

    # Shop defaults
    if db.query(models.ShopConfig).count() == 0:
        db.add_all([
            models.ShopConfig(item_key="coins_pack_small", price_ton=0.2, payload="coins:1000"),
            models.ShopConfig(item_key="ticket_pack_5", price_ton=0.5, payload="tickets:5"),
            models.ShopConfig(item_key="more_chance", price_ton=1.0, payload="level:+1"),
        ])

    # Tasks defaults
    if db.query(models.Task).count() == 0:
        db.add_all([
            models.Task(task_key="login", title_key="task_login_title", description_key="task_login_desc", reward_coins=100, reward_tickets=0, active=True),
            models.Task(task_key="spin_roulette", title_key="task_spin_title", description_key="task_spin_desc", reward_coins=50, reward_tickets=1, active=True),
        ])

    db.commit()
