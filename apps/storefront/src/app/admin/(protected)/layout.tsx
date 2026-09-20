import { AdminAuthGuard } from "@/components/admin/admin-auth-guard";
import { AdminProvider } from "@/components/admin/admin-provider";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSnapshot } from "@/services/admin-snapshot";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const snapshot = await getAdminSnapshot();
  return (
    <AdminProvider initialSnapshot={snapshot}>
      <AdminAuthGuard>
        <AdminShell>{children}</AdminShell>
      </AdminAuthGuard>
    </AdminProvider>
  );
}
