import Image from "next/image";
import Link from "next/link";
import { getServices } from "@/services/container";
import { ProductCard } from "@/components/catalog/product-card";
import { HorizontalCarousel } from "@/components/catalog/horizontal-carousel";
import { isSale } from "@/services/catalog-query";
import { localAssetPath } from "@/config/site";

export default async function HomePage() {
  const { catalog, homepage } = getServices();
  const [categories, sections, content, products] = await Promise.all([
    catalog.getCategories(),
    homepage.getSections(),
    homepage.getContent(),
    catalog.getProducts(),
  ]);
  const best = sections.find((s) => s.id === "top-sellers");
  const latest = sections.find((s) => s.id === "latest-products");
  const bestProducts =
    best?.kind === "curated-products" ? best.resolvedProducts : [];
  const highlights =
    latest?.kind === "curated-products" ? latest.resolvedProducts : [];
  const saleProducts = products.filter(isSale);
  return (
    <main id="main-content" className="reference-home">
      <h1 className="sr-only">Styleco — clothing for every day</h1>
      <section
        className="fashion-panels site-container"
        aria-label="Shop the collections"
      >
        {categories.map((category, index) => (
          <Link
            href={"/category/" + category.slug}
            className="fashion-panel"
            key={category.id}
          >
            {category.image && (
              <Image
                src={category.image.url}
                alt={category.image.alt}
                fill
                quality={85}
                sizes="(max-width: 600px) 50vw, 42vw"
                priority={index === 0}
              />
            )}
            <span>{category.name}</span>
          </Link>
        ))}
      </section>
      {saleProducts.length > 0 && (
        <HorizontalCarousel
          title="Current Sale"
          eyebrow="Save on selected styles"
          className="reference-carousel sale-carousel"
        >
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalCarousel>
      )}
      {bestProducts.length > 0 && (
        <HorizontalCarousel
          title="Best Sellers"
          eyebrow="Most loved right now"
          className="reference-carousel best-sellers-carousel"
        >
          {bestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalCarousel>
      )}
      <section className="luxury-banner">
        <Image
          src={content.hero.image}
          alt={content.hero.alt}
          fill
          quality={88}
          sizes="100vw"
        />
        <div className="photo-copy">
          <h2>
            Explore Current
            <br />
            Sale
          </h2>
          <p>Discover a wardrobe made for you</p>
          <Link href="/sale" className="button">
            Explore Now
          </Link>
        </div>
      </section>
      {highlights.length > 0 && (
        <HorizontalCarousel
          title="Latest Products"
          eyebrow="New into the collection"
          className="reference-carousel latest-products-carousel"
        >
          {highlights.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </HorizontalCarousel>
      )}
      <div className="shipping-strip">
        <span>FREE STANDARD DELIVERY ON ORDERS ৳3,000+</span>
      </div>
      <section
        className="reference-section site-container"
        aria-labelledby="seasonal-heading"
      >
        <p className="text-eyebrow">Deals</p>
        <h2 id="seasonal-heading">Seasonal styles</h2>
        <div className="seasonal-grid">
          <Link href="/sale" className="seasonal-large">
            <Image
              src={localAssetPath("/images/shirt.webp")}
              alt="Relaxed shirt from the seasonal edit"
              fill
              sizes="(max-width: 600px) 100vw, 50vw"
            />
            <div className="photo-copy">
              <h3>
                Find your next
                <br />
                favorite
              </h3>
              <p>Explore the seasonal sale edit</p>
              <span className="button">Explore Now</span>
            </div>
          </Link>
          {content.campaigns.slice(0, 2).map((campaign, index) => (
            <Link
              href={campaign.href}
              className="seasonal-small"
              key={campaign.href}
            >
              <Image
                src={campaign.image}
                alt={campaign.alt}
                fill
                sizes="(max-width: 600px) 100vw, 50vw"
              />
              <h3>
                {index === 0
                  ? "The Katua Collection"
                  : "Made for slow mornings"}
              </h3>
            </Link>
          ))}
        </div>
      </section>
      <section
        className="reference-section brand-section site-container"
        aria-labelledby="brand-heading"
      >
        <p className="text-eyebrow">About us</p>
        <h2 id="brand-heading">Behind The Brand</h2>
        <div className="brand-story">
          <div className="brand-photo">
            <Image
              src={localAssetPath("/images/katua.webp")}
              alt="Styleco cotton Katua, designed for everyday comfort"
              fill
              sizes="(max-width: 600px) 100vw, 55vw"
            />
          </div>
          <div className="brand-copy">
            <p>
              Mission
              <br />
              Values
              <br />
              <strong>Our story</strong>
            </p>
            <div>
              <h3>Clothes to feel yourself in.</h3>
              <p>
                Familiar shapes, considered details, and comfort that stays with
                you. Discover the everyday world of Styleco.
              </p>
              <Link href="/about" className="underlined">
                Discover our story
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
