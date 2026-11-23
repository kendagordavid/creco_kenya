import { NextResponse } from "next/server";
import { z } from "zod";
import {
  confirmMfaEnrollment,
  disableMfa,
  isMfaEnabled,
  startMfaEnrollment,
  verifyMfaCode,
} from "@/lib/mfa";
import { requireStaff } from "@/lib/staff-api";

const codeSchema = z.string().trim().regex(/^\d{6}$/);

const postSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("start") }),
  z.object({ action: z.literal("confirm"), code: codeSchema }),
]);

/** Two-step verification for the signed-in staff member's own account. */
export async function GET() {
  const { session, response } = await requireStaff();
  if (response) return response;
  return NextResponse.json({ enabled: await isMfaEnabled(session.user.id) });
}

export async function POST(request: Request) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const parsed = postSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (await isMfaEnabled(session.user.id)) {
    return NextResponse.json({ error: "Two-step verification is already on." }, { status: 409 });
  }

  if (parsed.data.action === "start") {
    const enrollment = await startMfaEnrollment(session.user.id, session.user.email ?? "staff");
    return NextResponse.json(enrollment);
  }

  const ok = await confirmMfaEnrollment(session.user.id, parsed.data.code);
  if (!ok) {
    return NextResponse.json({ error: "That code did not match." }, { status: 400 });
  }
  return NextResponse.json({ enabled: true });
}

/** Turning MFA off needs a current code, so an unattended signed-in browser cannot do it. */
export async function DELETE(request: Request) {
  const { session, response } = await requireStaff();
  if (response) return response;

  const parsed = z.object({ code: codeSchema }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }
  if (!(await verifyMfaCode(session.user.id, parsed.data.code))) {
    return NextResponse.json({ error: "That code did not match." }, { status: 400 });
  }
  await disableMfa(session.user.id);
  return NextResponse.json({ enabled: false });
}
