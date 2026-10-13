import { z } from "zod";
import { isNewsCategory, MAX_NEWS_IMAGE_BYTES, NEWS_IMAGE_TYPES } from "@/lib/news";
import type { CreateNewsPostInput } from "@/lib/store";

export const newsPayloadSchema = z.object({
  category: z.string().refine(isNewsCategory, "Invalid category."),
  published: z.boolean(),
  publishedAt: z.string().min(1),
  titleEn: z.string().trim().min(3).max(240),
  summaryEn: z.string().trim().min(10).max(600),
  bodyEn: z.string().trim().min(20).max(50000),
  titleSw: z.string().trim().max(240).optional(),
  summarySw: z.string().trim().max(600).optional(),
  bodySw: z.string().trim().max(50000).optional(),
  removeImage: z.boolean().optional(),
});

export type NewsPayload = z.infer<typeof newsPayloadSchema>;

export async function parseNewsMultipart(request: Request): Promise<{
  payload: NewsPayload;
  image?: { data: Buffer; contentType: string };
}> {
  const form = await request.formData();
  const raw = form.get("payload");
  if (typeof raw !== "string") {
    throw new z.ZodError([]);
  }
  const payload = newsPayloadSchema.parse(JSON.parse(raw));
  const file = form.get("image");
  let image: { data: Buffer; contentType: string } | undefined;

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_NEWS_IMAGE_BYTES) {
      throw new Error("IMAGE_TOO_LARGE");
    }
    const contentType = file.type || "application/octet-stream";
    if (!NEWS_IMAGE_TYPES.has(contentType)) {
      throw new Error("IMAGE_TYPE");
    }
    const data = Buffer.from(await file.arrayBuffer());
    image = { data, contentType };
  }

  return { payload, image };
}

export function toCreateNewsInput(
  payload: NewsPayload,
  options: {
    image?: { data: Buffer; contentType: string };
    authorUserId?: string;
  },
): CreateNewsPostInput {
  return {
    category: payload.category,
    published: payload.published,
    publishedAt: payload.publishedAt,
    titleEn: payload.titleEn,
    summaryEn: payload.summaryEn,
    bodyEn: payload.bodyEn,
    titleSw: payload.titleSw || undefined,
    summarySw: payload.summarySw || undefined,
    bodySw: payload.bodySw || undefined,
    removeImage: payload.removeImage,
    ...(options.image ? { image: options.image } : {}),
    authorUserId: options.authorUserId,
  };
}

export function serializeNewsPost(post: import("@/lib/store").NewsPostRecord) {
  return {
    id: post.id,
    category: post.category,
    published: post.published,
    publishedAt: post.publishedAt,
    titleEn: post.titleEn,
    summaryEn: post.summaryEn,
    bodyEn: post.bodyEn,
    titleSw: post.titleSw,
    summarySw: post.summarySw,
    bodySw: post.bodySw,
    hasImage: post.hasImage,
    authorUserId: post.authorUserId,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}
