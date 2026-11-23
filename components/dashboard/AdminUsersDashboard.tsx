"use client";

import { useMemo, useState } from "react";
import { Loader2, Search, ShieldCheck, ShieldOff, UserCheck, UserX, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AdminShell } from "@/components/dashboard/AdminShell";
import { useAuthQuery } from "@/hooks/useAuthQuery";
import { authFetch, invalidateAuthCache } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";
import { useFormat, useTranslations } from "@/lib/i18n/client";

type ManagedUser = {
  id: string;
  email: string;
  name: string;
  orgName: string;
  county?: string;
  role: "pbo_user" | "superuser";
  disabled: boolean;
  mfaEnabled: boolean;
  submissionCount: number;
  createdAt: string;
};

type UsersResponse = { users?: ManagedUser[]; currentUserId?: string; error?: string };

type Patch = { role?: ManagedUser["role"]; disabled?: boolean; resetMfa?: true };

const API = "/api/admin/users";

export function AdminUsersDashboard() {
  const t = useTranslations();
  const format = useFormat();
  const { data, loading, error: queryError } = useAuthQuery<UsersResponse>(API, { ttlMs: CACHE_TTL.admin });
  const [users, setUsers] = useState<ManagedUser[]>(() => (data?.error ? [] : (data?.users ?? [])));
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | ManagedUser["role"] | "disabled">("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const error = queryError ?? data?.error ?? "";
  const currentUserId = data?.currentUserId;

  // Adopt fresh server data during render (not in an effect) so local edits start from it.
  const [syncedData, setSyncedData] = useState(data);
  if (data !== syncedData) {
    setSyncedData(data);
    if (data && !data.error) setUsers(data.users ?? []);
  }

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return users.filter((user) => {
      if (roleFilter === "disabled" && !user.disabled) return false;
      if ((roleFilter === "pbo_user" || roleFilter === "superuser") && user.role !== roleFilter) return false;
      if (!needle) return true;
      return [user.name, user.email, user.orgName, user.county ?? ""].some((field) =>
        field.toLowerCase().includes(needle),
      );
    });
  }, [users, query, roleFilter]);

  const staffCount = users.filter((user) => user.role === "superuser" && !user.disabled).length;

  async function patchUser(user: ManagedUser, patch: Patch, confirmText?: string) {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(user.id);
    setNotice(null);
    try {
      const response = await authFetch(`${API}/${user.id}`, { method: "PATCH", body: JSON.stringify(patch) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? t.adminUsers.updateFailed);
      invalidateAuthCache(API);
      setUsers((current) => current.map((item) => (item.id === user.id ? payload.user : item)));
      setNotice({ tone: "ok", text: format(t.adminUsers.updated, { name: user.name }) });
    } catch (err) {
      setNotice({ tone: "error", text: err instanceof Error && err.message ? err.message : t.adminUsers.updateFailed });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminShell title={t.adminUsers.title} description={t.adminUsers.description}>
      {loading && !data ? (
        <div className="flex items-center gap-2 py-16 text-muted-foreground">
          <Loader2 className="size-5 animate-spin" aria-hidden />
          {t.adminUsers.loading}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-6 text-sm text-destructive">{error}</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: t.adminUsers.stats.total, value: users.length },
              { label: t.adminUsers.stats.staff, value: staffCount },
              { label: t.adminUsers.stats.disabled, value: users.filter((user) => user.disabled).length },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm ring-1 ring-black/5">
                <CardContent className="py-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-creco-primary">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">{t.adminUsers.searchLabel}</span>
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.adminUsers.searchPlaceholder}
                className="h-11 w-full rounded-lg border border-creco-border bg-background pl-9 pr-3 text-sm"
              />
            </label>
            <label className="sm:w-56">
              <span className="sr-only">{t.adminUsers.filterLabel}</span>
              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)}
                className="h-11 w-full rounded-lg border border-creco-border bg-background px-3 text-sm"
              >
                <option value="all">{t.adminUsers.filters.all}</option>
                <option value="superuser">{t.adminUsers.filters.staff}</option>
                <option value="pbo_user">{t.adminUsers.filters.pbo}</option>
                <option value="disabled">{t.adminUsers.filters.disabled}</option>
              </select>
            </label>
          </div>

          <p className="text-sm text-muted-foreground">{format(t.adminUsers.count, { count: filtered.length })}</p>

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

          {filtered.length === 0 ? (
            <Card className="border-0 shadow-sm ring-1 ring-black/5">
              <CardContent className="flex flex-col items-center px-6 py-12 text-center">
                <Users className="size-8 text-creco-primary" aria-hidden />
                <p className="mt-3 text-sm text-muted-foreground">{t.adminUsers.empty}</p>
              </CardContent>
            </Card>
          ) : (
            <ul className="space-y-3">
              {filtered.map((user) => {
                const isSelf = user.id === currentUserId;
                const busy = busyId === user.id;
                return (
                  <li key={user.id}>
                    <Card
                      className={`border-0 shadow-sm ring-1 ring-black/5 ${user.disabled ? "opacity-70" : ""}`}
                    >
                      <CardContent className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0 space-y-1">
                          <p className="flex flex-wrap items-center gap-2 font-bold text-creco-primary">
                            <span className="creco-break-words">{user.name}</span>
                            {isSelf && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                {t.adminUsers.you}
                              </span>
                            )}
                            {user.disabled && (
                              <span className="creco-status-badge creco-status-rejected">{t.adminUsers.disabledBadge}</span>
                            )}
                            {user.mfaEnabled && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-creco-green-muted px-2 py-0.5 text-xs font-semibold text-creco-primary">
                                <ShieldCheck className="size-3.5" aria-hidden />
                                {t.adminUsers.mfaBadge}
                              </span>
                            )}
                          </p>
                          <p className="creco-break-words text-sm text-foreground/90">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            {[user.orgName, user.county].filter(Boolean).join(" · ")} ·{" "}
                            {format(t.adminUsers.joined, {
                              date: new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" }),
                            })}{" "}
                            · {format(t.adminUsers.reports, { count: user.submissionCount })}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <label className="flex items-center gap-2 text-sm">
                            <span className="font-medium text-muted-foreground">{t.adminUsers.role}</span>
                            <select
                              value={user.role}
                              disabled={busy || isSelf}
                              onChange={(event) => {
                                const role = event.target.value as ManagedUser["role"];
                                void patchUser(
                                  user,
                                  { role },
                                  role === "superuser"
                                    ? format(t.adminUsers.confirmPromote, { name: user.name })
                                    : format(t.adminUsers.confirmDemote, { name: user.name }),
                                );
                              }}
                              className="h-11 rounded-lg border border-creco-border bg-background px-3 text-sm disabled:opacity-60"
                            >
                              <option value="pbo_user">{t.adminUsers.roles.pbo_user}</option>
                              <option value="superuser">{t.adminUsers.roles.superuser}</option>
                            </select>
                          </label>
                          {user.mfaEnabled && !isSelf && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                patchUser(user, { resetMfa: true }, format(t.adminUsers.confirmResetMfa, { name: user.name }))
                              }
                              className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-creco-border bg-background px-3 text-sm font-semibold text-foreground disabled:opacity-60"
                            >
                              <ShieldOff className="size-4" aria-hidden />
                              {t.adminUsers.resetMfa}
                            </button>
                          )}
                          {!isSelf && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() =>
                                patchUser(
                                  user,
                                  { disabled: !user.disabled },
                                  user.disabled
                                    ? undefined
                                    : format(t.adminUsers.confirmDisable, { name: user.name }),
                                )
                              }
                              className={
                                user.disabled
                                  ? "inline-flex min-h-11 items-center gap-2 rounded-lg bg-creco-primary px-3 text-sm font-semibold text-white disabled:opacity-60"
                                  : "inline-flex min-h-11 items-center gap-2 rounded-lg border border-destructive/40 bg-background px-3 text-sm font-semibold text-destructive disabled:opacity-60"
                              }
                            >
                              {busy ? (
                                <Loader2 className="size-4 animate-spin" aria-hidden />
                              ) : user.disabled ? (
                                <UserCheck className="size-4" aria-hidden />
                              ) : (
                                <UserX className="size-4" aria-hidden />
                              )}
                              {user.disabled ? t.adminUsers.enable : t.adminUsers.disable}
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </AdminShell>
  );
}
