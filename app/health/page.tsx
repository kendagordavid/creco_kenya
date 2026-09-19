import { getGoogleAuthIssue } from "@/lib/auth-oauth";
import { getHealthStatus } from "@/lib/health-status";
import { getRequestOrigin, googleOAuthRedirectUri } from "@/lib/request-origin";

export const metadata = {
  title: "System status",
};

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
        ok
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200"
      }`}
    >
      {label}
    </span>
  );
}

function googleStatusLabel(status: "disabled" | "misconfigured" | "enabled"): {
  ok: boolean;
  label: string;
  hint?: string;
} {
  if (status === "enabled") {
    return { ok: true, label: "Google sign-in configured" };
  }

  if (status === "disabled") {
    return {
      ok: false,
      label: "Google sign-in not configured",
      hint: "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env.local to enable it.",
    };
  }

  switch (getGoogleAuthIssue()) {
    case "invalid_client_secret":
      return {
        ok: false,
        label: "Client secret looks incomplete",
        hint: "Copy the full Client secret from Google Cloud Console (usually GOCSPX-…, 24+ characters) into GOOGLE_CLIENT_SECRET.",
      };
    case "invalid_client_id":
      return {
        ok: false,
        label: "Client ID looks invalid",
        hint: "Copy the full Client ID ending in .apps.googleusercontent.com into GOOGLE_CLIENT_ID.",
      };
    case "placeholder":
      return {
        ok: false,
        label: "Placeholder credentials detected",
        hint: "Replace example values in .env.local with real credentials from Google Cloud Console.",
      };
    default:
      return {
        ok: false,
        label: "Google credentials need fixing",
        hint: "Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local.",
      };
  }
}

export default async function HealthPage() {
  const [health, origin] = await Promise.all([getHealthStatus(), getRequestOrigin()]);
  const google = googleStatusLabel(health.google_auth_status);
  const googleRedirectUri = googleOAuthRedirectUri(origin);

  return (
    <div className="creco-section">
      <div className="creco-container max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-creco-primary">System status</h1>
        <p className="mt-2 text-muted-foreground">
          Quick check that login, database, and optional services are set up correctly.
        </p>

        <div className="mt-8 space-y-4 rounded-xl border border-creco-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-semibold">Overall</span>
            <StatusBadge ok={health.status === "ok"} label={health.status === "ok" ? "OK" : "Needs attention"} />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creco-border pt-4">
            <span>Session secret (AUTH_SECRET)</span>
            <StatusBadge
              ok={health.auth_secret_configured}
              label={health.auth_secret_configured ? "Configured" : "Missing"}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creco-border pt-4">
            <span>Database</span>
            <StatusBadge ok={health.db_ok} label={health.db_ok ? "Connected" : "Not connected"} />
          </div>

          <div className="border-t border-creco-border pt-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>Google sign-in</span>
              <StatusBadge ok={google.ok} label={google.label} />
            </div>
            {google.hint && <p className="mt-2 text-sm text-muted-foreground">{google.hint}</p>}
            <p className="mt-2 break-all text-sm text-muted-foreground">
              Authorized redirect URI for this host:{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-foreground">{googleRedirectUri}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-creco-border pt-4">
            <span>AI guidance</span>
            <StatusBadge
              ok={health.ai_ready}
              label={health.ai_ready ? "OpenAI ready" : "Wiki-only mode"}
            />
          </div>

          <p className="border-t border-creco-border pt-4 text-sm text-muted-foreground">
            Environment: {health.host === "vercel" ? "Production (Vercel)" : "Local development"}
          </p>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Developer JSON endpoint:{" "}
          <a href="/api/health" className="font-medium text-creco-primary hover:underline">
            /api/health
          </a>
        </p>
      </div>
    </div>
  );
}
