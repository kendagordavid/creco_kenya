import "server-only";
import { openaiConfigured } from "@/lib/openai-config";

/** OpenRouter speech models (see /api/v1/models?output_modalities=speech). */
const DEFAULT_MODEL = "google/gemini-3.8-flash-tts";
/** Google lists Iapetus as a "clear" voice; it suits slow, plain-language narration. */
const DEFAULT_GEMINI_VOICE = "Iapetus";
const OPENAI_TTS_DEFAULT_MODEL = "gpt-4o-mini-tts";
/** Gemini and HeyGen only return raw 16-bit mono PCM at this rate. */
const PCM_SAMPLE_RATE = 24000;
const MP3_KBPS = 48;

const GEMINI_VOICES = [
  "Zephyr", "Puck", "Charon", "Kore", "Fenrir", "Leda", "Orus", "Aoede", "Callirrhoe", "Autonoe",
  "Enceladus", "Iapetus", "Umbriel", "Algieba", "Despina", "Erinome", "Algenib", "Rasalgethi",
  "Laomedeia", "Achernar", "Alnilam", "Schedar", "Gacrux", "Pulcherrima", "Achird",
  "Zubenelgenubi", "Vindemiatrix", "Sadachbia", "Sadaltager", "Sulafat",
];
const OPENAI_VOICES = /^(alloy|ash|ballad|coral|echo|fable|nova|onyx|sage|shimmer|verse)$/i;

type Locale = "en" | "sw";

/** First non-empty environment variable among `names` (an empty value does not hide the next one). */
function env(...names: string[]): string {
  for (const name of names) {
    const value = (process.env[name] ?? "").trim();
    if (value) return value;
  }
  return "";
}

