import { Suspense } from "react";
import { AdminProductPreview } from "@/components/catalog/admin-product-preview";

export const metadata = {
  title: "Product Preview",
  robots: { index: false, follow: false },
};

export default function ProductPreviewPage() {
  return (
    <main id="main-content">
      <div className="site-container page-space pdp-page">
        <Suspense
          fallback={
            <div
              className="product-grid-skeleton"
              aria-label="Loading product"
            />
          }
        >
          <AdminProductPreview />
        </Suspense>
      </div>
    </main>
  );
}
