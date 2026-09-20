import type { AdminSession, AdminSnapshot } from "@/domain/admin";
import { createHomepageMediaAssets } from "@/services/admin-media";

export const ADMIN_SESSION_KEY = "styleco-admin-session-v1";
export const ADMIN_SNAPSHOT_KEY = "styleco-admin-state-v1";
export const ADMIN_SNAPSHOT_UPDATED_EVENT = "styleco-admin-snapshot-updated";
export const ADMIN_CREDENTIALS = { username: "admin", password: "admin" };

export function readAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(ADMIN_SESSION_KEY) ?? "null",
    );
    if (
      typeof value !== "object" ||
      value === null ||
      (value as { username?: unknown }).username !== "admin" ||
      (value as { role?: unknown }).role !== "admin"
    )
      return null;
    return value as AdminSession;
  } catch {
    return null;
  }
}

export function writeAdminSession(session: AdminSession) {
  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function clearAdminSession() {
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function readAdminSnapshot(): AdminSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(ADMIN_SNAPSHOT_KEY) ?? "null",
    );
    if (!isAdminSnapshot(value)) return null;
    const migrated = migrateAdminSnapshot(value);
    if (migrated !== value) writeAdminSnapshot(migrated);
    return migrated;
  } catch {
    return null;
  }
}

export function writeAdminSnapshot(snapshot: AdminSnapshot) {
  window.localStorage.setItem(ADMIN_SNAPSHOT_KEY, JSON.stringify(snapshot));
  window.dispatchEvent(new Event(ADMIN_SNAPSHOT_UPDATED_EVENT));
}

export function clearAdminSnapshot() {
  window.localStorage.removeItem(ADMIN_SNAPSHOT_KEY);
  window.dispatchEvent(new Event(ADMIN_SNAPSHOT_UPDATED_EVENT));
}

function isAdminSnapshot(value: unknown): value is AdminSnapshot {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<AdminSnapshot>;
  return (
    Array.isArray(candidate.categories) &&
    Array.isArray(candidate.products) &&
    Array.isArray(candidate.homepageSections) &&
    Array.isArray(candidate.media) &&
    Array.isArray(candidate.orders) &&
    Array.isArray(candidate.activity) &&
    typeof candidate.statuses === "object" &&
    candidate.statuses !== null &&
    typeof candidate.homepageContent === "object" &&
    candidate.homepageContent !== null &&
    typeof candidate.settings === "object" &&
    candidate.settings !== null
  );
}

function migrateAdminSnapshot(snapshot: AdminSnapshot): AdminSnapshot {
  const orders = snapshot.orders.map((order) =>
    order.total > 0 && order.total < 100_000
      ? { ...order, total: order.total * 100 }
      : order,
  );
  const existingMediaIds = new Set(snapshot.media.map((asset) => asset.id));
  const missingHomepageAssets = createHomepageMediaAssets(
    snapshot.homepageContent,
  ).filter((asset) => !existingMediaIds.has(asset.id));

  if (
    orders.every((order, index) => order === snapshot.orders[index]) &&
    missingHomepageAssets.length === 0
  ) {
    return snapshot;
  }

  return {
    ...snapshot,
    orders,
    media: [...snapshot.media, ...missingHomepageAssets],
  };
}
