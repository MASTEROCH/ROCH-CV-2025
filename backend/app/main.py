from __future__ import annotations
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import ORJSONResponse
from starlette_exporter import PrometheusMiddleware, handle_metrics

from .core.config import get_settings
from .db.session import engine, SessionLocal
from .db.models import Base
from .api.routes import router as api_router
from .utils.seed import seed_content

settings = get_settings()

app = FastAPI(title=settings.APP_NAME, default_response_class=ORJSONResponse)

origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.add_middleware(PrometheusMiddleware)
app.add_route("/metrics", handle_metrics)

# Create tables on startup (prototype)
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    # seed base content
    db = SessionLocal()
    try:
        seed_content(db)
    finally:
        db.close()


app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Datum Empire API", "env": settings.ENV}
