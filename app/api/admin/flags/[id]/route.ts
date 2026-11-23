import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/staff-api";
import { FLAG_STATUSES, updateFlag } from "@/lib/staff-store";

const updateSchema = z.object({
  status: z.enum(FLAG_STATUSES),
  staffNote: z.string().trim().max(2000).nullable().optional(),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid review details." }, { status: 400 });
  }

  const { id } = await context.params;
  try {
    const flag = await updateFlag(id, {
      status: parsed.data.status,
      staffNote: parsed.data.staffNote === undefined ? undefined : parsed.data.staffNote || null,
      reviewerId: session.user.id,
    });
    if (!flag) {
      return NextResponse.json({ error: "Flag not found." }, { status: 404 });
    }
    return NextResponse.json({ flag });
  } catch (error) {
    console.error("[admin/flags] update failed:", error);
    return NextResponse.json({ error: "Could not update this flag." }, { status: 500 });
  }
}
