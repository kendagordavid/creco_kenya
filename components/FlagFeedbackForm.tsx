"use client";

import { FormEvent, useState } from "react";
import { FormField, FormSelect, FormTextarea } from "@/components/FormField";
import { authFetch } from "@/lib/auth-client";

const REASONS = [
  "Inaccurate or incomplete",
  "Out of date",
  "Missing source citation",
  "Unclear language",
  "Other",
];

export function FlagFeedbackForm({ defaultQuestion = "" }: { defaultQuestion?: string }) {
  const [question, setQuestion] = useState(defaultQuestion);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const res = await authFetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ question, reason, details }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not submit feedback.");
      return;
    }

    setMessage("Thank you — CRECO staff will review your flag.");
    setDetails("");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl space-y-4">
      <FormField
        id="question"
        label="Guidance question"
        required
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <FormSelect
        id="reason"
        label="Reason for flag"
        required
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="">Select reason</option>
        {REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </FormSelect>
      <FormTextarea
        id="details"
        label="Additional details"
        rows={4}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />
      {message && <p className="text-sm font-medium text-creco-primary">{message}</p>}
      {error && <p className="creco-form-error">{error}</p>}
      <button type="submit" disabled={loading} className="creco-btn creco-btn-primary">
        {loading ? "Submitting…" : "Submit flag"}
      </button>
    </form>
  );
}
