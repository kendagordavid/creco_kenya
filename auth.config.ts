import type { NextAuthConfig } from "next-auth";
import { getAuthSecret } from "@/lib/auth-env";
import { isRouteAuthorized } from "@/lib/auth-routes";

const authSecret = getAuthSecret();

if (!authSecret && process.env.NODE_ENV === "production") {
  console.error("[auth] AUTH_SECRET is missing — sign-in and sign-out will not work reliably.");
}

export const authConfig = {
  secret: authSecret,
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // Avoid __Host- CSRF cookies on Vercel. Browsers reject them if the host/proxy
  // does not meet the prefix rules, which shows up as MissingCSRF in production only.
  cookies: {
    csrfToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-authjs.csrf-token" : "authjs.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      return isRouteAuthorized(request.nextUrl.pathname, auth);
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.orgName = user.orgName;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.orgName = token.orgName as string | undefined;
        session.user.role = token.role;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
