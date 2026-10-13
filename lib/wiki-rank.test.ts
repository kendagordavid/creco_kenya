import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { contentTerms } from "./search-terms.ts";
import { heuristicTopicScope } from "./topic-scope.ts";
import { excerptForQuestion, rankWikiPages, type RankableWikiPage } from "./wiki-rank.ts";

function loadPages(): RankableWikiPage[] {
  const dir = path.join(process.cwd(), "prototype", "wiki", "topics");
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const slug = file.replace(/^\d+-/, "").replace(/\.md$/, "");
      const title = raw.match(/^title:\s*"([^"]+)"/m)?.[1] ?? slug;
      return { slug, title, body: raw, tags: [] };
    });
}

const pages = loadPages();

test("content terms drop words that appear in almost any English sentence", () => {
  assert.deepEqual(contentTerms("who won the champions league?"), ["won", "champions", "league"]);
});

test("champions league does not match the PBO wiki and is off topic even with a high lexical score", () => {
  const question = "who won the champions league?";
  assert.equal(rankWikiPages(question, pages).length, 0);
  assert.equal(heuristicTopicScope(question, 9), "off_topic");
});

test("a registration question ranks the registration topic above unrelated pages", () => {
  const ranked = rankWikiPages("What documents do I need to register a PBO?", pages);
  assert.ok(ranked.length > 0);
  assert.equal(ranked[0]?.page.slug, "registration");
  assert.ok((ranked[0]?.score ?? 0) >= 4);
  assert.equal(heuristicTopicScope("What documents do I need to register a PBO?", ranked[0]?.score ?? 0), "on_topic");
});

test("a timing question prefers the compliance topic and the excerpt names the decision period", () => {
  const question = "How long does the Authority have to decide on a registration application?";
  const ranked = rankWikiPages(question, pages);
  assert.equal(ranked[0]?.page.slug, "practical-compliance");
  const excerpt = excerptForQuestion(ranked[0]?.page.body ?? "", question);
  assert.match(excerpt, /60/);
});

test("document questions excerpt the application checklist rather than the introduction", () => {
  const question = "What documents do I need to register a PBO?";
  const registration = pages.find((page) => page.slug === "registration");
  assert.ok(registration);
  const excerpt = excerptForQuestion(registration.body, question);
  assert.match(excerpt, /Form 1|must accompany/i);
});
