import postgres from "postgres";

function getDatabaseUrl(): string {
  const url = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "Database URL missing. Set POSTGRES_URL (or DATABASE_URL) in .env.local for local dev, or link Neon in Vercel.",
    );
  }
  return url;
}

function isLocalDatabase(url: string): boolean {
  return /localhost|127\.0\.0\.1/.test(url);
}

declare global {
  // eslint-disable-next-line no-var
  var __crecoSql: ReturnType<typeof postgres> | undefined;
}

export function getSql() {
  if (!globalThis.__crecoSql) {
    const url = getDatabaseUrl();
    globalThis.__crecoSql = postgres(url, {
      ssl: isLocalDatabase(url) ? false : "require",
      max: isLocalDatabase(url) ? 10 : 1,
    });
  }
  return globalThis.__crecoSql;
}
