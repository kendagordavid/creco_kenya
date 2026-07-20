# Deploy on Vercel

The Next.js app is at the **repository root** (`app/`, `package.json`). Vercel should use default settings:

- **Framework:** Next.js (auto-detected)
- **Root Directory:** leave empty / `.`
- **Build command:** `npm run build`
- **Install command:** `npm install`

## After connecting GitHub

1. Import `kendagordavid/creco_kenya`
2. Do **not** set Root Directory to `prototype/web` (outdated)
3. Deploy — open `/`, `/guidance`, `/api/health`

## Built-in API (no separate backend)

Wiki Q&A runs on Vercel via `/api/ask`, reading `prototype/wiki/`.  
Do **not** set `NEXT_PUBLIC_API_URL` unless you host the Python API separately.

## Optional external backend

Set `NEXT_PUBLIC_API_URL` to your FastAPI URL (Render/Railway) to use `prototype/backend` instead.

## If you still see 404

- Confirm latest commit includes `app/page.tsx` at repo root
- Redeploy with **Clear build cache**
- Remove old Root Directory override (`prototype/web`) in project settings
