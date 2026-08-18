import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { deleteUserData, getUserData, setUserData } from "@/lib/store";

const putSchema = z.object({
  key: z.string().min(1).max(64),
  data: z.unknown(),
});

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key." }, { status: 400 });
  }

  const data = await getUserData(session.user.id, key);
  return NextResponse.json({ key, data });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = putSchema.parse(await request.json());
    await setUserData(session.user.id, body.key, body.data);
    return NextResponse.json({ ok: true, key: body.key });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save data." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = new URL(request.url).searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "Missing key." }, { status: 400 });
  }

  await deleteUserData(session.user.id, key);
  return NextResponse.json({ ok: true, key });
}
