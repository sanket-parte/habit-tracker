# Habit Tracker (Habit Garden)

Side project built with AI coding agents.

A gamified habit tracker. Users sign up, create daily or weekly habits, log completions with an optional note and mood, and earn XP that levels up a plant shown in the UI. The backend is a FastAPI service backed by PostgreSQL; the frontend is a React PWA served by nginx.

## Features

- Account signup and login (JWT bearer tokens, bcrypt-hashed passwords)
- Create, edit, and delete habits with title, description, frequency (daily or weekly), time of day (any, morning, afternoon, evening), color, icon, motivation ("why"), and duration in minutes
- Log a habit completion with an optional note and mood; one completion per day (daily habits) or per week (weekly habits)
- Gamification: +10 XP per completion, level-up when XP reaches `level * 100` (XP resets to 0 on level-up), and a plant that grows with level (Seedling, Sapling, Blooming, Forest)
- Habit heatmap, analytics page (with per-habit streaks), and a settings page with light/dark theme and logout
- Installable PWA (manifest name "Habit Garden") via `vite-plugin-pwa`
- Paginated habit list (infinite loading)

## Tech stack

- Backend: Python 3.11+, FastAPI, SQLAlchemy 2, Alembic, Pydantic v2, python-jose (JWT), passlib/bcrypt, Uvicorn, PostgreSQL 15
- Frontend: React 19, Vite 7, Tailwind CSS 3, TanStack Query, Axios, Framer Motion, Lucide icons, vite-plugin-pwa
- Infrastructure: Docker, Docker Compose, nginx, GitHub Actions, GitHub Container Registry (GHCR), nginx-proxy with acme-companion (Let's Encrypt) in production

## Project structure

```
.
├── backend/                 FastAPI app
│   ├── app/
│   │   ├── api/             Routers (auth, users, habits) and dependencies
│   │   ├── core/            Settings and security (JWT, hashing)
│   │   ├── db/              SQLAlchemy base and session
│   │   ├── models/          User, Habit, HabitLog
│   │   └── schemas/         Pydantic schemas
│   ├── alembic/             Database migrations
│   ├── entrypoint.sh        Runs `alembic upgrade head`, then starts the server
│   └── Dockerfile
├── frontend/                React + Vite PWA
│   ├── src/features/        auth, habits, analytics, gamification, settings
│   ├── nginx.conf           Static serving and /api proxy to the backend
│   └── Dockerfile
├── docker-compose.yml       Local stack: frontend, backend, db
├── docker-compose.prod.yml  Production stack with TLS and DB bootstrap
├── db-init.sh               Creates the app DB user and database (production)
└── .github/workflows/       deploy.yml, cleanup-packages.yml
```

## Getting started

### Prerequisites

- Docker with Docker Compose v2
- Optional, for running without Docker: Python 3.11+ and Node.js 20+

### Run with Docker Compose

```sh
docker compose up --build
```

This starts:

| Service  | URL / port                                    |
|----------|-----------------------------------------------|
| frontend | http://localhost (port 80, nginx)             |
| backend  | http://localhost:8000 (API under `/api/v1`)   |
| db       | PostgreSQL on localhost:5432                  |

Interactive API docs are available at http://localhost:8000/docs. Migrations run automatically when the backend container starts.

The local compose file contains development credentials for the database (`postgres`/`postgres`); do not reuse them outside local development.

### Run without Docker

Backend (requires a reachable PostgreSQL; defaults point at `localhost`):

```sh
cd backend
uv sync            # or: pip install .
alembic upgrade head
uvicorn app.main:app --reload
```

Frontend:

```sh
cd frontend
npm ci
npm run dev
```

The frontend API client currently targets `http://localhost:8000/api/v1` (hardcoded in `frontend/src/lib/api.js`).

### Environment variables

There is no `.env.example`; the backend reads these from the environment (names only):

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | JWT signing key (has an insecure default; always set in production) |
| `BACKEND_CORS_ORIGINS` | Allowed origins, comma-separated or a JSON list |
| `POSTGRES_SERVER`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Database connection parts |
| `SQLALCHEMY_DATABASE_URI` | Full database URI; overrides the parts above |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token lifetime (default: 1 week) |

Production compose additionally uses `GITHUB_REPOSITORY`, `DOMAIN_NAME`, `SSL_EMAIL`, `APP_USER`, `APP_PASSWORD`, `APP_DB`, and `DATABASE_URL`.

### Linting

```sh
cd frontend && npm run lint
cd backend && ruff check .
```

## Deployment and CI

`.github/workflows/deploy.yml` runs on pushes to `main` (and manually):

1. Detects changed paths (`frontend/`, `backend/`, deploy files).
2. Builds and pushes the changed images to GHCR as `ghcr.io/<owner>/<repo>-frontend:latest` and `-backend:latest`, with GitHub Actions layer caching.
3. Over SSH, copies `docker-compose.prod.yml` and `db-init.sh` to `~/habit-tracker` on the host, logs in to GHCR, pulls the images, and runs `docker compose up -d`.

The production stack runs `nginx-proxy` plus `acme-companion` for HTTPS (domain from `DOMAIN_NAME`), a Postgres container, an `init-db` job that creates the application user and database, and the backend (which applies migrations on start).

Required GitHub secrets: `HOST`, `USERNAME`, `SSH_KEY`, `POSTGRES_PASSWORD`, `APP_USER`, `APP_PASSWORD`, `APP_DB`, `SECRET_KEY`, `BACKEND_CORS_ORIGINS`.

`.github/workflows/cleanup-packages.yml` runs weekly (and manually) to delete untagged GHCR container versions, keeping the latest two.
