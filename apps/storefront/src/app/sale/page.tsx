import { getServices } from "@/services/container";
import { isSale } from "@/services/catalog-query";
import { ProductListing } from "@/components/catalog/product-listing";
import { Breadcrumb } from "@/components/ui/shared";
export const metadata = { title: "Sale" };
export default async function Page() {
  const products = await getServices().catalog.getProducts();
  return (
    <main id="main-content" className="site-container page-space">
      <Breadcrumb items={[{ label: "Sale" }]} />
      <header className="listing-heading">
        <div>
          <p className="text-eyebrow">GOOD FINDS. BETTER PRICES.</p>
          <h1>
            The sale edit<span className="orange-period">.</span>
          </h1>
        </div>
        <p>
          Same great pieces. A little less.
          <br />
          Your next favorite is waiting.
        </p>
      </header>
      <ProductListing products={products.filter(isSale)} />
    </main>
  );
}
