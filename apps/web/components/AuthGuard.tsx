"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { api, clearToken, getToken, type AuthUser } from "@/lib/api";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "ready">("checking");

  useEffect(() => {
    let alive = true;

    async function verify() {
      const token = getToken();
      if (!token) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        await api<{ user: AuthUser }>("/api/auth/me");
        if (alive) setStatus("ready");
      } catch {
        clearToken();
        router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
      }
    }

    verify();
    return () => {
      alive = false;
    };
  }, [pathname, router]);

  if (status === "checking") {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 text-ink dark:bg-ink dark:text-white">
        <div className="rounded-md border border-slate-200 bg-white px-5 py-4 text-sm font-semibold shadow-sm dark:border-slate-800 dark:bg-slate-950">
          Checking your session
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
