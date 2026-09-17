import { NextResponse } from "next/server";
import { getHealthStatus } from "@/lib/health-status";
import { PUBLIC_CACHE } from "@/lib/http-cache";

export const runtime = "nodejs";
export const revalidate = 120;

export async function GET() {
  const health = await getHealthStatus();

  return NextResponse.json(health, {
    headers: {
      "Cache-Control": PUBLIC_CACHE.health,
    },
  });
}
