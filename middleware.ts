import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/monitoring/registration/:path*",
    "/monitoring/enabling/:path*",
    "/monitoring/incident/:path*",
    "/monitoring/upload/:path*",
    "/monitoring/confirmation/:path*",
    "/monitoring/submissions/:path*",
    "/profile",
    "/profile/account",
    "/profile/:path*",
  ],
};
