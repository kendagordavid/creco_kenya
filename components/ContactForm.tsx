"use client";

import { FormEvent, useState } from "react";
import { FormField, FormSelect, FormTextarea } from "@/components/FormField";
import { KENYA_COUNTIES } from "@/lib/content/constants";
import { useTranslations } from "@/lib/i18n/client";

const CONTACT_EMAIL = "info@crecokenya.org";

export function ContactForm() {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [county, setCounty] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const body = [
      `${t.contact.name}: ${name}`,
      `${t.contact.email}: ${email}`,
      orgName ? `${t.contact.orgName}: ${orgName}` : null,
      county ? `${t.contact.county}: ${county}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n");

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(t.contact.mailtoSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    setSent(true);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormField
        id="contact-name"
        label={t.contact.name}
        name="name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormField
        id="contact-email"
        label={t.contact.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormField
        id="contact-org"
        label={`${t.contact.orgName} (${t.common.optional})`}
        name="organisation"
        autoComplete="organization"
        value={orgName}
        onChange={(e) => setOrgName(e.target.value)}
      />
      <FormSelect
        id="contact-county"
        label={`${t.contact.county} (${t.common.optional})`}
        value={county}
        onChange={(e) => setCounty(e.target.value)}
      >
        <option value="">{t.common.selectCounty}</option>
        {KENYA_COUNTIES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </FormSelect>
      <FormTextarea
        id="contact-message"
        label={t.contact.message}
        name="message"
        rows={5}
        required
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {sent && <p className="text-sm font-medium text-creco-primary">{t.contact.sent}</p>}
      <button type="submit" className="creco-btn creco-btn-primary min-h-11">
        {t.contact.submit}
      </button>
    </form>
  );
}
