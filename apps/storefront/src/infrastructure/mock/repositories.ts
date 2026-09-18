import type { CatalogRepository } from "../../repositories/catalog-repository";
import type { HomepageRepository } from "../../repositories/homepage-repository";
import {
  categories,
  products,
  homepageSections,
  homepageContent,
} from "./data";

export const mockCatalogRepository: CatalogRepository = {
  async listProducts() {
    return structuredClone(products);
  },
  async listCategories() {
    return structuredClone(categories);
  },
  async getProductsByIds(ids) {
    return structuredClone(
      products.filter((product) => ids.includes(product.id)),
    );
  },
  async getProductBySlug(slug) {
    return structuredClone(
      products.find((product) => product.slug === slug) ?? null,
    );
  },
};

export const mockHomepageRepository: HomepageRepository = {
  async getContent() {
    return structuredClone(homepageContent);
  },
  async listSections() {
    return structuredClone(homepageSections);
  },
};
