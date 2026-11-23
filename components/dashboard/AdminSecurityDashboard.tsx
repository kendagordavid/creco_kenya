"use client";

import { FormEvent, useState } from "react";
import { KeyRound, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch, invalidateAuthCache } from "@/lib/auth-client";
import { useTranslations } from "@/lib/i18n/client";

const API = "/api/admin/mfa";

type Enrollment = { secret: string; otpauthUri: string; qrDataUrl: string };

function CodeInput({ value, onChange, id }: { value: string; onChange: (value: string) => void; id: string }) {
  return (
    <input
      id={id}
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]{6}"
      maxLength={6}
      required
      placeholder="123456"
      value={value}
      onChange={(event) => onChange(event.target.value.replace(/\D/g, "").slice(0, 6))}
      className="h-11 w-40 rounded-lg border border-creco-border bg-background px-3 text-center font-mono text-lg tracking-[0.3em]"
    />
  );
}

export function AdminSecurityDashboard() {
  const t = useTranslations();
  const { data, loading } = useAuthQuery<{ enabled?: boolean; error?: string }>(API, { ttlMs: 0 });
  // Local value after a change on this page; until then, what the server reported.
  const [changed, setChanged] = useState<boolean | null>(null);
  const enabled = changed ?? (typeof data?.enabled === "boolean" ? data.enabled : null);
  const setEnabled = setChanged;
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  async function call(method: "POST" | "DELETE", body: object) {
    const response = await authFetch(API, { method, body: JSON.stringify(body) });
    const payload = await response.json();
    invalidateAuthCache(API);
    return { ok: response.ok, payload };
  }

  async function start() {
    setBusy(true);
    setNotice(null);
    try {
      const { ok, payload } = await call("POST", { action: "start" });
      if (!ok) throw new Error();
      setEnrollment(payload as Enrollment);
      setCode("");
    } catch {
      setNotice({ tone: "error", text: t.adminSecurity.failed });
    } finally {
      setBusy(false);
    }
  }

  async function confirm(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const { ok } = await call("POST", { action: "confirm", code });
      if (!ok) {
        setNotice({ tone: "error", text: t.adminSecurity.wrongCode });
        setCode("");
        return;
      }
      setEnabled(true);
      setEnrollment(null);
      setCode("");
      setNotice({ tone: "ok", text: t.adminSecurity.turnedOn });
    } finally {
      setBusy(false);
    }
  }

  async function turnOff(event: FormEvent) {
    event.preventDefault();
    if (!window.confirm(t.adminSecurity.turnOffConfirm)) return;
    setBusy(true);
    setNotice(null);
    try {
      const { ok } = await call("DELETE", { code });
      if (!ok) {
        setNotice({ tone: "error", text: t.adminSecurity.wrongCode });
        setCode("");
        return;
      }
      setEnabled(false);
      setCode("");
      setNotice({ tone: "ok", text: t.adminSecurity.turnedOff });
    } finally {
      setBusy(false);
    }
  }

  return (
    <AdminShell title={t.adminSecurity.title} description={t.adminSecurity.description}>
      {notice && (
        <p
          role="status"
          className={
            notice.tone === "ok"
              ? "rounded-lg border border-creco-primary/20 bg-creco-green-muted px-4 py-3 text-sm text-creco-primary"
              : "rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          }
        >
          {notice.text}
        </p>
      )}

      {loading && enabled === null ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminSecurity.loading}
        </div>
      ) : (
        <Card className="border-0 shadow-sm ring-1 ring-black/5">
          <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <span
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${
                enabled ? "bg-creco-green-muted text-creco-primary" : "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
              }`}
            >
              {enabled ? <ShieldCheck className="size-6" aria-hidden /> : <ShieldAlert className="size-6" aria-hidden />}
            </span>
            <div>
              <CardTitle className="text-lg text-creco-primary">{t.adminSecurity.cardTitle}</CardTitle>
              <CardDescription className="mt-1 leading-relaxed">
                {enabled ? t.adminSecurity.statusOn : t.adminSecurity.statusOff}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {enabled ? (
              <form onSubmit={turnOff} className="space-y-3 border-t border-creco-border pt-5">
                <label htmlFor="mfa-off-code" className="block text-sm font-semibold text-creco-primary">
                  {t.adminSecurity.turnOffLabel}
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <CodeInput id="mfa-off-code" value={code} onChange={setCode} />
                  <button
                    type="submit"
                    disabled={busy || code.length !== 6}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-destructive/40 px-4 text-sm font-semibold text-destructive disabled:opacity-50"
                  >
                    {t.adminSecurity.turnOff}
                  </button>
                </div>
              </form>
            ) : enrollment ? (
              <div className="grid gap-6 border-t border-creco-border pt-5 md:grid-cols-[auto_minmax(0,1fr)]">
                {/* eslint-disable-next-line @next/next/no-img-element -- data URL generated on the server */}
                <img
                  src={enrollment.qrDataUrl}
                  alt={t.adminSecurity.qrAlt}
                  width={220}
                  height={220}
                  className="rounded-lg bg-white p-2 ring-1 ring-black/10"
                />
                <div className="min-w-0 space-y-4 text-sm">
                  <ol className="list-decimal space-y-2 pl-5 leading-relaxed">
                    <li>{t.adminSecurity.step1}</li>
                    <li>{t.adminSecurity.step2}</li>
                    <li>{t.adminSecurity.step3}</li>
                  </ol>
                  <div className="rounded-lg bg-muted/50 px-3 py-2">
                    <p className="text-xs font-semibold text-muted-foreground">{t.adminSecurity.manualKey}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <code className="break-all font-mono text-sm">{enrollment.secret.replace(/(.{4})/g, "$1 ").trim()}</code>
                      <button
                        type="button"
                        onClick={() => void navigator.clipboard?.writeText(enrollment.secret)}
                        className="shrink-0 rounded-md border border-creco-border px-2 py-1 text-xs font-semibold text-creco-primary"
                      >
                        {t.adminSecurity.copy}
                      </button>
                    </div>
                  </div>
                  <form onSubmit={confirm} className="space-y-2">
                    <label htmlFor="mfa-confirm-code" className="block font-semibold text-creco-primary">
                      {t.adminSecurity.confirmLabel}
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      <CodeInput id="mfa-confirm-code" value={code} onChange={setCode} />
                      <button
                        type="submit"
                        disabled={busy || code.length !== 6}
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-creco-primary px-4 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
                        {t.adminSecurity.confirm}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="space-y-3 border-t border-creco-border pt-5 text-sm leading-relaxed text-muted-foreground">
                <p>{t.adminSecurity.intro}</p>
                <p>{t.adminSecurity.googleNote}</p>
                <button
                  type="button"
                  onClick={start}
                  disabled={busy}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-creco-primary px-4 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <KeyRound className="size-4" aria-hidden />}
                  {t.adminSecurity.setUp}
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </AdminShell>
  );
}
