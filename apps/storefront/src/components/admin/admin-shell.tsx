"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Boxes,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Settings,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { clearAdminSession } from "@/infrastructure/browser/admin-storage";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/activity-log", label: "Activity log", icon: Activity },
];

function formatBreadcrumb(pathname: string) {
  const segments = pathname.replace(/^\/admin\/?/, "").split("/");
  const visibleSegments = segments.filter(Boolean);
  if (!visibleSegments.length) return "Overview";

  return visibleSegments
    .map((segment) =>
      segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .join(" / ");
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function signOut() {
    clearAdminSession();
    router.replace("/admin/login");
  }

  return (
    <div className="admin-shell">
      <button
        type="button"
        className="admin-mobile-menu"
        aria-label={open ? "Close admin navigation" : "Open admin navigation"}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {open && (
        <button
          type="button"
          className="admin-nav-scrim"
          aria-label="Close admin navigation"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`admin-sidebar${open ? " is-open" : ""}`}>
        <div className="admin-brand">
          <span className="admin-brand-mark">S</span>
          <span>
            <strong>Styleco</strong>
            <small>Admin studio</small>
          </span>
        </div>
        <nav aria-label="Admin navigation" className="admin-nav">
          <p className="admin-nav-label">Workspace</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`admin-nav-link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{label}</span>
                {active && (
                  <ChevronRight size={15} className="admin-nav-arrow" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <span className="admin-online-dot" aria-hidden="true" />
          <span>Local demo workspace</span>
        </div>
      </aside>
      <div className="admin-main-shell">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-kicker">STYLECO / CONTROL ROOM</span>
            <span className="admin-topbar-path" aria-hidden="true">
              {formatBreadcrumb(pathname)}
            </span>
          </div>
          <div className="admin-topbar-actions">
            <Link href="/" className="admin-storefront-link">
              <ExternalLink size={14} />
              <span>View storefront</span>
            </Link>
            <span className="admin-user-chip">
              <span className="admin-avatar">A</span>
              <span>Admin</span>
            </span>
            <button
              type="button"
              className="admin-icon-button"
              onClick={signOut}
            >
              <LogOut size={17} />
              <span className="sr-only">Sign out</span>
            </button>
          </div>
        </header>
        <main className="admin-main" id="admin-main-content">
          {children}
        </main>
      </div>
    </div>
  );
}
