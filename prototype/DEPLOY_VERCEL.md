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

## Local dev

```bash
cd prototype/web
npm install
npm run dev
```
