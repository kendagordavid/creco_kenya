import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { canViewAllReports } from "@/lib/authz";
import { findSubmissionById, updateSubmissionStatus } from "@/lib/store";

const updateSchema = z.object({
  status: z.enum(["pending", "under_review", "approved", "rejected"]),
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
  const existing = findSubmissionById(id);
  if (!existing) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const submission = updateSubmissionStatus(id, body.status);
    return NextResponse.json({ submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update report." }, { status: 500 });
  }
}
