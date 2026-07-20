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

## AI answers (OpenAI) — required for production

**Local `.env` / `.env.local` files are never uploaded to Vercel.**  
If `/api/health` shows `"answer_mode":"wiki_direct"`, AI is **not** active on the live site.

### Step-by-step (Vercel dashboard)

1. Open [vercel.com](https://vercel.com) → your **creco-kenya** project.
2. **Settings** → **Environment Variables**.
3. Add **`OPENAI_API_KEY`**
   - Value: your key from [OpenAI API keys](https://platform.openai.com/account/api-keys) (starts with `sk-`).
   - Environments: check **Production** (and **Preview** if you use preview URLs).
4. Add **`OPENAI_MODEL`** = `gpt-4.1-mini` (same environments).
5. **Delete** **`NEXT_PUBLIC_API_URL`** if it exists (especially `http://localhost:8000`).
6. **Deployments** tab → ⋮ on latest deployment → **Redeploy** → enable **Clear build cache** if offered.
7. Wait ~1–2 minutes, then open:  
   https://creco-kenya.vercel.app/api/health  

   Success looks like:

   ```json
   {
     "status": "ok",
     "answer_mode": "openai",
     "ai_ready": true,
     "setup_hint": null
   }
   ```

8. On **Guidance**, ask a question — badges should show **AI · compiled topics** or **AI · general reference**.

### Local only (optional)

- **Built-in `/api`:** `prototype/web/.env.local` with `OPENAI_API_KEY` (do not commit).
- **FastAPI backend:** `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` + key in `prototype/backend/.env`.

## Local dev

```bash
cd prototype/web
npm install
npm run dev
```
