import Link from "next/link";
import { listWikiPageSummaries } from "@/lib/wiki-server";

const MODULES = [
  {
    step: "01",
    title: "PBO Guidance",
    description: "Look up answers to registration and compliance questions, with links to source material.",
    href: "/guidance",
  },
  {
    step: "02",
    title: "Topic library",
    description: "Browse compiled pages on registration, the regulatory authority, and the Act's purpose.",
    href: "/topics",
  },
  {
    step: "03",
    title: "Source documents",
    description: "View the approved PBO Act PDFs that every topic page is built from.",
    href: "/sources",
  },
];

export default async function HomePage() {
  const wikiPages = listWikiPageSummaries();

  return (
    <>
      <section className="creco-hero-pattern border-b border-creco-border">
        <div className="creco-container py-16 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="creco-eyebrow">Civic access for PBOs · Kenya</span>
            <h1 className="font-display text-4xl font-bold leading-tight text-creco-primary sm:text-5xl">
              Navigate the PBO Act with clear, source-linked guidance
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-creco-muted sm:text-lg">
              CRECO Kenya helps Public Benefit Organizations understand the Public Benefit
              Organizations Act, 2013 — through plain-language topics, searchable guidance, and
              references to approved legal materials.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/guidance?ask=1" className="creco-btn creco-btn-primary">
                Look up guidance
              </Link>
              <Link href="/topics" className="creco-btn creco-btn-secondary">
                Explore topics
              </Link>
            </div>
          </div>

          <dl className="mx-auto mt-14 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Act commenced", value: "May 2024" },
              { label: "Topics", value: String(wikiPages.length) },
              { label: "Languages", value: "EN / SW" },
              { label: "Partner", value: "ICNL" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-creco-border bg-white px-4 py-3 text-center"
              >
                <dt className="text-xs text-creco-muted">{item.label}</dt>
                <dd className="mt-1 font-display text-lg font-bold text-creco-primary">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="creco-section">
        <div className="creco-container">
          <div className="text-center">
            <span className="creco-eyebrow">How it works</span>
            <h2 className="font-display text-3xl font-bold text-creco-primary">
              Three ways to find what you need
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MODULES.map((module) => (
              <Link
                key={module.href}
                href={module.href}
                className="creco-card group block p-6 no-underline"
              >
                <span className="font-display text-3xl font-bold text-creco-sage/60">
                  {module.step}
                </span>
                <h3 className="mt-3 font-display text-xl font-bold text-creco-primary group-hover:text-creco-accent">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-creco-muted">
                  {module.description}
                </p>
                <span className="mt-4 inline-block text-sm font-semibold text-creco-accent">
                  Open →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="creco-eyebrow">Why this platform</span>
            <h2 className="font-display text-3xl font-bold text-creco-primary">
              Built for organisations on the ground
            </h2>
            <p className="mt-4 text-creco-muted">
              PBO staff and community organisations need practical answers — not legal jargon. Every
              topic page is compiled from approved materials, reviewable by CRECO before publication,
              and traceable to the original source documents.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Source-linked responses you can verify",
              "Plain language for non-lawyers",
              "Kiswahili questions supported",
              "Staff can update topics as laws change",
            ].map((point) => (
              <li
                key={point}
                className="flex items-start gap-3 rounded-lg border border-creco-border bg-white px-4 py-3"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-creco-sage" aria-hidden />
                <span className="text-sm text-creco-text">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="creco-section bg-creco-primary text-white">
        <div className="creco-container text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Have a question about PBO registration?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-white/80">
            Try a common question or type your own. Guidance draws from compiled topic pages and
            cites the sources used.
          </p>
          <Link
            href="/guidance?ask=1"
            className="creco-btn mt-6 bg-white text-creco-primary hover:bg-creco-surface"
          >
            Go to guidance tool
          </Link>
        </div>
      </section>
    </>
  );
}
