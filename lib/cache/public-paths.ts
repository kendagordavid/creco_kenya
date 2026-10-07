/** Routes that can be cached at the CDN (guest-facing HTML). */

const PRIVATE_PREFIXES = [
  "/admin",
  "/profile",
  "/api/",
  "/login",
  "/register",
  "/forgot-password",
  "/monitoring/registration",
  "/monitoring/enabling",
  "/monitoring/incident",
  "/monitoring/upload",
  "/monitoring/confirmation",
  "/monitoring/submissions",
] as const;

function matchesPrefix(pathname: string, prefix: string): boolean {
  const normalized = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return pathname === normalized || pathname.startsWith(`${normalized}/`);
}

export function isPublicCacheablePath(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return false;
  return !PRIVATE_PREFIXES.some((prefix) => matchesPrefix(pathname, prefix));
}
