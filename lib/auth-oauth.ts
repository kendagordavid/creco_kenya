import "server-only";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createUser, findUserByEmail } from "@/lib/store";

export type GoogleAuthStatus = "disabled" | "misconfigured" | "enabled";

export type GoogleAuthIssue = "missing" | "placeholder" | "invalid_client_id" | "invalid_client_secret";

function firstEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key]?.trim() ?? "";
    if (value) return value;
  }
  return "";
}

export function getGoogleClientId(): string {
  return firstEnv("GOOGLE_CLIENT_ID", "AUTH_GOOGLE_ID");
}

export function getGoogleClientSecret(): string {
  return firstEnv("GOOGLE_CLIENT_SECRET", "AUTH_GOOGLE_SECRET");
}

export function getGoogleAuthIssue(): GoogleAuthIssue | null {
  const clientId = getGoogleClientId();
  const clientSecret = getGoogleClientSecret();

  if (!clientId || !clientSecret) return "missing";

  const haystack = `${clientId} ${clientSecret}`.toLowerCase();
  if (/your-client-id|your-client-secret|replace-me|example|changeme|xxx/.test(haystack)) {
    return "placeholder";
  }

  if (!clientId.endsWith(".apps.googleusercontent.com") || clientId.length < 50) {
    return "invalid_client_id";
  }

  if (clientSecret.length < 20) {
    return "invalid_client_secret";
  }

  return null;
}

export function getGoogleAuthStatus(): GoogleAuthStatus {
  const issue = getGoogleAuthIssue();
  if (!issue) return "enabled";
  if (issue === "missing") return "disabled";
  return "misconfigured";
}

export function isGoogleAuthEnabled(): boolean {
  return getGoogleAuthStatus() === "enabled";
}

export async function provisionGoogleUser(input: { email: string; name: string }) {
  const email = input.email.trim().toLowerCase();
  const existing = await findUserByEmail(email);
  if (existing) return existing;

  const passwordHash = await bcrypt.hash(randomUUID(), 10);
  return createUser({
    email,
    passwordHash,
    name: input.name.trim() || email.split("@")[0] || "PBO user",
    orgName: "Organisation profile pending",
    role: "pbo_user",
  });
}
