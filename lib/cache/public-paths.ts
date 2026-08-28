/** Routes that can be cached at the CDN (guest-facing HTML). */

const PRIVATE_PREFIXES = [
  "/admin",
  "/profile",
  "/api/",
  "/monitoring/registration",
  "/monitoring/enabling",
  "/monitoring/incident",
  "/monitoring/upload",
  "/monitoring/confirmation",
  "/monitoring/submissions",
] as const;

export function isPublicCacheablePath(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return false;
  return !PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
