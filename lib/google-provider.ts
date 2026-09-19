import Google from "next-auth/providers/google";
import { getGoogleClientId, getGoogleClientSecret } from "@/lib/auth-oauth";

export function createGoogleProvider() {
  return Google({
    clientId: getGoogleClientId(),
    clientSecret: getGoogleClientSecret(),
    allowDangerousEmailAccountLinking: true,
  });
}
