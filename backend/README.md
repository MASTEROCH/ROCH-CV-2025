# Datum Empire - Backend (FastAPI)

## Local dev

- Python 3.11+
- Create venv and install deps:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Copy `.env.example` to `.env` if needed.

## API headers (dev)
Use header `X-Telegram-User-Id: <your_dev_id>` to simulate auth.

## Endpoints (selection)
- GET /api/health
- GET /api/me
- POST /api/me/onboarding/complete
- POST /api/economy/convert/coins-to-ticket
- GET /api/inventory
- POST /api/inventory/mark-seen
- GET /api/tasks
- POST /api/tasks/{user_task_id}/claim
- POST /api/roulette/spin
- GET /api/stats/summary
