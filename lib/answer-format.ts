/**
 * Removes internal source markers such as "[Wiki: registration]" or "[[registration]]".
 * Sources are listed separately under each answer, so readers never need the slugs.
 */
export function stripSourceMarkers(text: string): string {
  return text
    .replace(/\s*[[(]\s*Wiki\s*:\s*[^\])]*[\])]/gi, "")
    .replace(/[ \t]*\bWiki\s*:\s*[a-z0-9-]+/gi, "")
    .replace(/\[\[([^\]]+)\]\]/g, (_, slug: string) => slug.replace(/-/g, " "))
    .replace(/^\s*\*?Source:\s*\*?\s*$/gim, "")
    .replace(/[ \t]+([.,;:])/g, "$1")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type AnswerBlock =
  | { type: "paragraph"; text: string }
  | { type: "note"; text: string }
  | { type: "ordered"; items: string[] }
  | { type: "unordered"; items: string[] };

function matchOrdered(line: string): string | null {
  const cleaned = line.replace(/^\*\*/, "").replace(/\*\*$/, "").trim();
  const match = cleaned.match(/^\d+[.)]\s+([\s\S]+)$/);
  if (!match) return null;
  return match[1].replace(/\*\*$/, "").trim();
}

function matchUnordered(line: string): string | null {
  const match = line.match(/^(?:[-•]|\*(?=\s))\s+([\s\S]+)$/);
  if (!match) return null;
  return match[1].trim();
}

function isNote(text: string): boolean {
  return text.startsWith("*") && text.endsWith("*") && !text.startsWith("**");
}

/**
 * Group list lines into one list, including when a blank line sits between items.
 * The caller draws 1, 2, 3 from the list itself, so a model that repeats "1." still displays in order.
 */
export function parseAnswer(content: string): AnswerBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: AnswerBlock[] = [];
  let index = 0;

  function nextContent(from: number): number {
    let cursor = from;
    while (cursor < lines.length && !lines[cursor].trim()) cursor += 1;
    return cursor;
  }

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    if (matchOrdered(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const current = lines[index].trim();
        if (!current) {
          const upcoming = nextContent(index + 1);
          if (upcoming < lines.length && matchOrdered(lines[upcoming].trim())) {
            index = upcoming;
            continue;
          }
          break;
        }
        const ordered = matchOrdered(current);
        if (ordered) {
          items.push(ordered);
          index += 1;
          continue;
        }
        if (matchUnordered(current)) break;
        if (items.length > 0) {
          items[items.length - 1] = `${items[items.length - 1]} ${current}`.trim();
          index += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: "ordered", items });
      continue;
    }

    if (matchUnordered(line)) {
      const items: string[] = [];
      while (index < lines.length) {
        const current = lines[index].trim();
        if (!current) {
          const upcoming = nextContent(index + 1);
          if (upcoming < lines.length && matchUnordered(lines[upcoming].trim())) {
            index = upcoming;
            continue;
          }
          break;
        }
        const unordered = matchUnordered(current);
        if (unordered) {
          items.push(unordered);
          index += 1;
          continue;
        }
        if (matchOrdered(current)) break;
        if (items.length > 0) {
          items[items.length - 1] = `${items[items.length - 1]} ${current}`.trim();
          index += 1;
          continue;
        }
        break;
      }
      blocks.push({ type: "unordered", items });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length) {
      const current = lines[index].trim();
      if (!current || matchOrdered(current) || matchUnordered(current)) break;
      paragraph.push(current);
      index += 1;
    }
    const text = paragraph.join(" ");
    if (isNote(text)) {
      blocks.push({ type: "note", text: text.replace(/^\*|\*$/g, "").trim() });
    } else {
      blocks.push({ type: "paragraph", text });
    }
  }

  return blocks;
}
