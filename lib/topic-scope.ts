export type TopicScope = "on_topic" | "off_topic" | "unclear";

const ON_TOPIC_PATTERNS: RegExp[] = [
  /\bpbo\b/i,
  /\bngo\b/i,
  /\bcso\b/i,
  /\bcreco\b/i,
  /\bicnl\b/i,
  /public benefit/i,
  /non[- ]?profit/i,
  /nonprofit/i,
  /registration/i,
  /register/i,
  /sajili/i,
  /mahitaji/i,
  /shirika/i,
  /faida ya umma/i,
  /pbo act/i,
  /organizations act/i,
  /organisations act/i,
  /regulatory authority/i,
  /compliance/i,
  /governance/i,
  /trustee/i,
  /board member/i,
  /civic space/i,
  /civil society/i,
  /kenya.*(act|law|legal)/i,
  /(act|law).{0,20}kenya/i,
  /tax exempt/i,
  /fundraising/i,
  /audit/i,
  /annual return/i,
  /by-?laws/i,
  /constitution/i,
  /memorandum/i,
  /charitable/i,
  /community organis/i,
  /community organiz/i,
];

const OFF_TOPIC_PATTERNS: RegExp[] = [
  /\bweather\b/i,
  /\bfootball\b/i,
  /\bsoccer\b/i,
  /\bchampions league\b/i,
  /\bpremier league\b/i,
  /\bworld cup\b/i,
  /\bla liga\b/i,
  /\bsuper bowl\b/i,
  /\bworld series\b/i,
  /\brecipe\b/i,
  /\bbitcoin\b/i,
  /\bcrypto(currency)?\b/i,
  /\bstock market\b/i,
  /\bwrite (me )?(a )?(poem|story|essay|code)\b/i,
  /\bpython\b/i,
  /\bjavascript\b/i,
  /\bhomework\b/i,
  /\bcapital of\b/i,
  /\bwho (is|was) (the )?(president|king|queen) of (?!kenya)/i,
  /\bdating\b/i,
  /\bmovie\b/i,
  /\bnetflix\b/i,
];

/** True for trivia and other questions that must not be answered from the PBO library. */
export function isOffTopicQuestion(question: string): boolean {
  const q = question.trim();
  if (q.length < 3) return true;
  return OFF_TOPIC_PATTERNS.some((re) => re.test(q));
}

export function heuristicTopicScope(question: string, wikiMatchScore: number): TopicScope {
  const q = question.trim();
  if (isOffTopicQuestion(q)) return "off_topic";

  if (wikiMatchScore >= 2) {
    return "on_topic";
  }

  const onHits = ON_TOPIC_PATTERNS.filter((re) => re.test(q)).length;
  if (onHits >= 1) {
    return "on_topic";
  }

  const terms = q.toLowerCase().match(/\w{4,}/g) ?? [];
  const genericNgOHints = ["organization", "organisation", "charity", "foundation", "association"];
  if (terms.some((t) => genericNgOHints.some((h) => t.includes(h)))) {
    return "unclear";
  }

  return "off_topic";
}
