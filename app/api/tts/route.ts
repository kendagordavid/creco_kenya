import { NextResponse } from "next/server";
import { speechTtsConfigured, synthesizeSpeech } from "@/lib/openrouter-tts";

export const runtime = "nodejs";

const MAX_CHARS = 1800;

export async function GET() {
  return NextResponse.json({ configured: speechTtsConfigured() });
}

export async function POST(request: Request) {
  if (!speechTtsConfigured()) {
    return NextResponse.json(
      {
        error:
          "Cloud read-aloud is not configured. Set OPENROUTER_API_KEY or OPENAI_API_KEY on the server (see .env.local.example), then restart or redeploy.",
        configured: false,
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const text = typeof (body as { text?: unknown }).text === "string" ? (body as { text: string }).text.trim() : "";
  const locale = (body as { locale?: unknown }).locale === "sw" ? "sw" : "en";

  if (!text || text.length > MAX_CHARS) {
    return NextResponse.json(
      { error: `Text must be between 1 and ${MAX_CHARS} characters.` },
      { status: 400 },
    );
  }

  try {
    const audio = await synthesizeSpeech(text, locale);
    return new NextResponse(audio, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : "OpenRouter speech failed");
    return NextResponse.json({ error: "The reading voice could not be generated." }, { status: 502 });
  }
}
