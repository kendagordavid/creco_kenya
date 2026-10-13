/** Same main pages before and after sign-in. Sign in stays in the account control. */
export const MAIN_NAV = [
  { href: "/", labelKey: "home" as const },
  { href: "/knowledge", labelKey: "knowledge" as const },
  { href: "/compliance", labelKey: "compliance" as const },
  { href: "/monitoring", labelKey: "monitoring" as const },
  { href: "/news", labelKey: "news" as const },
] as const;

export const PLATFORM_NAV = MAIN_NAV;
export const PUBLIC_NAV = MAIN_NAV;

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
    { href: "/topics", labelKey: "frameworkSummaries" as const },
    { href: "/knowledge/faq", labelKey: "faqs" as const },
    { href: "/knowledge/media", labelKey: "media" as const },
    { href: "/sources", labelKey: "sources" as const },
    { href: "/knowledge/forms", labelKey: "forms" as const },
    { href: "/guidance", labelKey: "askGuidance" as const },
  ],
  "/compliance": [
    { href: "/compliance", labelKey: "complianceOverview" as const },
    { href: "/compliance/checklist", labelKey: "selfAssessmentChecklist" as const },
    { href: "/compliance#toolkit", labelKey: "toolkit" as const },
    { href: "/compliance/templates", labelKey: "templates" as const },
  ],
  "/guidance": [
    { href: "/guidance", labelKey: "askGuidance" as const },
    { href: "/guidance/ask-creco", labelKey: "askCreco" as const },
    { href: "/guidance/flag", labelKey: "flagFeedback" as const },
  ],
  "/monitoring": [
    { href: "/monitoring", labelKey: "reportExperience" as const },
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
        pathname.startsWith("/topics/") ||
        pathname === "/sources" ||
        pathname.startsWith("/sources/") ||
        pathname === "/guidance" ||
        pathname.startsWith("/guidance/")
      );
    case "/compliance":
      return pathname === "/compliance" || pathname.startsWith("/compliance/");
    case "/monitoring":
      return (
        pathname === "/monitoring" ||
        pathname.startsWith("/monitoring/") ||
        pathname === "/report"
      );
    case "/news":
      return pathname === "/news" || pathname.startsWith("/news/");
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
