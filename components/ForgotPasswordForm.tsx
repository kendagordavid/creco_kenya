"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, KeyRound, Loader2, Mail } from "lucide-react";
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
import { useFormat, useTranslations } from "@/lib/i18n/client";

export function ForgotPasswordForm() {
  const t = useTranslations();
  const format = useFormat();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <Card className="border-0 bg-white shadow-xl shadow-[rgba(22,51,0,0.08)] ring-1 ring-black/5">
      <CardHeader className="space-y-3 pb-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-creco-primary text-white shadow-md">
          <KeyRound className="size-5" aria-hidden />
        </div>
        <CardTitle className="font-display text-2xl font-bold tracking-tight text-creco-primary">
          {t.auth.forgot.title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {t.auth.forgot.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {submitted ? (
          <Alert className="border-creco-primary/40 bg-creco-green-muted">
            <AlertDescription className="text-creco-primary">
              {format(t.auth.forgot.success, { email: "info@crecokenya.org" })}
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">{t.auth.forgot.email}</Label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@organisation.org"
                  className="h-11 pl-9"
                  required
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
                  {t.auth.forgot.submitting}
                </>
              ) : (
                <>
                  {t.auth.forgot.submit}
                  <ArrowRight aria-hidden />
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 border-t-0 bg-transparent pt-0">
        <Link
          href="/login"
          className="text-center text-sm font-medium text-[var(--creco-primary)] hover:underline"
        >
          {t.auth.forgot.backToSignIn}
        </Link>
        <Link
          href="/"
          className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.auth.forgot.backToHome}
        </Link>
      </CardFooter>
    </Card>
  );
}
