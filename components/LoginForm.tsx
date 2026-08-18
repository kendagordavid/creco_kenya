"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import {
  ArrowRight,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "@/lib/i18n/client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const registered = searchParams.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t.auth.login.invalidCredentials);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Card className="border-0 bg-white shadow-xl shadow-[rgba(22,51,0,0.08)] ring-1 ring-black/5">
      <CardHeader className="space-y-3 pb-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-creco-primary text-white shadow-md">
          <LogIn className="size-5" aria-hidden />
        </div>
        <CardTitle className="font-display text-2xl font-bold tracking-tight text-creco-primary">
          {t.auth.login.title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {t.auth.login.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {registered && (
          <Alert className="mb-4 border-creco-primary/40 bg-creco-green-muted">
            <AlertDescription className="text-creco-primary">
              {t.auth.login.registeredSuccess}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t.auth.login.email}</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.auth.login.emailPlaceholder}
                className="h-11 pl-9"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <Label htmlFor="password">{t.auth.login.password}</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[var(--creco-primary)] hover:underline"
              >
                {t.auth.login.forgotPassword}
              </Link>
            </div>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder={t.auth.login.passwordPlaceholder}
                className="h-11 pl-9"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-creco-primary text-white hover:bg-creco-primary-dark font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                {t.auth.login.submitting}
              </>
            ) : (
              <>
                {t.auth.login.submit}
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent pt-0">
        <div className="flex w-full items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">{t.common.newHere}</span>
          <Separator className="flex-1" />
        </div>
        <Link
          href="/register"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg border-2 border-creco-primary text-sm font-semibold text-creco-primary transition-colors hover:bg-creco-green-muted"
        >
          {t.auth.login.createAccount}
        </Link>
        <Link
          href="/"
          className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.common.backToHome}
        </Link>
        {process.env.NODE_ENV === "development" && (
          <p className="rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
            {t.auth.login.devDemo}{" "}
            <strong className="text-foreground">demo@pbo.org</strong> /{" "}
            <strong className="text-foreground">demo1234</strong>
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
