import type { NextAuthConfig } from "next-auth";
import { isSuperuser } from "@/lib/authz";

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (pathname === "/admin" || pathname.startsWith("/admin/")) {
        return isSuperuser(auth?.user?.role);
      }

      const protectedPrefixes = [
        "/monitoring/registration",
        "/monitoring/enabling",
        "/monitoring/incident",
        "/monitoring/upload",
        "/monitoring/confirmation",
        "/monitoring/submissions",
        "/profile",
        "/profile/account",
      ];

      const isProtected = protectedPrefixes.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
      );

      if (isProtected) return !!auth;
      return true;
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
