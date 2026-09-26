import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HomeHeroSection from "@/components/HomeHeroSection";
import { ParallaxBand } from "@/components/ParallaxBand";
import { ParallaxGraphic } from "@/components/ParallaxGraphic";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { CRECO_GRAPHICS } from "@/lib/content/graphics";
import { getServerTranslations, interpolate } from "@/lib/i18n/server";

export const revalidate = 3600;

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
      <HomeHeroSection hero={t.home.hero} quickAccess={t.home.quickAccess} />

      <section className="creco-section creco-section--after-hero">
        <div className="creco-container creco-container--home">
          <RevealOnScroll className="text-center">
            <span className="creco-eyebrow creco-eyebrow-center">{t.home.howItWorks.eyebrow}</span>
            <h2 className="text-2xl font-bold sm:text-4xl lg:text-[2.75rem]">
              {t.home.howItWorks.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-creco-muted">{t.home.howItWorks.lead}</p>
          </RevealOnScroll>

          <div className="mt-8 grid gap-4 sm:mt-16 sm:gap-6 md:grid-cols-3">
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
                  <h3 className="text-xl font-bold text-creco-black transition-colors group-hover:text-creco-primary dark:text-foreground dark:group-hover:text-creco-green-light">
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

      <section className="creco-section creco-section-alt">
        <div className="creco-container creco-container--home max-w-3xl">
          <RevealOnScroll>
            <span className="creco-eyebrow">{t.home.history.eyebrow}</span>
            <h2 className="text-2xl font-bold sm:text-4xl">{t.home.history.title}</h2>
          </RevealOnScroll>
          <div className="mt-8 space-y-5">
            {t.home.history.paragraphs.map((paragraph) => (
              <RevealOnScroll key={paragraph}>
                <p className="leading-relaxed text-creco-muted">{paragraph}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="creco-section">
        <div className="creco-container creco-container--home grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
          <RevealOnScroll>
            <span className="creco-eyebrow">{t.home.guides.register.eyebrow}</span>
            <h2 className="text-2xl font-bold sm:text-4xl">{t.home.guides.registerPathwaysTitle}</h2>
            <p className="mt-5 leading-relaxed text-creco-muted">{t.home.guides.registerPathwaysLead}</p>
            <ul className="mt-6 space-y-4 border-l-2 border-creco-primary/30 pl-4">
              {t.home.guides.registerPathwaysPoints.map((point) => (
                <li key={point} className="text-sm leading-relaxed text-creco-muted sm:text-base">
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href={t.home.guides.register.href}
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary no-underline hover:text-creco-accent"
            >
              {t.home.guides.register.link}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </RevealOnScroll>
          <RevealOnScroll delayMs={90} className="flex justify-center lg:justify-end">
            <ParallaxGraphic
              src={CRECO_GRAPHICS.pathways.src}
              alt={CRECO_GRAPHICS.pathways.alt}
              speed={0.36}
              className="w-full max-w-[17.5rem] sm:max-w-xs lg:max-w-sm"
            />
          </RevealOnScroll>
        </div>
      </section>

      <section className="creco-section creco-section-alt">
        <div className="creco-container creco-container--home grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <RevealOnScroll className="lg:order-2">
            <h2 className="text-2xl font-bold sm:text-4xl">{t.home.guides.notificationTitle}</h2>
            <p className="mt-5 leading-relaxed text-creco-muted">{t.home.guides.notificationLead}</p>
            <Link
              href={t.home.guides.rules.href}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-creco-primary no-underline hover:text-creco-accent"
            >
              {t.home.guides.rules.link}
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </RevealOnScroll>
          <RevealOnScroll delayMs={90} className="lg:order-1">
            <ParallaxGraphic
              src={CRECO_GRAPHICS.timelines.src}
              alt={CRECO_GRAPHICS.timelines.alt}
              speed={0.4}
            />
          </RevealOnScroll>
        </div>
      </section>

      <ParallaxBand
        imageSrc="/images/hero/civic-space.jpg"
        imageAlt={t.home.hero.slides[4]?.imageAlt ?? ""}
        overlay="green"
        speed={0.52}
        className="creco-section creco-parallax-copy"
      >
        <div className="creco-container creco-container--home relative z-10 grid items-center gap-14 lg:grid-cols-2">
          <RevealOnScroll>
            <span className="creco-eyebrow creco-eyebrow-light">{t.home.why.eyebrow}</span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-[2.75rem]">
              {t.home.why.title}
            </h2>
            <p className="mt-5 leading-relaxed text-white/90">{t.home.why.lead}</p>
          </RevealOnScroll>

          <ul className="space-y-4">
            {t.home.why.points.map((point, index) => (
              <RevealOnScroll
                key={point}
                as="li"
                delayMs={80 + index * 80}
                className="border-l-2 border-creco-orange pl-4 text-sm leading-relaxed text-white/90"
              >
                {point}
              </RevealOnScroll>
            ))}
          </ul>
        </div>
      </ParallaxBand>

      <ParallaxBand
        imageSrc="/images/hero/ask-a-question.jpg"
        imageAlt={t.home.hero.slides[3]?.imageAlt ?? ""}
        overlay="dark"
        speed={0.52}
        className="creco-section creco-parallax-copy !py-20"
      >
        <RevealOnScroll className="creco-container creco-container--home text-center">
          <span className="creco-eyebrow creco-eyebrow-light creco-eyebrow-center">
            {t.common.getStarted}
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{t.home.cta.title}</h2>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-white/90">{t.home.cta.lead}</p>
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
