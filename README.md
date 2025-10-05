## Datum Empire - Telegram Mini App (Prototype)

### Quick Start (local)
- Backend:
  - Python 3.11+
  - cd backend && cp .env.example .env
  - pip install -r requirements.txt
  - uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
- Frontend:
  - cd frontend && cp .env.example .env
  - npm install
  - npm run dev

Ensure `VITE_API_BASE` in frontend `.env` points to backend (http://localhost:8000).

### Deploy (Render, one-click)
- Push this repo to GitHub.
- Create new Render Web Service from this repo; Render auto-detects Dockerfile.
- Set env vars:
  - `ALLOWED_ORIGINS`: your frontend domain(s)
  - `ENV`: production
- After deploy, open the URL (health at `/api/health`).

### Deploy (Railway)
- `railway up` or connect repo; uses Dockerfile. Configure the same env vars.

### Telegram Mini App
- Set your bot `Web App` URL to the deployed URL.
- SDK is loaded in `frontend/index.html`.

### Minimum Implemented
- Loading, Onboarding, Home, Roulette, Inventory, Tasks, Shop, Network.
- State persisted in DB (SQLite by default). Admin seed for content/odds/shop.
