import { NextResponse } from "next/server";
import { buildContentList } from "@/lib/content-admin";
import { listContentOverrides } from "@/lib/content-overrides";
import { requireStaff } from "@/lib/staff-api";

export async function GET() {
  const { response } = await requireStaff();
  if (response) return response;
  return NextResponse.json({ items: buildContentList(await listContentOverrides()) });
}
