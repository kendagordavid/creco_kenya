# Deploying the PBO platform (creco-kenya.vercel.app)

## Why production can look unchanged

GitHub **`main`** builds the **repo-root** Next.js app (`app/`, `components/` at the project root).

If Vercel **Root Directory** is still set to **`prototype/web`**, production serves the **older prototype** (stats on the home page, old footer, no `/login`, `/knowledge`, etc.) even after you push new commits.

## Fix (one time in Vercel)

1. Open [Vercel](https://vercel.com) → project **creco-kenya** (or your linked project).
2. **Settings → General → Root Directory**
3. Set to **empty** (repository root) — **not** `prototype/web`.
4. **Settings → Environment Variables** — add **`AUTH_SECRET`** (Production + Preview):
   ```bash
   openssl rand -base64 32
   ```
5. **Storage → Neon** — ensure **`POSTGRES_URL`** is linked to the project (Production + Preview).
6. **Deployments** → latest → **Redeploy** → enable **Clear build cache**.

### Database (first time)

From your machine, with Neon’s connection string in `.env.local`:

```bash
npm run db:setup
```

This creates `users`, `submissions`, and `feedback` tables and seeds demo accounts from `data/users.seed.json`.

## Verify the correct app is live

After redeploy, check:

| URL | Expected |
|-----|----------|
| `/login` | Sign-in page (not 404) |
| `/knowledge` | Knowledge hub |
| `/` | Home **without** “Act commenced / Topics / Languages / Partner” stat tiles |

Root app health (optional): `/api/health`

## Local build (same as Vercel should run)

```bash
npm install
npm run build
npm start
```

## Branch

All platform work is on **`main`**. There is no separate deploy branch unless you created one in Vercel.
