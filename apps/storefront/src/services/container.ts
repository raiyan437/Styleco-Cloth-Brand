import "server-only";
import { parseEnvironment } from "../config/env";
import {
  mockCatalogRepository,
  mockHomepageRepository,
} from "../infrastructure/mock/repositories";
import { CatalogService } from "./catalog-service";
import { HomepageService } from "./homepage-service";

export function getServices() {
  const env = parseEnvironment(process.env);
  if (env.CATALOG_PROVIDER === "appwrite") {
    throw new Error(
      "The Appwrite adapter is not implemented yet. Use CATALOG_PROVIDER=mock for Phase 0.",
    );
  }
  return {
    catalog: new CatalogService(mockCatalogRepository),
    homepage: new HomepageService(
      mockHomepageRepository,
      mockCatalogRepository,
    ),
  };
}
