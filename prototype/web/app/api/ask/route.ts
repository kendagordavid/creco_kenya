import { NextResponse } from "next/server";
import { askQuestionWiki } from "@/lib/wiki-server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question : "";
  if (question.trim().length < 3) {
    return NextResponse.json({ error: "Question too short" }, { status: 400 });
  }
  return NextResponse.json(askQuestionWiki(question));
}
