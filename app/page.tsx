import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Megaphone,
  MessageCircleQuestion,
} from "lucide-react";
import HomeHeroSection from "@/components/HomeHeroSection";
import { ParallaxBand } from "@/components/ParallaxBand";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { CRECO_GRAPHICS } from "@/lib/content/graphics";
import { getServerTranslations, interpolate } from "@/lib/i18n/server";

export const revalidate = 3600;

export default async function HomePage() {
  const { t } = await getServerTranslations();

  const modules = [
    {
      title: t.home.modules.awareness.title,
      description: t.home.modules.awareness.description,
      href: "/knowledge",
      icon: BookOpen,
      accent: "green" as const,
    },
    {
      title: t.home.modules.compliance.title,
      description: t.home.modules.compliance.description,
      href: "/compliance",
      icon: ClipboardCheck,
      accent: "orange" as const,
    },
    {
      title: t.home.modules.monitoring.title,
      description: t.home.modules.monitoring.description,
      href: "/monitoring",
      icon: Megaphone,
      accent: "green" as const,
    },
    {
      title: t.home.modules.guidance.title,
      description: t.home.modules.guidance.description,
      href: "/guidance",
      icon: MessageCircleQuestion,
      accent: "orange" as const,
    },
  ];

  return (
    <>
      <HomeHeroSection hero={t.home.hero} quickAccess={t.home.quickAccess} />

      <section className="creco-section creco-section--after-hero">
        <div className="creco-container creco-container--home max-w-3xl text-center">
          <RevealOnScroll>
            <span className="creco-eyebrow creco-eyebrow-center">{t.home.about.eyebrow}</span>
            <h2 className="text-2xl font-bold sm:text-4xl">{t.home.about.title}</h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-creco-muted">{t.home.about.purpose}</p>
            <p className="sr-only">{t.home.about.usersTitle}</p>
            <ul className="mt-6 flex flex-wrap justify-center gap-2">
              {t.home.about.audiences.map((audience) => (
                <li
                  key={audience}
                  className="rounded-full bg-creco-green-muted px-3 py-1 text-sm font-semibold text-creco-primary"
                >
                  {audience}
                </li>
              ))}
            </ul>
          </RevealOnScroll>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container creco-container--home">
          <RevealOnScroll className="text-center">
            <span className="creco-eyebrow creco-eyebrow-center">{t.home.howItWorks.eyebrow}</span>
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-[2.75rem]">
              {t.home.howItWorks.title}
            </h2>
          </RevealOnScroll>

          <div className="mt-8 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-2">
            {modules.map((module, index) => (
              <RevealOnScroll key={module.href} delayMs={index * 90} className="h-full">
                <Link
                  href={module.href}
                  aria-label={interpolate(t.a11y.openModule, {
                    title: module.title,
                    description: module.description,
                  })}
                  className={`creco-card creco-card-soft group block h-full p-5 no-underline sm:p-8 ${
                    module.accent === "orange" ? "creco-card-accent" : "creco-card-green"
                  }`}
                >
                  <module.icon className="size-8 text-creco-primary" aria-hidden />
                  <h3 className="mt-4 text-xl font-bold text-creco-black transition-colors group-hover:text-creco-primary dark:text-foreground dark:group-hover:text-creco-green-light">
                    {module.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-creco-muted">
                    {module.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary group-hover:text-creco-accent">
                    {t.home.howItWorks.open}
                    <ArrowRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                      aria-hidden
                    />
                    <span className="sr-only"> — {module.title}</span>
                  </span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="creco-section">
        <div className="creco-container creco-container--home">
          <RevealOnScroll className="text-center">
            <span className="creco-eyebrow creco-eyebrow-center">{t.home.history.eyebrow}</span>
            <h2 className="text-2xl font-bold sm:text-4xl">{t.home.history.title}</h2>
          </RevealOnScroll>
          <ol className="relative mt-10 grid gap-6 md:grid-cols-5 md:gap-4">
            {t.home.history.timeline.map((step, index) => (
              <RevealOnScroll
                key={step.year}
                as="li"
                delayMs={index * 80}
                className="relative border-l-2 border-creco-primary/30 pl-5 md:border-l-0 md:border-t-2 md:pl-0 md:pt-5"
              >
                <span
                  className="absolute -left-[7px] top-1 size-3 rounded-full bg-creco-accent md:-top-[7px] md:left-0"
                  aria-hidden
                />
                <p className="text-2xl font-bold text-creco-primary">{step.year}</p>
                <p className="mt-1 text-sm leading-snug text-creco-muted">{step.text}</p>
              </RevealOnScroll>
            ))}
          </ol>
          <p className="mt-8 text-center">
            <Link
              href="/about#history"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary no-underline hover:text-creco-accent"
            >
              {t.home.history.readMore}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </p>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container creco-container--home grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <RevealOnScroll className="lg:order-2">
            <h2 className="text-2xl font-bold sm:text-4xl">{t.home.guides.notificationTitle}</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {t.home.guides.deadlines.map((deadline) => (
                <li key={deadline.days} className="creco-card p-5">
                  <p className="text-4xl font-bold text-creco-primary">
                    {deadline.days}
                    <span className="ml-1 text-base font-semibold text-creco-muted">{deadline.unit}</span>
                  </p>
                  <p className="mt-2 text-sm font-medium leading-snug text-creco-black dark:text-foreground">
                    {deadline.label}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href={t.home.guides.rules.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary no-underline hover:text-creco-accent"
            >
              {t.home.guides.rules.link}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </RevealOnScroll>
          <RevealOnScroll delayMs={90} className="lg:order-1">
            <a href={CRECO_GRAPHICS.timelines.src} target="_blank" rel="noopener noreferrer" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static infographic */}
              <img
                src={CRECO_GRAPHICS.timelines.src}
                alt={CRECO_GRAPHICS.timelines.alt}
                loading="lazy"
                className="block h-auto w-full rounded-xl border border-creco-border bg-white"
              />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      <ParallaxBand
        imageSrc="/images/hero/civic-space.jpg"
        imageAlt={t.home.hero.slides[4]?.imageAlt ?? ""}
        overlay="green-light"
        speed={0.52}
        tallBackground
        className="creco-section creco-parallax-copy"
      >
        <div className="creco-container creco-container--home relative z-10 grid items-center gap-14 lg:grid-cols-2">
          <RevealOnScroll>
            <span className="creco-eyebrow creco-eyebrow-light">{t.home.why.eyebrow}</span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem]">
              {t.home.why.title}
            </h2>
          </RevealOnScroll>

          <ul className="space-y-4">
            {t.home.why.points.map((point, index) => (
              <RevealOnScroll
                key={point}
                as="li"
                delayMs={80 + index * 80}
                className="flex items-start gap-3 text-base font-medium leading-snug text-white"
              >
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-creco-accent-light" aria-hidden />
                {point}
              </RevealOnScroll>
            ))}
          </ul>
        </div>

        <RevealOnScroll
          delayMs={120}
          className="creco-container creco-container--home relative z-10 mt-16 text-center sm:mt-20 lg:mt-24"
        >
          <span className="creco-eyebrow creco-eyebrow-light creco-eyebrow-center">
            {t.common.getStarted}
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t.home.cta.title}</h2>
          <Link
            href="/guidance?ask=1"
            className="creco-btn creco-btn-accent mt-9 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            {t.home.cta.button}
          </Link>
        </RevealOnScroll>
      </ParallaxBand>
    </>
  );
}
