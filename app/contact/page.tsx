import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return { title: t.contact.metaTitle };
}

export default async function ContactPage() {
  const { t } = await getServerTranslations();

  return (
    <>
      <PageHero
        eyebrow={t.contact.eyebrow}
        title={t.contact.title}
        lead={t.contact.lead}
        backgroundImage="/images/pages/contact-conversation.jpg"
        backgroundAlt={t.contact.imageAlt}
      />
      <section className="creco-section">
        <div className="creco-container grid gap-10 lg:grid-cols-2">
          <div className="creco-card p-8">
            <h2 className="text-xl font-bold text-creco-black dark:text-foreground">
              {t.contact.directTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
              {t.contact.directLead}
            </p>
            <a
              href="mailto:info@crecokenya.org"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-creco-primary no-underline hover:text-creco-primary-dark dark:hover:text-creco-green-light"
            >
              <Mail className="size-4" aria-hidden />
              info@crecokenya.org
            </a>
          </div>
          <div className="creco-card p-8">
            <h2 className="text-xl font-bold text-creco-black dark:text-foreground">
              {t.contact.formTitle}
            </h2>
            <p className="mt-3 mb-6 text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
              {t.contact.formLead}
            </p>
            <ContactForm />
            <p className="mt-6 text-sm leading-relaxed text-creco-muted dark:text-muted-foreground">
              {t.contact.anonymousLead}{" "}
              <Link href="/report" className="font-semibold text-creco-primary no-underline">
                {t.contact.anonymousLink}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
