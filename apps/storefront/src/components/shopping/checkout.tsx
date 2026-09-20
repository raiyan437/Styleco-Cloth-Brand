"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, ArrowUpRight, Check, CalendarDays } from "lucide-react";
import { useCommerce } from "../commerce-provider";
import { useShopping, updateShopping } from "@/services/shopping-store";
import { normalizeCart, cartTotals } from "@/services/mock-commerce";
import { imageForVariant, money } from "@/services/catalog-query";
import {
  checkoutSchema,
  type CheckoutValues,
} from "@/services/checkout-schema";
import { orderStorage } from "@/infrastructure/browser/shopping-storage";
import { EmptyState } from "../ui/shared";

const checkoutSteps = [
  { id: "checkout-details", label: "Your details" },
  { id: "checkout-address", label: "Delivery address" },
  { id: "checkout-delivery", label: "Delivery" },
  { id: "checkout-payment", label: "Payment" },
];

export function Checkout() {
  const { products } = useCommerce();
  const { state, ready } = useShopping();
  const router = useRouter();
  const [declined, setDeclined] = useState("");
  const [placed, setPlaced] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { delivery: "standard", payment: "cod", cardNumber: "" },
  });
  const delivery = useWatch({ control, name: "delivery" });
  const payment = useWatch({ control, name: "payment" });
  const cart = normalizeCart(state.cart, products);
  const totals = cartTotals(cart, products, state.coupon, delivery);
  function submit(values: CheckoutValues) {
    if (!cart.length || placed) return;
    if (
      values.payment === "card" &&
      values.cardNumber?.replaceAll(" ", "") === "4000000000000002"
    ) {
      setDeclined(
        "Your card was declined. Please try another card or choose Cash on Delivery.",
      );
      return;
    }
    const order = {
      id: `SC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: cart,
      ...totals,
      address: {
        fullName: values.fullName,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
      },
      payment: values.payment,
    };
    orderStorage.write(order);
    setPlaced(true);
    updateShopping((s) => ({ ...s, cart: [], coupon: "" }));
    router.push("/order-confirmation");
  }
  if (!ready) return <p>Preparing checkout…</p>;
  if (placed)
    return <p role="status">Your order is ready. Opening confirmation…</p>;
  if (!cart.length)
    return (
      <EmptyState
        title="First, find a favorite."
        description="Add a piece to your bag before checking out."
      />
    );
  const field = (
    name: "email" | "phone" | "fullName" | "address" | "city" | "postalCode",
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <label
      className={`field-label ${name === "address" || name === "fullName" ? "span-two" : ""}`}
    >
      <span id={`${name}-label`}>{label}</span>
      <input
        {...register(name)}
        aria-labelledby={`${name}-label`}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        autoComplete={
          name === "fullName"
            ? "name"
            : name === "address"
              ? "street-address"
              : name === "city"
                ? "address-level2"
                : name === "postalCode"
                  ? "postal-code"
                  : name === "phone"
                    ? "tel"
                    : "email"
        }
      />
      {errors[name] && (
        <span className="field-error" id={`${name}-error`}>
          {errors[name]?.message}
        </span>
      )}
    </label>
  );
  return (
    <form
      className="checkout-layout"
      onSubmit={handleSubmit(submit)}
      noValidate
    >
      <div className="checkout-fields">
        <nav className="checkout-progress" aria-label="Checkout steps">
          <span className="checkout-progress-hint" aria-hidden="true">
            Swipe to see all steps ↔
          </span>
          <ol>
            {checkoutSteps.map((step, index) => (
              <li key={step.id}>
                <a href={`#${step.id}`}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {step.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {Object.keys(errors).length > 0 && (
          <p className="form-error-summary" role="alert">
            Check the highlighted fields before continuing.
          </p>
        )}
        <div className="checkout-notice">
          <LockKeyhole size={18} />
          <span>
            Your details are secure and used only to process your order. We’ll
            confirm your delivery details after checkout.
          </span>
        </div>
        <section className="checkout-section" id="checkout-details">
          <h2>
            <span>01</span> Your details
          </h2>
          <div className="form-grid">
            {field("email", "Email address", "you@example.com", "email")}
            {field("phone", "Phone number", "01712345678", "tel")}
          </div>
        </section>
        <section className="checkout-section" id="checkout-address">
          <h2>
            <span>02</span> Where’s it going?
          </h2>
          <div className="form-grid">
            {field("fullName", "Full name", "Alex Rahman")}
            {field("address", "Street address", "House 12, Road 5, Dhanmondi")}
            {field("city", "City", "Dhaka")}
            {field("postalCode", "Postal code", "1209")}
          </div>
        </section>
        <section className="checkout-section" id="checkout-delivery">
          <h2>
            <span>03</span> Delivery, your way
          </h2>
          <div className="delivery-options">
            <label className={delivery === "standard" ? "selected" : ""}>
              <input type="radio" value="standard" {...register("delivery")} />
              <span>
                Standard delivery<small>3–5 working days</small>
              </span>
              <b>{totals.subtotal >= 300000 ? "Free" : money(8000)}</b>
            </label>
            <label className={delivery === "express" ? "selected" : ""}>
              <input type="radio" value="express" {...register("delivery")} />
              <span>
                Express delivery<small>1–2 working days</small>
              </span>
              <b>{money(15000)}</b>
            </label>
          </div>
          <p className="delivery-estimate" role="status">
            <CalendarDays size={18} />
            <span>
              Estimated arrival:{" "}
              <strong>
                {delivery === "express" ? "1–2" : "3–5"} working days
              </strong>
              <small>We’ll confirm the delivery details with your order.</small>
            </span>
          </p>
        </section>
        <section className="checkout-section" id="checkout-payment">
          <h2>
            <span>04</span> The final detail
          </h2>
          <div className="delivery-options">
            <label className={payment === "cod" ? "selected" : ""}>
              <input
                type="radio"
                value="cod"
                {...register("payment", { onChange: () => setDeclined("") })}
              />
              <span>
                Cash on Delivery
                <small>Pay when your order arrives.</small>
              </span>
              {payment === "cod" && <Check size={20} />}
            </label>
            <label className={payment === "card" ? "selected" : ""}>
              <input
                type="radio"
                value="card"
                {...register("payment", { onChange: () => setDeclined("") })}
              />
              <span>
                Card payment<small>Secure payment at checkout.</small>
              </span>
              {payment === "card" && <Check size={20} />}
            </label>
          </div>
          {payment === "card" && (
            <div className="test-card">
              <p>Enter your card number to complete payment.</p>
              <label className="field-label">
                Card number
                <input
                  {...register("cardNumber", {
                    onChange: () => setDeclined(""),
                  })}
                  autoComplete="off"
                  inputMode="numeric"
                  placeholder="1234 5678 9012 3456"
                  aria-invalid={!!errors.cardNumber}
                  aria-describedby={
                    errors.cardNumber ? "card-error" : undefined
                  }
                />
                {errors.cardNumber && (
                  <span className="field-error" id="card-error">
                    {errors.cardNumber.message}
                  </span>
                )}
              </label>
            </div>
          )}
          {declined && (
            <p role="alert" className="field-error">
              {declined}
            </p>
          )}
        </section>
      </div>
      <aside className="order-summary checkout-summary">
        <p className="text-eyebrow">YOUR VERY GOOD CHOICES</p>
        <h2>
          In your bag{" "}
          <span>({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
        </h2>
        <div className="checkout-items">
          {cart.map((item) => {
            const p = products.find((p) => p.id === item.productId)!;
            const v = p.variants.find((v) => v.id === item.variantId)!;
            const image = imageForVariant(p, v);
            return (
              <div key={item.variantId}>
                <Image
                  src={image!.url}
                  alt={image!.alt}
                  width={72}
                  height={90}
                  quality={80}
                  sizes="72px"
                />
                <span>
                  {p.name}
                  <small>
                    {v.color?.name} / {v.size} · Qty {item.quantity}
                  </small>
                </span>
                <b>{money(v.price.amount * item.quantity)}</b>
              </div>
            );
          })}
        </div>
        <div className="totals">
          <p>
            <span>Subtotal</span>
            <span>{money(totals.subtotal)}</span>
          </p>
          {totals.discount > 0 && (
            <p className="discount-line">
              <span>STYLE10 discount</span>
              <span>−{money(totals.discount)}</span>
            </p>
          )}
          <p>
            <span>Delivery</span>
            <span>{totals.shipping ? money(totals.shipping) : "On us"}</span>
          </p>
          <p className="total-line">
            <span>Total</span>
            <span>{money(totals.total)}</span>
          </p>
        </div>
        <button className="button full-width" disabled={isSubmitting || placed}>
          Place order
          <ArrowUpRight size={19} />
        </button>
        <p className="summary-note">
          Your order details are kept private and used only to fulfil your
          order. You’ll receive confirmation after checkout.
        </p>
      </aside>
    </form>
  );
}
