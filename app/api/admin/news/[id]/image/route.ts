import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { canViewAllReports } from "@/lib/authz";
import { getNewsPostImage } from "@/lib/store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return new NextResponse(null, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return new NextResponse(null, { status: 403 });
  }

  const { id } = await context.params;
  const image = await getNewsPostImage(id);
  if (!image) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    status: 200,
    headers: {
      "Content-Type": image.contentType,
      "Cache-Control": "private, max-age=60",
    },
  });
}
