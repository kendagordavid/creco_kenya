import { ChatInterface } from "@/components/ChatInterface";
import { fetchSources, fetchWikiPages } from "@/lib/api";

export default async function Home() {
  const [sources, wikiPages] = await Promise.all([fetchSources(), fetchWikiPages()]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              CRECO Kenya · Prototype
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
              PBO Act Knowledge Wiki
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              LLM Wiki pattern — source documents are compiled into structured, reviewable wiki
              pages. Questions search the wiki, not raw PDF chunks. No RAG vector retrieval.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            Informational guidance only. Not legal advice.
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <ChatInterface />

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Compiled wiki topics</h2>
            <p className="mt-2 text-sm text-slate-600">
              Knowledge is compiled once into interlinked pages that CRECO staff can review and
              edit before publishing.
            </p>
            <ul className="mt-4 space-y-3">
              {wikiPages.length === 0 ? (
                <li className="text-sm text-slate-500">No wiki pages found. Start the backend.</li>
              ) : (
                wikiPages.map((page) => (
                  <li
                    key={page.slug}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <p className="font-medium text-slate-900">{page.title}</p>
                    <p className="text-xs text-slate-500">{page.tags.join(" · ")}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Underlying source documents</h2>
            <p className="mt-2 text-sm text-slate-600">
              Wiki pages trace back to these approved PDFs. In production, CRECO controls which
              sources are compiled.
            </p>
            <ul className="mt-4 space-y-3">
              {sources.length === 0 ? (
                <li className="text-sm text-slate-500">No sources listed yet.</li>
              ) : (
                sources.map((source) => (
                  <li
                    key={source.id}
                    className="flex flex-col gap-1 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="font-medium text-slate-900">{source.title}</p>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-emerald-700 hover:underline"
                    >
                      Open PDF
                    </a>
                  </li>
                ))
              )}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
