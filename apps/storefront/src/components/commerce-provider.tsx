"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Image from "next/image";
import type { Product } from "@/domain/catalog";
import { useShopping, updateShopping } from "@/services/shopping-store";
import {
  normalizeCart,
  setCartQuantity,
  stockFor,
} from "@/services/mock-commerce";
import { CartContents } from "./shopping/cart-contents";
import { Dialog } from "./ui/dialog";
import { imageForVariant } from "@/services/catalog-query";

type CartToast = {
  productName: string;
  imageUrl: string;
  imageAlt: string;
  productId: string;
  variantId: string;
  previousQuantity: number;
};

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
  const [closeCartImmediately, setCloseCartImmediately] = useState(false);
  const [cartToast, setCartToast] = useState<CartToast | null>(null);
  const { state } = useShopping();
  useEffect(() => {
    if (!cartToast) return;
    const timeout = window.setTimeout(() => setCartToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [cartToast]);
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
    const product = products.find((item) => item.id === productId);
    const selectedVariant = product?.variants.find(
      (variant) => variant.id === variantId,
    );
    const image = product
      ? imageForVariant(product, selectedVariant)
      : undefined;
    setCartToast({
      productName: product?.name ?? "Your new favorite",
      imageUrl: image?.url ?? "",
      imageAlt: image?.alt ?? product?.name ?? "Added product",
      productId,
      variantId,
      previousQuantity: current,
    });
    return true;
  }
  const undoLastAdd = () => {
    if (!cartToast) return;
    updateShopping((value) => ({
      ...value,
      cart: setCartQuantity(
        normalizeCart(value.cart, products),
        {
          productId: cartToast.productId,
          variantId: cartToast.variantId,
          quantity: cartToast.previousQuantity,
        },
        products,
      ),
    }));
    setCartToast(null);
  };
  return (
    <Context.Provider
      value={{
        products,
        openCart: () => {
          setCloseCartImmediately(false);
          setCartOpen(true);
        },
        closeCart: () => {
          setCloseCartImmediately(false);
          setCartOpen(false);
        },
        addToBag,
      }}
    >
      {children}
      {cartToast && (
        <div className="cart-toast" aria-live="polite">
          {cartToast.imageUrl && (
            <Image
              className="cart-toast-image"
              src={cartToast.imageUrl}
              alt={cartToast.imageAlt}
              width={48}
              height={60}
              sizes="48px"
            />
          )}
          <span className="cart-toast-copy">
            <strong>Added to your bag.</strong>
            <span>{cartToast.productName}</span>
          </span>
          <button type="button" onClick={undoLastAdd}>
            Undo
          </button>
        </div>
      )}
      <Dialog
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        title="Your bag"
        drawer
        className="bag-drawer"
        closeImmediately={closeCartImmediately}
      >
        <CartContents
          compact
          onNavigate={() => {
            setCloseCartImmediately(true);
            setCartOpen(false);
          }}
        />
      </Dialog>
    </Context.Provider>
  );
}
