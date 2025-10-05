# Datum Empire

A Telegram Mini App featuring a roulette game with TON blockchain integration.

## Project Structure

```
datum-empire/
├── packages/
│   ├── web/          # Vite React frontend
│   └── api/          # NestJS backend API
├── docker-compose.yml
└── package.json
```

## Features

- 🎰 Roulette game with auto-spin functionality
- 💰 TON blockchain integration
- 🎫 Ticket system with free daily tickets
- 🔥 Streak rewards
- 👥 Referral system
- 🛒 In-game shop
- 🌍 Multi-language support (EN, RU)
- 📊 Admin dashboard

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start database:**
   ```bash
   docker-compose up postgres redis -d
   ```

3. **Set up database:**
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create `.env` files in both `packages/api` and `packages/web`:

### API (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/datum_empire"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key"
TELEGRAM_BOT_TOKEN="your-telegram-bot-token"
PORT=3000
```

### Web (.env)
```
VITE_API_URL="http://localhost:3000"
VITE_TELEGRAM_BOT_USERNAME="your_bot_username"
```

## Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** NestJS, Prisma, PostgreSQL, Redis
- **Blockchain:** TON (The Open Network)
- **Deployment:** Docker, Docker Compose