# Technical Proposal

**Development of a Civic Access and PBO Act Monitoring Web Platform**

| | | | |
|---|---|---|---|
| **Consultant** | Emmanuel Kiyai Kendagor | **Date** | June 2026 |
| **Email** | emmanuelkens@gmail.com | **Submitted to** | CRECO Kenya |
| **Phone** | 254 708 454 455 | **Deadline** | 30 June 2026, 5:00 PM |
| **Project partner** | ICNL | **Document type** | Technical proposal |

---

## 1. Introduction

I am submitting this technical proposal in response to CRECO Kenya's call for a web developer to build a civic access and PBO Act monitoring platform. The assignment is to develop a working website that helps Public Benefit Organizations understand the PBO Act, check compliance readiness, ask questions about the law, and report experiences on the ground including registration delays, administrative barriers, enabling practices, and civic space incidents.

CRECO needs a platform that staff can manage after handover, that PBOs can use on phones with ordinary data bundles, and that produces data CRECO can use in reports and advocacy. My CV, financial proposal, portfolio, and references are attached separately.

---

## 2. Understanding of the assignment

CRECO Kenya, with ICNL, is implementing a project on safeguarding civic space through legal awareness and monitoring of PBO Act implementation. The platform is the central tool for this work.

| User group | What they need from the platform |
|---|---|
| PBO staff | Plain explanations of the law, compliance tools, and a channel to report experiences |
| Community organisations | Mobile-friendly access, Kiswahili content, simple navigation |
| CRECO staff | CMS to publish content, moderate submissions, and export reports |
| Partners | Aggregated insights, not raw confidential submissions |

| No. | Platform function | What it covers |
|---|---|---|
| 1 | Legal awareness | Summaries, Kiswahili versions, toolkits, FAQs, infographics, videos |
| 2 | Compliance tools | Checklists, self-assessment with scoring, downloadable templates |
| 3 | Guided Q&A | Answers drawn only from CRECO-approved PBO Act materials |
| 4 | Monitoring | Structured reports from PBOs, incident logging, document uploads |
| 5 | Admin dashboard | Review submissions, view trends, export data |

CMS, user accounts, role-based access, search, analytics, SEO, security, training, documentation, and post-launch support all fall within these five areas. I will build one integrated system.

---

## 3. Work plan and schedule

I will begin with a kick-off meeting, review of approved PBO Act documents, and agreement on branding. CRECO will sign off on wireframes before full development begins.

| Phase | Period | Main activities | Outputs |
|---|---|---|---|
| Inception and design | Weeks 1 to 2 | Kick-off, content review, user journeys, wireframes | Inception report, wireframes, technical specs |
| Development | Week 3 | Core site, auth, roles, CMS, knowledge hub | Staging prototype |
| Development | Week 4 | Compliance tools, search, SEO, Q&A module | Working tools on staging |
| Development | Week 5 | Monitoring forms, admin dashboard, analytics | Full module set on staging |
| Testing | Week 6 | Functional, security, mobile, and UAT testing | UAT fixes completed |
| Deployment | Week 7 | Go-live, HTTPS, backups, staff training | Live platform, manuals |
| Handover | Week 8 | Final revisions, source code transfer, final report | Signed deliverables |
| Support | Weeks 9 to 32 | Bug fixes, patches, monthly check-ins | Ongoing maintenance |

| CRECO input required | When needed |
|---|---|
| Approved legal content and branding | Week 1 |
| Named focal person for weekly review | Week 1 |
| Confirmed hosting environment | Week 6 |
| Pilot PBO users for UAT | Week 6 |

---

## 4. Technical approach

| Layer | Choice | Reason |
|---|---|---|
| Backend | Django (Python) | Strong admin and CMS, secure, proven for content-heavy platforms |
| Database | PostgreSQL | Structured monitoring data, full-text search, reliable exports |
| Frontend | Responsive HTML and light JavaScript | Fast on mobile and low-bandwidth connections |
| File storage | Secure object or media storage | Controlled uploads with type and size limits |
| Search | PostgreSQL full-text search | Fast filtering; expandable if content grows |
| Analytics | Matomo or Plausible | Privacy-conscious usage tracking |
| Hosting | CRECO-approved VPS or cloud | Kenya-accessible performance, daily backups |

| Role | Access |
|---|---|
| Public visitor | Open content and basic tools where no login is required |
| Registered PBO user | Monitoring submissions, saved assessments, Q&A, document uploads |
| Content editor | Articles, FAQs, toolkits, Kiswahili pages, media |
| Moderator | Review, approve, or reject submissions |
| Administrator | User management, exports, system settings, full dashboard |

Administrators and moderators will use multi-factor authentication.

| Module | Description |
|---|---|
| Knowledge hub | CMS-managed plain-language summaries, Kiswahili translations, guides, FAQs, infographics, and videos with search by content type, language, and topic |
| Compliance checklist | Interactive checklist that PBOs can complete online, save, or print |
| Self-assessment | Questionnaire mapped to the PBO Act with automated scoring and links to relevant resources |
| Template library | Downloadable board resolutions, policies, and reporting formats with usage notes |
| Monitoring module | Structured forms for registration experiences, delays, enabling practices, and civic space incidents with county tagging and optional uploads |
| Admin dashboard | Submission counts, trends by county and issue type, self-assessment patterns, and site usage summaries |

