# RSS Server API

The backend service for the RSS Server & Client project. A standalone Next.js app
(`npx create-next-app`) that exposes a CRUD API over a PostgreSQL database via Prisma,
plus operational monitoring endpoints. Runs independently from the `frontend` app.

## Endpoints

| Method | Route              | Description                          |
|--------|--------------------|---------------------------------------|
| GET    | `/api/feeds`       | List feeds (`?author=`, `?category=`) |
| POST   | `/api/feeds`       | Create a feed                         |
| GET    | `/api/feeds/:id`   | Get one feed                          |
| PUT    | `/api/feeds/:id`   | Update a feed                         |
| DELETE | `/api/feeds/:id`   | Delete a feed                         |
| GET    | `/api/health`      | Server + DB liveness check            |
| GET    | `/api/count`       | Request counts + total feed count     |

All CRUD responses follow `{ success, data | error }`. CORS is enabled (see
`middleware.ts`) for the origin set in `FRONTEND_ORIGIN`, so the separately-hosted
frontend app can call these routes from the browser.

## Database schema

`Feed` — id, title, author, content, summary, imageUrl, link, category, publishedAt,
createdAt, updatedAt.

`RequestStat` — one row per route, incremented on every call, backing `/api/count`.

See `prisma/schema.prisma` for the full definitions.

## Running locally

Requires Node 20+ and a running PostgreSQL instance.

```bash
npm install
cp .env.example .env        # set DATABASE_URL and FRONTEND_ORIGIN
npx prisma migrate dev --name init
npm run seed                # optional demo data
npm run dev                 # serves on http://localhost:4000
```

## Running with Docker

See the root `docker-compose.yml`, which runs this alongside Postgres and the
frontend app:

```bash
docker compose up --build
```

The API will be reachable at `http://localhost:4000`.
