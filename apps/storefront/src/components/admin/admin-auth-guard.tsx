"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { readAdminSession } from "@/infrastructure/browser/admin-storage";

export function AdminAuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const frame = window.requestAnimationFrame(() => {
      if (cancelled) return;
      if (readAdminSession()) setAuthorized(true);
      else router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
    };
  }, [pathname, router]);

  if (authorized !== true) {
    return (
      <div className="admin-loading-screen" aria-busy="true">
        <span className="admin-loading-mark" aria-hidden="true">
          S
        </span>
        <p>Checking your workspace…</p>
      </div>
    );
  }

  return children;
}
