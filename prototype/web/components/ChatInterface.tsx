"use client";

import { FormEvent, useState } from "react";
import { askQuestion, AskResponse, Citation } from "@/lib/api";
import { CitationPanel } from "./CitationPanel";

const STARTER_QUESTIONS = [
  "What documents do I need to register as a PBO?",
  "What is a Public Benefit Organization under the PBO Act?",
  "How long does the Authority have to decide on a registration application?",
  "Ni nini mahitaji ya kusajili shirika la faida ya umma?",
];

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  confidence?: string;
  refused?: boolean;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Karibu. Ask a question about Kenya's Public Benefit Organizations Act, 2013. Answers come from compiled wiki pages — structured, reviewable knowledge — not raw document retrieval.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCitation, setActiveCitation] = useState<number | null>(null);
  const [latestCitations, setLatestCitations] = useState<Citation[]>([]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const result: AskResponse = await askQuestion(trimmed);
      setLatestCitations(result.citations);
      setActiveCitation(result.citations[0]?.index ?? null);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
          citations: result.citations,
          confidence: result.confidence,
          refused: result.refused,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
          refused: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submitQuestion(input);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section className="flex min-h-[70vh] flex-col rounded-3xl border border-emerald-100 bg-white shadow-sm">
        <div className="border-b border-emerald-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            LLM Wiki Q&A
          </p>
          <h2 className="text-lg font-semibold text-slate-900">Ask about the PBO Act</h2>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "ml-auto bg-emerald-700 text-white"
                  : "bg-slate-50 text-slate-800"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.role === "assistant" && message.confidence && (
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                  Confidence: {message.confidence}
                  {message.refused ? " · no answer generated" : ""}
                </p>
              )}
            </div>
          ))}
          {loading && (
            <div className="max-w-[70%] rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Searching compiled wiki pages…
            </div>
          )}
        </div>

        <div className="border-t border-emerald-50 px-5 py-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {STARTER_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => submitQuestion(question)}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-900 transition hover:bg-emerald-100"
              >
                {question}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. What are the registration requirements for a PBO?"
              className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-emerald-500 focus:ring-2"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ask
            </button>
          </form>
        </div>
      </section>

      <aside>
        <CitationPanel
          citations={latestCitations}
          activeIndex={activeCitation}
          onSelect={setActiveCitation}
        />
      </aside>
    </div>
  );
}
