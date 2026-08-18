"use client";

import { FormEvent, useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useTranslations } from "@/lib/i18n/client";
import { KENYA_COUNTIES, ORG_TYPES } from "@/lib/content/constants";
import { cn } from "@/lib/utils";

type Profile = {
  email: string;
  name: string;
  orgName: string;
  orgType?: string;
  county?: string;
  phone?: string;
};

export function ProfileSettings() {
  const t = useTranslations();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile>({
    email: "",
    name: "",
    orgName: "",
    orgType: "",
    county: "",
    phone: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setProfile(data);
          setForm(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function update(field: keyof Profile, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        orgName: form.orgName,
        orgType: form.orgType,
        county: form.county,
        phone: form.phone,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? t.dashboard.accountSettings.saveFailed);
      return;
    }

    setProfile(data);
    setForm(data);
    setMessage(t.dashboard.accountSettings.saved);
  }

  if (loading) {
    return (
      <DashboardShell
        title={t.dashboard.accountSettings.title}
        description={t.dashboard.accountSettings.loading}
      >
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.common.loading}
        </div>
      </DashboardShell>
    );
  }

  if (error && !profile) {
    return (
      <DashboardShell title={t.dashboard.accountSettings.title}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={t.dashboard.accountSettings.title}
      description={t.dashboard.accountSettings.description}
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <Card className="border-0 shadow-md ring-1 ring-black/5">
          <CardHeader>
            <CardTitle className="text-lg text-creco-primary">
              {t.dashboard.accountSettings.personalSection}
            </CardTitle>
            <CardDescription>{t.dashboard.accountSettings.personalLead}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-5">
              {message && (
                <Alert className="border-creco-primary/40 bg-creco-green-muted">
                  <CheckCircle2 className="size-4 text-creco-primary" aria-hidden />
                  <AlertDescription className="text-creco-primary">{message}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Field icon={Mail} id="email" label={t.auth.login.email}>
                <Input id="email" type="email" className="h-11 pl-9" value={form.email} disabled readOnly />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {t.dashboard.accountSettings.emailReadonly}
                </p>
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field icon={User} id="name" label={t.auth.register.yourName} className="sm:col-span-2">
                  <Input
                    id="name"
                    className="h-11 pl-9"
                    required
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                  />
                </Field>

                <Field
                  icon={Building2}
                  id="orgName"
                  label={t.auth.register.orgName}
                  className="sm:col-span-2"
                >
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
                    value={form.orgType ?? ""}
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
                      value={form.county ?? ""}
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

                <Field
                  icon={Phone}
                  id="phone"
                  label={t.auth.register.phone}
                  className="sm:col-span-2"
                >
                  <Input
                    id="phone"
                    type="tel"
                    className="h-11 pl-9"
                    value={form.phone ?? ""}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </Field>
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="h-11 bg-creco-primary text-white hover:bg-creco-primary-dark font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" aria-hidden />
                    {t.common.saving}
                  </>
                ) : (
                  <>
                    <Save aria-hidden />
                    {t.common.save}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="border-0 bg-creco-green-muted shadow-sm ring-1 ring-creco-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-creco-primary">
                {t.dashboard.accountSettings.orgSection}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed text-creco-primary/85">
              {t.dashboard.accountSettings.orgLead}
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm ring-1 ring-black/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold text-creco-primary">
                {t.dashboard.stats.accountStatus}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t.dashboard.accountSettings.securityNote}
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Field({
  icon: Icon,
  id,
  label,
  className,
  children,
}: {
  icon: LucideIcon;
  id: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
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
