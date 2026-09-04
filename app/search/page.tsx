import { PageHero } from "@/components/PageHero";
import { PlatformSubnav } from "@/components/PlatformSubnav";
import { SearchForm } from "@/components/SearchForm";
import { SearchResults } from "@/components/SearchResults";
import { getServerTranslations } from "@/lib/i18n/server";
import { globalSearch } from "@/lib/search";

export async function generateMetadata() {
  const { t } = await getServerTranslations();
  return { title: t.search.metaTitle };
}

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { t } = await getServerTranslations();
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const results = globalSearch(query);

  return (
    <>
      <PageHero
        eyebrow={t.search.metaTitle}
        title={t.search.title}
        lead={t.search.lead}
        variant="light"
      />
      <PlatformSubnav />
      <section className="creco-section" aria-label={t.search.resultsRegion}>
        <div className="creco-container max-w-3xl">
          <SearchForm defaultQuery={query} />
          <SearchResults query={query} results={results} />
        </div>
      </section>
    </>
  );
}
