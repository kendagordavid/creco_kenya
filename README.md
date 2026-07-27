# CRECO Kenya — PBO Act platform prototype

## Live on Vercel

Connect the GitHub repo with **default settings** (root = repository root). No Root Directory override needed.

The site includes **built-in API routes** (`/api/ask`, `/api/sources`, …) that read wiki topics from `prototype/wiki/`. You do **not** need a separate backend for demos.

Optional: set `NEXT_PUBLIC_API_URL` to a deployed FastAPI server instead.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Python backend (optional):

```bash
cd prototype/backend && source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
# Then set NEXT_PUBLIC_API_URL=http://localhost:8000 in .env.local
```

## Wireframes (ToR Deliverable #2)

Mid-fidelity UI/UX wireframes for CRECO sign-off — 48 screens, 6 user journeys, mobile variants.

```bash
node wireframes/build.mjs          # Regenerate HTML
npx --yes serve wireframes -p 3456 # View at http://localhost:3456
```

See [`wireframes/README.md`](wireframes/README.md), [`docs/sitemap.md`](docs/sitemap.md), and [`docs/inception-report-wireframes.md`](docs/inception-report-wireframes.md).

## Repo layout

| Path | Purpose |
|------|---------|
| `app/`, `components/`, `lib/` | Next.js frontend + Vercel API |
| `wireframes/` | ToR wireframe deliverable (HTML + PDF export) |
| `docs/` | Sitemap, user journeys, inception wireframe report |
| `prototype/wiki/` | PBO Act topic pages (bundled with deploy) |
| `prototype/backend/` | Optional FastAPI server |

See [prototype/HOW_TO_USE.md](prototype/HOW_TO_USE.md) and [prototype/DEPLOY_VERCEL.md](prototype/DEPLOY_VERCEL.md).
