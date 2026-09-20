import { ProductCardSkeleton } from "@/components/ui/shared";

export default function Loading() {
  return (
    <main
      id="main-content"
      className="site-container page-space"
      aria-busy="true"
      aria-label="Loading collection"
    >
      <div className="loading-heading" />
      <div className="loading-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
