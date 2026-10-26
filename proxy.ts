import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { isRouteAuthorized } from "@/lib/auth-routes";
import {
  LOCALE_COOKIE,
  LOCALE_HEADER,
  resolveLocaleFromCookie,
} from "@/lib/i18n/locale-header";

export default NextAuth(authConfig).auth((request) => {
  const { pathname, search } = request.nextUrl;

  if (request.auth && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  if (!isRouteAuthorized(pathname, request.auth)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const locale = resolveLocaleFromCookie(request.cookies.get(LOCALE_COOKIE)?.value);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  // Pages are not cached at the CDN: their language comes from the locale cookie,
  // and Vercel's CDN cannot key a cache on cookies, so one cached copy would be
  // served to every visitor whatever language they chose.
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
});

export const config = {
  matcher: [
    // Keep Auth.js off /api/auth. This middleware rewrites the session cookie
    // on every matched request, and on the credentials callback that rewrite
    // clears the cookie the sign-in handler just set.
    "/((?!api/auth|_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|pdf)$).*)",
  ],
};
