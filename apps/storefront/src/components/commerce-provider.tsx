"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import type { Product } from "@/domain/catalog";
import { useShopping, updateShopping } from "@/services/shopping-store";
import {
  normalizeCart,
  setCartQuantity,
  stockFor,
} from "@/services/mock-commerce";
import { CartContents } from "./shopping/cart-contents";
import { Dialog } from "./ui/dialog";

interface CommerceContext {
  products: Product[];
  openCart: () => void;
  closeCart: () => void;
  addToBag: (productId: string, variantId: string, quantity: number) => boolean;
}
const Context = createContext<CommerceContext | null>(null);
export function useCommerce() {
  const context = useContext(Context);
  if (!context) throw new Error("CommerceProvider is required");
  return context;
}
export function CommerceProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const [cartOpen, setCartOpen] = useState(false);
  const { state } = useShopping();
  function addToBag(productId: string, variantId: string, quantity: number) {
    const current =
      state.cart.find((item) => item.variantId === variantId)?.quantity ?? 0;
    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      current + quantity > stockFor(products, variantId)
    )
      return false;
    updateShopping((value) => ({
      ...value,
      cart: setCartQuantity(
        normalizeCart(value.cart, products),
        { productId, variantId, quantity: current + quantity },
        products,
      ),
    }));
    setCartOpen(true);
    return true;
  }
  return (
    <Context.Provider
      value={{
        products,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
        addToBag,
      }}
    >
      {children}
      <Dialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Your bag"
        drawer
      >
        <CartContents compact onNavigate={() => setCartOpen(false)} />
      </Dialog>
    </Context.Provider>
  );
}
