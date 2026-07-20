import { NextResponse } from "next/server";
import { askQuestionEngine } from "@/lib/ask-engine";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question : "";
  if (question.trim().length < 3) {
    return NextResponse.json({ error: "Question too short" }, { status: 400 });
  }
  const result = await askQuestionEngine(question);
  return NextResponse.json(result);
}
