/** Prepare wiki/markdown body text for speech synthesis. */
export function textForSpeech(title: string, body: string): string {
  const cleanedBody = body
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^plain[- ]language:\s*/gim, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  return `${title.trim()}. ${cleanedBody}`.trim();
}
