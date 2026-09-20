import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StorefrontCatalogProvider } from "@/components/storefront-catalog-provider";
import { CustomCursor } from "@/components/custom-cursor";
import { getServices } from "@/services/container";

export default async function StorefrontLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await getServices().catalog.getProducts();

  return (
    <>
      <CustomCursor />
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <StorefrontCatalogProvider initialProducts={products}>
        <SiteHeader />
        {children}
        <SiteFooter />
      </StorefrontCatalogProvider>
    </>
  );
}
