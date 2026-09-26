import { NextResponse } from "next/server";
import { z } from "zod";
import { clientKeyFromRequest, isReportRateLimited } from "@/lib/report-rate-limit";
import { createAnonymousReport } from "@/lib/store";

const schema = z.object({
  category: z.enum(["system", "other"]),
  subject: z.string().trim().min(5).max(160),
  details: z.string().trim().min(20).max(4000),
  contactEmail: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => !value || z.string().email().safeParse(value).success),
  company: z.string().optional(),
});

export async function POST(request: Request) {
  if (isReportRateLimited(clientKeyFromRequest(request))) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  try {
    const body = schema.parse(await request.json());

    if (body.company?.trim()) {
      return NextResponse.json({ ok: true, reference: "received" });
    }

    const record = await createAnonymousReport({
      category: body.category,
      subject: body.subject,
      details: body.details,
      contactEmail: body.contactEmail,
    });

    return NextResponse.json({
      ok: true,
      reference: record.id.slice(0, 8).toUpperCase(),
      hasContact: Boolean(record.contactEmail),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "invalid" }, { status: 400 });
    }
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
