export type UserRole = "pbo_user" | "superuser";

export function normalizeRole(role?: string): UserRole {
  return role === "superuser" ? "superuser" : "pbo_user";
}

export function isSuperuser(role?: string): boolean {
  return normalizeRole(role) === "superuser";
}

export function canViewAllReports(role?: string): boolean {
  return isSuperuser(role);
}
