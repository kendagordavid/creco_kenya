import { signIn } from "@/auth";
import { safeLoginCallbackUrl } from "@/lib/login-params";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const callbackUrl = safeLoginCallbackUrl(new URL(request.url).searchParams.get("callbackUrl"));
  await signIn("google", { redirectTo: callbackUrl });
}
