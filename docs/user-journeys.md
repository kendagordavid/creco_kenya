# CRECO PBO Platform — User Journeys

Wireframe flow diagrams for CRECO sign-off. Each journey links to individual screen wireframes in [`wireframes/`](../wireframes/).

---

## Journey 1 — Public PBO: Knowledge → Self-assessment

**Actor:** Public visitor (PBO staff)  
**Goal:** Understand registration requirements and assess compliance readiness

| Step | Screen | Action |
|------|--------|--------|
| 1 | [Home](../wireframes/pages/01-home-desktop.html) | Land on platform, browse five module entry points |
| 2 | [Knowledge hub](../wireframes/pages/10-knowledge-hub.html) | Filter by guides, select registration topic |
| 3 | [Topic detail](../wireframes/pages/12-topic-detail.html) | Read plain-language summary, toggle EN/SW |
| 4 | [Compliance hub](../wireframes/pages/20-compliance-hub.html) | Open self-assessment tool |
| 5 | [Assessment results](../wireframes/pages/24-assessment-results.html) | View score by domain, download recommendations |

**Wireframe flow:** [journey-01-knowledge-assessment.html](../wireframes/pages/journey-01-knowledge-assessment.html)

---

## Journey 2 — Public PBO: Guidance Q&A → Flag → Ask CRECO

**Actor:** Public visitor  
**Goal:** Get an answer about the PBO Act; escalate if inaccurate

| Step | Screen | Action |
|------|--------|--------|
| 1 | [Home](../wireframes/pages/01-home-desktop.html) | Click "Ask a question" |
| 2 | [Guidance](../wireframes/pages/30-guidance-desktop.html) | Type question (EN or SW), see disclaimer |
| 3 | [Answer view](../wireframes/pages/31-answer-view.html) | Read structured answer with source citations |
| 4 | [Flag feedback](../wireframes/pages/32-flag-feedback.html) | Report inaccurate response |
| 5 | [Ask CRECO](../wireframes/pages/33-ask-creco.html) | Send complex question to staff for human follow-up |

**Wireframe flow:** [journey-02-guidance-flag.html](../wireframes/pages/journey-02-guidance-flag.html)

---

## Journey 3 — Registered PBO: Login → Monitoring → Upload

**Actor:** Registered PBO user  
**Goal:** Submit a structured report on registration experience

| Step | Screen | Action |
|------|--------|--------|
| 1 | [Login](../wireframes/pages/02-login.html) | Authenticate with PBO account |
| 2 | [Monitoring hub](../wireframes/pages/40-monitoring-hub.html) | Choose "Registration experience" report type |
| 3 | [Registration form](../wireframes/pages/41-monitoring-registration-desktop.html) | Fill county, issue type, narrative |
| 4 | [Upload & consent](../wireframes/pages/44-monitoring-upload.html) | Attach supporting docs, confirm Data Protection consent |
| 5 | [Confirmation](../wireframes/pages/45-monitoring-confirmation.html) | Receive reference ID; status = pending moderation |

**Mobile variant:** [41-monitoring-registration-mobile.html](../wireframes/pages/41-monitoring-registration-mobile.html)

**Wireframe flow:** [journey-03-monitoring-submit.html](../wireframes/pages/journey-03-monitoring-submit.html)

---

## Journey 4 — CRECO Moderator: MFA → Approve submission

**Actor:** Moderator (staff)  
**Goal:** Review and approve a pending monitoring submission

| Step | Screen | Action |
|------|--------|--------|
| 1 | [Staff login + MFA](../wireframes/pages/60-login-mfa.html) | Verify two-factor authentication |
| 2 | [Dashboard](../wireframes/pages/50-dashboard-desktop.html) | See pending moderation KPI |
| 3 | [Submissions list](../wireframes/pages/51-submissions-list.html) | Filter status = pending |
| 4 | [Submission detail](../wireframes/pages/52-submission-detail.html) | Review narrative, approve / reject / request info |

**Wireframe flow:** [journey-04-moderation.html](../wireframes/pages/journey-04-moderation.html)

---

## Journey 5 — Content Editor: CMS → Edit Kiswahili → Publish

**Actor:** Content editor (staff)  
**Goal:** Publish Kiswahili translation of a knowledge hub article

| Step | Screen | Action |
|------|--------|--------|
| 1 | [CMS dashboard](../wireframes/pages/56-cms-dashboard.html) | Open draft article |
| 2 | [Article editor](../wireframes/pages/57-article-editor.html) | Switch to Kiswahili tab, edit content |
| 3 | [Topic detail](../wireframes/pages/12-topic-detail.html) | Published article visible on public knowledge hub |

**Wireframe flow:** [journey-05-cms-publish.html](../wireframes/pages/journey-05-cms-publish.html)

---

## Journey 6 — Administrator: Dashboard → Export CSV

**Actor:** Administrator (staff)  
**Goal:** Export monitoring data for advocacy report

| Step | Screen | Action |
|------|--------|--------|
| 1 | [Dashboard](../wireframes/pages/50-dashboard-desktop.html) | Review county-level submission trends |
| 2 | [Analytics](../wireframes/pages/54-analytics-trends.html) | Drill into issue types over time |
| 3 | [Export](../wireframes/pages/55-export-data.html) | Filter by date/county, download CSV |

**Wireframe flow:** [journey-06-admin-export.html](../wireframes/pages/journey-06-admin-export.html)

---

## Cross-cutting requirements (all journeys)

- **Disclaimer:** "Not legal advice" on Q&A and compliance screens
- **Privacy:** Consent at registration and monitoring submission (Kenya Data Protection Act, 2019)
- **Confidentiality:** Monitoring submissions not public without staff approval
- **Mobile:** Key PBO-facing flows available on low-bandwidth mobile devices
- **Kiswahili:** Language toggle on knowledge hub and key user journeys
