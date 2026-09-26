import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { canViewAllReports } from "@/lib/authz";
import { findAnonymousReportById, updateAnonymousReport } from "@/lib/store";

const updateSchema = z.object({
  status: z.enum(["received", "under_review", "resolved", "closed"]),
  staffNote: z.string().trim().max(2000).nullable().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await findAnonymousReportById(id);
  if (!existing) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const report = await updateAnonymousReport(id, body.status, body.staffNote);
    return NextResponse.json({ report });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid review details." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update report." }, { status: 500 });
  }
}
