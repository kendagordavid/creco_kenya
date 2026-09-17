"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { isGoogleAuthEnabled } from "@/lib/auth-oauth";
import { safeLoginCallbackUrl } from "@/lib/login-params";

export async function googleSignIn(callbackUrl: string) {
  const next = safeLoginCallbackUrl(callbackUrl);
  if (!isGoogleAuthEnabled()) {
    redirect(`/login?error=Configuration&callbackUrl=${encodeURIComponent(next)}`);
  }
  await signIn("google", { redirectTo: next });
}
