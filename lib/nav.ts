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
