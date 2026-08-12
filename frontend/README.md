# RSS Client (Frontend)

The frontend for the RSS Server & Client project. A standalone Next.js app
(`npx create-next-app`) covering navigation, theming, and usability — it talks to the
`api` app over HTTP, it does not host any API routes itself.

## Pages

| Route        | Purpose                                                                 |
|--------------|--------------------------------------------------------------------------|
| `/`          | Home — project intro and links to the other pages                       |
| `/feeds`     | RSS Client — live feed list wired to the `api` app's CRUD endpoints      |
| `/about`     | Project explanation, student name/number, video walkthrough placeholder  |
| `/settings`  | Theme, feed layout density, and status-ticker visibility preferences     |

**Before submitting:** fill in your real name and student number in
`components/Footer.tsx` and `app/about/page.tsx` (currently placeholders), and embed
your walkthrough video on the About page.

## Talking to the API

All requests go through `lib/api.ts`, which resolves the API's base URL from
`NEXT_PUBLIC_API_URL` (defaults to `http://localhost:4000`). Because this is a
`NEXT_PUBLIC_` variable, it's inlined into the client bundle at **build time** — see
the note in `Dockerfile`.

## Features (Assessment 1 requirements)

- Component-based architecture (`components/`) with shared state via `PreferencesProvider`
- Responsive navbar with a hamburger menu on small screens (CSS-transform animated),
  hide/show via a grid-rows transition
- Light and dark themes, saved to `localStorage`, applied via a `data-theme` attribute;
  an inline script in `app/layout.tsx` applies the saved theme before first paint
- Breadcrumb navigation on every page except Home
- Hide/show blocks: the status ticker (toggle in Settings) and the feed create/edit form
- Keyboard and screen-reader support: `aria-expanded`/`aria-controls` on collapsible
  panels, `role="radiogroup"`/`role="switch"` on custom controls, focus-visible actions

## Running locally

Requires the `api` app running (see its README) — by default at `http://localhost:4000`.

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL if the API runs elsewhere
npm run dev                  # serves on http://localhost:3000
```

## Running with Docker

See the root `docker-compose.yml`, which builds this alongside the `api` app and
Postgres, passing `NEXT_PUBLIC_API_URL` as a build arg:

```bash
docker compose up --build
```
