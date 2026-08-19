import { randomUUID } from "crypto";
import type { JSONValue } from "postgres";
import type { UserRole } from "@/lib/authz";
import { getSql } from "@/lib/db";

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
