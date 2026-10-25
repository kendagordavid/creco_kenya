import type { Metadata } from "next";
import Link from "next/link";
import { NewsUnsubscribe } from "@/components/news/NewsUnsubscribe";
import { getDictionary, getLocale, getServerTranslations } from "@/lib/i18n/server";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale());
  return { title: t.newsUnsubscribe.title, robots: { index: false } };
}

export default async function NewsUnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;
  const { t } = await getServerTranslations();
  const valid = Boolean(token && /^[0-9a-f-]{36}$/i.test(token));

  return (
    <section className="creco-section">
      <div className="creco-container max-w-xl">
        <h1 className="text-2xl font-bold text-creco-primary">{t.newsUnsubscribe.title}</h1>
        {valid && token ? (
          <>
            <p className="mt-3 mb-6 text-creco-muted">{t.newsUnsubscribe.lead}</p>
            <NewsUnsubscribe token={token} />
          </>
        ) : (
          <p className="mt-3 text-creco-muted">{t.newsUnsubscribe.invalid}</p>
        )}
        <p className="mt-8 text-sm">
          <Link href="/news" className="font-semibold text-creco-primary no-underline">
            {t.newsPage.backToNews}
          </Link>
        </p>
      </div>
    </section>
  );
}
