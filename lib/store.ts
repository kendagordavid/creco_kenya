import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { UserRole } from "@/lib/authz";

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

type PlatformStore = {
  users: UserRecord[];
  submissions: SubmissionRecord[];
  feedback: FeedbackRecord[];
};

const STORE_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(STORE_DIR, "platform-store.json");
const SEED_PATH = path.join(STORE_DIR, "users.seed.json");

declare global {
  // eslint-disable-next-line no-var
  var __crecoPlatformStore: PlatformStore | undefined;
}

function readSeedUsers(): UserRecord[] {
  if (!fs.existsSync(SEED_PATH)) return [];
  return JSON.parse(fs.readFileSync(SEED_PATH, "utf-8")) as UserRecord[];
}

function loadFromDisk(): PlatformStore {
  const seedUsers = readSeedUsers();
  if (!fs.existsSync(STORE_PATH)) {
    return { users: seedUsers, submissions: [], feedback: [] };
  }

  const parsed = JSON.parse(fs.readFileSync(STORE_PATH, "utf-8")) as PlatformStore;
  const byEmail = new Map<string, UserRecord>();

  for (const user of seedUsers) {
    byEmail.set(user.email.toLowerCase(), user);
  }
  for (const user of parsed.users ?? []) {
    byEmail.set(user.email.toLowerCase(), user);
  }

  return {
    users: [...byEmail.values()],
    submissions: parsed.submissions ?? [],
    feedback: parsed.feedback ?? [],
  };
}

function persist(store: PlatformStore) {
  if (!fs.existsSync(STORE_DIR)) {
    fs.mkdirSync(STORE_DIR, { recursive: true });
  }
  const seedEmails = new Set(readSeedUsers().map((u) => u.email.toLowerCase()));
  const writable: PlatformStore = {
    users: store.users.filter((u) => !seedEmails.has(u.email.toLowerCase())),
    submissions: store.submissions,
    feedback: store.feedback,
  };
  fs.writeFileSync(STORE_PATH, `${JSON.stringify(writable, null, 2)}\n`, "utf-8");
}

function getStore(): PlatformStore {
  if (!globalThis.__crecoPlatformStore) {
    globalThis.__crecoPlatformStore = loadFromDisk();
  }
  return globalThis.__crecoPlatformStore;
}

function saveStore(store: PlatformStore) {
  globalThis.__crecoPlatformStore = store;
  try {
    persist(store);
  } catch {
    // Writable filesystem may be unavailable on some serverless hosts.
  }
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return getStore().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function findUserById(id: string): UserRecord | undefined {
  return getStore().users.find((u) => u.id === id);
}

export function createUser(
  input: Omit<UserRecord, "id" | "createdAt"> & { passwordHash: string },
): UserRecord {
  const store = getStore();
  if (findUserByEmail(input.email)) {
    throw new Error("An account with this email already exists.");
  }

  const user: UserRecord = {
    id: randomUUID(),
    email: input.email.toLowerCase(),
    passwordHash: input.passwordHash,
    name: input.name,
    orgName: input.orgName,
    orgType: input.orgType,
    county: input.county,
    phone: input.phone,
    role: input.role ?? "pbo_user",
    createdAt: new Date().toISOString(),
  };

  store.users.push(user);
  saveStore(store);
  return user;
}

export function updateUser(id: string, patch: Partial<Omit<UserRecord, "id" | "email" | "passwordHash">>) {
  const store = getStore();
  const index = store.users.findIndex((u) => u.id === id);
  if (index === -1) return undefined;

  store.users[index] = { ...store.users[index], ...patch };
  saveStore(store);
  return store.users[index];
}

export function createSubmission(
  input: Omit<SubmissionRecord, "id" | "status" | "createdAt" | "updatedAt">,
): SubmissionRecord {
  const store = getStore();
  const now = new Date().toISOString();
  const submission: SubmissionRecord = {
    ...input,
    id: randomUUID(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  store.submissions.unshift(submission);
  saveStore(store);
  return submission;
}

export function listSubmissionsForUser(userId: string): SubmissionRecord[] {
  return getStore()
    .submissions.filter((s) => s.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function findSubmission(id: string, userId: string): SubmissionRecord | undefined {
  return getStore().submissions.find((s) => s.id === id && s.userId === userId);
}

export function findSubmissionById(id: string): SubmissionRecord | undefined {
  return getStore().submissions.find((s) => s.id === id);
}

export function listAllSubmissions(): SubmissionRecord[] {
  return getStore()
    .submissions.slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function updateSubmissionStatus(
  id: string,
  status: SubmissionStatus,
): SubmissionRecord | undefined {
  const store = getStore();
  const index = store.submissions.findIndex((s) => s.id === id);
  if (index === -1) return undefined;

  store.submissions[index] = {
    ...store.submissions[index],
    status,
    updatedAt: new Date().toISOString(),
  };
  saveStore(store);
  return store.submissions[index];
}

export function createFeedback(input: Omit<FeedbackRecord, "id" | "createdAt">): FeedbackRecord {
  const store = getStore();
  const record: FeedbackRecord = {
    ...input,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
  };
  store.feedback.unshift(record);
  saveStore(store);
  return record;
}
