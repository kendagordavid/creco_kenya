"use client";

import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useEffect } from "react";
import { prefetchAuthJson } from "@/lib/auth-client";
import { isSuperuser } from "@/lib/authz";
import { CACHE_TTL } from "@/lib/browser-cache";

function SessionCacheWarmup() {
  const { data: session } = useSession();

  useEffect(() => {
    void prefetchAuthJson("/api/profile", CACHE_TTL.profile);
    void prefetchAuthJson("/api/submissions", CACHE_TTL.submissions);
    if (isSuperuser(session?.user?.role)) {
      void prefetchAuthJson("/api/admin/compliance", CACHE_TTL.admin);
    }
  }, [session?.user?.role]);

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
