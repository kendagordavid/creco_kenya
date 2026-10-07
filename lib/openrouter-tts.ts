import "server-only";
import { openaiConfigured } from "@/lib/openai-config";

/** OpenRouter speech models (see /api/v1/models?output_modalities=speech). */
const DEFAULT_MODEL = "mistralai/voxtral-mini-tts-2603";
const DEFAULT_VOICE = "en_paul_neutral";
/** Legacy default; OpenAI mini TTS slug is not available on OpenRouter for many keys. */
const DEPRECATED_OPENAI_TTS_MODEL = "openai/gpt-4o-mini-tts-2025-12-15";
const OPENAI_TTS_DEFAULT_MODEL = "gpt-4o-mini-tts";

export function openrouterApiKey(): string {
  return (
    process.env.OPENROUTER_API_KEY ??
    process.env.OPENROUTER_TTS_API_KEY ??
    ""
  ).trim();
}

export function openrouterTtsConfigured(): boolean {
  const key = openrouterApiKey();
  if (!key) return false;
  const lowered = key.toLowerCase();
  return !lowered.startsWith("sk-your") && !lowered.includes("your-key") && lowered !== "changeme";
}

/** Cloud read-aloud works when OpenRouter or OpenAI speech is configured on the server. */
export function speechTtsConfigured(): boolean {
  return openrouterTtsConfigured() || openaiConfigured();
}

/** OpenRouter's slug for GPT-4o mini TTS. A short name is mapped to that slug. */
export function openrouterTtsModel(): string {
  const raw = (process.env.OPENROUTER_TTS_MODEL ?? DEFAULT_MODEL).trim() || DEFAULT_MODEL;
  if (
    raw === "gpt-4o-mini-tts" ||
    raw === "openai/gpt-4o-mini-tts" ||
    raw === DEPRECATED_OPENAI_TTS_MODEL
  ) {
    return DEFAULT_MODEL;
  }
  return raw;
}

function defaultVoiceForModel(model: string): string {
  if (model.includes("voxtral")) return "en_paul_neutral";
  if (model.startsWith("openai/")) return "alloy";
  return DEFAULT_VOICE;
}

function voice(model: string): string {
  const configured = (process.env.OPENROUTER_TTS_VOICE ?? "").trim();
  if (configured) {
    if (model.includes("voxtral") && /^(alloy|coral|nova|ash|echo|fable|onyx|shimmer)$/i.test(configured)) {
      return defaultVoiceForModel(model);
    }
    return configured;
  }
  return defaultVoiceForModel(model);
}

function instructions(locale: "en" | "sw"): string {
  const clarity =
    "Speak clearly at a moderate pace, with a short pause at each sentence. Read only the provided text. Do not add an introduction, commentary, or words that are not in the text.";
  if (locale === "sw") {
    return `${clarity} The text is Kiswahili. Pronounce it as standard Kenyan Kiswahili.`;
  }
  return `${clarity} The text is English.`;
}

async function synthesizeViaOpenRouter(text: string, locale: "en" | "sw"): Promise<ArrayBuffer> {
  const key = openrouterApiKey();
  const model = openrouterTtsModel();
  const payload: Record<string, unknown> = {
    model,
    input: text,
    voice: voice(model),
    response_format: "mp3",
  };
  if (model.startsWith("openai/")) {
    payload.provider = {
      options: {
        openai: {
          instructions: instructions(locale),
        },
      },
    };
  }

  const response = await fetch("https://openrouter.ai/api/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenRouter speech failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  return response.arrayBuffer();
}

function openaiTtsModel(): string {
  return (process.env.OPENAI_TTS_MODEL ?? OPENAI_TTS_DEFAULT_MODEL).trim() || OPENAI_TTS_DEFAULT_MODEL;
}

async function synthesizeViaOpenAI(text: string, locale: "en" | "sw"): Promise<ArrayBuffer> {
  const key = (process.env.OPENAI_API_KEY ?? "").trim();
  const response = await fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: openaiTtsModel(),
      input: text,
      voice: voice(openaiTtsModel()),
      response_format: "mp3",
      instructions: instructions(locale),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI speech failed (${response.status}): ${detail.slice(0, 300)}`);
  }

  return response.arrayBuffer();
}

export async function synthesizeSpeech(text: string, locale: "en" | "sw"): Promise<ArrayBuffer> {
  if (openrouterTtsConfigured()) return synthesizeViaOpenRouter(text, locale);
  if (openaiConfigured()) return synthesizeViaOpenAI(text, locale);
  throw new Error("Speech TTS is not configured");
}
