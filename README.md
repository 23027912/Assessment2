# The Wire — RSS Server & Client

Two independent Next.js apps (each scaffolded with `npx create-next-app`) that together
form the RSS Server & Client project:

- **`frontend/`** — the RSS Client UI: Home, Feeds, About, Settings pages, navigation,
  theming, usability features. Contains no API routes.
- **`api/`** — the RSS Server: CRUD API for feed entries, a Prisma/PostgreSQL database,
  and `/api/health` + `/api/count` operational endpoints. Contains no pages beyond a
  simple status index.

They communicate over HTTP: the frontend calls the api app's endpoints from the browser,
with CORS enabled on the api side.

```
rss-split/
  frontend/     # npx create-next-app — RSS Client
  api/          # npx create-next-app — RSS Server
  docker-compose.yml
```

## Running everything with Docker (recommended)

From this root folder:

```bash
docker compose up --build
```

This starts, in order: Postgres → a one-off Prisma migration → the `api` service
(port 4000) → the `frontend` service (port 3000).

- Frontend: http://localhost:3000
- API: http://localhost:4000 (try http://localhost:4000/api/health)

To seed demo feed data:

```bash
docker compose exec api node prisma/seed.js
```

## Running each app locally without Docker

You'll need a local PostgreSQL instance, then run each app in its own terminal.

**1. API** (see `api/README.md` for details):
```bash
cd api
npm install
cp .env.example .env
npx prisma migrate dev --name init
npm run dev      # http://localhost:4000
```

**2. Frontend** (see `frontend/README.md` for details):
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev      # http://localhost:3000
```

## Before submitting

- Fill in your name and student number in `frontend/components/Footer.tsx` and
  `frontend/app/about/page.tsx` (currently placeholders)
- Embed your walkthrough video on the About page
- Push both `frontend/` and `api/` to GitHub with meaningful commits and feature
  branches, and remove `node_modules` from both before zipping for submission
