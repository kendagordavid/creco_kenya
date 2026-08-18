# Inception Report — Wireframe Deliverable (ToR #2)

**Project:** Development of a Civic Access and PBO Act Monitoring Web Platform  
**Client:** CRECO Kenya (ICNL Partnership)  
**Consultant:** Emmanuel Kiyai Kendagor  
**Deliverable:** UI/UX designs and wireframes (Week 2)  
**Date:** July 2026

> **Note:** This document covers the wireframe deliverable only. For the full project inception report (32-week methodology, architecture, and work plan), see [`Inception-Report-CRECO-PBO-Platform.md`](Inception-Report-CRECO-PBO-Platform.md) or [`inception-report.html`](inception-report.html).

---

## 1. Purpose

This document accompanies the wireframe deliverable required under the CRECO Kenya Terms of Reference. Wireframes cover all five platform modules, five user roles, six primary user journeys, and four mobile-priority screens. CRECO sign-off on these wireframes is required before full development begins in Week 3.

## 2. Deliverable package

| Item | Location |
|------|----------|
| Interactive wireframe hub | [`wireframes/index.html`](../wireframes/index.html) |
| 48 screen wireframes | [`wireframes/pages/`](../wireframes/pages/) |
| 6 user journey flows | [`wireframes/pages/journey-*.html`](../wireframes/pages/) |
| Sitemap & screen mapping | [`docs/sitemap.md`](sitemap.md) |
| User journey documentation | [`docs/user-journeys.md`](user-journeys.md) |
| PDF export | [`wireframes/export/CRECO-PBO-Wireframes.pdf`](../wireframes/export/CRECO-PBO-Wireframes.pdf) |
| Screen manifest (machine-readable) | [`wireframes/manifest.json`](../wireframes/manifest.json) |

## 3. Design approach

**Fidelity:** Mid-fidelity wireframes — layout, navigation, form fields, content blocks, and role-based access patterns. CRECO brand colours applied (primary green `#0a864d`, accent orange `#ef9334`) without final copy or production imagery.

**Tooling:** HTML/CSS wireframe system generated from [`wireframes/data/screens.mjs`](../wireframes/data/screens.mjs). Screens are reproducible, version-controlled, and exportable to PDF for CRECO submission. A Figma file may be produced by importing PDF/screenshots if CRECO requires native `.fig` format.

**Mobile-first priority:** Dedicated mobile wireframes for Home, Guidance Q&A, Monitoring form, and Admin dashboard summary — aligned with ToR requirements for mobile-friendly, low-bandwidth access.

## 4. Platform structure

One integrated platform with shared header, authentication, search, and analytics — not five separate mini-sites.

| ToR module | Wireframe IDs | Screen count |
|------------|---------------|--------------|
| 1. Legal awareness / Knowledge hub | WF-10 – WF-16 | 7 |
| 2. Compliance tools | WF-20 – WF-26 | 7 |
| 3. Guided Q&A | WF-30 – WF-33 | 5 (+ 1 mobile) |
| 4. Civic space monitoring | WF-40 – WF-46 | 7 (+ 1 mobile) |
| 5. Admin dashboard & CMS | WF-50 – WF-61 | 12 (+ 1 mobile) |
| Global shell & auth | WF-00 – WF-06 | 8 (+ 1 mobile home) |

**Total:** 48 screens + 6 journey flow diagrams.

## 5. User roles wireframed

| Role | Key wireframes |
|------|----------------|
| Public visitor | Home, Knowledge, Compliance, Guidance, Search, Login |
| Registered PBO user | Monitoring forms, My submissions, Profile (role-based nav variant) |
| Content editor | CMS dashboard, Article editor (EN/SW), Media library |
| Moderator | Dashboard, Submissions queue, Q&A flags, MFA login |
| Administrator | User management, Export, Analytics, Settings |

## 6. User journeys documented

1. Public PBO — Home → Knowledge → Self-assessment → Results  
2. Public PBO — Guidance Q&A → Flag → Ask CRECO  
3. Registered PBO — Login → Monitoring → Upload → Confirmation  
4. CRECO moderator — MFA → Pending queue → Approve submission  
5. Content editor — CMS → Edit Kiswahili → Publish  
6. Administrator — Dashboard → Analytics → Export CSV  

Full step-by-step documentation: [`docs/user-journeys.md`](user-journeys.md)

## 7. Relationship to existing prototype

The Next.js prototype ([`app/`](../app/)) demonstrates Module 3 (Guidance Q&A) with working API routes. Wireframes extend this layout pattern across all ToR modules. The prototype is a **technical proof-of-concept**, not a substitute for this wireframe deliverable.

Production development (Week 3+) will use Django/PostgreSQL per the technical proposal. Wireframes guide UI implementation; the prototype informs Q&A module behaviour only.

## 8. CRECO review & sign-off

**Requested from CRECO:**

- [ ] Confirm sitemap covers all required ToR modules  
- [ ] Approve monitoring form fields, consent language, and county tagging  
- [ ] Approve admin/moderation workflow (approve / reject / request info)  
- [ ] Approve mobile layouts for key PBO-facing screens  
- [ ] Sign off before Week 3 development kick-off  

**Review contact:** Named CRECO focal person (Week 1 input per technical proposal)

## 9. Intellectual property

All wireframes, documentation, and exported assets become the property of CRECO Kenya upon contract completion, per the Terms of Reference.

---

**View wireframes:** Open [`wireframes/index.html`](../wireframes/index.html) in a browser, or serve locally:

```bash
cd wireframes && npx --yes serve . -p 3456
```

Then open http://localhost:3456
