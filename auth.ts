import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";
import { isGoogleAuthEnabled, provisionGoogleUser } from "@/lib/auth-oauth";
import { createGoogleProvider } from "@/lib/google-provider";
import { normalizeRole } from "@/lib/authz";
import { verifyMfaCode } from "@/lib/mfa";
import { getAccountState } from "@/lib/staff-store";
import { findUserByEmail, findUserById } from "@/lib/store";

/** Password was right; the account has MFA on and no code was sent. The form asks for one. */
class MfaRequired extends CredentialsSignin {
  code = "mfa_required";
}

class MfaInvalid extends CredentialsSignin {
  code = "mfa_invalid";
}

class AccountDisabled extends CredentialsSignin {
  code = "account_disabled";
}

/** How often a signed-in session re-reads role and disabled state from the database. */
const ACCOUNT_RECHECK_MS = 60 * 1000;

const providers = [
  ...(isGoogleAuthEnabled()
    ? [
        createGoogleProvider(),
      ]
    : []),
  Credentials({
    name: "Email and password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
      code: { label: "Authenticator code", type: "text" },
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

        if (user.disabledAt) throw new AccountDisabled();

        if (user.mfaEnabled) {
          const code = String(credentials?.code ?? "").trim();
          if (!code) throw new MfaRequired();
          if (!(await verifyMfaCode(user.id, code))) throw new MfaInvalid();
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          orgName: user.orgName,
          role: normalizeRole(user.role),
        };
      } catch (error) {
        if (error instanceof CredentialsSignin) throw error;
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.orgName = user.orgName;
        token.role = user.role;
        token.checkedAt = Date.now();
        if (user.name) token.name = user.name;
        return token;
      }

      // Pick up role changes and disabled accounts from the staff console without
      // waiting for the 30-day session to expire.
      if (token.id && Date.now() - (token.checkedAt ?? 0) > ACCOUNT_RECHECK_MS) {
        try {
          const state = await getAccountState(String(token.id));
          if (!state || state.disabled) return null;
          token.role = state.role;
          token.checkedAt = Date.now();
        } catch (error) {
          // Keep the session if the database is briefly unreachable.
          console.error("[auth] account recheck failed:", error);
        }
      }

      const label = `${token.name ?? ""} ${token.orgName ?? ""}`;
      if (token.id && /creco|mashariki/i.test(label)) {
        const dbUser = await findUserById(String(token.id));
        if (dbUser) {
          token.name = dbUser.name;
          token.orgName = dbUser.orgName;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.orgName = token.orgName as string | undefined;
        session.user.role = token.role;
        if (typeof token.name === "string") session.user.name = token.name;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (account?.provider !== "google") return true;

      if (!user.email) return false;

      try {
        const dbUser = await provisionGoogleUser({
          email: user.email,
          name: user.name ?? user.email.split("@")[0] ?? "PBO user",
        });
        if (dbUser.disabledAt) return false;
        // Google sign-in would skip the authenticator code, so MFA accounts use email + password.
        if (dbUser.mfaEnabled) return "/login?error=MfaUseEmail";
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
