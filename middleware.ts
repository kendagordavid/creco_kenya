import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/auth.config";
import { isRouteAuthorized } from "@/lib/auth-routes";
import { PUBLIC_CACHE } from "@/lib/cache/headers";
import { isPublicCacheablePath } from "@/lib/cache/public-paths";
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

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  if (isPublicCacheablePath(pathname) && !request.auth) {
    response.headers.set("Cache-Control", PUBLIC_CACHE.publicPage);
    response.headers.set("CDN-Cache-Control", PUBLIC_CACHE.publicPage);
    response.headers.set("Vary", "Cookie");
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|pdf)$).*)",
  ],
};
