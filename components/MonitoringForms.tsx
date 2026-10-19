"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FormField, FormSelect, FormTextarea } from "@/components/FormField";
import { KENYA_COUNTIES, ORG_TYPES } from "@/lib/content/constants";
import { useTranslations } from "@/lib/i18n/client";
import {
  clearPersistedData,
  loadPersistedData,
  savePersistedData,
} from "@/lib/persist-user-data";
import { authFetch, invalidateAuthCache } from "@/lib/auth-client";

const AREA_TYPE = {
  registration: "registration",
  international: "registration",
  suspension: "incident",
  appeals: "incident",
  forums: "incident",
  transition: "registration",
  authority: "incident",
} as const;

export type MonitoringArea = keyof typeof AREA_TYPE;

export type MonitoringDraft = {
  type: "registration" | "enabling" | "incident";
  area?: MonitoringArea;
  county: string;
  issueType?: string;
  severity?: string;
  experienceDate?: string;
  narrative: string;
  orgType?: string;
  consentGiven?: boolean;
  attachmentNote?: string;
};

const DRAFT_KEY = "creco-monitoring-draft";

type Props = {
  title: string;
  continueHref: string;
};

export function MonitoringReportForm({ title, continueHref }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [form, setForm] = useState<MonitoringDraft>({
    type: "registration",
    county: "",
    narrative: "",
    issueType: "",
    severity: "",
    experienceDate: "",
    orgType: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void loadPersistedData<MonitoringDraft>(DRAFT_KEY, sessionStorage).then((draft) => {
      if (!active || !draft) return;
      setForm(draft);
    });
    return () => {
      active = false;
    };
  }, []);

  function update(field: keyof MonitoringDraft, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      void savePersistedData(DRAFT_KEY, next, sessionStorage);
      return next;
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.area) {
      setError("Please choose the area you are reporting on.");
      return;
    }
    if (form.narrative.trim().length < 20) {
      setError("Please describe your experience in at least a few sentences.");
      return;
    }
    if (!form.county) {
      setError("Please select a county.");
      return;
    }
    void savePersistedData(DRAFT_KEY, form, sessionStorage);
    router.push(continueHref);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-creco-primary">{title}</h1>

      <FormSelect
        id="area"
        label={t.monitoringHub.areaLabel}
        required
        value={form.area ?? ""}
        onChange={(e) => {
          const area = e.target.value as MonitoringArea;
          const match = t.monitoringHub.areas.find((item) => item.id === area);
          update("area", area);
          update("type", AREA_TYPE[area] ?? "incident");
          update("issueType", match?.label ?? area);
        }}
      >
        <option value="">{t.monitoringHub.areaPlaceholder}</option>
        {t.monitoringHub.areas.map((area) => (
          <option key={area.id} value={area.id}>
            {area.label}
          </option>
        ))}
      </FormSelect>

      <FormSelect
        id="county"
        label="County"
        required
        value={form.county}
        onChange={(e) => update("county", e.target.value)}
      >
        <option value="">Select county</option>
        {KENYA_COUNTIES.map((county) => (
          <option key={county} value={county}>
            {county}
          </option>
        ))}
      </FormSelect>

      <FormField
        id="experienceDate"
        label="Date of experience"
        type="date"
        value={form.experienceDate ?? ""}
        onChange={(e) => update("experienceDate", e.target.value)}
      />

      <FormTextarea
        id="narrative"
        label="Describe what happened"
        required
        rows={6}
        value={form.narrative}
        onChange={(e) => update("narrative", e.target.value)}
        hint="Structured narrative — what occurred, who was involved, and any reference numbers if applicable."
      />

      <FormSelect
        id="orgType"
        label="Organisation type (optional)"
        value={form.orgType ?? ""}
        onChange={(e) => update("orgType", e.target.value)}
      >
        <option value="">Select type</option>
        {ORG_TYPES.map((org) => (
          <option key={org} value={org}>
            {org}
          </option>
        ))}
      </FormSelect>

      {error && <p className="creco-form-error">{error}</p>}

      <div className="flex flex-wrap gap-3 pt-2">
        <Link href="/monitoring" className="creco-btn creco-btn-secondary">
          Cancel
        </Link>
        <button type="submit" className="creco-btn creco-btn-primary">
          Continue to upload
        </button>
      </div>
    </form>
  );
}

export function MonitoringUploadForm() {
  const router = useRouter();
  const [draft, setDraft] = useState<MonitoringDraft | null>(null);
  const [attachmentNote, setAttachmentNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    void loadPersistedData<MonitoringDraft>(DRAFT_KEY, sessionStorage).then((saved) => {
      if (active && saved) setDraft(saved);
    });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draft) {
      setError("No report draft found. Start from the monitoring hub.");
      return;
    }
    if (!consent) {
      setError("You must consent to confidential staff review.");
      return;
    }

    setLoading(true);
    setError("");

    const names = files.map((file) => file.name).join(", ");
    const note = [attachmentNote.trim(), names ? `Attached: ${names}` : ""].filter(Boolean).join("\n");
    const payload = new FormData();
    payload.set(
      "payload",
      JSON.stringify({
        ...draft,
        attachmentNote: note,
        consentGiven: consent,
      }),
    );
    for (const file of files) payload.append("files", file);

    const res = await authFetch("/api/submissions", {
      method: "POST",
      body: payload,
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Submission failed.");
      return;
    }

    await clearPersistedData(DRAFT_KEY, sessionStorage);
    invalidateAuthCache("/api/submissions");
    router.push(`/monitoring/confirmation?id=${data.id}`);
  }

  if (!draft) {
    return (
      <div className="creco-card mx-auto max-w-xl p-8 text-center">
        <p className="text-creco-muted">No draft report found.</p>
        <Link href="/monitoring" className="creco-btn creco-btn-primary mt-4">
          Back to monitoring hub
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold text-creco-primary">Upload & consent</h1>
      <p className="text-sm text-creco-muted">
        Attach supporting documents or other evidence. PDF, Word, and image files up to 5 MB each.
      </p>

      <label className="block text-sm font-medium text-creco-black dark:text-foreground" htmlFor="evidence">
        Supporting documents
      </label>
      <input
        id="evidence"
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,application/pdf,image/*"
        className="block w-full text-sm text-creco-muted"
        onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
      />

      <FormTextarea
        id="attachmentNote"
        label="Supporting documents (optional)"
        rows={4}
        value={attachmentNote}
        onChange={(e) => setAttachmentNote(e.target.value)}
        hint="e.g. Letter from Authority dated 12 Jan 2026; screenshot of portal delay"
      />

      <label className="flex items-start gap-3 rounded-lg border border-creco-border bg-creco-surface p-4 text-sm">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
          required
        />
        <span>
          I consent to Mashirika Law staff reviewing this submission confidentially for advocacy and
          monitoring purposes, in line with the platform privacy notice.
        </span>
      </label>

      {error && <p className="creco-form-error">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <Link href="/monitoring" className="creco-btn creco-btn-secondary">
          Cancel
        </Link>
        <button type="submit" disabled={loading} className="creco-btn creco-btn-primary">
          {loading ? "Submitting…" : "Submit report"}
        </button>
      </div>
    </form>
  );
}

export { DRAFT_KEY };
