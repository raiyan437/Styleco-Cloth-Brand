import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getServices } from "@/services/container";
import { ProductListing } from "@/components/catalog/product-listing";
import { Breadcrumb } from "@/components/ui/shared";

export async function generateStaticParams() {
  const categories = await getServices().catalog.getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const category = await getServices().catalog.getCategory((await params).slug);
  return { title: category?.name ?? "Collection not found" };
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServices().catalog;
  const [category, products] = await Promise.all([
    service.getCategory(slug),
    service.getProducts(),
  ]);
  if (!category) notFound();
  return (
    <main id="main-content" className="site-container page-space">
      <Breadcrumb items={[{ label: category.name }]} />
      <header className="listing-heading">
        <div>
          <p className="text-eyebrow">THE EVERYDAY COLLECTION</p>
          <h1>
            {category.name}
            <span className="orange-period">.</span>
          </h1>
        </div>
        <p>
          Easy silhouettes. Considered details.
          <br />
          Your everyday, just a little better.
        </p>
      </header>
      <ProductListing
        products={products.filter((p) => p.categoryIds.includes(category.id))}
      />
    </main>
  );
}
