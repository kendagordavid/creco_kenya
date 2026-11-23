import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/staff-api";
import { listManagedUsers } from "@/lib/staff-store";

export async function GET() {
  const { session, response } = await requireStaff();
  if (response) return response;
  return NextResponse.json({ users: await listManagedUsers(), currentUserId: session.user.id });
}
