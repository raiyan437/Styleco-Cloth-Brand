"use client";
import { useCommerce } from "../commerce-provider";
import { useShopping } from "@/services/shopping-store";
import { ProductCard } from "../catalog/product-card";
import { EmptyState } from "../ui/shared";
export function Wishlist() {
  const { products } = useCommerce();
  const { state, ready } = useShopping();
  if (!ready) return <p>Opening your edit…</p>;
  const saved = products.filter((p) => state.wishlist.includes(p.id));
  return saved.length ? (
    <>
      <p className="muted wishlist-summary">
        {saved.length} favorites, saved on this device.
      </p>
      <div className="product-grid wishlist-grid">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  ) : (
    <EmptyState
      title="Keep the good ones close."
      description="Tap the heart on a piece you love. We'll save your edit right here, on this device."
    />
  );
}
