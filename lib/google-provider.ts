import Google from "next-auth/providers/google";

function firstEnv(...keys: string[]): string {
  for (const key of keys) {
    const value = process.env[key]?.trim() ?? "";
    if (value) return value;
  }
  return "";
}

/** Google OAuth with explicit endpoints so sign-in does not depend on OIDC discovery fetch. */
export function createGoogleProvider() {
  return Google({
    clientId: firstEnv("GOOGLE_CLIENT_ID", "AUTH_GOOGLE_ID"),
    clientSecret: firstEnv("GOOGLE_CLIENT_SECRET", "AUTH_GOOGLE_SECRET"),
    allowDangerousEmailAccountLinking: true,
    authorization: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
  });
}
