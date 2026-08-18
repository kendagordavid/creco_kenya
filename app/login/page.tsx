import { Suspense } from "react";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/LoginForm";

export const metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="rounded-xl bg-white p-8 text-center text-muted-foreground shadow-lg ring-1 ring-black/5">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
