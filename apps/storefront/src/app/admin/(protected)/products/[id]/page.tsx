import { AdminProductDetailClient } from "./client";

export function generateStaticParams() {
  return [
    "shirt-1",
    "shirt-2",
    "shirt-3",
    "shirt-4",
    "shirt-5",
    "katua-1",
    "katua-2",
    "katua-3",
    "katua-4",
    "katua-5",
    "t-shirt-1",
    "t-shirt-2",
    "t-shirt-3",
    "t-shirt-4",
    "t-shirt-5",
    "pant-1",
    "pant-2",
    "pant-3",
    "pant-4",
    "pant-5",
    "sleepwear-1",
    "sleepwear-2",
    "sleepwear-3",
    "sleepwear-4",
    "sleepwear-5",
  ].map((id) => ({ id }));
}

export default function AdminProductDetailPage() {
  return <AdminProductDetailClient />;
}
