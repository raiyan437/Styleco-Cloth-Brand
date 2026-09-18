import { getServices } from "@/services/container";
import { ProductListing } from "@/components/catalog/product-listing";
import { Breadcrumb } from "@/components/ui/shared";
export const metadata = { title: "New Arrivals" };
export default async function Page() {
  const products = await getServices().catalog.getProducts();
  return (
    <main id="main-content" className="site-container page-space">
      <Breadcrumb items={[{ label: "New Arrivals" }]} />
      <header className="listing-heading">
        <div>
          <p className="text-eyebrow">FRESH INTO THE ROTATION</p>
          <h1>
            New arrivals<span className="orange-period">.</span>
          </h1>
        </div>
        <p>
          A fresh perspective on your everyday.
          <br />
          Find the pieces that feel like you.
        </p>
      </header>
      <ProductListing products={products.filter((p) => p.isNew)} />
    </main>
  );
}
