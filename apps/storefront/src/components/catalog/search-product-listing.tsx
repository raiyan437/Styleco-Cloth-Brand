"use client";

import { useSearchParams } from "next/navigation";
import type { Product } from "@/domain/catalog";
import { ProductListing } from "./product-listing";

export function SearchProductListing({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  return (
    <ProductListing
      products={products}
      search
      initialQuery={searchParams.get("q") ?? ""}
    />
  );
}
