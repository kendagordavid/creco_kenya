import type { NextAuthConfig } from "next-auth";
import { getAuthSecret } from "@/lib/auth-env";
import { isRouteAuthorized } from "@/lib/auth-routes";

export const authConfig = {
  secret: getAuthSecret(),
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
