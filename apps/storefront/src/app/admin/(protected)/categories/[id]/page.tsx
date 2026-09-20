import { AdminCategoryDetailClient } from "./client";

export function generateStaticParams() {
  return ["shirt", "katua", "t-shirt", "pant", "sleepwear"].map((id) => ({
    id,
  }));
}

export default function AdminCategoryDetailPage() {
  return <AdminCategoryDetailClient />;
}
