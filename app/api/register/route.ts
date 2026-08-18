import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { createUser, findUserByEmail } from "@/lib/store";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  orgName: z.string().min(2),
  orgType: z.string().optional(),
  county: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    if (await findUserByEmail(body.email)) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);
    const user = await createUser({
      email: body.email,
      passwordHash,
      name: body.name,
      orgName: body.orgName,
      orgType: body.orgType,
      county: body.county,
      phone: body.phone,
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : "Registration failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
