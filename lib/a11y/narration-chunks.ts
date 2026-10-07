import { splitSentences } from "@/lib/a11y/speech-playback";

const MAX_CHUNK_CHARS = 1400;

/** Group spoken text into pieces short enough for one text-to-speech request. */
export function narrationChunks(text: string): string[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];

  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length > MAX_CHUNK_CHARS && current) {
      chunks.push(current);
      current = sentence;
      continue;
    }
    current = next;
  }

  if (current) chunks.push(current);
  return chunks;
}
