import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServices } from "@/services/container";
import { ProductDetail } from "@/components/catalog/product-detail";
import { ProductCard } from "@/components/catalog/product-card";
import { HorizontalCarousel } from "@/components/catalog/horizontal-carousel";
import { RecentlyViewed } from "@/components/catalog/recently-viewed";
import { Breadcrumb } from "@/components/ui/shared";
import { Star } from "lucide-react";

export async function generateStaticParams() {
  const products = await getServices().catalog.getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const p = await getServices().catalog.getProductBySlug((await params).slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const socialImage = p?.cardImage?.url ?? p?.images[0]?.url;
  return {
    title: p?.seoTitle ?? p?.name ?? "Product not found",
    description: p?.seoDescription ?? p?.description,
    openGraph: p
      ? {
          title: p.seoTitle ?? p.name,
          description: p.seoDescription ?? p.description,
          images:
            siteUrl && socialImage
              ? [new URL(socialImage, siteUrl).toString()]
              : undefined,
        }
      : undefined,
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { catalog } = getServices();
  const [p, products, categories] = await Promise.all([
    catalog.getProductBySlug(slug),
    catalog.getProducts(),
    catalog.getCategories(),
  ]);
  if (!p) notFound();
  const category = categories.find((c) => p.categoryIds.includes(c.id))!;
  return (
    <main id="main-content">
      <div className="site-container page-space pdp-page">
        <Breadcrumb
          items={[
            { label: category.name, href: `/category/${category.slug}` },
            { label: p.name },
          ]}
        />
        <ProductDetail product={p} />
        <section id="reviews" className="reviews">
          <div>
            <p className="text-eyebrow">WORD ON THE STREET</p>
            <h2>
              Feels as good
              <br />
              as it looks.
            </h2>
            <div className="review-score">
              <Star fill="currentColor" />
              <strong>{p.rating?.toFixed(1)}</strong>
              <span>{p.reviewCount} reviews</span>
            </div>
          </div>
          <div className="review-quotes">
            <blockquote>
              <p>
                “The kind of piece you reach for without thinking. So
                comfortable, and the fit is exactly right.”
              </p>
              <footer>Rafi · Customer review</footer>
            </blockquote>
            <blockquote>
              <p>
                “Simple, but it feels special. Already planning my next color.”
              </p>
              <footer>Nadia · Customer review</footer>
            </blockquote>
          </div>
        </section>
      </div>
      <HorizontalCarousel
        title="You may also like"
        eyebrow="KEEP A GOOD THING GOING"
        className="related-products-carousel"
      >
        {products
          .filter(
            (other) =>
              other.id !== p.id && other.categoryIds.includes(category.id),
          )
          .map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </HorizontalCarousel>
      <RecentlyViewed productId={p.id} products={products} />
    </main>
  );
}
