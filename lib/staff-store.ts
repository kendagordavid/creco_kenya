import "server-only";

import type { UserRole } from "@/lib/authz";
import { getSql } from "@/lib/db";

/*
 * Data for the staff console screens added after launch: the Q&A flag queue,
 * user management and staff MFA. The columns are also in db/schema.sql; this
 * applies them lazily so a deployed database picks them up without a manual step,
 * the same way news_posts is created.
 */

let schemaReady: Promise<void> | null = null;

export function ensureStaffSchema(): Promise<void> {
  if (!schemaReady) {
    const sql = getSql();
    schemaReady = sql
      .unsafe(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS disabled_at TIMESTAMPTZ;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_secret TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_pending_secret TEXT;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_enabled_at TIMESTAMPTZ;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS mfa_last_step BIGINT;
        ALTER TABLE feedback ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'open';
        ALTER TABLE feedback ADD COLUMN IF NOT EXISTS staff_note TEXT;
        ALTER TABLE feedback ADD COLUMN IF NOT EXISTS reviewed_by TEXT REFERENCES users (id) ON DELETE SET NULL;
        ALTER TABLE feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
        CREATE TABLE IF NOT EXISTS content_overrides (
          kind TEXT NOT NULL CHECK (kind IN ('topic', 'faq')),
          slug TEXT NOT NULL,
          locale TEXT NOT NULL CHECK (locale IN ('en', 'sw')),
          title TEXT NOT NULL,
          lead TEXT,
          body TEXT NOT NULL,
          updated_by TEXT REFERENCES users (id) ON DELETE SET NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          PRIMARY KEY (kind, slug, locale)
        );
      `)
      .then(() => undefined)
      .catch((error) => {
        schemaReady = null;
        throw error;
      });
  }
  return schemaReady;
}

/* ------------------------------------------------------------------ */
/* Q&A flag review queue                                               */
/* ------------------------------------------------------------------ */

export const FLAG_STATUSES = ["open", "reviewing", "answer_updated", "dismissed"] as const;
export type FlagStatus = (typeof FLAG_STATUSES)[number];

export type FlagRecord = {
  id: string;
  question: string;
  reason: string;
  details?: string;
  status: FlagStatus;
  staffNote?: string;
  reporter?: { name: string; email: string; orgName: string };
  reviewerName?: string;
  createdAt: string;
  updatedAt: string;
};

type FlagRow = {
  id: string;
  question: string;
  reason: string;
  details: string | null;
  status: string;
  staff_note: string | null;
  reporter_name: string | null;
  reporter_email: string | null;
  reporter_org: string | null;
  reviewer_name: string | null;
  created_at: Date;
  updated_at: Date;
};

function mapFlag(row: FlagRow): FlagRecord {
  return {
    id: row.id,
    question: row.question,
    reason: row.reason,
    details: row.details ?? undefined,
    status: (FLAG_STATUSES as readonly string[]).includes(row.status)
      ? (row.status as FlagStatus)
      : "open",
    staffNote: row.staff_note ?? undefined,
    reporter: row.reporter_email
      ? {
          name: row.reporter_name ?? "",
          email: row.reporter_email,
          orgName: row.reporter_org ?? "",
        }
      : undefined,
    reviewerName: row.reviewer_name ?? undefined,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

const FLAG_SELECT = `
  SELECT
    f.id, f.question, f.reason, f.details, f.status, f.staff_note, f.created_at, f.updated_at,
    reporter.name AS reporter_name, reporter.email AS reporter_email, reporter.org_name AS reporter_org,
    reviewer.name AS reviewer_name
  FROM feedback f
  LEFT JOIN users reporter ON reporter.id = f.user_id
  LEFT JOIN users reviewer ON reviewer.id = f.reviewed_by
`;

export async function listFlags(): Promise<FlagRecord[]> {
  await ensureStaffSchema();
  const sql = getSql();
  const rows = await sql.unsafe<FlagRow[]>(`${FLAG_SELECT} ORDER BY f.created_at DESC`);
  return rows.map(mapFlag);
}

export async function updateFlag(
  id: string,
  input: { status: FlagStatus; staffNote?: string | null; reviewerId: string },
): Promise<FlagRecord | undefined> {
  await ensureStaffSchema();
  const sql = getSql();
  const updated =
    input.staffNote !== undefined
      ? await sql`
          UPDATE feedback
          SET status = ${input.status}, staff_note = ${input.staffNote},
              reviewed_by = ${input.reviewerId}, updated_at = NOW()
          WHERE id = ${id}
          RETURNING id
        `
      : await sql`
          UPDATE feedback
          SET status = ${input.status}, reviewed_by = ${input.reviewerId}, updated_at = NOW()
          WHERE id = ${id}
          RETURNING id
        `;
  if (updated.length === 0) return undefined;
  const rows = await sql.unsafe<FlagRow[]>(`${FLAG_SELECT} WHERE f.id = $1`, [id]);
  return rows[0] ? mapFlag(rows[0]) : undefined;
}

/* ------------------------------------------------------------------ */
/* User management                                                     */
/* ------------------------------------------------------------------ */

export type ManagedUser = {
  id: string;
  email: string;
  name: string;
  orgName: string;
  county?: string;
  role: UserRole;
  disabled: boolean;
  mfaEnabled: boolean;
  submissionCount: number;
  createdAt: string;
};

type ManagedUserRow = {
  id: string;
  email: string;
  name: string;
  org_name: string;
  county: string | null;
  role: string;
  disabled_at: Date | null;
  mfa_enabled_at: Date | null;
  submission_count: number;
  created_at: Date;
};

function mapManagedUser(row: ManagedUserRow): ManagedUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    orgName: row.org_name,
    county: row.county ?? undefined,
    role: row.role === "superuser" ? "superuser" : "pbo_user",
    disabled: Boolean(row.disabled_at),
    mfaEnabled: Boolean(row.mfa_enabled_at),
    submissionCount: row.submission_count,
    createdAt: row.created_at.toISOString(),
  };
}

async function selectManagedUsers(id?: string): Promise<ManagedUser[]> {
  await ensureStaffSchema();
  const sql = getSql();
  const rows = await sql<ManagedUserRow[]>`
    SELECT
      u.id, u.email, u.name, u.org_name, u.county, u.role, u.disabled_at, u.mfa_enabled_at, u.created_at,
      (SELECT count(*)::int FROM submissions s WHERE s.user_id = u.id) AS submission_count
    FROM users u
    ${id ? sql`WHERE u.id = ${id}` : sql``}
    ORDER BY u.created_at DESC
  `;
  return rows.map(mapManagedUser);
}

export function listManagedUsers(): Promise<ManagedUser[]> {
  return selectManagedUsers();
}

export async function findManagedUser(id: string): Promise<ManagedUser | undefined> {
  return (await selectManagedUsers(id))[0];
}

/** Active staff accounts other than `excludeId` — used so the last admin cannot lock everyone out. */
export async function countOtherActiveSuperusers(excludeId: string): Promise<number> {
  await ensureStaffSchema();
  const sql = getSql();
  const [row] = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count
    FROM users
    WHERE role = 'superuser' AND disabled_at IS NULL AND id <> ${excludeId}
  `;
  return row?.count ?? 0;
}

export async function updateManagedUser(
  id: string,
  patch: { role?: UserRole; disabled?: boolean; resetMfa?: boolean },
): Promise<ManagedUser | undefined> {
  await ensureStaffSchema();
  const sql = getSql();
  await sql.begin(async (tx) => {
    if (patch.role) {
      await tx`UPDATE users SET role = ${patch.role} WHERE id = ${id}`;
    }
    if (patch.disabled !== undefined) {
      await tx`
        UPDATE users
        SET disabled_at = ${patch.disabled ? sql`COALESCE(disabled_at, NOW())` : null}
        WHERE id = ${id}
      `;
    }
    if (patch.resetMfa) {
      await tx`
        UPDATE users
        SET mfa_secret = NULL, mfa_pending_secret = NULL, mfa_enabled_at = NULL, mfa_last_step = NULL
        WHERE id = ${id}
      `;
    }
  });
  return findManagedUser(id);
}

/** Role and access state, read on session refresh so staff changes apply without a new sign-in. */
export async function getAccountState(
  id: string,
): Promise<{ role: UserRole; disabled: boolean } | undefined> {
  await ensureStaffSchema();
  const sql = getSql();
  const [row] = await sql<{ role: string; disabled_at: Date | null }[]>`
    SELECT role, disabled_at FROM users WHERE id = ${id} LIMIT 1
  `;
  if (!row) return undefined;
  return { role: row.role === "superuser" ? "superuser" : "pbo_user", disabled: Boolean(row.disabled_at) };
}

/* ------------------------------------------------------------------ */
/* MFA (secrets are sealed by lib/secret-box before they reach here)   */
/* ------------------------------------------------------------------ */

export async function getMfaSecrets(
  userId: string,
): Promise<{ secret: string | null; pending: string | null; enabled: boolean } | undefined> {
  await ensureStaffSchema();
  const sql = getSql();
  const [row] = await sql<
    { mfa_secret: string | null; mfa_pending_secret: string | null; mfa_enabled_at: Date | null }[]
  >`
    SELECT mfa_secret, mfa_pending_secret, mfa_enabled_at FROM users WHERE id = ${userId} LIMIT 1
  `;
  if (!row) return undefined;
  return {
    secret: row.mfa_secret,
    pending: row.mfa_pending_secret,
    enabled: Boolean(row.mfa_enabled_at && row.mfa_secret),
  };
}

export async function setPendingMfaSecret(userId: string, sealed: string): Promise<void> {
  await ensureStaffSchema();
  const sql = getSql();
  await sql`UPDATE users SET mfa_pending_secret = ${sealed} WHERE id = ${userId}`;
}

/** Promotes the pending secret once the user has proved they can generate codes from it. */
export async function activatePendingMfa(userId: string, step: number): Promise<void> {
  await ensureStaffSchema();
  const sql = getSql();
  await sql`
    UPDATE users
    SET mfa_secret = mfa_pending_secret, mfa_pending_secret = NULL,
        mfa_enabled_at = NOW(), mfa_last_step = ${step}
    WHERE id = ${userId} AND mfa_pending_secret IS NOT NULL
  `;
}

export async function clearMfa(userId: string): Promise<void> {
  await ensureStaffSchema();
  const sql = getSql();
  await sql`
    UPDATE users
    SET mfa_secret = NULL, mfa_pending_secret = NULL, mfa_enabled_at = NULL, mfa_last_step = NULL
    WHERE id = ${userId}
  `;
}

/**
 * Records that `step` was used. Returns false when that code (or a later one) was
 * already used, so an intercepted code cannot be replayed within its 90 s window.
 */
export async function claimMfaStep(userId: string, step: number): Promise<boolean> {
  await ensureStaffSchema();
  const sql = getSql();
  const rows = await sql`
    UPDATE users
    SET mfa_last_step = ${step}
    WHERE id = ${userId} AND (mfa_last_step IS NULL OR mfa_last_step < ${step})
    RETURNING id
  `;
  return rows.length > 0;
}
