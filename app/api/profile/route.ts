import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { findUserById, updateUser } from "@/lib/store";

const schema = z.object({
  name: z.string().min(2).optional(),
  orgName: z.string().min(2).optional(),
  orgType: z.string().optional(),
  county: z.string().optional(),
  phone: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = findUserById(session.user.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    orgName: user.orgName,
    orgType: user.orgType,
    county: user.county,
    phone: user.phone,
    createdAt: user.createdAt,
  });
}

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = schema.parse(await request.json());
    const user = updateUser(session.user.id, body);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      orgName: user.orgName,
      orgType: user.orgType,
      county: user.county,
      phone: user.phone,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid profile data." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not update profile." }, { status: 500 });
  }
}
