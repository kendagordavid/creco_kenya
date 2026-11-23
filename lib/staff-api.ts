import "server-only";

import type { Session } from "next-auth";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isSuperuser } from "@/lib/authz";

type StaffSession = Session & { user: Session["user"] & { id: string } };

/** Resolves the signed-in staff session, or the 401/403 response to send instead. */
export async function requireStaff(): Promise<
  { session: StaffSession; response?: undefined } | { session?: undefined; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!isSuperuser(session.user.role)) {
    return { response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session: session as StaffSession };
}
