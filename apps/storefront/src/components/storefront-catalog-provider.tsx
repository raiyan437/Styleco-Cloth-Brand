"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/domain/catalog";
import {
  readAdminCatalog,
  STOREFRONT_CATALOG_UPDATED_EVENT,
} from "@/services/browser-admin-catalog";
import { CommerceProvider } from "./commerce-provider";

interface StorefrontCatalogValue {
  products: Product[];
  ready: boolean;
  productById: (id: string) => Product | undefined;
  previewProductById: (id: string) => Product | undefined;
}

const StorefrontCatalogContext = createContext<StorefrontCatalogValue | null>(
  null,
);

export function StorefrontCatalogProvider({
  initialProducts,
  children,
}: {
  initialProducts: Product[];
  children: ReactNode;
}) {
  const [products, setProducts] = useState(initialProducts);
  const [previewProducts, setPreviewProducts] = useState(initialProducts);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let releaseTimer: number | undefined;
    const sync = () => {
      const catalog = readAdminCatalog(initialProducts);
      setProducts(catalog.published);
      setPreviewProducts(catalog.all);
      if (releaseTimer) window.clearTimeout(releaseTimer);
      if (catalog.nextReleaseAt) {
        releaseTimer = window.setTimeout(
          sync,
          Math.min(
            Math.max(50, catalog.nextReleaseAt - Date.now() + 50),
            2_147_000_000,
          ),
        );
      }
    };
    const frame = window.requestAnimationFrame(() => {
      sync();
      setReady(true);
    });
    window.addEventListener("storage", sync);
    window.addEventListener(STOREFRONT_CATALOG_UPDATED_EVENT, sync);
    return () => {
      window.cancelAnimationFrame(frame);
      if (releaseTimer) window.clearTimeout(releaseTimer);
      window.removeEventListener("storage", sync);
      window.removeEventListener(STOREFRONT_CATALOG_UPDATED_EVENT, sync);
    };
  }, [initialProducts]);

  const value = useMemo<StorefrontCatalogValue>(() => {
    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );
    const previewProductsById = new Map(
      previewProducts.map((product) => [product.id, product]),
    );
    return {
      products,
      ready,
      productById: (id) => productsById.get(id),
      previewProductById: (id) => previewProductsById.get(id),
    };
  }, [previewProducts, products, ready]);

  return (
    <StorefrontCatalogContext.Provider value={value}>
      <CommerceProvider products={products}>{children}</CommerceProvider>
    </StorefrontCatalogContext.Provider>
  );
}

export function useStorefrontCatalog() {
  const context = useContext(StorefrontCatalogContext);
  if (!context) throw new Error("StorefrontCatalogProvider is required");
  return context;
}
