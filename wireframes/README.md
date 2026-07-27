# CRECO PBO Platform — UI/UX Wireframes

ToR Deliverable #2 · Mid-fidelity wireframes for CRECO sign-off (Week 2)

## Quick start

```bash
# Regenerate all pages after editing data/screens.mjs
node wireframes/build.mjs

# View in browser
npx --yes serve wireframes -p 3456
# Open http://localhost:3456
```

## Structure

```
wireframes/
├── index.html              # Hub — links to all screens & journeys
├── manifest.json           # Screen inventory (generated)
├── build.mjs               # HTML generator
├── export/                 # PDF deliverable
├── assets/
│   └── wireframe.css       # Mid-fidelity styles + CRECO branding
├── data/
│   └── screens.mjs         # All screen & journey definitions
├── lib/
│   └── render.mjs        # HTML rendering helpers
└── pages/                  # Generated wireframe HTML (48 screens + 6 journeys)
```

## Coverage

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

## Mobile wireframes

Dedicated mobile frames (390px) for ToR-priority flows:

- `01-home-mobile.html`
- `30-guidance-mobile.html`
- `41-monitoring-registration-mobile.html`
- `50-dashboard-mobile.html`

## Documentation

- [Sitemap](../docs/sitemap.md) — screen-to-module mapping
- [User journeys](../docs/user-journeys.md) — six primary flows
- [Inception report — wireframes](../docs/inception-report-wireframes.md) — CRECO deliverable summary

## PDF export

```bash
node wireframes/export-pdf.mjs
```

Output: `wireframes/export/CRECO-PBO-Wireframes.pdf`

Requires Chromium (via Puppeteer, installed on first run).

## Figma import (optional)

To produce a native Figma file for CRECO:

1. Open the PDF or individual PNG screenshots in Figma (File → Import)
2. Or use Figma's HTML-to-design plugins with `wireframes/pages/*.html`

The HTML wireframes are the source of truth in this repository.

## Editing wireframes

1. Edit screen content in `data/screens.mjs`
2. Run `node build.mjs`
3. Commit updated `pages/` output

Do not edit generated HTML in `pages/` directly — changes will be overwritten.

## Sign-off

CRECO Kenya must review and sign off on these wireframes before Week 3 full development, per the Terms of Reference.
