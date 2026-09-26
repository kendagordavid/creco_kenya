import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { canViewAllReports } from "@/lib/authz";
import { listAnonymousReports } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const reports = await listAnonymousReports();
  return NextResponse.json({ reports });
}
