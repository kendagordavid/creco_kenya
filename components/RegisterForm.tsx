"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Building2,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
  UserPlus,
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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { KENYA_COUNTIES, ORG_TYPES } from "@/lib/content/constants";
import { useTranslations } from "@/lib/i18n/client";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();
  const t = useTranslations();
  const termsParts = t.auth.register.terms.split("{privacyLink}");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    orgName: "",
    orgType: "",
    county: "",
    phone: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError(t.auth.register.passwordMismatch);
      return;
    }

    if (!termsAccepted) {
      setError(t.auth.register.termsRequired);
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        orgName: form.orgName,
        orgType: form.orgType,
        county: form.county,
        phone: form.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? t.auth.register.failed);
      return;
    }

    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (signInResult?.error) {
      router.push("/login?registered=1");
      return;
    }

    router.push("/profile");
    router.refresh();
  }

  return (
    <Card className="border-0 bg-white shadow-xl shadow-[rgba(22,51,0,0.08)] ring-1 ring-black/5">
      <CardHeader className="space-y-3 pb-2 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-creco-primary text-white shadow-md">
          <UserPlus className="size-5" aria-hidden />
        </div>
        <CardTitle className="font-display text-2xl font-bold tracking-tight text-creco-primary">
          {t.auth.register.title}
        </CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {t.auth.register.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field icon={User} id="name" label={t.auth.register.yourName} required className="sm:col-span-2">
              <Input
                id="name"
                autoComplete="name"
                className="h-11 pl-9"
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </Field>

            <Field icon={Mail} id="email" label={t.auth.register.workEmail} required className="sm:col-span-2">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={t.auth.login.emailPlaceholder}
                className="h-11 pl-9"
                required
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </Field>

            <Field icon={Lock} id="password" label={t.auth.register.password} required>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className="h-11 pl-9"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
              />
            </Field>

            <Field icon={Lock} id="confirmPassword" label={t.auth.register.confirmPassword} required>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="h-11 pl-9"
                required
                minLength={8}
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
              />
            </Field>
            <p className="text-xs text-muted-foreground sm:col-span-2">{t.auth.register.passwordHint}</p>

            <Field icon={Building2} id="orgName" label={t.auth.register.orgName} required className="sm:col-span-2">
              <Input
                id="orgName"
                className="h-11 pl-9"
                required
                value={form.orgName}
                onChange={(e) => update("orgName", e.target.value)}
              />
            </Field>

            <div className="space-y-2">
              <Label htmlFor="orgType">{t.auth.register.orgType}</Label>
              <select
                id="orgType"
                required
                value={form.orgType}
                onChange={(e) => update("orgType", e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <option value="">{t.common.selectType}</option>
                {ORG_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="county">{t.auth.register.county}</Label>
              <div className="relative">
                <MapPin
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden
                />
                <select
                  id="county"
                  required
                  value={form.county}
                  onChange={(e) => update("county", e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">{t.common.selectCounty}</option>
                  {KENYA_COUNTIES.map((county) => (
                    <option key={county} value={county}>
                      {county}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Field icon={Phone} id="phone" label={t.auth.register.phone} className="sm:col-span-2">
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                className="h-11 pl-9"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </Field>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              required
            />
            <Label htmlFor="terms" className="text-sm font-normal leading-snug text-muted-foreground">
              {termsParts[0]}
              <Link href="/" className="font-medium text-[var(--creco-primary)] hover:underline">
                {t.auth.register.privacyNotice}
              </Link>
              {termsParts[1]}
            </Label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full bg-creco-primary text-white hover:bg-creco-primary-dark font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                {t.auth.register.submitting}
              </>
            ) : (
              <>
                {t.auth.register.submit}
                <ArrowRight aria-hidden />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent pt-0">
        <div className="flex w-full items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">{t.common.alreadyRegistered}</span>
          <Separator className="flex-1" />
        </div>
        <Link
          href="/login"
          className="inline-flex h-11 w-full items-center justify-center rounded-lg border-2 border-creco-primary text-sm font-semibold text-creco-primary transition-colors hover:bg-creco-green-muted"
        >
          {t.auth.register.signInLink}
        </Link>
        <Link
          href="/"
          className="text-center text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {t.common.backToHome}
        </Link>
      </CardFooter>
    </Card>
  );
}

function Field({
  icon: Icon,
  id,
  label,
  required,
  className,
  children,
}: {
  icon: LucideIcon;
  id: string;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>
        {label}
        {required ? "" : ""}
      </Label>
      <div className="relative">
        <Icon
          className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        {children}
      </div>
    </div>
  );
}
