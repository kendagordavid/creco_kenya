"use client";

import { FormEvent, useState } from "react";
import { FormField, FormSelect, FormTextarea } from "@/components/FormField";
import { useFormat, useTranslations } from "@/lib/i18n/client";

export function AnonymousReportForm() {
  const t = useTranslations();
  const format = useFormat();
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ reference: string; hasContact: boolean } | null>(null);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          subject,
          details,
          contactEmail,
          company,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (data.error === "rate_limited") setError(t.anonymousReport.rateLimited);
        else if (data.error === "invalid") setError(t.anonymousReport.invalid);
        else setError(t.anonymousReport.saveFailed);
        return;
      }

      setResult({
        reference: data.reference ?? "",
        hasContact: Boolean(data.hasContact || contactEmail.trim()),
      });
    } catch {
      setError(t.anonymousReport.saveFailed);
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <div className="space-y-4" role="status">
        <h3 className="text-lg font-bold text-creco-black dark:text-foreground">
          {t.anonymousReport.successTitle}
        </h3>
        <p className="text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
          {format(t.anonymousReport.successBody, { reference: result.reference })}
        </p>
        <p className="text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
          {result.hasContact ? t.anonymousReport.successEmail : t.anonymousReport.successAnonymous}
        </p>
        <button
          type="button"
          className="creco-btn creco-btn-secondary min-h-11"
          onClick={() => {
            setResult(null);
            setCategory("");
            setSubject("");
            setDetails("");
            setContactEmail("");
          }}
        >
          {t.anonymousReport.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormSelect
        id="report-category"
        label={t.anonymousReport.category}
        hint={t.anonymousReport.categoryHint}
        required
        value={category}
        onChange={(event) => setCategory(event.target.value)}
      >
        <option value="">{t.anonymousReport.selectCategory}</option>
        <option value="system">{t.anonymousReport.categories.system}</option>
        <option value="other">{t.anonymousReport.categories.other}</option>
      </FormSelect>
      <FormField
        id="report-subject"
        label={t.anonymousReport.subject}
        hint={t.anonymousReport.subjectHint}
        name="subject"
        required
        minLength={5}
        maxLength={160}
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
      />
      <FormTextarea
        id="report-details"
        label={t.anonymousReport.details}
        hint={t.anonymousReport.detailsHint}
        name="details"
        rows={6}
        required
        minLength={20}
        maxLength={4000}
        value={details}
        onChange={(event) => setDetails(event.target.value)}
      />
      <FormField
        id="report-email"
        label={`${t.anonymousReport.email} (${t.common.optional})`}
        hint={t.anonymousReport.emailHint}
        name="email"
        type="email"
        autoComplete="email"
        maxLength={200}
        value={contactEmail}
        onChange={(event) => setContactEmail(event.target.value)}
      />
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="report-company">Company</label>
        <input
          id="report-company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>
      <p className="text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
        {t.anonymousReport.privacyNote}
      </p>
      {error && (
        <p className="creco-form-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={loading} className="creco-btn creco-btn-primary min-h-11">
        {loading ? t.anonymousReport.submitting : t.anonymousReport.submit}
      </button>
    </form>
  );
}
