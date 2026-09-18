import { Suspense } from "react";
import { getServices } from "@/services/container";
import { SearchProductListing } from "@/components/catalog/search-product-listing";
export const metadata = { title: "Search" };
export default async function Page() {
  const products = await getServices().catalog.getProducts();
  return (
    <main id="main-content" className="site-container page-space">
      <header className="listing-heading">
        <div>
          <p className="text-eyebrow">SOMETHING GOOD IS WAITING</p>
          <h1>
            Find your thing<span className="orange-period">.</span>
          </h1>
        </div>
      </header>
      <Suspense fallback={<div className="state-loading">Loading search…</div>}>
        <SearchProductListing products={products} />
      </Suspense>
    </main>
  );
}
