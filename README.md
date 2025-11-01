# 🏰 Pandimus Reborn

A web-based MMORPG inspired by the classic Pandimus game, featuring turn-based combat, idle mechanics, and persistent character progression.

## 🎮 Game Features

- **Character Creation**: Choose from multiple classes with unique abilities
- **Turn-Based Combat**: Strategic battles with monsters and other players
- **Idle Progression**: Continue gaining experience and loot while offline
- **Equipment System**: Weapons, armor, and accessories with stat bonuses
- **World Exploration**: Multiple areas, dungeons, and boss encounters
- **Social Features**: Guilds, chat, trading, and PvP
- **Persistent Data**: Secure login system with character persistence

## 🛠️ Tech Stack

- **Frontend**: React + Phaser.js
- **Backend**: Node.js + Express + Socket.io
- **Database**: PostgreSQL
- **Authentication**: JWT + bcrypt
- **Deployment**: Railway + GitHub

## 🚀 Getting Started

1. Clone the repository and install dependencies: `npm run install-all`
2. Copy `env.example` to `.env` and configure `DATABASE_URL` for your Postgres instance
3. Generate the Prisma client: `npm run prisma:generate`
4. Apply database migrations: `npm run prisma:migrate`
5. Seed baseline data (abilities, items, missions): `npm run prisma:seed`
6. Launch the full stack development environment: `npm run dev`

## 📋 Development Roadmap

- [x] Project setup and architecture
- [x] Character creation system
- [x] Turn-based combat system
- [x] Idle progression mechanics
- [x] World exploration system
- [x] Equipment and loot system
- [x] Social features (guilds, chat, trading)
- [x] PvP and multiplayer features
- [ ] Asset integration and optimization
- [ ] Testing and bug fixes
- [ ] Deployment and production setup

## 🎯 Game Design Philosophy

Pandimus Reborn aims to capture the essence of classic MMORPGs while incorporating modern web technologies and idle game mechanics. Players can enjoy both active gameplay sessions and passive progression, making it perfect for busy schedules.

## 📁 Project Structure

```
PandimusReborn/
├── client/          # React frontend
├── server/          # Node.js backend
├── assets/          # Game assets (images, sounds)
├── public/          # Static files
└── docs/           # Documentation
```

## 🔧 Development Commands

- `npm run dev` – start both frontend and backend with hot reload
- `npm run server` – start backend only (Express + Socket.io)
- `npm run client` – start frontend only (React)
- `npm run build` – build the production UI bundle
- `npm start` – launch the production server
- `npm test` – execute Jest suites (combat math, progression)
- `npm run prisma:generate` – regenerate the Prisma client
- `npm run prisma:migrate` – apply migrations in development
- `npm run prisma:deploy` – apply migrations in production
- `npm run prisma:seed` – seed abilities, items, missions, and enemy templates

## 🧠 Game Loop Overview

Pandimus Reborn aligns active play with meaningful idle rewards:

- **Loadout Planning:** Characters store multiple loadouts (abilities, equipment, targeting). The active loadout steers automation in combat and idle missions.
- **Mission Difficulty:** Each mission defines duration, base XP/gold, enemy compositions, and loot tables. Higher tiers increase multipliers and enemy sophistication.
- **Automated Combat:** Encounters resolve server-side with deterministic seeds. Ability priority, speed-based initiative, buffs (e.g. Guard), and status effects (e.g. Burn) drive outcomes while generating detailed logs.
- **Progression Math:** XP thresholds follow \(100 \times level^{1.6}\). Rewards scale with difficulty, fight efficiency, and victory state. Loot blends guaranteed drops with probabilistic rolls.
- **Idle Dispatch:** Offline sessions return ~60% of the active mission baseline, capped at 12 hours and scaled by character power vs. mission tier.

## 🖥️ Frontend Flow

The React dashboard (`client/src/App.tsx`) offers:

- **Authentication** – login/register with JWT persistence
- **Character Creator** – class selection with stat previews when no hero exists
- **Mission Console** – stats, loadout summary, mission picker, combat & idle actions
- **Encounter Log** – recent combat summaries with XP/gold breakdowns
- **Idle Tracker** – active offline session overview and one-click reward claims

All requests funnel through `client/src/api/client.ts` and honour `REACT_APP_API_URL` overrides.

## 🧪 Testing & Verification

- `npm test` – Jest coverage for combat maths and progression utilities
- `npm run build` – ensures the React client compiles
- Health check – `curl http://localhost:5000/api/health` should return `{ "status": "OK" }`

## 📚 Game Content Reference

- `docs/ability-library.md` – Full catalogue of player abilities, class defaults, and engine notes
- `docs/equipment-library.md` - Gear philosophy, slot-by-slot stat summaries, and rarity guidance
- `docs/enemy-roster.md` - Biome-based enemy roster with level bands and signature mechanics

---

*Inspired by the original Pandimus MMORPG by Bitroit*


