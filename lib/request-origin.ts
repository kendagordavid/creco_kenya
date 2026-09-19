import { headers } from "next/headers";

export async function getRequestOrigin(): Promise<string> {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto =
    headerList.get("x-forwarded-proto") ??
    (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}

export function googleOAuthRedirectUri(origin: string): string {
  return `${origin.replace(/\/$/, "")}/api/auth/callback/google`;
}
