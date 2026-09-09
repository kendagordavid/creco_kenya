import "server-only";

import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { createUser, findUserByEmail } from "@/lib/store";

export function isGoogleAuthEnabled(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim(),
  );
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
