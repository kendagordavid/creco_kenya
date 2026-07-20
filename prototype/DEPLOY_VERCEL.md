# Deploy on Vercel — creco-kenya.vercel.app

The app is in **`prototype/web`**. Vercel accepts **either** setting:

| Root Directory (Settings) | What happens |
|---------------------------|--------------|
| **`prototype/web`** (recommended) | Next.js auto-detect; builds this folder |
| **Empty** (repo root) | Root `vercel.json` runs `npm run build --prefix prototype/web` |

## Fix 404 NOT_FOUND

1. **Settings → General → Root Directory** → set to **`prototype/web`** (or leave empty and use root `vercel.json`).
2. **Remove** env var `NEXT_PUBLIC_API_URL` if it is `http://localhost:8000`.
3. **Deployments → Redeploy** → enable **Clear build cache**.
4. Confirm GitHub **`main`** includes commit with `prototype/web/app/page.tsx`.

## Verify after deploy

- https://creco-kenya.vercel.app/
- https://creco-kenya.vercel.app/api/health → `{"status":"ok",...}`

## AI answers (OpenAI)

Built-in `/api/ask` uses **`OPENAI_API_KEY`** on the server (never expose it to the browser).

1. **Vercel:** Settings → Environment Variables → add `OPENAI_API_KEY` and `OPENAI_MODEL`=`gpt-4.1-mini` (recommended for grounded Q&A and instruction-following).
2. **Local (built-in API):** in `prototype/web/.env.local`, set `OPENAI_API_KEY` and **leave `NEXT_PUBLIC_API_URL` unset**.
3. **Local (FastAPI backend):** keep `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` and put the key in `prototype/backend/.env` instead.

Check mode: `/api/health` → `"answer_mode": "openai"` when the key is active.

## Local dev

```bash
cd prototype/web
npm install
npm run dev
```
