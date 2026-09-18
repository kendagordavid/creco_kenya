"use server";

import { signIn } from "@/auth";
import { safeLoginCallbackUrl } from "@/lib/login-params";

export async function googleSignIn(callbackUrl: string) {
  await signIn("google", { redirectTo: safeLoginCallbackUrl(callbackUrl) });
}
