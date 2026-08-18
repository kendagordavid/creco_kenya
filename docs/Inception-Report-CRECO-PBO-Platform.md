# Inception Report

**Development of a Civic Access and PBO Act Monitoring Web Platform**

| | |
|---|---|
| **Client** | CRECO Kenya · **Partner** ICNL |
| **Consultant** | Emmanuel Kiyai Kendagor · emmanuelkens@gmail.com · +254 708 454 455 |
| **Date** | August 2026 · **Period** Weeks 1–32 · **Version** 1.0 |

---

## 1. Summary

CRECO Kenya, with ICNL, is building one integrated web platform to help PBOs understand the PBO Act, check compliance readiness, ask guided questions, and report implementation experiences. The assignment runs **32 weeks**: eight weeks to design, build, test, deploy, and hand over; twenty-four weeks of post-launch support.

**Inception status:** Complete. Wireframes, this report, and a live Guidance Q&A prototype are ready for CRECO sign-off before development continues in Week 3.

| Done | Pending |
|------|---------|
| Sitemap, user journeys, 48 wireframes | CRECO wireframe sign-off |
| Technical architecture defined | Approved legal content & branding |
| Prototype live | Hosting confirmed (Week 6) |
| Wireframe site live | Full build (Weeks 3–7) |

**Links:** [Prototype](https://creco-kenya.vercel.app/) · [Wireframes](https://creco-wireframe.vercel.app/) · [Wireframe PDF](https://creco-wireframe.vercel.app/export/CRECO-PBO-Wireframes.pdf)

---

## 2. Scope

One platform, five modules, five roles:

| Module | Purpose |
|--------|---------|
| Knowledge hub | Plain-language & Kiswahili content, FAQs, toolkits, media |
| Compliance tools | Checklist, self-assessment, downloadable templates |
| Guided Q&A | Answers from CRECO-approved materials only; flag & Ask CRECO |
| Monitoring | Structured reports, county tagging, uploads, consent |
| Admin & CMS | Dashboard, moderation, analytics, exports, user management |

| Role | Access |
|------|--------|
| Public | Open content and basic tools |
| PBO user | Monitoring, saved assessments, uploads |
| Editor / Moderator / Admin | CMS, review queue, dashboard, exports (staff use MFA) |

---

## 3. Methodology

Participatory delivery: CRECO co-design → wireframe sign-off → three development sprints on staging → UAT → go-live → handover → monthly support.

| Week | Focus |
|------|-------|
| 1–2 | Inception, wireframes, technical specs |
| 3 | Core site, auth, CMS, knowledge hub |
| 4 | Compliance tools, search, Q&A |
| 5 | Monitoring, dashboard, analytics |
| 6 | Testing & UAT |
| 7 | Deployment & training |
| 8 | Handover & final report |
| 9–32 | Bug fixes, patches, monthly check-ins |

Weekly reviews with a CRECO focal person during Weeks 1–8.

---

## 4. Technical approach

| Layer | Choice |
|-------|--------|
| Backend | Django + PostgreSQL |
| Frontend | Responsive HTML, mobile-first, low bandwidth |
| Q&A | Approved corpus + citations; optional AI polish in prototype only |
| Storage | Secure media for uploads |
| Analytics | Matomo or Plausible |
| Hosting | CRECO-approved VPS/cloud, HTTPS, daily backups |

The current [Next.js prototype](https://creco-kenya.vercel.app/) validates Module 3 UX. Production follows wireframes on Django.

---

## 5. Security & ethics

- HTTPS, encryption at rest, RBAC, MFA for staff, audit logs
- Privacy notice and consent aligned with Kenya Data Protection Act, 2019
- Monitoring data confidential; no public incident reports without staff approval
- WCAG 2.1 AA target; Kiswahili on key journeys
- Q&A clearly disclaims legal advice; flagged responses go to staff review

---

## 6. Deliverables

| # | Deliverable | When | Status |
|---|-------------|------|--------|
| 1 | Inception report | Week 2 | **Done** |
| 2 | UI/UX wireframes | Week 2 | **Done** — sign-off needed |
| 3 | Full platform | Week 7 | Planned |
| 4 | Monitoring dashboard | Week 5–8 | Planned |
| 5 | Source code & docs | Week 7–8 | Planned |
| 6 | Manuals & training (2 sessions) | Week 7 | Planned |
| 7 | Final report | Week 8 | Planned |
| 8 | Post-deployment support | Weeks 9–32 | Planned |

All outputs belong to CRECO Kenya on completion.

---

## 7. Risks & CRECO inputs

| Risk | Mitigation |
|------|------------|
| Late content | Week 1 audit; sample content for testing |
| Wrong Q&A answers | Approved sources only; staff review queue |
| Low uptake | Mobile-first design, Kiswahili, simple registration |
| Hosting delay | Confirm hosting by Week 6 |

**CRECO to provide:** approved PBO Act materials, branding, named focal person, wireframe sign-off, pilot PBOs for UAT (Week 6), hosting (Week 6).

---

## 8. Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Consultant | Emmanuel Kiyai Kendagor | | |
| CRECO focal person | | | |
| CRECO authorising officer | | | |

**Emmanuel Kiyai Kendagor** · ToR Deliverable #1
