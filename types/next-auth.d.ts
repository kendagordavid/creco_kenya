import "next-auth";
import "next-auth/jwt";
import type { UserRole } from "@/lib/authz";

declare module "next-auth" {
  interface User {
    id: string;
    orgName?: string;
    role?: UserRole;
  }

  interface Session {
    user: User & {
      email?: string | null;
      name?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    orgName?: string;
    role?: UserRole;
  }
}
