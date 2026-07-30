# CRECO Kenya — PBO Act platform prototype

## Live on Vercel

1. Push this repo to GitHub (`kendagordavid/creco_kenya`).
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Use **default settings** — Framework: Next.js, Root Directory: *(empty / repo root)*.
4. Add environment variable (optional, for AI-polished guidance answers):
   - `OPENAI_API_KEY` — your OpenAI API key (Production + Preview)
5. Deploy.

**URLs after deploy:**

| URL | What |
|-----|------|
| `/` | PBO Act platform (Guidance, Topics, Sources) |
| `/guidance` | PBO Act guidance Q&A |
| `/topics` | Topic library |
| `/sources` | Source documents |

The site includes **built-in API routes** (`/api/ask`, `/api/sources`, …) that read wiki topics from `prototype/wiki/`. You do **not** need a separate backend for demos.

Optional: set `NEXT_PUBLIC_API_URL` to a deployed FastAPI server instead.

CLI deploy:

```bash
npx vercel          # preview
npx vercel --prod   # production
```

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

Mid-fidelity UI/UX wireframes for CRECO sign-off — deployed **separately** from this app (see [`wireframes/README.md`](wireframes/README.md)).

## Repo layout

| Path | Purpose |
|------|---------|
| `app/`, `components/`, `lib/` | Next.js frontend + Vercel API |
| `wireframes/` | ToR wireframe deliverable (HTML + PDF export) |
| `docs/` | Sitemap, user journeys, inception wireframe report |
| `prototype/wiki/` | PBO Act topic pages (bundled with deploy) |
| `prototype/backend/` | Optional FastAPI server |

See [prototype/HOW_TO_USE.md](prototype/HOW_TO_USE.md) and [prototype/DEPLOY_VERCEL.md](prototype/DEPLOY_VERCEL.md).
