import os
from functools import lru_cache

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "Datum Empire Backend")
    ENV: str = os.getenv("ENV", "development")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))

    # DB: default to SQLite file, allow Postgres
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./datum_empire.db",
    )

    # CORS
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    # Telegram
    TELEGRAM_BOT_TOKEN: str | None = os.getenv("TELEGRAM_BOT_TOKEN")

    # Admin
    ADMIN_SECRET: str = os.getenv("ADMIN_SECRET", "dev-admin-secret")

    # Gameplay
    FREE_TICKET_INTERVAL_SECONDS: int = int(os.getenv("FREE_TICKET_INTERVAL_SECONDS", str(4 * 60 * 60)))
    COINS_PER_TICKET: int = int(os.getenv("COINS_PER_TICKET", "900"))


@lru_cache
def get_settings() -> Settings:
    return Settings()
