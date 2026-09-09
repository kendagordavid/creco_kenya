import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";
import { isGoogleAuthEnabled } from "@/lib/auth-oauth";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/profile");
  }

  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="rounded-xl bg-white p-8 text-center text-muted-foreground shadow-lg ring-1 ring-black/5">
            Loading…
          </div>
        }
      >
        <LoginForm googleAuthEnabled={isGoogleAuthEnabled()} />
      </Suspense>
    </AuthShell>
  );
}
