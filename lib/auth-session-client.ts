"use client";

import { signIn, signOut } from "next-auth/react";
import { invalidateAuthCache } from "@/lib/auth-client";

export type CredentialsSignInResult =
  | { ok: true }
  | { ok: false; error: "invalid_credentials" | "configuration" | "unknown"; message?: string };

export async function completeSignOut(callbackUrl = "/"): Promise<void> {
  invalidateAuthCache();

  try {
    await signOut({ redirect: false });
  } catch {
    // Still force a hard navigation so the UI cannot stay in a stale signed-in state.
  }

  window.location.assign(callbackUrl);
}

export async function signInWithCredentials(
  email: string,
  password: string,
  callbackUrl: string,
): Promise<CredentialsSignInResult> {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const result = await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirect: false,
    });

    if (result?.error === "Configuration") {
      return { ok: false, error: "configuration" };
    }

    if (result?.error || result?.ok === false) {
      return { ok: false, error: "invalid_credentials" };
    }

    invalidateAuthCache();
    window.location.assign(callbackUrl);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: "unknown",
      message: error instanceof Error ? error.message : undefined,
    };
  }
}
