import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createFeedback } from "@/lib/store";

const schema = z.object({
  question: z.string().min(5),
  reason: z.string().min(3),
  details: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();

  try {
    const body = schema.parse(await request.json());
    const record = createFeedback({
      userId: session?.user?.id,
      question: body.question,
      reason: body.reason,
      details: body.details,
    });

    return NextResponse.json({ id: record.id, ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid feedback." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save feedback." }, { status: 500 });
  }
}
