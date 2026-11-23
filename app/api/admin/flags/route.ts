import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-api";
import { listFlags } from "@/lib/staff-store";

export async function GET() {
  const { response } = await requireStaff();
  if (response) return response;
  return NextResponse.json({ flags: await listFlags() });
}
