import type { Product } from "@/domain/catalog";
import {
  ADMIN_SNAPSHOT_UPDATED_EVENT,
  readAdminSnapshot,
} from "@/infrastructure/browser/admin-storage";

export const STOREFRONT_CATALOG_UPDATED_EVENT = ADMIN_SNAPSHOT_UPDATED_EVENT;

export function readAdminCatalog(fallback: Product[]) {
  const snapshot = readAdminSnapshot();
  if (!snapshot)
    return { published: fallback, all: fallback, nextReleaseAt: undefined };

  const now = Date.now();
  let nextReleaseAt: number | undefined;
  const published = snapshot.products.filter((product) => {
    const status = snapshot.statuses[`product:${product.id}`] ?? "published";
    if (status === "published") return true;
    if (status !== "scheduled" || !product.releasedAt) return false;
    const releaseTime = new Date(product.releasedAt).getTime();
    if (releaseTime > now) {
      nextReleaseAt = Math.min(nextReleaseAt ?? releaseTime, releaseTime);
      return false;
    }
    return true;
  });

  return { published, all: snapshot.products, nextReleaseAt };
}
