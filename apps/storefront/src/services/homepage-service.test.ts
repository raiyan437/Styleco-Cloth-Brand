import { describe, expect, it } from "vitest";
import type { Product } from "../domain/catalog";
import { HomepageService } from "./homepage-service";
import { mockCatalogRepository } from "../infrastructure/mock/repositories";
import { parseEnvironment } from "../config/env";

describe("homepage curation", () => {
  it("filters disabled sections, orders sections and resolves curated order while skipping missing products", async () => {
    const product = (id: string): Product => ({
      id,
      slug: id,
      name: id,
      categoryIds: [],
      images: [],
      variants: [],
    });
    const service = new HomepageService(
      {
        async listSections() {
          return [
            {
              id: "hidden",
              title: "Hidden",
              kind: "categories",
              enabled: false,
              position: 0,
            },
            {
              id: "latest",
              title: "Latest Products",
              kind: "curated-products",
              enabled: true,
              position: 2,
              products: [
                { productId: "a", position: 2 },
                { productId: "missing", position: 1 },
                { productId: "b", position: 0 },
              ],
            },
            {
              id: "categories",
              title: "Categories",
              kind: "categories",
              enabled: true,
              position: 1,
            },
          ];
        },
      },
      {
        ...mockCatalogRepository,
        async getProductsByIds() {
          return [product("a"), product("b")];
        },
      },
    );
    const sections = await service.getSections();
    expect(sections.map((section) => section.id)).toEqual([
      "categories",
      "latest",
    ]);
    const latest = sections[1];
    expect(latest?.kind).toBe("curated-products");
    if (latest?.kind === "curated-products") {
      expect(latest.resolvedProducts.map((item) => item.id)).toEqual([
        "b",
        "a",
      ]);
    }
  });

  it("defaults to mock without credentials and rejects unknown providers", () => {
    expect(parseEnvironment({}).CATALOG_PROVIDER).toBe("mock");
    expect(() => parseEnvironment({ CATALOG_PROVIDER: "unknown" })).toThrow();
  });
});