| Q&A feature | Approach |
|---|---|
| Source control | Answers drawn only from CRECO-approved Act, regulations, summaries, and FAQs |
| Response format | Structured answers with source references on each response |
| FAQ matching | Direct matching for common questions |
| Legal disclaimer | Clear notice that responses are not legal advice |
| Quality control | Users can flag responses; staff review flagged items |
| Human follow-up | Form to send complex questions to CRECO staff |

| Security measure | Implementation |
|---|---|
| Transmission | HTTPS on all connections |
| Storage | Encrypted storage for sensitive data |
| Authentication | MFA required for admin and moderator accounts |
| Access control | Role-based permissions and audit logging |
| Data protection | Privacy notice and consent aligned with Kenya Data Protection Act, 2019 |
| Accessibility | WCAG 2.1 AA target, Kiswahili on key pages, compressed assets for low bandwidth |

---

## 5. Deliverables

| No. | Deliverable | Timing |
|---|---|---|
| 1 | Inception report with methodology, work plan, and technical specs | Week 2 |
| 2 | UI/UX wireframes | Week 2 |
| 3 | Fully functional platform with all approved modules | Week 7 |
| 4 | Monitoring and reporting dashboard | Week 5, refined by Week 8 |
| 5 | Source code and technical documentation | Week 7 to 8 |
| 6 | Administrator and user manuals | Week 7 |
| 7 | Staff training, minimum two sessions | Week 7 |
| 8 | Final assignment report | Week 8 |
| 9 | Post-deployment support and maintenance | Weeks 9 to 32 |

All deliverables, including source code and designs, will belong to CRECO Kenya on completion.

---

## 6. Testing and risk management

Before launch I will test all forms, user roles, exports, and the Q&A flow. I will also check mobile performance and low-bandwidth usability.

| Risk | Mitigation |
|---|---|
| Late content from CRECO | Content audit in week 1; sample content for testing if needed |
| Q&A giving wrong answers | Restrict to approved sources; disclaimers; human review for flagged responses |
| Low uptake from PBOs | Simple registration, mobile-friendly design, Kiswahili on key pages |
| Hosting delays | Agree hosting early; staging environment from week 3 |

| Test area | What will be checked |
|---|---|
| Functional testing | Forms, workflows, permissions, exports, and moderation |
| Security testing | Authentication, uploads, role access, and HTTPS |
| Mobile and performance | Responsive layout and usability on slow connections |
| User acceptance | Review with CRECO staff and pilot PBO users |

---

## 7. Training and documentation

| Session | Duration | Topics covered |
|---|---|---|
| Platform administration | 2 hours | Content management, media, user accounts, publishing workflow |
| Monitoring and dashboard | 2 hours | Moderation, dashboard use, data exports, Q&A review |

| Document | Purpose |
|---|---|
| Deployment guide | Server setup, environment variables, backups, and restore |
| Administrator manual | Step-by-step CMS and moderation instructions with screenshots |
| User guide | Short guide for PBOs on registration, tools, and submissions |

During the support period I will respond to critical issues within 24 hours and other reported bugs within a few working days.

---

## 8. Relevant experience

I am a web developer and data specialist based in Nairobi with experience building platforms, dashboards, and backend systems for organisations that need secure data handling and admin tools their staff can use without technical help.

| Item | Detail |
|---|---|
| Project | CVE Research Hub Kenya, Platform Upgrade (2026) |
| Client | CHRIPS and Transparency International Kenya |
| Role | Lead consultant and developer |
| Delivered | Digital library, AML/CFT compliance hub, NPO self-assessment tool, observatory monitoring dashboard, moderated forum, CMS, and handover documentation |

| CRECO requirement | Comparable experience from CVE project |
|---|---|
| Legal awareness hub | AML/CFT hub and searchable digital library |
| Compliance tools | NPO self-assessment with automated scoring |
| Monitoring and reporting | Observatory dashboard with exports |
| CMS and handover | Django admin, SOPs, training, and documentation |

The CRECO platform will be built fresh against this ToR. Further details are in the attached portfolio.

---

## 9. Ethics and safeguarding

| Principle | How it will be applied |
|---|---|
| Confidentiality | Monitoring submissions treated as confidential unless CRECO defines otherwise |
| Do no harm | Incident reports not made public without staff approval and appropriate consent |
| Transparency | Q&A tool clearly states what it can and cannot do |
| Safeguarding | Strict adherence to CRECO Kenya safeguarding policies |

---

## 10. Closing

CRECO needs a platform that makes the PBO Act understandable, gives PBOs a channel to report what they experience, and produces evidence the team can use. Eight weeks is workable if we align on content, design, and hosting early. I am available to discuss this proposal and begin co-design upon award of contract.

**Emmanuel Kiyai Kendagor**  
emmanuelkens@gmail.com  
254 708 454 455
