"use client";
import { useSyncExternalStore } from "react";
import type { ShoppingState } from "../domain/commerce";
import {
  emptyShopping,
  shoppingStorage,
} from "../infrastructure/browser/shopping-storage";

let snapshot = emptyShopping;
let ready = false;
let storageAvailable = true;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((listener) => listener());
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!ready) {
    snapshot = shoppingStorage.read();
    ready = true;
    queueMicrotask(emit);
  }
  const sync = () => {
    snapshot = shoppingStorage.read();
    emit();
  };
  window.addEventListener("storage", sync);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", sync);
  };
}
export function updateShopping(
  updater: (state: ShoppingState) => ShoppingState,
) {
  snapshot = updater(snapshot);
  storageAvailable = shoppingStorage.write(snapshot);
  emit();
}
export function toggleWishlist(productId: string) {
  updateShopping((state) => ({
    ...state,
    wishlist: state.wishlist.includes(productId)
      ? state.wishlist.filter((id) => id !== productId)
      : [...state.wishlist, productId],
  }));
}
export function useShopping() {
  const state = useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => emptyShopping,
  );
  return {
    state,
    ready: useSyncExternalStore(
      subscribe,
      () => ready,
      () => false,
    ),
    storageAvailable,
  };
}
