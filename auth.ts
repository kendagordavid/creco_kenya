import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { isGoogleAuthEnabled, provisionGoogleUser } from "@/lib/auth-oauth";
import { normalizeRole } from "@/lib/authz";
import { findUserByEmail } from "@/lib/store";

const providers = [
  ...(isGoogleAuthEnabled()
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : []),
  Credentials({
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");

        if (!email || !password) return null;

        try {
          const user = await findUserByEmail(email);
          if (!user) return null;

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            orgName: user.orgName,
            role: normalizeRole(user.role),
          };
        } catch (error) {
          console.error("[auth] credentials authorize failed:", error);
          return null;
        }
      },
    }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      if (!user.email) return false;

      try {
        const dbUser = await provisionGoogleUser({
          email: user.email,
          name: user.name ?? user.email.split("@")[0] ?? "PBO user",
        });
        user.id = dbUser.id;
        user.orgName = dbUser.orgName;
        user.role = normalizeRole(dbUser.role);
        return true;
      } catch (error) {
        console.error("[auth] google sign-in failed:", error);
        return false;
      }
    },
  },
});
