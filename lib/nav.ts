export const PLATFORM_NAV = [
  { href: "/", labelKey: "home" as const },
  { href: "/knowledge", labelKey: "knowledge" as const },
  { href: "/compliance", labelKey: "compliance" as const },
  { href: "/guidance", labelKey: "guidance" as const },
  { href: "/monitoring", labelKey: "monitoring" as const },
] as const;

export const PUBLIC_NAV = [
  { href: "/", labelKey: "home" as const },
  { href: "/guidance", labelKey: "guidance" as const },
  { href: "/topics", labelKey: "topics" as const },
  { href: "/sources", labelKey: "sources" as const },
] as const;

export const TOPIC_NAV = [
  { href: "/knowledge/topics/legal-framework", slug: "legal-framework" },
  { href: "/knowledge/topics/registration", slug: "registration" },
  { href: "/knowledge/topics/bestowment", slug: "bestowment" },
  { href: "/knowledge/topics/international-pbos", slug: "international-pbos" },
  { href: "/knowledge/topics/rights-and-benefits", slug: "rights-and-benefits" },
  { href: "/knowledge/topics/governance-reporting-accountability", slug: "governance-reporting-accountability" },
  { href: "/knowledge/topics/suspension-cancellation-appeals", slug: "suspension-cancellation-appeals" },
  { href: "/knowledge/topics/self-regulation", slug: "self-regulation" },
  { href: "/knowledge/topics/regulatory-authority-and-tribunal", slug: "regulatory-authority-and-tribunal" },
  { href: "/knowledge/topics/practical-compliance", slug: "practical-compliance" },
] as const;

export const NAV_MENUS = {
  "/knowledge": [
    { href: "/knowledge", labelKey: "knowledgeHub" as const },
    { href: "/topics", labelKey: "allTopics" as const },
    { href: "/knowledge/faq", labelKey: "faqs" as const },
    { href: "/knowledge?filter=toolkits", labelKey: "toolkits" as const },
    { href: "/knowledge/media", labelKey: "media" as const },
  ],
  "/compliance": [
    { href: "/compliance", labelKey: "complianceOverview" as const },
    { href: "/compliance/checklist", labelKey: "checklist" as const },
    { href: "/compliance/assessment", labelKey: "assessment" as const },
    { href: "/compliance/templates", labelKey: "templates" as const },
  ],
  "/guidance": [
    { href: "/guidance", labelKey: "askGuidance" as const },
    { href: "/guidance/ask-creco", labelKey: "askCreco" as const },
    { href: "/guidance/flag", labelKey: "flagFeedback" as const },
    { href: "/sources", labelKey: "sources" as const },
  ],
  "/monitoring": [
    { href: "/monitoring", labelKey: "monitoringOverview" as const },
    { href: "/monitoring/registration", labelKey: "registration" as const },
    { href: "/monitoring/enabling", labelKey: "enabling" as const },
    { href: "/monitoring/incident", labelKey: "incident" as const },
    { href: "/monitoring/submissions", labelKey: "mySubmissions" as const },
    { href: "/report", labelKey: "anonymousReport" as const },
  ],
  "/topics": [
    { href: "/topics", labelKey: "allTopics" as const },
  ],
} as const;

export function isPlatformNavActive(pathname: string, href: string): boolean {
  switch (href) {
    case "/":
      return pathname === "/";
    case "/knowledge":
      return (
        pathname === "/knowledge" ||
        pathname.startsWith("/knowledge/") ||
        pathname === "/topics" ||
        pathname.startsWith("/topics/")
      );
    case "/compliance":
      return pathname === "/compliance" || pathname.startsWith("/compliance/");
    case "/guidance":
      return (
        pathname === "/guidance" ||
        pathname.startsWith("/guidance/") ||
        pathname === "/sources" ||
        pathname.startsWith("/sources/")
      );
    case "/monitoring":
      return pathname === "/monitoring" || pathname.startsWith("/monitoring/");
    default:
      return pathname === href || pathname.startsWith(`${href}/`);
  }
}

export function isPublicNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isDashboardRoute(pathname: string): boolean {
  return (
    pathname === "/profile" ||
    pathname.startsWith("/profile/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}
