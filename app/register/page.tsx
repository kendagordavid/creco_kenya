import { Suspense } from "react";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="rounded-xl bg-white p-8 text-center text-muted-foreground shadow-lg ring-1 ring-black/5">
            Loading…
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
