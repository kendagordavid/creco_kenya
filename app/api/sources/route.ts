import { NextResponse } from "next/server";
import { listSourceDocuments } from "@/lib/wiki-server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({ sources: listSourceDocuments() });
}
