const KEY_POINTS_HEADING = /^##\s+(?:Key Takeaways|Mambo muhimu ya kukumbuka)\s*$/im;

/**
 * Splits a topic's "Key Takeaways" section from the rest of the body so the
 * page can lead with the short points and fold the full explanation away.
 */
export function splitKeyPoints(body: string): { keyPoints: string | null; rest: string } {
  const match = KEY_POINTS_HEADING.exec(body);
  if (!match) return { keyPoints: null, rest: body };

  const start = match.index;
  const afterHeading = start + match[0].length;
  const nextHeading = body.slice(afterHeading).search(/^##\s/m);
  const end = nextHeading === -1 ? body.length : afterHeading + nextHeading;

  const keyPoints = body.slice(afterHeading, end).trim();
  const rest = `${body.slice(0, start).trimEnd()}\n\n${body.slice(end).trimStart()}`.trim();
  return { keyPoints: keyPoints || null, rest };
}

/** First sentence of a topic lead, for compact topic cards. */
export function cardSummary(lead: string, maxChars = 140): string {
  const text = lead.replace(/\s+/g, " ").trim();
  const sentence = text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
  if (sentence.length <= maxChars) return sentence;
  return `${sentence.slice(0, sentence.lastIndexOf(" ", maxChars - 1))}…`;
}
