import { getServices } from "@/services/container";
import { CartContents } from "@/components/shopping/cart-contents";
import { HorizontalCarousel } from "@/components/catalog/horizontal-carousel";
import { ProductCard } from "@/components/catalog/product-card";
import { Breadcrumb } from "@/components/ui/shared";
export const metadata = {
  title: "Your Bag",
  description: "Review your saved Styleco pieces before checkout.",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const products = await getServices().catalog.getProducts();
  return (
    <>
      <main id="main-content" className="site-container page-space">
        <Breadcrumb items={[{ label: "Your bag" }]} />
        <header className="page-heading">
          <p className="text-eyebrow">GREAT TASTE, BY THE WAY</p>
          <h1>
            Your bag<span className="orange-period">.</span>
          </h1>
        </header>
        <CartContents />
      </main>
      <HorizontalCarousel
        title="You may also like"
        eyebrow="COMPLETE THE EDIT"
        className="cart-recommendations-carousel"
      >
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </HorizontalCarousel>
    </>
  );
}
