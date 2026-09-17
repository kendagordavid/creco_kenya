import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "@/components/RegisterForm";
import { GoogleSignInServerForm } from "@/components/login/GoogleSignInServerForm";
import { getGoogleAuthStatus } from "@/lib/auth-oauth";
import { getDictionary, getLocale } from "@/lib/i18n/server";

export const metadata = {
  title: "Register",
};

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/profile");
  }

  const locale = await getLocale();
  const t = getDictionary(locale);
  const googleAuthStatus = getGoogleAuthStatus();
  const googleSection = (
    <GoogleSignInServerForm callbackUrl="/profile" label={t.auth.login.signInWithGoogle} />
  );

  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="rounded-xl bg-white p-8 text-center text-muted-foreground shadow-lg ring-1 ring-black/5">
            Loading…
          </div>
        }
      >
        <RegisterForm googleAuthStatus={googleAuthStatus} googleSection={googleSection} />
      </Suspense>
    </AuthShell>
  );
}
