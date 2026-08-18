"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect } from "react";
import { prefetchAuthJson } from "@/lib/auth-client";
import { CACHE_TTL } from "@/lib/browser-cache";

function SessionCacheWarmup() {
  useEffect(() => {
    void prefetchAuthJson("/api/profile", CACHE_TTL.profile);
    void prefetchAuthJson("/api/submissions", CACHE_TTL.submissions);
  }, []);

  return null;
}

export function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus>
      {session?.user ? <SessionCacheWarmup /> : null}
      {children}
    </SessionProvider>
  );
}
