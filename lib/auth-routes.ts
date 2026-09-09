import type { Session } from "next-auth";
import { isSuperuser } from "@/lib/authz";

const PROTECTED_PREFIXES = [
  "/monitoring/registration",
  "/monitoring/enabling",
  "/monitoring/incident",
  "/monitoring/upload",
  "/monitoring/confirmation",
  "/monitoring/submissions",
  "/profile",
  "/profile/account",
] as const;

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function isRouteAuthorized(pathname: string, session: Session | null): boolean {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return isSuperuser(session?.user?.role);
  }

  if (isProtectedPath(pathname)) {
    return !!session;
  }

  return true;
}
