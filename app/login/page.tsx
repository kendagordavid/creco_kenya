import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";
import { GoogleSignInServerForm } from "@/components/login/GoogleSignInServerForm";
import { getGoogleAuthStatus } from "@/lib/auth-oauth";
import { getDictionary, getLocale } from "@/lib/i18n/server";
import { parseLoginAuthError, safeLoginCallbackUrl } from "@/lib/login-params";

export const metadata = {
  title: "Sign in",
};

type Props = {
  searchParams: Promise<{
    callbackUrl?: string;
    registered?: string;
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user) {
    redirect("/profile");
  }

  const [params, locale] = await Promise.all([searchParams, getLocale()]);
  const t = getDictionary(locale);
  const callbackUrl = safeLoginCallbackUrl(params.callbackUrl);
  const googleAuthStatus = getGoogleAuthStatus();

  const googleSection =
    googleAuthStatus === "enabled" ? (
      <GoogleSignInServerForm callbackUrl={callbackUrl} label={t.auth.login.signInWithGoogle} />
    ) : null;

  return (
    <AuthShell>
      <LoginForm
        googleAuthStatus={googleAuthStatus}
        googleSection={googleSection}
        callbackUrl={callbackUrl}
        registered={params.registered === "1"}
        authError={parseLoginAuthError(params.error)}
      />
    </AuthShell>
  );
}
