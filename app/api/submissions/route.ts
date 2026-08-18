import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission, listSubmissionsForUser } from "@/lib/store";

const createSchema = z.object({
  type: z.enum(["registration", "enabling", "incident"]),
  county: z.string().min(2),
  narrative: z.string().min(20),
  issueType: z.string().optional(),
  severity: z.string().optional(),
  experienceDate: z.string().optional(),
  orgType: z.string().optional(),
  consentGiven: z.boolean(),
  attachmentNote: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ submissions: listSubmissionsForUser(session.user.id) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = createSchema.parse(await request.json());

    if (!body.consentGiven) {
      return NextResponse.json({ error: "Consent is required to submit a report." }, { status: 400 });
    }

    const submission = createSubmission({
      userId: session.user.id,
      type: body.type,
      county: body.county,
      narrative: body.narrative,
      issueType: body.issueType,
      severity: body.severity,
      experienceDate: body.experienceDate,
      orgType: body.orgType,
      consentGiven: body.consentGiven,
      attachmentNote: body.attachmentNote,
    });

    return NextResponse.json({ id: submission.id, status: submission.status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
  }
}
