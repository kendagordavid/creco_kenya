import { randomUUID } from "crypto";
import type { JSONValue } from "postgres";
import type { UserRole } from "@/lib/authz";
import { getSql } from "@/lib/db";
import type { NewsCategory } from "@/lib/news";

export type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  orgName: string;
  orgType?: string;
  county?: string;
  phone?: string;
  role?: UserRole;
  createdAt: string;
};

export type SubmissionType = "registration" | "enabling" | "incident";

export type SubmissionStatus = "pending" | "under_review" | "approved" | "rejected";

export type SubmissionRecord = {
  id: string;
  userId: string;
  type: SubmissionType;
  status: SubmissionStatus;
  county: string;
  narrative: string;
  issueType?: string;
  severity?: string;
  experienceDate?: string;
  orgType?: string;
  consentGiven: boolean;
  attachmentNote?: string;
  reviewComment?: string;
  createdAt: string;
  updatedAt: string;
};

export type FeedbackRecord = {
  id: string;
  userId?: string;
  question: string;
  reason: string;
  details?: string;
  createdAt: string;
};

export type AnonymousReportCategory = "system" | "other";

export type AnonymousReportStatus = "received" | "under_review" | "resolved" | "closed";

export type AnonymousReportRecord = {
  id: string;
  category: AnonymousReportCategory;
  subject: string;
  details: string;
  contactEmail?: string;
  status: AnonymousReportStatus;
  staffNote?: string;
  createdAt: string;
  updatedAt: string;
};

type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  org_name: string;
  org_type: string | null;
  county: string | null;
  phone: string | null;
  role: string;
  created_at: Date;
};

type SubmissionRow = {
  id: string;
  user_id: string;
  type: SubmissionType;
  status: SubmissionStatus;
  county: string;
  narrative: string;
  issue_type: string | null;
  severity: string | null;
  experience_date: string | null;
  org_type: string | null;
  consent_given: boolean;
  attachment_note: string | null;
  review_comment: string | null;
  created_at: Date;
  updated_at: Date;
};

type FeedbackRow = {
  id: string;
  user_id: string | null;
  question: string;
  reason: string;
  details: string | null;
  created_at: Date;
};

type AnonymousReportRow = {
  id: string;
  category: AnonymousReportCategory;
  subject: string;
  details: string;
  contact_email: string | null;
  status: AnonymousReportStatus;
  staff_note: string | null;
  created_at: Date;
  updated_at: Date;
};

function mapUser(row: UserRow): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    name: row.name,
    orgName: row.org_name,
    orgType: row.org_type ?? undefined,
    county: row.county ?? undefined,
    phone: row.phone ?? undefined,
    role: row.role as UserRole,
    createdAt: row.created_at.toISOString(),
  };
}

