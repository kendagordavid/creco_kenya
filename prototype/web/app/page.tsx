import Link from "next/link";
import { listWikiPageSummaries } from "@/lib/wiki-server";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function HomePage() {
  const { t } = await getServerTranslations();
  const wikiPages = listWikiPageSummaries();

  const modules = [
    {
      step: "01",
      title: t.home.modules.guidance.title,
      description: t.home.modules.guidance.description,
      href: "/guidance",
      accent: "orange" as const,
    },
    {
      step: "02",
      title: t.home.modules.topics.title,
      description: t.home.modules.topics.description,
      href: "/topics",
      accent: "green" as const,
    },
    {
      step: "03",
      title: t.home.modules.sources.title,
      description: t.home.modules.sources.description,
      href: "/sources",
      accent: "orange" as const,
    },
  ];

  const stats = [
    { label: t.home.stats.actCommenced, value: "May 2024" },
    { label: t.home.stats.topics, value: String(wikiPages.length) },
    { label: t.home.stats.languages, value: "EN / SW" },
    { label: t.home.stats.partner, value: "ICNL" },
  ];

  return (
    <>
      <section className="creco-hero">
        <div className="creco-hero-inner creco-container py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="creco-eyebrow creco-eyebrow-light creco-eyebrow-center">
              {t.home.eyebrow}
            </span>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-[3.25rem]">
              {t.home.title}
            </h1>
            <p className="creco-hero-lead mx-auto mt-6 max-w-2xl text-base sm:text-lg">
              {t.home.lead}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/guidance?ask=1" className="creco-btn creco-btn-accent">
                {t.home.lookUpGuidance}
              </Link>
              <Link href="/topics" className="creco-btn creco-btn-ghost-light">
                {t.home.exploreTopics}
              </Link>
            </div>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((item) => (
              <div key={item.label} className="creco-stat">
                <dd className="creco-stat-value">{item.value}</dd>
                <dt className="creco-stat-label">{item.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="creco-section">
        <div className="creco-container">
          <div className="text-center">
            <span className="creco-eyebrow creco-eyebrow-center">{t.home.howItWorks.eyebrow}</span>
            <h2 className="text-3xl font-bold sm:text-4xl">{t.home.howItWorks.title}</h2>
            <p className="mx-auto mt-3 max-w-xl text-creco-muted">{t.home.howItWorks.lead}</p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className={`creco-card group block p-7 no-underline ${
                  module.accent === "orange" ? "creco-card-accent" : "creco-card-green"
                }`}
              >
                <span className="text-4xl font-bold text-creco-accent/80">{module.step}</span>
                <h3 className="mt-4 text-xl font-bold text-creco-black group-hover:text-creco-primary">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-creco-muted">{module.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-creco-primary group-hover:text-creco-accent">
                  {t.home.howItWorks.open}
                  <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="creco-eyebrow">{t.home.why.eyebrow}</span>
            <h2 className="text-3xl font-bold sm:text-4xl">{t.home.why.title}</h2>
            <p className="mt-5 text-creco-muted leading-relaxed">{t.home.why.lead}</p>
          </div>
          <ul className="space-y-3">
            {t.home.why.points.map((point) => (
              <li key={point} className="creco-check-item">
                <span className="creco-check-icon" aria-hidden>
                  ✓
                </span>
                <span className="text-sm font-medium text-creco-black-soft">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="creco-cta-band creco-section !py-16">
        <div className="creco-container relative z-10 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{t.home.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/70">{t.home.cta.lead}</p>
          <Link href="/guidance?ask=1" className="creco-btn creco-btn-accent mt-8">
            {t.home.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
