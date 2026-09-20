"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ProductDetail } from "./product-detail";
import { useStorefrontCatalog } from "../storefront-catalog-provider";
import { Breadcrumb, EmptyState } from "../ui/shared";

export function AdminProductPreview() {
  const searchParams = useSearchParams();
  const { previewProductById, ready } = useStorefrontCatalog();
  const id = searchParams.get("id") ?? "";
  const product = previewProductById(id);

  if (!ready) {
    return (
      <div className="product-grid-skeleton" aria-label="Loading product" />
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="This product preview is unavailable."
        description="Publish the product in Admin, then return to its storefront preview."
        href="/new-arrivals"
        label="Browse new arrivals"
      />
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Shop", href: "/new-arrivals" },
          { label: product.name },
        ]}
      />
      <ProductDetail product={product} />
      <p className="admin-preview-return">
        <Link href="/admin/products">Return to product administration</Link>
      </p>
    </>
  );
}
