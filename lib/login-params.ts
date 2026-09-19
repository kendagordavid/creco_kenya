export function safeLoginCallbackUrl(raw: string | undefined | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/profile";
  }
  return raw;
}

export type LoginAuthError =
  | "OAuthAccountNotLinked"
  | "AccessDenied"
  | "OAuthSignin"
  | "OAuthCallback"
  | "Callback"
  | "Configuration"
  | "MissingCSRF"
  | "unknown";

export function parseLoginAuthError(raw: string | undefined | null): LoginAuthError | null {
  switch (raw) {
    case "OAuthAccountNotLinked":
    case "AccessDenied":
    case "OAuthSignin":
    case "OAuthCallback":
    case "Callback":
    case "Configuration":
    case "MissingCSRF":
      return raw;
    default:
      return raw ? "unknown" : null;
  }
}
