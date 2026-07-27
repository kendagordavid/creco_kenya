import {
  card,
  disclaimerBanner,
  formField,
  kpi,
  placeholder,
  publicFooter,
  publicHeader,
  staffHeader,
  staffSidebar,
} from "../lib/render.mjs";

/** @typedef {{ id: string, file: string, title: string, module: string, viewport?: string, role?: string, render: (ctx: { mobile: boolean }) => string }} Screen */

/** @type {Screen[]} */
export const screens = [
  {
    id: "WF-00",
    file: "00-sitemap-roles.html",
    title: "Sitemap & user roles",
    module: "Overview",
    render: () => `<main class="wf-main">
  <div class="wf-eyebrow">Inception · Week 2 deliverable</div>
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Platform sitemap & role matrix</h1>
  <div class="wf-grid-2" style="margin-bottom:1.5rem">
    <div class="wf-card">
      <h3>Public visitor</h3>
      <p>Home, Knowledge hub, Compliance tools (basic), Guidance Q&A, Sources, Search, Register/Login</p>
    </div>
    <div class="wf-card">
      <h3>Registered PBO user</h3>
      <p>All public areas + Monitoring forms, My submissions, Saved assessments, Q&A history</p>
    </div>
    <div class="wf-card">
      <h3>Content editor</h3>
      <p>CMS dashboard, Article editor (EN/SW), FAQ manager, Media library, Publish workflow</p>
    </div>
    <div class="wf-card">
      <h3>Moderator / Admin</h3>
      <p>Dashboard, Submission queue, Q&A flags, Analytics, Export, User management, MFA login</p>
    </div>
  </div>
  <div class="wf-label">Integrated platform modules (ToR)</div>
  <div class="wf-grid-5 wf-grid-3" style="display:grid;grid-template-columns:repeat(5,1fr);gap:0.75rem">
    ${["1 Legal awareness", "2 Compliance tools", "3 Guided Q&A", "4 Monitoring", "5 Admin dashboard"]
      .map((m) => `<div class="wf-box" style="padding:0.75rem;text-align:center;font-size:0.75rem;font-weight:600">${m}</div>`)
      .join("")}
  </div>
  <p class="wf-annotation" style="margin-top:1rem">One integrated system — shared header, auth, search, analytics. CRECO sign-off required before Week 3 development.</p>
</main>`,
  },
  {
    id: "WF-01",
    file: "01-home-desktop.html",
    title: "Home (desktop)",
    module: "Global",
    render: ({ mobile }) =>
      `${publicHeader({ active: "home", mobile })}
<section class="wf-hero">
  <div class="wf-eyebrow">Civic access for PBOs · Kenya</div>
  <h1>Navigate the PBO Act with clear, source-linked guidance</h1>
  <p>Legal awareness, compliance tools, guided Q&A, and civic space monitoring — one platform for PBOs nationwide.</p>
  <div style="margin-top:1rem;display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap">
    <span class="wf-btn wf-btn--primary">Look up guidance</span>
    <span class="wf-btn wf-btn--secondary">Report your experience</span>
  </div>
</section>
<main class="wf-main">
  <div class="wf-label">Five platform functions</div>
  <div class="wf-grid-3">
    ${card("Knowledge hub", "Plain-language summaries, Kiswahili, toolkits, FAQs, videos", "01")}
    ${card("Compliance tools", "Checklists, self-assessment with scoring, templates", "02")}
    ${card("Guided Q&A", "Answers from approved PBO Act materials only", "03")}
    ${card("Monitoring", "Report registration delays, barriers, incidents", "04")}
    ${card("Partner insights", "Aggregated trends for CRECO advocacy", "05")}
    ${card("Admin dashboard", "Staff-only — moderation & exports", "Staff")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-01M",
    file: "01-home-mobile.html",
    title: "Home (mobile)",
    module: "Global",
    viewport: "mobile",
    render: ({ mobile }) =>
      `${publicHeader({ active: "home", mobile: true })}
<section class="wf-hero">
  <div class="wf-eyebrow">Civic access · Kenya</div>
  <h1 style="font-size:1.25rem">Navigate the PBO Act</h1>
  <p style="font-size:0.8125rem">Guidance, compliance tools & monitoring for PBOs.</p>
  <span class="wf-btn wf-btn--primary" style="margin-top:0.75rem;width:100%">Ask a question</span>
</section>
<main class="wf-main">
  <div class="wf-grid-2" style="grid-template-columns:1fr">
    ${card("Knowledge hub", "Guides, FAQs, toolkits")}
    ${card("Compliance", "Checklist & self-assessment")}
    ${card("Guidance Q&A", "Source-linked answers")}
    ${card("Report experience", "Monitoring forms — login required")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-02",
    file: "02-login.html",
    title: "Login",
    module: "Auth",
    render: () =>
      `${publicHeader({ mobile: false })}
<main class="wf-main wf-main--alt" style="max-width:420px;margin:2rem auto">
  <h1 style="margin:0 0 0.5rem;font-size:1.25rem;color:var(--creco-primary)">Sign in</h1>
  <p class="wf-annotation">Required for monitoring submissions and saved assessments</p>
  ${formField("Email address", "email", "you@organisation.org")}
  ${formField("Password", "password", "••••••••")}
  <span class="wf-btn wf-btn--primary" style="width:100%;margin-top:0.5rem">Sign in</span>
  <p style="margin-top:1rem;font-size:0.8125rem"><span class="wf-annotation">Forgot password · Create PBO account</span></p>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-03",
    file: "03-register-pbo.html",
    title: "Register (PBO user)",
    module: "Auth",
    render: () =>
      `${publicHeader()}
<main class="wf-main" style="max-width:520px;margin:0 auto">
  <h1 style="margin:0 0 1rem;font-size:1.25rem;color:var(--creco-primary)">Register your organisation</h1>
  ${formField("Organisation name")}
  ${formField("County", "select", "[ Select county — 47 counties ]")}
  ${formField("Contact email")}
  ${formField("Password")}
  <div class="wf-checkbox-row">
    <input type="checkbox" disabled checked>
    <span>I agree to the privacy notice and consent to CRECO processing my monitoring submissions under the Kenya Data Protection Act, 2019.</span>
  </div>
  <span class="wf-btn wf-btn--primary" style="margin-top:1rem">Create account</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-04",
    file: "04-password-reset.html",
    title: "Password reset",
    module: "Auth",
    render: () =>
      `${publicHeader()}
<main class="wf-main wf-main--alt" style="max-width:420px;margin:2rem auto">
  <h1 style="margin:0 0 0.5rem;font-size:1.25rem;color:var(--creco-primary)">Reset password</h1>
  ${formField("Email address")}
  <span class="wf-btn wf-btn--primary" style="width:100%">Send reset link</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-05",
    file: "05-profile-account.html",
    title: "Profile / account",
    module: "Auth",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "reports" })}
<main class="wf-main">
  <h1 style="margin:0 0 1rem;font-size:1.25rem;color:var(--creco-primary)">My account</h1>
  <div class="wf-grid-2">
    <div>
      ${formField("Organisation name", "text", "Sample PBO")}
      ${formField("County", "select", "Nairobi")}
      <span class="wf-btn wf-btn--secondary">Update profile</span>
    </div>
    <div>
      <div class="wf-label">Saved items</div>
      ${placeholder("Self-assessment progress — 68% complete", "3rem")}
      ${placeholder("2 draft monitoring reports", "3rem")}
      ${placeholder("Q&A history — 5 questions", "3rem")}
    </div>
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-06",
    file: "06-global-search.html",
    title: "Global search results",
    module: "Global",
    render: () =>
      `${publicHeader()}
<main class="wf-main">
  <div class="wf-form-group">
    <div class="wf-input wf-input--box">registration requirements</div>
  </div>
  <div class="wf-label">Results across knowledge hub · FAQs · toolkits</div>
  <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.75rem">
    ${card("Registration requirements for PBOs", "Knowledge hub · Guide · English")}
    ${card("What documents do I need to register?", "FAQ · Registration")}
    ${card("Board resolution template", "Template library · Download")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-10",
    file: "10-knowledge-hub.html",
    title: "Knowledge hub landing",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main">
  <div class="wf-eyebrow">Legal awareness</div>
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Knowledge hub</h1>
  <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.25rem">
    ${["All", "Guides", "FAQs", "Toolkits", "Videos", "Infographics"].map((f) => `<span class="wf-btn wf-btn--${f === "All" ? "primary" : "ghost"}">${f}</span>`).join("")}
    <span class="wf-btn wf-btn--ghost">EN | SW</span>
  </div>
  <div class="wf-label">Featured topics</div>
  <div class="wf-grid-3">
    ${card("What is a PBO?", "Plain-language summary")}
    ${card("Registration requirements", "Documents & eligibility")}
    ${card("PBO Regulatory Authority", "Role & public registry")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-11",
    file: "11-topic-listing.html",
    title: "Topic listing",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main wf-main--alt">
  <h1 style="margin:0 0 1rem;font-size:1.25rem;color:var(--creco-primary)">All topics</h1>
  <div class="wf-grid-2" style="margin-bottom:1rem">
    ${formField("Filter by topic", "select", "[ Registration ]")}
    ${formField("Language", "select", "[ English / Kiswahili ]")}
  </div>
  <table class="wf-table">
    <thead><tr><th>Topic</th><th>Type</th><th>Language</th><th>Updated</th></tr></thead>
    <tbody>
      <tr><td>Registration process & timeline</td><td>Guide</td><td>EN / SW</td><td>Jun 2026</td></tr>
      <tr><td>Objects and purpose of the Act</td><td>Guide</td><td>EN</td><td>Jun 2026</td></tr>
      <tr><td>Annual reporting obligations</td><td>FAQ</td><td>EN / SW</td><td>May 2026</td></tr>
    </tbody>
  </table>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-12",
    file: "12-topic-detail.html",
    title: "Topic detail",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <div class="wf-eyebrow">Registration</div>
    <span class="wf-btn wf-btn--ghost">English | Kiswahili</span>
  </div>
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Registration requirements for PBOs</h1>
  ${placeholder("Plain-language article body — section headings, bullet lists, key terms explained", "12rem")}
  <div class="wf-label" style="margin-top:1.25rem">Related topics</div>
  <div class="wf-grid-3">
    ${card("Registration timeline", "60-day decision period")}
    ${card("Required documents", "Checklist download")}
    ${card("Self-assessment tool", "Check your readiness →")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-13",
    file: "13-faq-index.html",
    title: "FAQ index",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main wf-main--alt">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Frequently asked questions</h1>
  ${formField("Search FAQs", "text", "Search by keyword…")}
  <div class="wf-grid-2" style="margin-top:1rem">
    ${["Registration", "Governance", "Reporting", "Penalties"].map((cat) => card(cat, "12 questions")).join("")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-14",
    file: "14-faq-detail.html",
    title: "FAQ detail",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main">
  <div class="wf-eyebrow">Registration · FAQ</div>
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">How long does registration take?</h1>
  ${placeholder("Answer text with link to source section of PBO Act", "6rem")}
  <span class="wf-btn wf-btn--secondary">View source document</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-15",
    file: "15-toolkit-detail.html",
    title: "Toolkit / resource detail",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main">
  <div class="wf-eyebrow">Toolkit</div>
  <h1 style="margin:0 0 0.5rem;color:var(--creco-primary)">PBO registration checklist (PDF)</h1>
  <p class="wf-annotation">Usage notes: Complete before submitting to PBORA</p>
  ${placeholder("Preview thumbnail", "8rem", "wf-box--img")}
  <span class="wf-btn wf-btn--primary" style="margin-top:1rem">Download PDF</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-16",
    file: "16-media-gallery.html",
    title: "Media gallery",
    module: "Module 1 — Knowledge",
    render: () =>
      `${publicHeader({ active: "knowledge" })}
<main class="wf-main wf-main--alt">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Infographics & videos</h1>
  <div class="wf-grid-3">
    ${Array(6).fill(0).map((_, i) => placeholder(`Media item ${i + 1}`, "6rem", "wf-box--img")).join("")}
  </div>
  <p class="wf-annotation" style="margin-top:0.75rem">Lazy-loaded for low-bandwidth connections</p>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-20",
    file: "20-compliance-hub.html",
    title: "Compliance tools hub",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
${disclaimerBanner()}
<main class="wf-main">
  <div class="wf-eyebrow">Compliance support</div>
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Compliance tools</h1>
  <div class="wf-grid-3">
    ${card("Organizational checklist", "Track compliance items online, print or save")}
    ${card("Self-assessment", "Automated scoring mapped to PBO Act domains")}
    ${card("Template library", "Board resolutions, policies, reporting formats")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-21",
    file: "21-checklist.html",
    title: "Interactive checklist",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
${disclaimerBanner()}
<main class="wf-main">
  <h1 style="margin:0 0 0.5rem;color:var(--creco-primary)">Organizational compliance checklist</h1>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
    <span class="wf-annotation">Progress: 12 / 24 items</span>
    <div><span class="wf-btn wf-btn--ghost">Print</span> <span class="wf-btn wf-btn--secondary">Save (login)</span></div>
  </div>
  ${placeholder("Section: Governance — checkbox items", "5rem")}
  ${placeholder("Section: Registration documents", "5rem")}
  ${placeholder("Section: Reporting obligations", "5rem")}
</main>
${publicFooter()}`,
  },
  {
    id: "WF-22",
    file: "22-assessment-intro.html",
    title: "Self-assessment intro",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
${disclaimerBanner()}
<main class="wf-main wf-main--alt" style="max-width:560px;margin:0 auto">
  <h1 style="margin:0 0 0.5rem;color:var(--creco-primary)">PBO compliance self-assessment</h1>
  <p>Covers governance, registration, reporting, and operational requirements. Estimated time: 15–20 minutes.</p>
  <ul style="font-size:0.8125rem;color:var(--creco-muted)">
    <li>Automated scoring by compliance domain</li>
    <li>Links to relevant knowledge hub resources</li>
    <li>Save progress when logged in</li>
  </ul>
  <span class="wf-btn wf-btn--primary" style="margin-top:1rem">Start assessment</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-23",
    file: "23-assessment-steps.html",
    title: "Self-assessment steps",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
${disclaimerBanner()}
<main class="wf-main">
  <div class="wf-steps">
    <div class="wf-step done"></div><div class="wf-step done"></div><div class="wf-step active"></div><div class="wf-step"></div><div class="wf-step"></div>
  </div>
  <div class="wf-eyebrow">Step 3 of 5 · Reporting</div>
  <h1 style="margin:0 0 1rem;font-size:1.125rem;color:var(--creco-primary)">Does your organisation file annual reports on time?</h1>
  ${formField("Response", "select", "[ Yes / No / Not sure ]")}
  ${formField("Additional notes (optional)", "textarea", "[ Optional context ]")}
  <div style="display:flex;gap:0.5rem;margin-top:1rem">
    <span class="wf-btn wf-btn--ghost">Back</span>
    <span class="wf-btn wf-btn--primary">Next</span>
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-24",
    file: "24-assessment-results.html",
    title: "Self-assessment results",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
<main class="wf-main wf-main--alt">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Your compliance score</h1>
  <div class="wf-kpi-row">
    ${kpi("72%", "Overall")}
    ${kpi("Compliant", "Governance")}
    ${kpi("Needs attention", "Reporting")}
    ${kpi("Critical gap", "Documentation")}
  </div>
  <div class="wf-label">Recommended actions</div>
  ${card("Update annual report template", "Download from template library →")}
  ${card("Review registration documents", "Knowledge hub topic →")}
  <span class="wf-btn wf-btn--secondary" style="margin-top:1rem">Download results PDF</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-25",
    file: "25-template-library.html",
    title: "Template library",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
<main class="wf-main">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Downloadable templates</h1>
  <table class="wf-table">
    <thead><tr><th>Template</th><th>Format</th><th>Description</th><th></th></tr></thead>
    <tbody>
      <tr><td>Board resolution — registration</td><td>DOCX</td><td>For PBORA application</td><td><span class="wf-btn wf-btn--ghost">Download</span></td></tr>
      <tr><td>Conflict of interest policy</td><td>PDF</td><td>Governance requirement</td><td><span class="wf-btn wf-btn--ghost">Download</span></td></tr>
    </tbody>
  </table>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-26",
    file: "26-template-detail.html",
    title: "Template detail",
    module: "Module 2 — Compliance",
    render: () =>
      `${publicHeader({ active: "compliance" })}
<main class="wf-main">
  <h1 style="margin:0 0 0.5rem;color:var(--creco-primary)">Board resolution template</h1>
  ${placeholder("Preview placeholder", "10rem", "wf-box--img")}
  <p class="wf-annotation">Usage: Adopt at board meeting before registration application</p>
  <span class="wf-btn wf-btn--primary">Download DOCX</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-30",
    file: "30-guidance-desktop.html",
    title: "Guidance landing (desktop)",
    module: "Module 3 — Q&A",
    render: () =>
      `${publicHeader({ active: "guidance" })}
${disclaimerBanner()}
<section class="wf-hero" style="padding:1.5rem">
  <div class="wf-eyebrow">Guidance tool</div>
  <h1 style="font-size:1.25rem">PBO Act guidance</h1>
  <p style="font-size:0.8125rem">Ask in English or Kiswahili. Answers cite approved sources.</p>
</section>
<main class="wf-main wf-main--alt">
  ${formField("Your question", "text", "What documents do I need to register as a PBO?")}
  <div class="wf-label">Suggested questions</div>
  <div style="display:flex;flex-wrap:gap:0.5rem">
    ${["Registration requirements", "Timeline for PBORA decision", "What is a PBO?"].map((q) => `<span class="wf-btn wf-btn--ghost">${q}</span>`).join("")}
  </div>
  ${placeholder("Answer area — appears after submit", "8rem")}
</main>
${publicFooter()}`,
  },
  {
    id: "WF-30M",
    file: "30-guidance-mobile.html",
    title: "Guidance landing (mobile)",
    module: "Module 3 — Q&A",
    viewport: "mobile",
    render: () =>
      `${publicHeader({ active: "guidance", mobile: true })}
${disclaimerBanner()}
<main class="wf-main">
  <h1 style="margin:0 0 0.75rem;font-size:1.125rem;color:var(--creco-primary)">Ask about the PBO Act</h1>
  ${formField("Question", "text", "Type your question…")}
  <span class="wf-btn wf-btn--primary" style="width:100%">Get guidance</span>
  <div class="wf-label" style="margin-top:1rem">Suggested</div>
  ${placeholder("Chip: Registration docs", "2.5rem")}
  ${placeholder("Chip: Registration timeline", "2.5rem")}
</main>
${publicFooter()}`,
  },
  {
    id: "WF-31",
    file: "31-answer-view.html",
    title: "Answer view",
    module: "Module 3 — Q&A",
    render: () =>
      `${publicHeader({ active: "guidance" })}
${disclaimerBanner()}
<main class="wf-main">
  <div class="wf-label">Question</div>
  <p style="font-weight:600;margin:0 0 1rem">What documents do I need to register as a PBO?</p>
  ${placeholder("Structured answer with headings and plain language", "8rem")}
  <div class="wf-label" style="margin-top:1rem">Sources cited</div>
  ${card("Registration requirements", "Wiki topic · PBO Act s.18")}
  ${card("PBO Act, 2013 — Section 18", "Source PDF")}
  <div style="display:flex;gap:0.5rem;margin-top:1rem">
    <span class="wf-btn wf-btn--ghost">Helpful</span>
    <span class="wf-btn wf-btn--ghost">Flag inaccurate</span>
    <span class="wf-btn wf-btn--secondary">Ask CRECO staff</span>
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-32",
    file: "32-flag-feedback.html",
    title: "Flag / feedback",
    module: "Module 3 — Q&A",
    render: () =>
      `${publicHeader({ active: "guidance" })}
<main class="wf-main wf-main--alt" style="max-width:480px;margin:0 auto">
  <h1 style="margin:0 0 1rem;font-size:1.125rem;color:var(--creco-primary)">Flag this response</h1>
  ${formField("What was wrong?", "select", "[ Inaccurate / Incomplete / Out of scope ]")}
  ${formField("Details (optional)", "textarea", "Describe the issue…")}
  <span class="wf-btn wf-btn--primary">Submit flag</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-33",
    file: "33-ask-creco.html",
    title: "Ask CRECO (human follow-up)",
    module: "Module 3 — Q&A",
    render: () =>
      `${publicHeader({ active: "guidance" })}
<main class="wf-main" style="max-width:520px;margin:0 auto">
  <h1 style="margin:0 0 0.5rem;font-size:1.125rem;color:var(--creco-primary)">Send question to CRECO staff</h1>
  <p class="wf-annotation">For complex questions the guidance tool cannot answer</p>
  ${formField("Your question")}
  ${formField("Organisation (optional)")}
  ${formField("Email for follow-up")}
  <span class="wf-btn wf-btn--primary">Send to CRECO</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-40",
    file: "40-monitoring-hub.html",
    title: "Monitoring hub",
    module: "Module 4 — Monitoring",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring" })}
<main class="wf-main">
  <div class="wf-eyebrow">Civic space monitoring</div>
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Report your experience</h1>
  <p class="wf-annotation">Submissions are confidential. Moderated by CRECO staff before use in advocacy.</p>
  <div class="wf-grid-2">
    ${card("Registration experience", "Delays, barriers, process issues")}
    ${card("Enabling practices", "Positive outcomes & good practices")}
    ${card("Civic space incident", "Violations — severity classification")}
    ${card("My submissions", "View status of past reports →")}
  </div>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-41",
    file: "41-monitoring-registration-desktop.html",
    title: "Registration / barriers form (desktop)",
    module: "Module 4 — Monitoring",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring" })}
<main class="wf-main wf-main--alt">
  <h1 style="margin:0 0 1rem;font-size:1.125rem;color:var(--creco-primary)">Registration experience report</h1>
  ${formField("County", "select", "[ Select county ]")}
  ${formField("Type of issue", "select", "[ Delay / Administrative barrier / Other ]")}
  ${formField("Date of experience")}
  ${formField("Describe what happened", "textarea", "Structured narrative field…")}
  ${formField("Organisation type (optional)", "select", "[ NGO / CBO / Foundation ]")}
  <span class="wf-btn wf-btn--primary">Continue to upload</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-41M",
    file: "41-monitoring-registration-mobile.html",
    title: "Registration form (mobile)",
    module: "Module 4 — Monitoring",
    viewport: "mobile",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring", mobile: true })}
<main class="wf-main">
  <h1 style="margin:0 0 0.75rem;font-size:1rem;color:var(--creco-primary)">Report registration issue</h1>
  ${formField("County", "select", "[ County ]")}
  ${formField("Issue type", "select", "[ Delay / Barrier ]")}
  ${formField("Description", "textarea", "What happened?")}
  <span class="wf-btn wf-btn--primary" style="width:100%;margin-top:0.5rem">Next</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-42",
    file: "42-monitoring-enabling.html",
    title: "Enabling practices form",
    module: "Module 4 — Monitoring",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring" })}
<main class="wf-main">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Report enabling practice</h1>
  ${formField("County", "select", "[ Select county ]")}
  ${formField("Practice description", "textarea")}
  ${formField("Outcome for your organisation")}
  <span class="wf-btn wf-btn--primary">Continue</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-43",
    file: "43-monitoring-incident.html",
    title: "Civic space incident form",
    module: "Module 4 — Monitoring",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring" })}
<main class="wf-main wf-main--alt">
  <h1 style="margin:0 0 0.5rem;color:var(--creco-primary)">Civic space incident report</h1>
  <p class="wf-annotation">Sensitive — not published without staff approval and consent</p>
  ${formField("Severity", "select", "[ Low / Medium / High / Critical ]")}
  ${formField("County", "select", "[ Select county ]")}
  ${formField("Incident description", "textarea")}
  <div class="wf-checkbox-row">
    <input type="checkbox" disabled>
    <span>Do not share my organisation name in aggregated reports</span>
  </div>
  <span class="wf-btn wf-btn--primary" style="margin-top:1rem">Continue</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-44",
    file: "44-monitoring-upload.html",
    title: "Upload & consent step",
    module: "Module 4 — Monitoring",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring" })}
<main class="wf-main">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Supporting documents</h1>
  ${placeholder("Drag & drop upload — PDF, JPG · Max 5MB", "5rem")}
  <div class="wf-checkbox-row" style="margin-top:1rem">
    <input type="checkbox" disabled checked>
    <span>I consent to CRECO storing this submission securely under the Kenya Data Protection Act, 2019.</span>
  </div>
  <span class="wf-btn wf-btn--primary" style="margin-top:1rem">Submit report</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-45",
    file: "45-monitoring-confirmation.html",
    title: "Submission confirmation",
    module: "Module 4 — Monitoring",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "monitoring" })}
<main class="wf-main wf-main--alt" style="text-align:center;max-width:480px;margin:2rem auto">
  <h1 style="color:var(--creco-primary)">Report submitted</h1>
  <p>Reference: <strong>MON-2026-0042</strong></p>
  <p class="wf-annotation">CRECO staff will review your submission. Status: Pending moderation.</p>
  <span class="wf-btn wf-btn--secondary">View my submissions</span>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-46",
    file: "46-my-submissions.html",
    title: "My submissions",
    module: "Module 4 — Monitoring",
    role: "pbo",
    render: () =>
      `${publicHeader({ role: "pbo", active: "reports" })}
<main class="wf-main">
  <h1 style="margin:0 0 1rem;color:var(--creco-primary)">My submissions</h1>
  <table class="wf-table">
    <thead><tr><th>Reference</th><th>Type</th><th>County</th><th>Status</th><th>Date</th></tr></thead>
    <tbody>
      <tr><td>MON-2026-0042</td><td>Registration delay</td><td>Nairobi</td><td><span class="wf-status wf-status--pending">Pending</span></td><td>Jul 2026</td></tr>
      <tr><td>MON-2026-0031</td><td>Enabling practice</td><td>Kisumu</td><td><span class="wf-status wf-status--approved">Approved</span></td><td>Jun 2026</td></tr>
    </tbody>
  </table>
</main>
${publicFooter()}`,
  },
  {
    id: "WF-50",
    file: "50-dashboard-desktop.html",
    title: "Admin dashboard (desktop)",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("dashboard")}
<div class="wf-sidebar-layout">
  ${staffSidebar("dashboard")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Dashboard overview</h1>
    <div class="wf-kpi-row">
      ${kpi("142", "Total submissions")}
      ${kpi("23", "Pending moderation")}
      ${kpi("8", "Q&A flags")}
      ${kpi("47", "Counties represented")}
    </div>
    <div class="wf-grid-2">
      ${placeholder("Chart: Submissions by county", "10rem", "wf-box--chart")}
      ${placeholder("Chart: Issue types over time", "10rem", "wf-box--chart")}
    </div>
  </div>
</div>`,
  },
  {
    id: "WF-50M",
    file: "50-dashboard-mobile.html",
    title: "Admin dashboard (mobile)",
    module: "Module 5 — Admin",
    viewport: "mobile",
    role: "staff",
    render: () =>
      `${staffHeader("dashboard")}
<main class="wf-main">
  <h1 style="margin:0 0 0.75rem;font-size:1rem;color:var(--creco-primary)">Dashboard</h1>
  <div class="wf-grid-2" style="grid-template-columns:1fr 1fr">
    ${kpi("142", "Submissions")}
    ${kpi("23", "Pending")}
  </div>
  ${placeholder("Trend chart", "8rem", "wf-box--chart")}
  <span class="wf-btn wf-btn--primary" style="width:100%;margin-top:0.75rem">Review queue</span>
</main>`,
  },
  {
    id: "WF-51",
    file: "51-submissions-list.html",
    title: "Submissions list",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("submissions")}
<div class="wf-sidebar-layout">
  ${staffSidebar("submissions")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Monitoring submissions</h1>
    <div class="wf-grid-4" style="margin-bottom:1rem">
      ${formField("Date range", "select", "[ Last 30 days ]")}
      ${formField("County", "select", "[ All ]")}
      ${formField("Type", "select", "[ All ]")}
      ${formField("Status", "select", "[ Pending ]")}
    </div>
    <table class="wf-table">
      <thead><tr><th>ID</th><th>Type</th><th>County</th><th>Status</th><th>Submitted</th><th></th></tr></thead>
      <tbody>
        <tr><td>MON-0042</td><td>Registration delay</td><td>Nairobi</td><td><span class="wf-status wf-status--pending">Pending</span></td><td>Today</td><td><span class="wf-btn wf-btn--ghost">Review</span></td></tr>
      </tbody>
    </table>
  </div>
</div>`,
  },
  {
    id: "WF-52",
    file: "52-submission-detail.html",
    title: "Submission detail (moderation)",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("submissions")}
<div class="wf-sidebar-layout">
  ${staffSidebar("submissions")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 0.5rem;color:var(--creco-primary)">MON-2026-0042</h1>
    <span class="wf-status wf-status--pending">Pending review</span>
    ${placeholder("Submission fields — county, type, narrative, attachments", "8rem")}
    <div class="wf-label" style="margin-top:1rem">Audit trail</div>
    ${placeholder("Submitted · Jul 27 · Awaiting moderator", "2.5rem")}
    <div style="display:flex;gap:0.5rem;margin-top:1rem">
      <span class="wf-btn wf-btn--primary">Approve</span>
      <span class="wf-btn wf-btn--ghost">Reject</span>
      <span class="wf-btn wf-btn--ghost">Request info</span>
    </div>
  </div>
</div>`,
  },
  {
    id: "WF-53",
    file: "53-qa-review-queue.html",
    title: "Q&A review queue",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("qa")}
<div class="wf-sidebar-layout">
  ${staffSidebar("qa")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Flagged Q&A responses</h1>
    <table class="wf-table">
      <thead><tr><th>Question</th><th>Flag reason</th><th>Date</th><th></th></tr></thead>
      <tbody>
        <tr><td>Registration timeline question</td><td>Inaccurate</td><td>Jul 26</td><td><span class="wf-btn wf-btn--ghost">Review</span></td></tr>
      </tbody>
    </table>
  </div>
</div>`,
  },
  {
    id: "WF-54",
    file: "54-analytics-trends.html",
    title: "Analytics & trends",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("dashboard")}
<div class="wf-sidebar-layout">
  ${staffSidebar("analytics")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Analytics</h1>
    ${placeholder("Self-assessment score distributions", "8rem", "wf-box--chart")}
    ${placeholder("Site usage — popular resources", "8rem", "wf-box--chart")}
  </div>
</div>`,
  },
  {
    id: "WF-55",
    file: "55-export-data.html",
    title: "Export data",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("dashboard")}
<div class="wf-sidebar-layout">
  ${staffSidebar("export")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Export data</h1>
    ${formField("Dataset", "select", "[ Monitoring submissions ]")}
    ${formField("Date range")}
    ${formField("County filter", "select", "[ All counties ]")}
    <div style="display:flex;gap:0.5rem;margin-top:1rem">
      <span class="wf-btn wf-btn--primary">Export CSV</span>
      <span class="wf-btn wf-btn--secondary">Export Excel</span>
      <span class="wf-btn wf-btn--ghost">PDF summary</span>
    </div>
  </div>
</div>`,
  },
  {
    id: "WF-56",
    file: "56-cms-dashboard.html",
    title: "CMS dashboard",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("cms")}
<div class="wf-sidebar-layout">
  ${staffSidebar("cms")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Content management</h1>
    <span class="wf-btn wf-btn--primary" style="margin-bottom:1rem">New article</span>
    <table class="wf-table">
      <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Language</th><th></th></tr></thead>
      <tbody>
        <tr><td>Registration requirements</td><td>Guide</td><td><span class="wf-status wf-status--approved">Published</span></td><td>EN / SW</td><td><span class="wf-btn wf-btn--ghost">Edit</span></td></tr>
        <tr><td>Annual reporting FAQ</td><td>FAQ</td><td><span class="wf-status wf-status--review">Draft</span></td><td>EN</td><td><span class="wf-btn wf-btn--ghost">Edit</span></td></tr>
      </tbody>
    </table>
  </div>
</div>`,
  },
  {
    id: "WF-57",
    file: "57-article-editor.html",
    title: "Article editor",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("cms")}
<div class="wf-sidebar-layout">
  ${staffSidebar("cms")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Edit article</h1>
    <div style="display:flex;gap:0.5rem;margin-bottom:1rem">
      <span class="wf-btn wf-btn--primary">English</span>
      <span class="wf-btn wf-btn--ghost">Kiswahili</span>
    </div>
    ${formField("Title")}
    ${placeholder("WYSIWYG editor — headings, lists, links", "12rem")}
    <div style="display:flex;gap:0.5rem;margin-top:1rem">
      <span class="wf-btn wf-btn--ghost">Save draft</span>
      <span class="wf-btn wf-btn--primary">Publish</span>
    </div>
  </div>
</div>`,
  },
  {
    id: "WF-58",
    file: "58-media-library.html",
    title: "Media library",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("cms")}
<div class="wf-sidebar-layout">
  ${staffSidebar("media")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Media library</h1>
    <span class="wf-btn wf-btn--secondary" style="margin-bottom:1rem">Upload media</span>
    <div class="wf-grid-4">
      ${Array(8).fill(0).map((_, i) => placeholder(`Media ${i + 1}`, "4rem", "wf-box--img")).join("")}
    </div>
  </div>
</div>`,
  },
  {
    id: "WF-59",
    file: "59-user-management.html",
    title: "User management",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("users")}
<div class="wf-sidebar-layout">
  ${staffSidebar("users")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Users & roles</h1>
    <table class="wf-table">
      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>MFA</th><th></th></tr></thead>
      <tbody>
        <tr><td>Jane Moderator</td><td>jane@crecokenya.org</td><td>Moderator</td><td>Yes</td><td><span class="wf-btn wf-btn--ghost">Edit</span></td></tr>
        <tr><td>Sample PBO</td><td>contact@pb.org</td><td>PBO user</td><td>—</td><td><span class="wf-btn wf-btn--ghost">Edit</span></td></tr>
      </tbody>
    </table>
  </div>
</div>`,
  },
  {
    id: "WF-60",
    file: "60-login-mfa.html",
    title: "Staff login + MFA",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `<main class="wf-main wf-main--alt" style="max-width:400px;margin:3rem auto;text-align:center">
  <div class="wf-logo" style="justify-content:center;margin-bottom:1.5rem">
    <span class="wf-logo-mark">C</span>
    <span>CRECO Staff Portal</span>
  </div>
  <h1 style="margin:0 0 1rem;font-size:1.125rem;color:var(--creco-primary)">Two-factor authentication</h1>
  <p class="wf-annotation">Required for moderators and administrators</p>
  ${formField("Authentication code", "text", "000000")}
  <span class="wf-btn wf-btn--primary" style="width:100%">Verify</span>
</main>`,
  },
  {
    id: "WF-61",
    file: "61-settings.html",
    title: "System settings",
    module: "Module 5 — Admin",
    role: "staff",
    render: () =>
      `${staffHeader("dashboard")}
<div class="wf-sidebar-layout">
  ${staffSidebar("settings")}
  <div class="wf-content-area">
    <h1 style="margin:0 0 1rem;color:var(--creco-primary)">Settings</h1>
    ${formField("Privacy notice URL")}
    ${formField("Data retention period", "select", "[ 24 months ]")}
    ${formField("Analytics provider", "select", "[ Matomo ]")}
    <span class="wf-btn wf-btn--primary" style="margin-top:1rem">Save settings</span>
  </div>
</div>`,
  },
];

/** @type {{ id: string, file: string, title: string, steps: { title: string, desc: string, link?: string }[] }[]} */
export const journeys = [
  {
    id: "J-01",
    file: "journey-01-knowledge-assessment.html",
    title: "Knowledge → Self-assessment",
    steps: [
      { title: "Home", desc: "Public visitor lands on platform", link: "01-home-desktop.html" },
      { title: "Knowledge hub", desc: "Browse legal awareness content", link: "10-knowledge-hub.html" },
      { title: "Topic detail", desc: "Read registration requirements", link: "12-topic-detail.html" },
      { title: "Compliance hub", desc: "Navigate to self-assessment tool", link: "20-compliance-hub.html" },
      { title: "Assessment results", desc: "View automated score & recommendations", link: "24-assessment-results.html" },
    ],
  },
  {
    id: "J-02",
    file: "journey-02-guidance-flag.html",
    title: "Guidance Q&A → Flag → Ask CRECO",
    steps: [
      { title: "Home", desc: "User clicks Ask a question", link: "01-home-desktop.html" },
      { title: "Guidance", desc: "Submit question in English or Kiswahili", link: "30-guidance-desktop.html" },
      { title: "Answer view", desc: "Review answer with source citations", link: "31-answer-view.html" },
      { title: "Flag feedback", desc: "Report inaccurate response", link: "32-flag-feedback.html" },
      { title: "Ask CRECO", desc: "Escalate complex question to staff", link: "33-ask-creco.html" },
    ],
  },
  {
    id: "J-03",
    file: "journey-03-monitoring-submit.html",
    title: "Login → Monitoring → Upload",
    steps: [
      { title: "Login", desc: "PBO user authenticates", link: "02-login.html" },
      { title: "Monitoring hub", desc: "Choose report type", link: "40-monitoring-hub.html" },
      { title: "Registration form", desc: "Structured fields + county tag", link: "41-monitoring-registration-desktop.html" },
      { title: "Upload & consent", desc: "Attach documents, confirm privacy consent", link: "44-monitoring-upload.html" },
      { title: "Confirmation", desc: "Reference ID, pending moderation status", link: "45-monitoring-confirmation.html" },
    ],
  },
  {
    id: "J-04",
    file: "journey-04-moderation.html",
    title: "Moderator MFA → Approve submission",
    steps: [
      { title: "Staff login + MFA", desc: "Moderator verifies identity", link: "60-login-mfa.html" },
      { title: "Dashboard", desc: "See pending moderation count", link: "50-dashboard-desktop.html" },
      { title: "Submissions list", desc: "Filter by status = pending", link: "51-submissions-list.html" },
      { title: "Submission detail", desc: "Review narrative, approve or reject", link: "52-submission-detail.html" },
    ],
  },
  {
    id: "J-05",
    file: "journey-05-cms-publish.html",
    title: "CMS → Edit Kiswahili → Publish",
    steps: [
      { title: "CMS dashboard", desc: "Content editor opens draft article", link: "56-cms-dashboard.html" },
      { title: "Article editor", desc: "Switch to Kiswahili tab", link: "57-article-editor.html" },
      { title: "Publish", desc: "Article goes live on knowledge hub", link: "12-topic-detail.html" },
    ],
  },
  {
    id: "J-06",
    file: "journey-06-admin-export.html",
    title: "Admin dashboard → Export CSV",
    steps: [
      { title: "Dashboard", desc: "Admin views county trends", link: "50-dashboard-desktop.html" },
      { title: "Analytics", desc: "Drill into issue types over time", link: "54-analytics-trends.html" },
      { title: "Export", desc: "Download filtered CSV for advocacy report", link: "55-export-data.html" },
    ],
  },
];

export function groupScreensByModule(allScreens) {
  const order = [
    "Overview",
    "Global",
    "Auth",
    "Module 1 — Knowledge",
    "Module 2 — Compliance",
    "Module 3 — Q&A",
    "Module 4 — Monitoring",
    "Module 5 — Admin",
  ];
  const map = new Map();
  for (const s of allScreens) {
    if (!map.has(s.module)) map.set(s.module, []);
    map.get(s.module).push(s);
  }
  return order.filter((m) => map.has(m)).map((module) => ({ module, screens: map.get(module) }));
}

export function renderJourney(journey) {
  const stepsHtml = journey.steps
    .map((step, i) => {
      const link = step.link
        ? `<a href="${step.link}" style="font-size:0.75rem">View wireframe →</a>`
        : "";
      return `${i > 0 ? '<div class="wf-flow-arrow">↓</div>' : ""}
<div class="wf-flow-step">
  <div class="wf-flow-num">${i + 1}</div>
  <div class="wf-flow-card">
    <h3>${step.title}</h3>
    <p>${step.desc}</p>
    ${link}
  </div>
</div>`;
    })
    .join("");

  return `<div class="wf-flow">
  <div class="wf-eyebrow">User journey · ${journey.id}</div>
  <h1 style="margin:0 0 1.5rem;color:var(--creco-primary)">${journey.title}</h1>
  ${stepsHtml}
</div>`;
}