function mapSubmission(row: SubmissionRow): SubmissionRecord {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    status: row.status,
    county: row.county,
    narrative: row.narrative,
    issueType: row.issue_type ?? undefined,
    severity: row.severity ?? undefined,
    experienceDate: row.experience_date ?? undefined,
    orgType: row.org_type ?? undefined,
    consentGiven: row.consent_given,
    attachmentNote: row.attachment_note ?? undefined,
    reviewComment: row.review_comment ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapAnonymousReport(row: AnonymousReportRow): AnonymousReportRecord {
  return {
    id: row.id,
    category: row.category,
    subject: row.subject,
    details: row.details,
    contactEmail: row.contact_email ?? undefined,
    status: row.status,
    staffNote: row.staff_note ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapFeedback(row: FeedbackRow): FeedbackRecord {
  return {
    id: row.id,
    userId: row.user_id ?? undefined,
    question: row.question,
    reason: row.reason,
    details: row.details ?? undefined,
    createdAt: row.created_at.toISOString(),
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const sql = getSql();
  const rows = await sql<UserRow[]>`
    SELECT *
    FROM users
    WHERE lower(email) = lower(${email})
    LIMIT 1
  `;
  return rows[0] ? mapUser(rows[0]) : undefined;
}

export async function findUserById(id: string): Promise<UserRecord | undefined> {
  const sql = getSql();
  const rows = await sql<UserRow[]>`
    SELECT *
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapUser(rows[0]) : undefined;
}

export async function createUser(
  input: Omit<UserRecord, "id" | "createdAt"> & { passwordHash: string },
): Promise<UserRecord> {
  if (await findUserByEmail(input.email)) {
    throw new Error("An account with this email already exists.");
  }

  const sql = getSql();
  const id = randomUUID();
  const rows = await sql<UserRow[]>`
    INSERT INTO users (
      id,
      email,
      password_hash,
      name,
      org_name,
      org_type,
      county,
      phone,
      role
    )
    VALUES (
      ${id},
      ${input.email.toLowerCase()},
      ${input.passwordHash},
      ${input.name},
      ${input.orgName},
      ${input.orgType ?? null},
      ${input.county ?? null},
      ${input.phone ?? null},
      ${input.role ?? "pbo_user"}
    )
    RETURNING *
  `;

  return mapUser(rows[0]);
}

export async function updateUser(
  id: string,
  patch: Partial<Omit<UserRecord, "id" | "email" | "passwordHash">>,
): Promise<UserRecord | undefined> {
  const existing = await findUserById(id);
  if (!existing) return undefined;

  const sql = getSql();
  const rows = await sql<UserRow[]>`
    UPDATE users
    SET
      name = ${patch.name ?? existing.name},
      org_name = ${patch.orgName ?? existing.orgName},
      org_type = ${patch.orgType ?? existing.orgType ?? null},
      county = ${patch.county ?? existing.county ?? null},
      phone = ${patch.phone ?? existing.phone ?? null},
      role = ${patch.role ?? existing.role ?? "pbo_user"}
    WHERE id = ${id}
    RETURNING *
  `;

  return rows[0] ? mapUser(rows[0]) : undefined;
}

export async function createSubmission(
  input: Omit<SubmissionRecord, "id" | "status" | "createdAt" | "updatedAt">,
): Promise<SubmissionRecord> {
  const sql = getSql();
  const id = randomUUID();
  const rows = await sql<SubmissionRow[]>`
    INSERT INTO submissions (
      id,
      user_id,
      type,
      status,
      county,
      narrative,
      issue_type,
      severity,
      experience_date,
      org_type,
      consent_given,
      attachment_note
    )
    VALUES (
      ${id},
      ${input.userId},
      ${input.type},
      'pending',
      ${input.county},
      ${input.narrative},
      ${input.issueType ?? null},
      ${input.severity ?? null},
      ${input.experienceDate ?? null},
      ${input.orgType ?? null},
      ${input.consentGiven},
      ${input.attachmentNote ?? null}
    )
    RETURNING *
  `;

  return mapSubmission(rows[0]);
}

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export async function saveSubmissionFiles(
  submissionId: string,
  files: { name: string; type: string; data: Buffer }[],
): Promise<void> {
  if (files.length === 0) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS submission_files (
      id TEXT PRIMARY KEY,
      submission_id TEXT NOT NULL REFERENCES submissions (id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      content_type TEXT NOT NULL,
      data BYTEA NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  for (const file of files) {
    if (file.data.byteLength > MAX_ATTACHMENT_BYTES) continue;
    await sql`
      INSERT INTO submission_files (id, submission_id, filename, content_type, data)
      VALUES (${randomUUID()}, ${submissionId}, ${file.name}, ${file.type || "application/octet-stream"}, ${file.data})
    `;
  }
}

export async function listSubmissionsForUser(userId: string): Promise<SubmissionRecord[]> {
  const sql = getSql();
  const rows = await sql<SubmissionRow[]>`
    SELECT *
    FROM submissions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return rows.map(mapSubmission);
}

export async function findSubmission(
  id: string,
  userId: string,
): Promise<SubmissionRecord | undefined> {
  const sql = getSql();
  const rows = await sql<SubmissionRow[]>`
    SELECT *
    FROM submissions
    WHERE id = ${id}
      AND user_id = ${userId}
    LIMIT 1
  `;
  return rows[0] ? mapSubmission(rows[0]) : undefined;
}

export async function findSubmissionById(id: string): Promise<SubmissionRecord | undefined> {
  const sql = getSql();
  const rows = await sql<SubmissionRow[]>`
    SELECT *
    FROM submissions
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapSubmission(rows[0]) : undefined;
}

export async function listAllSubmissions(): Promise<SubmissionRecord[]> {
  const sql = getSql();
  const rows = await sql<SubmissionRow[]>`
    SELECT *
    FROM submissions
    ORDER BY created_at DESC
  `;
  return rows.map(mapSubmission);
}

export async function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
  reviewComment?: string | null,
): Promise<SubmissionRecord | undefined> {
  const sql = getSql();
  const rows =
    reviewComment !== undefined
      ? await sql<SubmissionRow[]>`
          UPDATE submissions
          SET
            status = ${status},
            review_comment = ${reviewComment},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `
      : await sql<SubmissionRow[]>`
          UPDATE submissions
          SET
            status = ${status},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
  return rows[0] ? mapSubmission(rows[0]) : undefined;
}

export async function createFeedback(
  input: Omit<FeedbackRecord, "id" | "createdAt">,
): Promise<FeedbackRecord> {
  const sql = getSql();
  const id = randomUUID();
  const rows = await sql<FeedbackRow[]>`
    INSERT INTO feedback (id, user_id, question, reason, details)
    VALUES (
      ${id},
      ${input.userId ?? null},
      ${input.question},
      ${input.reason},
      ${input.details ?? null}
    )
    RETURNING *
  `;
  return mapFeedback(rows[0]);
}

export async function createAnonymousReport(
  input: Pick<AnonymousReportRecord, "category" | "subject" | "details" | "contactEmail">,
): Promise<AnonymousReportRecord> {
  const sql = getSql();
  const id = randomUUID();
  const rows = await sql<AnonymousReportRow[]>`
    INSERT INTO anonymous_reports (id, category, subject, details, contact_email)
    VALUES (
      ${id},
      ${input.category},
      ${input.subject},
      ${input.details},
      ${input.contactEmail ?? null}
    )
    RETURNING *
  `;
  return mapAnonymousReport(rows[0]);
}

export async function listAnonymousReports(): Promise<AnonymousReportRecord[]> {
  const sql = getSql();
  const rows = await sql<AnonymousReportRow[]>`
    SELECT *
    FROM anonymous_reports
    ORDER BY created_at DESC
  `;
  return rows.map(mapAnonymousReport);
}

export async function findAnonymousReportById(
  id: string,
): Promise<AnonymousReportRecord | undefined> {
  const sql = getSql();
  const rows = await sql<AnonymousReportRow[]>`
    SELECT *
    FROM anonymous_reports
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows[0] ? mapAnonymousReport(rows[0]) : undefined;
}

export async function updateAnonymousReport(
  id: string,
  status: AnonymousReportStatus,
  staffNote?: string | null,
): Promise<AnonymousReportRecord | undefined> {
  const sql = getSql();
  const rows =
    staffNote !== undefined
      ? await sql<AnonymousReportRow[]>`
          UPDATE anonymous_reports
          SET
            status = ${status},
            staff_note = ${staffNote},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `
      : await sql<AnonymousReportRow[]>`
          UPDATE anonymous_reports
          SET
            status = ${status},
            updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
  return rows[0] ? mapAnonymousReport(rows[0]) : undefined;
}

export async function getUserData(userId: string, dataKey: string): Promise<unknown | null> {
  const sql = getSql();
  const rows = await sql<{ payload: unknown }[]>`
    SELECT payload
    FROM user_data
    WHERE user_id = ${userId}
      AND data_key = ${dataKey}
    LIMIT 1
  `;
  return rows[0]?.payload ?? null;
}

export async function setUserData(userId: string, dataKey: string, payload: unknown): Promise<void> {
  const sql = getSql();
  await sql`
    INSERT INTO user_data (user_id, data_key, payload)
    VALUES (${userId}, ${dataKey}, ${sql.json(payload as JSONValue)})
    ON CONFLICT (user_id, data_key) DO UPDATE SET
      payload = EXCLUDED.payload,
      updated_at = NOW()
  `;
}

export async function deleteUserData(userId: string, dataKey: string): Promise<void> {
  const sql = getSql();
  await sql`
    DELETE FROM user_data
    WHERE user_id = ${userId}
      AND data_key = ${dataKey}
  `;
}

export type ComplianceUserSnapshot = {
  user: {
    id: string;
    email: string;
    name: string;
    orgName: string;
    orgType?: string;
    county?: string;
    createdAt: string;
  };
  checklist: unknown | null;
  checklistUpdatedAt: string | null;
  assessment: unknown | null;
  assessmentUpdatedAt: string | null;
};

export async function listComplianceSnapshots(): Promise<ComplianceUserSnapshot[]> {
  const sql = getSql();
  const users = await sql<UserRow[]>`
    SELECT *
    FROM users
    WHERE role = 'pbo_user'
    ORDER BY org_name ASC, name ASC
  `;

  if (users.length === 0) return [];

  const userIds = users.map((u) => u.id);
  const dataRows = await sql<
    { user_id: string; data_key: string; payload: unknown; updated_at: Date }[]
  >`
    SELECT user_id, data_key, payload, updated_at
    FROM user_data
    WHERE user_id IN ${sql(userIds)}
      AND data_key IN ('creco-checklist-progress', 'creco-assessment-answers')
  `;

  const byUser = new Map<
    string,
    {
      checklist: unknown | null;
      checklistUpdatedAt: string | null;
      assessment: unknown | null;
      assessmentUpdatedAt: string | null;
    }
  >();

  for (const user of users) {
    byUser.set(user.id, {
      checklist: null,
      checklistUpdatedAt: null,
      assessment: null,
      assessmentUpdatedAt: null,
    });
  }

  for (const row of dataRows) {
    const entry = byUser.get(row.user_id);
    if (!entry) continue;
    const updatedAt = row.updated_at.toISOString();

    if (row.data_key === "creco-checklist-progress") {
      entry.checklist = row.payload;
      entry.checklistUpdatedAt = updatedAt;
    } else if (row.data_key === "creco-assessment-answers") {
      entry.assessment = row.payload;
      entry.assessmentUpdatedAt = updatedAt;
    }
  }

  return users.map((user) => {
    const progress = byUser.get(user.id)!;
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        orgName: user.org_name,
        orgType: user.org_type ?? undefined,
        county: user.county ?? undefined,
        createdAt: user.created_at.toISOString(),
      },
      checklist: progress.checklist,
      checklistUpdatedAt: progress.checklistUpdatedAt,
      assessment: progress.assessment,
      assessmentUpdatedAt: progress.assessmentUpdatedAt,
    };
  });
}

export async function countSubmissionsByUsers(userIds: string[]): Promise<Record<string, number>> {
  if (userIds.length === 0) return {};

  const sql = getSql();
  const rows = await sql<{ user_id: string; count: number }[]>`
    SELECT user_id, count(*)::int AS count
    FROM submissions
    WHERE user_id IN ${sql(userIds)}
    GROUP BY user_id
  `;

  return Object.fromEntries(rows.map((row) => [row.user_id, row.count]));
}

export type NewsPostRecord = {
  id: string;
  category: NewsCategory;
  published: boolean;
  publishedAt: string;
  titleEn: string;
  summaryEn: string;
  bodyEn: string;
  titleSw?: string;
  summarySw?: string;
  bodySw?: string;
  hasImage: boolean;
  imageContentType?: string;
  authorUserId?: string;
  createdAt: string;
  updatedAt: string;
};

type NewsPostRow = {
  id: string;
  category: string;
  published: boolean;
  published_at: Date;
  title_en: string;
  summary_en: string;
  body_en: string;
  title_sw: string | null;
  summary_sw: string | null;
  body_sw: string | null;
  image_data: Buffer | null;
  image_content_type: string | null;
  author_user_id: string | null;
  created_at: Date;
  updated_at: Date;
};

async function ensureNewsPostsTable(): Promise<void> {
  const sql = getSql();
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS news_posts (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL CHECK (
        category IN ('legislative', 'regulation', 'court', 'guidance', 'other')
      ),
      published BOOLEAN NOT NULL DEFAULT FALSE,
      published_at TIMESTAMPTZ NOT NULL,
      title_en TEXT NOT NULL,
      summary_en TEXT NOT NULL,
      body_en TEXT NOT NULL,
      title_sw TEXT,
      summary_sw TEXT,
      body_sw TEXT,
      image_data BYTEA,
      image_content_type TEXT,
      author_user_id TEXT REFERENCES users (id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS news_posts_published_at_idx ON news_posts (published_at DESC);
    CREATE INDEX IF NOT EXISTS news_posts_published_idx ON news_posts (published, published_at DESC);
  `);
}

function mapNewsPostRow(row: {
  id: string;
  category: string;
  published: boolean;
  published_at: Date;
  title_en: string;
  summary_en: string;
  body_en: string;
  title_sw: string | null;
  summary_sw: string | null;
  body_sw: string | null;
  has_image?: boolean;
  image_data?: Buffer | null;
  image_content_type: string | null;
  author_user_id: string | null;
  created_at: Date;
  updated_at: Date;
}): NewsPostRecord {
  const hasImage =
    typeof row.has_image === "boolean"
      ? row.has_image
      : row.image_data != null && row.image_data.length > 0;
  return {
    id: row.id,
    category: row.category as NewsCategory,
    published: row.published,
    publishedAt: row.published_at.toISOString(),
    titleEn: row.title_en,
    summaryEn: row.summary_en,
    bodyEn: row.body_en,
    titleSw: row.title_sw ?? undefined,
    summarySw: row.summary_sw ?? undefined,
    bodySw: row.body_sw ?? undefined,
    hasImage,
    imageContentType: row.image_content_type ?? undefined,
    authorUserId: row.author_user_id ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export type CreateNewsPostInput = {
  category: NewsCategory;
  published: boolean;
  publishedAt: string;
  titleEn: string;
  summaryEn: string;
  bodyEn: string;
  titleSw?: string;
  summarySw?: string;
  bodySw?: string;
  image?: { data: Buffer; contentType: string } | null;
  removeImage?: boolean;
  authorUserId?: string;
};

export async function listNewsPosts(options?: {
  publishedOnly?: boolean;
}): Promise<NewsPostRecord[]> {
  await ensureNewsPostsTable();
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  const rows = publishedOnly
    ? await sql<
        (NewsPostRow & { has_image: boolean })[]
      >`
        SELECT
          id,
          category,
          published,
          published_at,
          title_en,
          summary_en,
          body_en,
          title_sw,
          summary_sw,
          body_sw,
          (image_data IS NOT NULL) AS has_image,
          image_content_type,
          author_user_id,
          created_at,
          updated_at
        FROM news_posts
        WHERE published = TRUE
        ORDER BY published_at DESC
      `
    : await sql<
        (NewsPostRow & { has_image: boolean })[]
      >`
        SELECT
          id,
          category,
          published,
          published_at,
          title_en,
          summary_en,
          body_en,
          title_sw,
          summary_sw,
          body_sw,
          (image_data IS NOT NULL) AS has_image,
          image_content_type,
          author_user_id,
          created_at,
          updated_at
        FROM news_posts
        ORDER BY published_at DESC, created_at DESC
      `;
  return rows.map(mapNewsPostRow);
}

export async function findNewsPostById(
  id: string,
  options?: { publishedOnly?: boolean },
): Promise<NewsPostRecord | undefined> {
  await ensureNewsPostsTable();
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  const rows = publishedOnly
    ? await sql<
        (NewsPostRow & { has_image: boolean })[]
      >`
        SELECT
          id,
          category,
          published,
          published_at,
          title_en,
          summary_en,
          body_en,
          title_sw,
          summary_sw,
          body_sw,
          (image_data IS NOT NULL) AS has_image,
          image_content_type,
          author_user_id,
          created_at,
          updated_at
        FROM news_posts
        WHERE id = ${id}
          AND published = TRUE
        LIMIT 1
      `
    : await sql<
        (NewsPostRow & { has_image: boolean })[]
      >`
        SELECT
          id,
          category,
          published,
          published_at,
          title_en,
          summary_en,
          body_en,
          title_sw,
          summary_sw,
          body_sw,
          (image_data IS NOT NULL) AS has_image,
          image_content_type,
          author_user_id,
          created_at,
          updated_at
        FROM news_posts
        WHERE id = ${id}
        LIMIT 1
      `;
  return rows[0] ? mapNewsPostRow(rows[0]) : undefined;
}

export async function getNewsPostImage(
  id: string,
  options?: { publishedOnly?: boolean },
): Promise<{ data: Buffer; contentType: string } | undefined> {
  await ensureNewsPostsTable();
  const sql = getSql();
  const publishedOnly = options?.publishedOnly ?? false;
  const rows = publishedOnly
    ? await sql<{ image_data: Buffer | null; image_content_type: string | null }[]>`
        SELECT image_data, image_content_type
        FROM news_posts
        WHERE id = ${id}
          AND published = TRUE
          AND image_data IS NOT NULL
        LIMIT 1
      `
    : await sql<{ image_data: Buffer | null; image_content_type: string | null }[]>`
        SELECT image_data, image_content_type
        FROM news_posts
        WHERE id = ${id}
          AND image_data IS NOT NULL
        LIMIT 1
      `;
  const row = rows[0];
  if (!row?.image_data?.length) return undefined;
  return {
    data: row.image_data,
    contentType: row.image_content_type || "application/octet-stream",
  };
}

export async function createNewsPost(input: CreateNewsPostInput): Promise<NewsPostRecord> {
  await ensureNewsPostsTable();
  const sql = getSql();
  const id = randomUUID();
  const publishedAt = new Date(input.publishedAt);
  const imageData = input.image?.data ?? null;
  const imageType = input.image?.contentType ?? null;

  const rows = await sql<NewsPostRow[]>`
    INSERT INTO news_posts (
      id,
      category,
      published,
      published_at,
      title_en,
      summary_en,
      body_en,
      title_sw,
      summary_sw,
      body_sw,
      image_data,
      image_content_type,
      author_user_id
    )
    VALUES (
      ${id},
      ${input.category},
      ${input.published},
      ${publishedAt},
      ${input.titleEn},
      ${input.summaryEn},
      ${input.bodyEn},
      ${input.titleSw ?? null},
      ${input.summarySw ?? null},
      ${input.bodySw ?? null},
      ${imageData},
      ${imageType},
      ${input.authorUserId ?? null}
    )
    RETURNING *
  `;
  return mapNewsPostRow(rows[0]);
}

export async function updateNewsPost(
  id: string,
  input: CreateNewsPostInput,
): Promise<NewsPostRecord | undefined> {
  await ensureNewsPostsTable();
  const sql = getSql();
  const existing = await findNewsPostById(id);
  if (!existing) return undefined;

  const publishedAt = new Date(input.publishedAt);

  await sql`
    UPDATE news_posts
    SET
      category = ${input.category},
      published = ${input.published},
      published_at = ${publishedAt},
      title_en = ${input.titleEn},
      summary_en = ${input.summaryEn},
      body_en = ${input.bodyEn},
      title_sw = ${input.titleSw ?? null},
      summary_sw = ${input.summarySw ?? null},
      body_sw = ${input.bodySw ?? null},
      updated_at = NOW()
    WHERE id = ${id}
  `;

  if (input.removeImage) {
    await sql`
      UPDATE news_posts
      SET image_data = NULL, image_content_type = NULL, updated_at = NOW()
      WHERE id = ${id}
    `;
  } else if (input.image) {
    await sql`
      UPDATE news_posts
      SET
        image_data = ${input.image.data},
        image_content_type = ${input.image.contentType},
        updated_at = NOW()
      WHERE id = ${id}
    `;
  }

  return findNewsPostById(id);
}

export async function deleteNewsPost(id: string): Promise<boolean> {
  await ensureNewsPostsTable();
  const sql = getSql();
  const rows = await sql<{ id: string }[]>`
    DELETE FROM news_posts
    WHERE id = ${id}
    RETURNING id
  `;
  return rows.length > 0;
}
