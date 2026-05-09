# Running PeerChain

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Start dev server (frontend + backend API routes)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Bootstrap Script

For a full automated setup:

```bash
chmod +x bootstrap.sh
./bootstrap.sh
```

This installs dependencies, generates the Prisma client, copies the env file, and starts the dev server.

## Architecture

PeerChain uses Next.js API routes as its backend — no separate server needed.

| Layer | Technology | Runs on |
|-------|-----------|---------|
| Frontend | Next.js (React) | `localhost:3000` |
| Backend API | Next.js API Routes | `localhost:3000/api/*` |
| Database | PostgreSQL (via Prisma) | Supabase |
| Blockchain | Solana Devnet | `api.devnet.solana.com` |

## Build for Production

```bash
npm run build
npm run start
```
