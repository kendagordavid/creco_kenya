import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createSubmission, listSubmissionsForUser, saveSubmissionFiles } from "@/lib/store";

const MAX_FILES = 4;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

async function readMultipartSubmission(request: Request) {
  const form = await request.formData();
  const raw = form.get("payload");
  if (typeof raw !== "string") {
    throw new z.ZodError([]);
  }
  const parsed = createSchema.parse(JSON.parse(raw));
  const files = form
    .getAll("files")
    .filter((item): item is File => item instanceof File && item.size > 0)
    .slice(0, MAX_FILES);
  return { ...parsed, files };
}

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

  return NextResponse.json({ submissions: await listSubmissionsForUser(session.user.id) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    const body = contentType.includes("multipart/form-data")
      ? await readMultipartSubmission(request)
      : { ...(createSchema.parse(await request.json())), files: [] as File[] };

    if (!body.consentGiven) {
      return NextResponse.json({ error: "Consent is required to submit a report." }, { status: 400 });
    }

    if (body.files.some((file) => file.size > MAX_FILE_BYTES)) {
      return NextResponse.json({ error: "Each attachment must be 5 MB or smaller." }, { status: 400 });
    }

    const submission = await createSubmission({
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

    const stored = await Promise.all(
      body.files.map(async (file) => ({
        name: file.name,
        type: file.type,
        data: Buffer.from(await file.arrayBuffer()),
      })),
    );
    await saveSubmissionFiles(submission.id, stored);

    return NextResponse.json({ id: submission.id, status: submission.status });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save submission." }, { status: 500 });
  }
}
