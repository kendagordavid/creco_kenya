# CRECO PBO Platform — UI/UX Wireframes

**Standalone review site for CRECO administrators** — not part of the main PBO platform.

**Live:** https://creco-wireframe.vercel.app/

ToR Deliverable #2 · Mid-fidelity wireframes for CRECO sign-off (Week 2)

## Deploy on Vercel

1. Connect this repository: `kendagordavid/creco_wireframe`
2. **Root Directory:** *(leave empty — repo root is the site)*
3. **Framework:** Other (static HTML — no build command)
4. Deploy

`vercel.json` is included for clean URLs.

## Local preview

```bash
npx --yes serve . -p 3456
# Open http://localhost:3456
```

## Regenerate pages (developers)

```bash
node build.mjs
```

Edit screen content in `data/screens.mjs`, then run the build script.

## What's included

| Area | Screens |
|------|---------|
| Overview & sitemap | 1 |
| Global + auth | 7 (+ mobile home) |
| Module 1 — Knowledge hub | 7 |
| Module 2 — Compliance tools | 7 |
| Module 3 — Guided Q&A | 5 (+ mobile) |
| Module 4 — Monitoring | 7 (+ mobile) |
| Module 5 — Admin & CMS | 12 (+ mobile dashboard) |
| User journey flows | 6 |

**PDF:** [`export/CRECO-PBO-Wireframes.pdf`](export/CRECO-PBO-Wireframes.pdf)

## Related project

The working PBO Act platform (Guidance, Topics, API) lives in a **separate repo**: [creco_kenya](https://github.com/kendagordavid/creco_kenya) → https://creco-kenya.vercel.app/

## Sign-off

CRECO Kenya must review and sign off on these wireframes before Week 3 full development, per the Terms of Reference.
