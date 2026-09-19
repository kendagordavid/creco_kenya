import type { NextAuthConfig } from "next-auth";
import { getAuthSecret } from "@/lib/auth-env";
import { isRouteAuthorized } from "@/lib/auth-routes";

const authSecret = getAuthSecret();
const useSecureCookies = process.env.NODE_ENV === "production";
const sessionMaxAge = 30 * 24 * 60 * 60;

if (!authSecret && process.env.NODE_ENV === "production") {
  console.error("[auth] AUTH_SECRET is missing — sign-in and sign-out will not work reliably.");
}

function authCookie(name: string, maxAge?: number) {
  return {
    // Auth.js defaults some cookies to `__Host-*` over HTTPS. Browsers reject
    // that prefix on Vercel (`*.vercel.app`). `__Secure-` is valid there.
    name: useSecureCookies ? `__Secure-${name}` : name,
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      secure: useSecureCookies,
      ...(maxAge != null ? { maxAge } : {}),
    },
  };
}

export const authConfig = {
  secret: authSecret,
  trustHost: true,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  cookies: {
    sessionToken: authCookie("authjs.session-token", sessionMaxAge),
    callbackUrl: authCookie("authjs.callback-url"),
    csrfToken: authCookie("authjs.csrf-token"),
    pkceCodeVerifier: authCookie("authjs.pkce.code_verifier", 60 * 15),
    state: authCookie("authjs.state", 60 * 15),
    nonce: authCookie("authjs.nonce", 60 * 15),
  },
  session: {
    strategy: "jwt",
    maxAge: sessionMaxAge,
    updateAge: 24 * 60 * 60,
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
