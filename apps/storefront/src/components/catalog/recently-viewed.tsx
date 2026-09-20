"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/domain/catalog";
import { HorizontalCarousel } from "./horizontal-carousel";
import { ProductCard } from "./product-card";

const RECENTLY_VIEWED_KEY = "styleco-recently-viewed-v1";

export function RecentlyViewed({
  productId,
  products,
}: {
  productId: string;
  products: Product[];
}) {
  const [viewedIds, setViewedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const stored = JSON.parse(
          window.localStorage.getItem(RECENTLY_VIEWED_KEY) ?? "[]",
        );
        const previous = Array.isArray(stored)
          ? stored.filter((value): value is string => typeof value === "string")
          : [];
        const next = [
          productId,
          ...previous.filter((id) => id !== productId),
        ].slice(0, 7);
        window.localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
        setViewedIds(next.filter((id) => id !== productId));
      } catch {
        setViewedIds([]);
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [productId]);

  if (!ready) return null;
  const viewed = viewedIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  if (!viewed.length) return null;
  const clearViewed = () => {
    try {
      window.localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch {
      /* The section can still be cleared for this render. */
    }
    setViewedIds([]);
  };

  return (
    <HorizontalCarousel
      title="Recently viewed"
      eyebrow="A LITTLE SOMETHING TO REMEMBER"
      className="recently-viewed-carousel"
      headerAction={
        <button
          type="button"
          className="carousel-header-action"
          onClick={clearViewed}
        >
          Clear
        </button>
      }
    >
      {viewed.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </HorizontalCarousel>
  );
}
