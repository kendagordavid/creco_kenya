import Google from "next-auth/providers/google";

/** Google OAuth with explicit endpoints so sign-in does not depend on OIDC discovery fetch. */
export function createGoogleProvider() {
  return Google({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    allowDangerousEmailAccountLinking: true,
    authorization: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
  });
}
