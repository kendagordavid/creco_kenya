import { auth } from "@/auth";
import { NextResponse, after } from "next/server";
import { z } from "zod";
import { canViewAllReports } from "@/lib/authz";
import { parseNewsMultipart, serializeNewsPost, toCreateNewsInput } from "@/lib/news-api";
import { emailNewsPostToSubscribers, newsEmailConfigured } from "@/lib/news-email";
import { getRequestOrigin } from "@/lib/request-origin";
import { countActiveNewsSubscribers, createNewsPost, listNewsPosts } from "@/lib/store";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!canViewAllReports(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [posts, subscriberCount] = await Promise.all([listNewsPosts(), countActiveNewsSubscribers()]);
  return NextResponse.json({
    posts: posts.map(serializeNewsPost),
    subscribers: { count: subscriberCount, emailConfigured: newsEmailConfigured() },
  });
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
    const origin = await getRequestOrigin();
    after(() => emailNewsPostToSubscribers(post, origin));
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
