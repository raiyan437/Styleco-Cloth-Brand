import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin studio",
    template: "%s | Styleco Admin",
  },
  description: "Styleco content management workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="admin-route-root">{children}</div>;
}
