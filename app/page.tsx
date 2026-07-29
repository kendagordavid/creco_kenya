import Link from "next/link";
import { listWikiPageSummaries } from "@/lib/wiki-server";

const MODULES = [
  {
    step: "01",
    title: "PBO Guidance",
    description:
      "Look up answers to registration and compliance questions, with links to source material.",
    href: "/guidance",
    accent: "orange" as const,
    icon: "?",
  },
  {
    step: "02",
    title: "Topic library",
    description:
      "Browse compiled pages on registration, the regulatory authority, and the Act's purpose.",
    href: "/topics",
    accent: "green" as const,
    icon: "§",
  },
  {
    step: "03",
    title: "Source documents",
    description: "View the approved PBO Act PDFs that every topic page is built from.",
    href: "/sources",
    accent: "orange" as const,
    icon: "📄",
  },
];

export default async function HomePage() {
  const wikiPages = listWikiPageSummaries();

  return (
    <>
      <section className="creco-hero">
        <div className="creco-hero-grid" aria-hidden />
        <div className="creco-hero-inner creco-container py-20 sm:py-28 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="creco-animate-in mb-6 flex flex-wrap justify-center gap-3">
              <span className="creco-trust-badge">
                <span className="creco-trust-badge-dot" aria-hidden />
                Civic access for PBOs · Kenya
              </span>
            </div>

            <h1 className="creco-animate-in creco-animate-in-delay-1 text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-[3.5rem]">
              Navigate the PBO Act with{" "}
              <span className="creco-highlight">clear, source-linked</span> guidance
            </h1>

            <p className="creco-hero-lead creco-animate-in creco-animate-in-delay-2 mx-auto mt-6 max-w-2xl text-base sm:text-lg">
              CRECO Kenya helps Public Benefit Organizations understand the Public Benefit
              Organizations Act, 2013 — through plain-language topics, searchable guidance, and
              references to approved legal materials.
            </p>

            <div className="creco-animate-in creco-animate-in-delay-3 mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/guidance?ask=1" className="creco-btn creco-btn-accent">
                Look up guidance
                <span aria-hidden>→</span>
              </Link>
              <Link href="/topics" className="creco-btn creco-btn-ghost-light">
                Explore topics
              </Link>
            </div>
          </div>

          <dl className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Act commenced", value: "May 2024" },
              { label: "Topics", value: String(wikiPages.length) },
              { label: "Languages", value: "EN / SW" },
              { label: "Partner", value: "ICNL" },
            ].map((item) => (
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
            <span className="creco-eyebrow creco-eyebrow-center">How it works</span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
              Three ways to find what you need
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-creco-muted">
              Start with a question, browse topics, or go straight to the official documents.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {MODULES.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className={`creco-card group block p-8 no-underline ${
                  module.accent === "orange" ? "creco-card-accent" : "creco-card-green"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`creco-card-icon ${
                      module.accent === "orange" ? "creco-card-icon-orange" : "creco-card-icon-green"
                    }`}
                    aria-hidden
                  >
                    {module.icon}
                  </span>
                  <span className="text-3xl font-bold text-creco-accent/60">{module.step}</span>
                </div>
                <h3 className="mt-5 text-xl font-bold text-creco-black transition-colors group-hover:text-creco-primary">
                  {module.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-creco-muted">
                  {module.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-creco-primary transition group-hover:text-creco-accent">
                  Open
                  <span
                    aria-hidden
                    className="inline-block transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container relative z-10 grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="creco-eyebrow">Why this platform</span>
            <h2 className="text-3xl font-bold sm:text-4xl lg:text-[2.75rem]">
              Built for organisations on the ground
            </h2>
            <p className="mt-5 text-creco-muted leading-relaxed">
              PBO staff and community organisations need practical answers — not legal jargon. Every
              topic page is compiled from approved materials, reviewable by CRECO before publication,
              and traceable to the original source documents.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["Verified sources", "Plain language", "Bilingual"].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-creco-border bg-white px-4 py-1.5 text-xs font-semibold text-creco-primary shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <ul className="space-y-3">
            {[
              "Source-linked responses you can verify",
              "Plain language for non-lawyers",
              "Kiswahili questions supported",
              "Staff can update topics as laws change",
            ].map((point) => (
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

      <section className="creco-cta-band creco-section !py-20">
        <div className="creco-container relative z-10 text-center">
          <span className="creco-eyebrow creco-eyebrow-light creco-eyebrow-center">
            Get started
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Have a question about PBO registration?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/75 leading-relaxed">
            Try a common question or type your own. Guidance draws from compiled topic pages and
            cites the sources used.
          </p>
          <Link href="/guidance?ask=1" className="creco-btn creco-btn-accent mt-9">
            Go to guidance tool
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
