import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { canViewAllReports } from "@/lib/authz";
import { parseNewsMultipart, serializeNewsPost, toCreateNewsInput } from "@/lib/news-api";
import { createNewsPost, listNewsPosts } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const posts = await listNewsPosts();
  return NextResponse.json({ posts: posts.map(serializeNewsPost) });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart form data." }, { status: 400 });
    }

    const { payload, image } = await parseNewsMultipart(request);
    const post = await createNewsPost(
      toCreateNewsInput(payload, {
        image,
        authorUserId: session.user.id,
      }),
    );
    return NextResponse.json({ post: serializeNewsPost(post) }, { status: 201 });
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
    return NextResponse.json({ error: "Could not create news item." }, { status: 500 });
  }
}
