import { getServices } from "@/services/container";
import { ProductListing } from "@/components/catalog/product-listing";
export const metadata = { title: "Search" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [products, params] = await Promise.all([
    getServices().catalog.getProducts(),
    searchParams,
  ]);
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
      <ProductListing
        products={products}
        search
        initialQuery={typeof params.q === "string" ? params.q : ""}
      />
    </main>
  );
}
