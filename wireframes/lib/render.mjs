/**
 * HTML wireframe page renderer for CRECO PBO Platform
 */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderToolbar(screen, prev, next) {
  const badges = [];
  if (screen.viewport === "mobile") badges.push('<span class="wf-badge wf-badge--mobile">Mobile</span>');
  if (screen.role === "staff") badges.push('<span class="wf-badge wf-badge--staff">Staff</span>');
  badges.push(`<span class="wf-badge">${escapeHtml(screen.module)}</span>`);

  return `<div class="wf-toolbar">
  <div>
    <a href="../index.html">← All wireframes</a>
    ${prev ? ` · <a href="${prev.file}">← ${escapeHtml(prev.title)}</a>` : ""}
  </div>
  <div class="wf-toolbar-meta">
    ${badges.join(" ")}
    <span>${escapeHtml(screen.id)} · ${escapeHtml(screen.title)}</span>
  </div>
  <div>
    ${next ? `<a href="${next.file}">${escapeHtml(next.title)} →</a>` : ""}
  </div>
</div>`;
}

export function renderPage(screen, bodyHtml, prev, next) {
  const frameClass = screen.viewport === "mobile" ? "wf-frame wf-frame--mobile" : "wf-frame";
  const mobileNavClass = screen.viewport === "mobile" ? " wf-mobile-nav-hidden" : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(screen.title)} — CRECO Wireframe</title>
  <link rel="stylesheet" href="../assets/wireframe.css">
</head>
<body>
  ${renderToolbar(screen, prev, next)}
  <div class="wf-canvas-wrap">
    <div class="${frameClass}">
      ${bodyHtml}
    </div>
  </div>
</body>
</html>`;
}

export function publicHeader(options = {}) {
  const {
    active = "",
    role = "public",
    mobile = false,
  } = options;

  const publicNav = [
    { href: "#", label: "Home", key: "home" },
    { href: "#", label: "Knowledge", key: "knowledge" },
    { href: "#", label: "Compliance", key: "compliance" },
    { href: "#", label: "Guidance", key: "guidance" },
    { href: "#", label: "Monitoring", key: "monitoring" },
  ];

  const pboNav = [
    ...publicNav,
    { href: "#", label: "My reports", key: "reports" },
  ];

  const navItems = role === "pbo" ? pboNav : publicNav;

  return `<header class="wf-header${mobile ? " wf-mobile-nav-hidden" : ""}">
  <div class="wf-logo">
    <span class="wf-logo-mark">C</span>
    <span>CRECO · PBO Act Platform</span>
  </div>
  ${mobile ? '<button type="button" class="wf-hamburger" aria-label="Menu">☰</button>' : ""}
  <nav class="wf-nav">
    ${navItems
      .map(
        (item) =>
          `<span class="${active === item.key ? "active" : ""}">${escapeHtml(item.label)}</span>`,
      )
      .join("")}
  </nav>
  <div class="wf-nav-actions">
    <span class="wf-btn wf-btn--ghost">EN | SW</span>
    <span class="wf-btn wf-btn--ghost">Search</span>
    ${
      role === "pbo"
        ? '<span class="wf-btn wf-btn--secondary">Account</span>'
        : '<span class="wf-btn wf-btn--secondary">Login</span>'
    }
    <span class="wf-btn wf-btn--accent">Ask a question</span>
  </div>
</header>`;
}

export function staffHeader(active = "dashboard") {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "submissions", label: "Submissions" },
    { key: "qa", label: "Q&A queue" },
    { key: "cms", label: "Content" },
    { key: "users", label: "Users" },
  ];
  return `<header class="wf-header">
  <div class="wf-logo">
    <span class="wf-logo-mark">C</span>
    <span>CRECO Admin</span>
  </div>
  <nav class="wf-nav">
    ${items.map((i) => `<span class="${active === i.key ? "active" : ""}">${i.label}</span>`).join("")}
  </nav>
  <div class="wf-nav-actions">
    <span class="wf-annotation">Moderator · MFA verified</span>
    <span class="wf-btn wf-btn--ghost">Logout</span>
  </div>
</header>`;
}

export function disclaimerBanner() {
  return `<div class="wf-banner">Not legal advice — guidance is drawn from CRECO-approved PBO Act materials only.</div>`;
}

export function publicFooter() {
  return `<footer class="wf-footer">
  <div class="wf-footer-grid">
    <div>
      <strong>CRECO Kenya</strong>
      <p class="wf-annotation">Safeguarding civic space · ICNL partnership</p>
    </div>
    <div>
      <div class="wf-label">Legal</div>
      <p>Privacy notice · Data protection · Disclaimer</p>
    </div>
    <div>
      <div class="wf-label">Contact</div>
      <p>info@crecokenya.org</p>
    </div>
  </div>
