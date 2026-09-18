"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, Minus, Plus, Trash2, Truck } from "lucide-react";
import { useCommerce } from "../commerce-provider";
import { updateShopping, useShopping } from "@/services/shopping-store";
import {
  cartTotals,
  normalizeCart,
  setCartQuantity,
  stockFor,
  validateCoupon,
} from "@/services/mock-commerce";
import { money } from "@/services/catalog-query";
import { EmptyState, Price } from "../ui/shared";
export function CartContents({
  compact = false,
  onNavigate,
}: {
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const { products } = useCommerce();
  const { state, ready, storageAvailable } = useShopping();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const cart = normalizeCart(state.cart, products);
  const totals = cartTotals(cart, products, state.coupon);
  if (!ready) return <p className="state-loading">Getting your bag ready…</p>;
  if (!cart.length)
    return (
      <div onClick={onNavigate}>
        <EmptyState
          title="Room for a new favorite."
          description="Your bag is empty. Let's find something that feels like you."
        />
      </div>
    );
  return (
    <div className={compact ? "cart-compact" : "cart-layout"}>
      <div className="cart-items">
        <div className="shipping-note">
          <Truck size={19} />
          {totals.subtotal >= 300000
            ? "Your bag qualifies for free standard delivery."
            : `You're ${money(300000 - totals.subtotal)} away from free standard delivery.`}
        </div>
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          const variant = product.variants.find(
            (v) => v.id === item.variantId,
          )!;
          return (
            <article className="cart-item" key={item.variantId}>
              <Link href={`/products/${product.slug}`} onClick={onNavigate}>
                <Image
                  src={product.images[0]!.url}
                  alt={product.name}
                  width={128}
                  height={160}
                />
              </Link>
              <div className="cart-item-info">
                <Link href={`/products/${product.slug}`} onClick={onNavigate}>
                  {product.name}
                </Link>
                <p>
                  {variant.color?.name} <span>/</span> {variant.size}
                </p>
                <Price
                  amount={variant.price.amount}
                  original={variant.originalPrice?.amount}
                />
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button
                      aria-label={`Decrease ${product.name}`}
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateShopping((s) => ({
                          ...s,
                          cart: setCartQuantity(
                            s.cart,
                            { ...item, quantity: item.quantity - 1 },
                            products,
                          ),
                        }))
                      }
                    >
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      aria-label={`Increase ${product.name}`}
                      disabled={
                        item.quantity >= stockFor(products, item.variantId)
                      }
                      onClick={() =>
                        updateShopping((s) => ({
                          ...s,
                          cart: setCartQuantity(
                            s.cart,
                            { ...item, quantity: item.quantity + 1 },
                            products,
                          ),
                        }))
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    className="icon-button"
                    aria-label={`Remove ${product.name}`}
                    onClick={() =>
                      updateShopping((s) => ({
                        ...s,
                        cart: s.cart.filter(
                          (row) => row.variantId !== item.variantId,
                        ),
                      }))
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <span className="cart-line-total">
                {money(variant.price.amount * item.quantity)}
              </span>
            </article>
          );
        })}
        <Link className="text-cta" href="/new-arrivals" onClick={onNavigate}>
          Keep exploring <ArrowUpRight size={18} />
        </Link>
        {!storageAvailable && (
          <p role="status">
            Browser storage is unavailable. Your bag will last for this visit
            only.
          </p>
        )}
      </div>
      <aside className="order-summary">
        <p className="text-eyebrow">THE GOOD STUFF, ALL TOGETHER</p>
        <h2>Order summary</h2>
        <div className="totals">
          <p>
            <span>Subtotal</span>
            <span>{money(totals.subtotal)}</span>
          </p>
          {totals.discount > 0 && (
            <p className="discount-line">
              <span>
                STYLE10{" "}
                <button
                  className="underlined"
                  onClick={() => updateShopping((s) => ({ ...s, coupon: "" }))}
                >
                  Remove
                </button>
              </span>
              <span>−{money(totals.discount)}</span>
            </p>
          )}
          <p>
            <span>Standard delivery</span>
            <span>{totals.shipping ? money(totals.shipping) : "On us"}</span>
          </p>
          <p className="total-line">
            <span>Total</span>
            <span>{money(totals.total)}</span>
          </p>
        </div>
        {!compact && (
          <form
            className="coupon-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (validateCoupon(code)) {
                updateShopping((s) => ({ ...s, coupon: "STYLE10" }));
                setMessage("STYLE10 applied. Enjoy 10% off your demo order.");
              } else setMessage("That code isn't in this edit. Try STYLE10.");
            }}
          >
            <label htmlFor="coupon">Have a little something extra?</label>
            <div>
              <input
                id="coupon"
                placeholder="Demo code: STYLE10"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <button type="submit">Apply</button>
            </div>
            <small role="status">
              {message || "Frontend demo coupon. No real promotion is applied."}
            </small>
          </form>
        )}
        <Link
          className="button full-width"
          href={compact ? "/cart" : "/checkout"}
          onClick={onNavigate}
        >
          {compact ? "View your bag" : "Continue to checkout"}
          <ArrowUpRight size={19} />
        </Link>
        <p className="summary-note">
          Local demo · No real payment or order fulfillment.
        </p>
      </aside>
    </div>
  );
}