/** The read-aloud key wins, so speech can use a different OpenRouter account from chat. */
export function openrouterApiKey(): string {
  return env("OPENROUTER_TTS_API_KEY", "OPENROUTER_API_KEY");
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

/**
 * The OpenRouter speech model for a language: OPENROUTER_TTS_MODEL_SW for Kiswahili
 * when set, otherwise OPENROUTER_TTS_MODEL. Used as given, except that a bare
 * "gemini-…" name gets its "google/" prefix.
 */
export function openrouterTtsModel(locale: Locale = "en"): string {
  const raw = env(...(locale === "sw" ? ["OPENROUTER_TTS_MODEL_SW"] : []), "OPENROUTER_TTS_MODEL") || DEFAULT_MODEL;
  if (!raw.includes("/") && raw.startsWith("gemini")) return `google/${raw}`;
  return raw;
}

function returnsPcmOnly(model: string): boolean {
  return model.includes("gemini") || model.startsWith("heygen/");
}

function defaultVoiceForModel(model: string): string | undefined {
  if (model.includes("gemini")) return DEFAULT_GEMINI_VOICE;
  if (model.includes("voxtral")) return "en_paul_neutral";
  if (model.startsWith("elevenlabs/")) return "george";
  if (model.startsWith("openai/") || !model.includes("/")) return "coral";
  // Let OpenRouter use the provider's own default voice.
  return undefined;
}

/**
 * The voice for a model and language: OPENROUTER_TTS_VOICE_SW for Kiswahili when set,
 * otherwise OPENROUTER_TTS_VOICE, otherwise the model's default. Gemini names match
 * in any letter case; every other model receives the configured voice exactly as set.
 */
function voice(model: string, locale: Locale): string | undefined {
  const configured = env(...(locale === "sw" ? ["OPENROUTER_TTS_VOICE_SW"] : []), "OPENROUTER_TTS_VOICE");
  if (!configured) return defaultVoiceForModel(model);

  if (model.includes("gemini")) {
    const match = GEMINI_VOICES.find((name) => name.toLowerCase() === configured.toLowerCase());
    if (match) return match;
    console.warn(
      `Read-aloud voice "${configured}" is not a Gemini voice; using ${DEFAULT_GEMINI_VOICE}. Gemini voices: ${GEMINI_VOICES.join(", ")}.`,
    );
    return DEFAULT_GEMINI_VOICE;
  }
  if (!model.includes("/") && !OPENAI_VOICES.test(configured)) {
    console.warn(`Read-aloud voice "${configured}" is not an OpenAI voice; using coral.`);
    return "coral";
  }
  return configured;
}

/** What the server will use for each language, for checking deployment settings. */
export function speechSettings() {
  const describe = (locale: Locale) => {
    if (openrouterTtsConfigured()) {
      const model = openrouterTtsModel(locale);
      return { provider: "openrouter", model, voice: voice(model, locale) ?? "provider default" };
    }
    if (openaiConfigured()) {
      const model = openaiTtsModel();
      return { provider: "openai", model, voice: voice(model, locale) ?? "coral" };
    }
    return { provider: "none", model: null, voice: null };
  };
  return { en: describe("en"), sw: describe("sw") };
}

function instructions(locale: Locale): string {
  const delivery =
    "Read slowly and clearly, a little slower than normal conversation, like a patient teacher explaining the law to a community audience. Pronounce every word fully and pause briefly at commas and full stops. Read only the provided text. Do not add an introduction, commentary, or words that are not in the text.";
  if (locale === "sw") {
    return `${delivery} The text is Kiswahili. Pronounce it as standard Kenyan Kiswahili.`;
  }
  return `${delivery} The text is English. Use a neutral, easily understood accent.`;
}

async function pcmToMp3(pcm: ArrayBuffer): Promise<ArrayBuffer> {
  const { Mp3Encoder } = await import("@breezystack/lamejs");
  const samples = new Int16Array(pcm, 0, Math.floor(pcm.byteLength / 2));
  const encoder = new Mp3Encoder(1, PCM_SAMPLE_RATE, MP3_KBPS);
  const parts: Uint8Array[] = [];
  for (let offset = 0; offset < samples.length; offset += 1152) {
    parts.push(encoder.encodeBuffer(samples.subarray(offset, offset + 1152)));
  }
  parts.push(encoder.flush());

  const mp3 = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let position = 0;
  for (const part of parts) {
    mp3.set(part, position);
    position += part.length;
  }
  return mp3.buffer;
}

async function synthesizeViaOpenRouter(text: string, locale: Locale): Promise<ArrayBuffer> {
  const key = openrouterApiKey();
  const model = openrouterTtsModel(locale);
  const pcmOnly = returnsPcmOnly(model);
  const payload: Record<string, unknown> = {
    model,
    input: text,
    voice: voice(model, locale),
    // Gemini reads pacing from `instructions`; providers without delivery control ignore it.
    instructions: instructions(locale),
    response_format: pcmOnly ? "pcm" : "mp3",
  };

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
    throw new Error(
      `OpenRouter speech failed (${response.status}) for model "${model}", voice "${String(payload.voice)}": ${detail.slice(0, 300)}`,
    );
  }

  const audio = await response.arrayBuffer();
  // Raw PCM is about six times larger than MP3, too heavy for mobile data bundles.
  return pcmOnly ? pcmToMp3(audio) : audio;
}

function openaiTtsModel(): string {
  return (process.env.OPENAI_TTS_MODEL ?? OPENAI_TTS_DEFAULT_MODEL).trim() || OPENAI_TTS_DEFAULT_MODEL;
}

async function synthesizeViaOpenAI(text: string, locale: Locale): Promise<ArrayBuffer> {
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
      voice: voice(openaiTtsModel(), locale) ?? "coral",
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

export async function synthesizeSpeech(text: string, locale: Locale): Promise<ArrayBuffer> {
  if (openrouterTtsConfigured()) return synthesizeViaOpenRouter(text, locale);
  if (openaiConfigured()) return synthesizeViaOpenAI(text, locale);
  throw new Error("Speech TTS is not configured");
}
