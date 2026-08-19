#!/usr/bin/env node
/**
 * Apply schema and seed demo users. Run after setting POSTGRES_URL in .env.local.
 *
 * Usage:
 *   npm run db:setup
 *   POSTGRES_URL=postgresql://... npm run db:setup
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postgres from "postgres";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvLocal();

const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Missing POSTGRES_URL or DATABASE_URL.");
  console.error("Add it to .env.local, e.g.:");
  console.error("  POSTGRES_URL=postgresql://postgres:postgres@localhost:5432/creco_pbo");
  process.exit(1);
}

const isLocal = /localhost|127\.0\.0\.1/.test(url);
const sql = postgres(url, {
  ssl: isLocal ? false : "require",
  max: 1,
});

async function main() {
  const schemaPath = path.join(root, "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  await sql.unsafe(schema);
  console.log("Applied schema from db/schema.sql");

  await sql`ALTER TABLE submissions ADD COLUMN IF NOT EXISTS review_comment TEXT`;
  console.log("Ensured submissions.review_comment column");

  const seedPath = path.join(root, "data", "users.seed.json");
  const seedUsers = JSON.parse(fs.readFileSync(seedPath, "utf8"));

  for (const user of seedUsers) {
    await sql`
      INSERT INTO users (
        id,
        email,
        password_hash,
        name,
        org_name,
        org_type,
        county,
        phone,
        role,
        created_at
      )
      VALUES (
        ${user.id},
        ${user.email.toLowerCase()},
        ${user.passwordHash},
        ${user.name},
        ${user.orgName},
        ${user.orgType ?? null},
        ${user.county ?? null},
        ${user.phone ?? null},
        ${user.role ?? "pbo_user"},
        ${user.createdAt ?? new Date().toISOString()}
      )
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        name = EXCLUDED.name,
        org_name = EXCLUDED.org_name,
        org_type = EXCLUDED.org_type,
        county = EXCLUDED.county,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role
    `;
    console.log(`Seeded user: ${user.email}`);
  }

  const storePath = path.join(root, "data", "platform-store.json");
  if (fs.existsSync(storePath)) {
    const store = JSON.parse(fs.readFileSync(storePath, "utf8"));
    for (const user of store.users ?? []) {
      await sql`
        INSERT INTO users (
          id,
          email,
          password_hash,
          name,
          org_name,
          org_type,
          county,
          phone,
          role,
          created_at
        )
        VALUES (
          ${user.id},
          ${user.email.toLowerCase()},
          ${user.passwordHash},
          ${user.name},
          ${user.orgName},
          ${user.orgType ?? null},
          ${user.county ?? null},
          ${user.phone ?? null},
          ${user.role ?? "pbo_user"},
          ${user.createdAt ?? new Date().toISOString()}
        )
        ON CONFLICT (email) DO NOTHING
      `;
      console.log(`Imported user from platform-store.json: ${user.email}`);
    }
  }

  console.log("Database setup complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await sql.end();
  });
