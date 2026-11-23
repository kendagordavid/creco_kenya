import { NextResponse } from "next/server";
import { z } from "zod";
import { requireStaff } from "@/lib/staff-api";
import { countOtherActiveSuperusers, findManagedUser, updateManagedUser } from "@/lib/staff-store";

const updateSchema = z
  .object({
    role: z.enum(["pbo_user", "superuser"]).optional(),
    disabled: z.boolean().optional(),
    resetMfa: z.literal(true).optional(),
  })
  .refine((body) => body.role !== undefined || body.disabled !== undefined || body.resetMfa, {
    message: "Nothing to change.",
  });

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid change." }, { status: 400 });
  }

  const { id } = await context.params;
  const target = await findManagedUser(id);
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const body = parsed.data;
  const isSelf = id === session.user.id;
  const losesStaffAccess =
    (body.role === "pbo_user" && target.role === "superuser") || body.disabled === true;

  // Staff manage their own role and MFA from their own screens, so nobody demotes,
  // disables or strips MFA from themselves by accident here.
  if (isSelf && (losesStaffAccess || body.resetMfa)) {
    return NextResponse.json({ error: "You cannot change this on your own account." }, { status: 409 });
  }

  if (losesStaffAccess && target.role === "superuser" && !target.disabled) {
    if ((await countOtherActiveSuperusers(id)) === 0) {
      return NextResponse.json({ error: "At least one active staff account must remain." }, { status: 409 });
    }
  }

  try {
    const user = await updateManagedUser(id, body);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("[admin/users] update failed:", error);
    return NextResponse.json({ error: "Could not update this user." }, { status: 500 });
  }
}
