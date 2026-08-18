import Link from "next/link";
import { getServerTranslations } from "@/lib/i18n/server";

export default async function HomePage() {
  const { t } = await getServerTranslations();

  const modules = [
    {
      title: t.home.modules.guidance.title,
      description: t.home.modules.guidance.description,
      href: "/guidance",
      accent: "orange" as const,
    },
    {
      title: t.home.modules.topics.title,
      description: t.home.modules.topics.description,
      href: "/topics",
      accent: "green" as const,
    },
    {
      title: t.home.modules.sources.title,
      description: t.home.modules.sources.description,
      href: "/sources",
      accent: "orange" as const,
    },
  ];

  return (
    <>
      <section className="creco-hero">
        <div className="creco-hero-inner creco-container py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/80">
              {t.home.eyebrow}
            </p>

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
        </div>
      </section>

      <section className="creco-section">
        <div className="creco-container">
          <div className="text-center">
            <span className="creco-eyebrow creco-eyebrow-center">{t.home.howItWorks.eyebrow}</span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
              {t.home.howItWorks.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-creco-muted">{t.home.howItWorks.lead}</p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {modules.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className={`creco-card group block p-8 no-underline ${
                  module.accent === "orange" ? "creco-card-accent" : "creco-card-green"
                }`}
              >
                <h3 className="text-xl font-bold text-creco-black transition-colors group-hover:text-creco-primary">
                  {module.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-creco-muted">
                  {module.description}
                </p>
                <span className="mt-5 inline-block text-sm font-semibold text-creco-primary group-hover:text-creco-accent">
                  {t.home.howItWorks.open}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container relative z-10 grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="creco-eyebrow">{t.home.why.eyebrow}</span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">{t.home.why.title}</h2>
            <p className="mt-5 leading-relaxed text-creco-muted">{t.home.why.lead}</p>
          </div>

          <ul className="space-y-4">
            {t.home.why.points.map((point) => (
              <li key={point} className="border-l-2 border-creco-primary pl-4 text-sm leading-relaxed text-creco-black-soft">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="creco-cta-band creco-section !py-20">
        <div className="creco-container text-center">
          <span className="creco-eyebrow creco-eyebrow-center">{t.common.getStarted}</span>
          <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{t.home.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-creco-muted">{t.home.cta.lead}</p>
          <Link href="/guidance?ask=1" className="creco-btn creco-btn-accent mt-9">
            {t.home.cta.button}
          </Link>
        </div>
      </section>
    </>
  );
}
