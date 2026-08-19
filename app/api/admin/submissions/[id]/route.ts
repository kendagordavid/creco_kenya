import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { canViewAllReports } from "@/lib/authz";
import { findSubmissionById, updateSubmissionStatus } from "@/lib/store";

const updateSchema = z
  .object({
    status: z.enum(["pending", "under_review", "approved", "rejected"]),
    reviewComment: z.string().trim().min(10).max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (
      (data.status === "approved" || data.status === "rejected") &&
      !data.reviewComment
    ) {
      ctx.addIssue({
        code: "custom",
        message: "A review comment is required when approving or rejecting a report.",
        path: ["reviewComment"],
      });
    }
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
  const existing = await findSubmissionById(id);
  if (!existing) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  try {
    const body = updateSchema.parse(await request.json());
    const submission = await updateSubmissionStatus(
      id,
      body.status,
      body.reviewComment,
    );
    return NextResponse.json({ submission });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message =
        error.issues[0]?.message ?? "Invalid review details.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update report." }, { status: 500 });
  }
}
