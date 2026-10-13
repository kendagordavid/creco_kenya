import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { canViewAllReports } from "@/lib/authz";
import { parseNewsMultipart, serializeNewsPost, toCreateNewsInput } from "@/lib/news-api";
import { deleteNewsPost, findNewsPostById, updateNewsPost } from "@/lib/store";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const existing = await findNewsPostById(id);
  if (!existing) {
    return NextResponse.json({ error: "News item not found." }, { status: 404 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
    }

    const { payload, image } = await parseNewsMultipart(request);
    const input = toCreateNewsInput(payload, { image, authorUserId: existing.authorUserId });
    const post = await updateNewsPost(id, input);
    if (!post) {
      return NextResponse.json({ error: "News item not found." }, { status: 404 });
    }
    return NextResponse.json({ post: serializeNewsPost(post) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid news details." }, { status: 400 });
    }
    if (error instanceof Error) {
      if (error.message === "IMAGE_TOO_LARGE") {
        return NextResponse.json({ error: "Photo must be 2 MB or smaller." }, { status: 400 });
      }
      if (error.message === "IMAGE_TYPE") {
        return NextResponse.json({ error: "Photo must be JPEG, PNG, or WebP." }, { status: 400 });
      }
    }
    return NextResponse.json({ error: "Could not update news item." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await context.params;
  const deleted = await deleteNewsPost(id);
  if (!deleted) {
    return NextResponse.json({ error: "News item not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
