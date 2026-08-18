import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    orgName?: string;
    role?: "pbo_user";
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
    role?: string;
  }
}
