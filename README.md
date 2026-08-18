# CRECO Kenya — PBO Act platform

> **Production deploy:** The live app must build from the **repository root**, not `prototype/web`.  
> If https://creco-kenya.vercel.app still shows old home stats or a dark AI-style footer, follow **[DEPLOY.md](./DEPLOY.md)**.

## Live on Vercel

1. Push this repo to GitHub (`kendagordavid/creco_kenya`).
2. In [Vercel](https://vercel.com/new), **Import** the repository.
3. Use **default settings** — Framework: Next.js, Root Directory: *(empty / repo root)*.
4. Add environment variables:
   - `AUTH_SECRET` — session signing secret (required for login)
   - `OPENAI_API_KEY` — optional, for AI-polished guidance answers (Production + Preview)
5. Deploy.

**URLs after deploy:**

| URL | What |
|-----|------|
| `/` | Platform home — all five modules |
| `/knowledge` | Knowledge hub (topics, FAQs, toolkits, media) |
| `/compliance` | Checklist, self-assessment, templates |
| `/guidance` | PBO Act guidance Q&A |
| `/monitoring` | Civic space monitoring reports |
| `/login` | Sign in (demo: `demo@pbo.org` / `demo1234`) |
| `/register` | PBO user registration |
| `/search` | Global search |
| `/sources` | Source documents |
| `/topics` | Topic library (legacy route) |

Set **`AUTH_SECRET`** in Vercel (Production + Preview) — generate with `openssl rand -base64 32`.

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

## Inception report (ToR Deliverable #1)

Full project inception report — methodology, architecture, and **32-week work plan** (inception through post-deployment support):

| Format | Location |
|--------|----------|
| Markdown (source) | [`docs/Inception-Report-CRECO-PBO-Platform.md`](docs/Inception-Report-CRECO-PBO-Platform.md) |
| HTML (CRECO review) | [`docs/inception-report.html`](docs/inception-report.html) |
| Wireframe site copy | https://creco-wireframe.vercel.app/docs/inception-report.html |

Open the HTML version in a browser and use **Print → Save as PDF** for submission.

## Wireframes (ToR Deliverable #2)

Mid-fidelity UI/UX wireframes for CRECO sign-off — **hosted separately**:

**https://creco-wireframe.vercel.app/**

Source repo: [`kendagordavid/creco_wireframe`](https://github.com/kendagordavid/creco_wireframe)

## Repo layout

| Path | Purpose |
|------|---------|
| `app/`, `components/`, `lib/` | Next.js frontend + Vercel API |
| `wireframes/` | ToR wireframe deliverable (HTML + PDF export) |
| `docs/` | Sitemap, user journeys, **full inception report** |
| `prototype/wiki/` | PBO Act topic pages (bundled with deploy) |
| `prototype/backend/` | Optional FastAPI server |

See [prototype/HOW_TO_USE.md](prototype/HOW_TO_USE.md) and [prototype/DEPLOY_VERCEL.md](prototype/DEPLOY_VERCEL.md).