</footer>`;
}

export function staffSidebar(active = "dashboard") {
  const items = [
    { key: "dashboard", label: "Overview" },
    { key: "submissions", label: "Submissions" },
    { key: "qa", label: "Q&A flags" },
    { key: "analytics", label: "Analytics" },
    { key: "export", label: "Export data" },
    { key: "cms", label: "CMS" },
    { key: "media", label: "Media library" },
    { key: "users", label: "Users & roles" },
    { key: "settings", label: "Settings" },
  ];
  return `<aside class="wf-sidebar">
  ${items.map((i) => `<span class="${active === i.key ? "active" : ""}">${i.label}</span>`).join("")}
</aside>`;
}

export function placeholder(label, height = "2rem", extraClass = "") {
  return `<div class="wf-box ${extraClass}" style="min-height:${height}">${label ? `<span class="wf-annotation">${escapeHtml(label)}</span>` : ""}</div>`;
}

export function formField(label, type = "text", placeholder = "[ Input field ]") {
  return `<div class="wf-form-group">
  <label>${escapeHtml(label)}</label>
  <div class="wf-input wf-input--box">${escapeHtml(placeholder)}</div>
</div>`;
}

export function card(title, description, step = "") {
  return `<div class="wf-card">
  ${step ? `<div class="wf-eyebrow">${escapeHtml(step)}</div>` : ""}
  <h3>${escapeHtml(title)}</h3>
  <p>${escapeHtml(description)}</p>
</div>`;
}

export function kpi(value, label) {
  return `<div class="wf-kpi">
  <div class="value">${escapeHtml(value)}</div>
  <div class="label">${escapeHtml(label)}</div>
</div>`;
}

export function renderHub(sections) {
  const body = sections
    .map(
      (section) => `<section class="wf-hub-section">
  <h2>${escapeHtml(section.module)}</h2>
  <ul class="wf-hub-links">
    ${section.screens
      .map(
        (s) =>
          `<li><a href="pages/${s.file}">${escapeHtml(s.title)}${s.viewport === "mobile" ? '<span class="tag">Mobile</span>' : ""}${s.role === "staff" ? '<span class="tag">Staff</span>' : ""}</a></li>`,
      )
      .join("")}
  </ul>
</section>`,
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CRECO PBO Platform — Wireframes</title>
  <link rel="stylesheet" href="assets/wireframe.css">
</head>
<body class="wf-hub">
  <header class="wf-hub-header">
    <h1>CRECO PBO Act Platform — UI/UX Wireframes</h1>
    <p>ToR Deliverable #2 · CRECO Kenya &amp; ICNL · For administrator review and sign-off before development. This site is separate from the live PBO platform.</p>
    <p style="margin-top:0.75rem"><a href="export/CRECO-PBO-Wireframes.pdf" style="color:#93c5fd">Download PDF for CRECO sign-off →</a></p>
  </header>
  <div class="wf-hub-grid">
    ${body}
    <section class="wf-hub-section">
      <h2>User journeys</h2>
      <ul class="wf-hub-links">
        <li><a href="pages/journey-01-knowledge-assessment.html">Journey 1 — Knowledge → Self-assessment</a></li>
        <li><a href="pages/journey-02-guidance-flag.html">Journey 2 — Guidance Q&A → Flag → Ask CRECO</a></li>
        <li><a href="pages/journey-03-monitoring-submit.html">Journey 3 — Login → Monitoring → Upload</a></li>
        <li><a href="pages/journey-04-moderation.html">Journey 4 — Moderator MFA → Approve submission</a></li>
        <li><a href="pages/journey-05-cms-publish.html">Journey 5 — CMS → Edit Kiswahili → Publish</a></li>
        <li><a href="pages/journey-06-admin-export.html">Journey 6 — Admin dashboard → Export CSV</a></li>
      </ul>
    </section>
    <section class="wf-hub-section">
      <h2>Documentation</h2>
      <ul class="wf-hub-links">
        <li><a href="docs/sitemap.html">Sitemap &amp; screen inventory</a></li>
        <li><a href="docs/user-journeys.html">User journeys</a></li>
        <li><a href="docs/inception.html">Inception report summary</a></li>
        <li><a href="export/CRECO-PBO-Wireframes.pdf">Wireframes PDF (CRECO deliverable)</a></li>
      </ul>
    </section>
  </div>
</body>
</html>`;
}
