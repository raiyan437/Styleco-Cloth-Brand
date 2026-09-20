import { AdminOrderDetailClient } from "./client";

export function generateStaticParams() {
  return [{ id: "SC-1048" }, { id: "SC-1047" }];
}

export default function AdminOrderDetailPage() {
  return <AdminOrderDetailClient />;
}
