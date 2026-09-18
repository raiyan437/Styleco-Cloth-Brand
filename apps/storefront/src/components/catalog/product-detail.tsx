"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Star,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import type { Product } from "@/domain/catalog";
import { colorsOf, displayVariant } from "@/services/catalog-query";
import { useCommerce } from "../commerce-provider";
import { useShopping } from "@/services/shopping-store";
import { Price } from "../ui/shared";
import { WishlistButton } from "./product-card";
import { SizeGuide } from "./size-guide";

export function ProductDetail({ product }: { product: Product }) {
  const colors = colorsOf(product);
  const first = displayVariant(product)!;
  const [color, setColor] = useState(
    colors[0]?.name ?? first.color?.name ?? "",
  );
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [image, setImage] = useState(0);
  const [guide, setGuide] = useState(false);
  const [feedback, setFeedback] = useState("");
  const { addToBag } = useCommerce();
  const { state, ready } = useShopping();
  const variant = product.variants.find(
    (v) => v.color?.name === color && v.size === size,
  );
  const priceVariant =
    variant ?? product.variants.find((v) => v.color?.name === color) ?? first;
  const inBag =
    state.cart.find((row) => row.variantId === variant?.id)?.quantity ?? 0;
  const remaining = Math.max(0, (variant?.stock ?? 0) - inBag);
  const purchasable = ready && variant?.inStock && remaining >= quantity;
  const images = product.colorImages?.[color] ?? product.images;
  const currentImage = images[image] ?? images[0]!;
  return (
    <div className="pdp-layout">
      <div className="gallery">
        <div className="gallery-main">
          <Image
            key={currentImage.id}
            className="gallery-image"
            src={currentImage.url}
            alt={currentImage.alt}
            fill
            quality={95}
            priority
            sizes="(max-width:767px) 100vw, 55vw"
          />
          <span className="gallery-counter">
            {String(image + 1).padStart(2, "0")} /{" "}
            {String(images.length).padStart(2, "0")}
          </span>
          {images.length > 1 && (
            <button
              className="gallery-next icon-button"
              onClick={() => setImage((image + 1) % images.length)}
              aria-label="Next product image"
            >
              <ArrowUpRight size={21} />
            </button>
          )}
        </div>
        <div className="gallery-thumbnails">
          {images.map((photo, index) => (
            <button
              key={photo.id}
              className={image === index ? "selected" : ""}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={image === index}
              onClick={() => setImage(index)}
            >
              <Image src={photo.url} alt={photo.alt} width={100} height={125} />
            </button>
          ))}
          <p>
            Good from every angle.
            <br />
            <span>Original demo imagery.</span>
          </p>
        </div>
      </div>
      <div className="pdp-info">
        <p className="text-eyebrow">THE EVERYDAY COLLECTION</p>
        <h1>{product.name}</h1>
        <a href="#reviews" className="rating">
          <Star size={15} fill="currentColor" />
          {product.rating?.toFixed(1)}{" "}
          <span>({product.reviewCount} demo reviews)</span>
        </a>
        <div className="pdp-price">
          <Price
            amount={priceVariant.price.amount}
            original={priceVariant.originalPrice?.amount}
          />
          <small>Inclusive of all taxes</small>
        </div>
        <p className="pdp-description">{product.description}</p>
        <fieldset className="color-selection">
          <legend>
            Color <span>— {color}</span>
          </legend>
          <div>
            {colors.map((c) => (
              <button
                key={c.name}
                aria-label={`Select ${c.name}`}
                aria-pressed={color === c.name}
                className={`color-choice ${color === c.name ? "selected" : ""}`}
                onClick={() => {
                  setColor(c.name);
                  setImage(0);
                  setSize("");
                  setQuantity(1);
                  setFeedback("");
                }}
              >
                <span style={{ background: c.hex }} />
              </button>
            ))}
          </div>
          <small className="muted">
            Colors are illustrative in this frontend demo.
          </small>
        </fieldset>
        <div className="size-heading">
          <span>Select size {size && `— ${size}`}</span>
          <button className="underlined" onClick={() => setGuide(true)}>
            Size guide
          </button>
        </div>
        <div className="size-options pdp-sizes">
          {["S", "M", "L", "XL"].map((s) => {
            const candidate = product.variants.find(
              (v) => v.color?.name === color && v.size === s,
            );
            return (
              <button
                key={s}
                disabled={!candidate?.inStock}
                aria-label={`Size ${s}${candidate?.inStock ? "" : " — unavailable"}`}
                aria-pressed={size === s}
                className={size === s ? "selected" : ""}
                onClick={() => {
                  setSize(s);
                  setQuantity(1);
                  setFeedback("");
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
        <div className="purchase-row">
          <div className="quantity-control">
            <button
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => q - 1)}
            >
              <Minus size={15} />
            </button>
            <span aria-live="polite">{quantity}</span>
            <button
              disabled={!variant || quantity >= remaining}
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus size={15} />
            </button>
          </div>
          <button
            className="button add-to-bag"
            disabled={!purchasable}
            onClick={() =>
              setFeedback(
                addToBag(product.id, variant!.id, quantity)
                  ? "Added to your bag."
                  : "This quantity is no longer available.",
              )
            }
          >
            {!product.variants.some((v) => v.inStock)
              ? "Out of stock"
              : !size
                ? "Select a size"
                : remaining < quantity
                  ? "Stock limit reached"
                  : "Add to Bag"}
            <ArrowUpRight size={19} />
          </button>
          <WishlistButton product={product} />
        </div>
        <p className="stock-feedback" role="status">
          {feedback ||
            (variant?.inStock
              ? `${remaining} available to add in this size and color.`
              : "Pick your color and size to make it yours.")}
        </p>
        <div className="delivery-promises">
          <p>
            <Truck size={19} />
            Free standard delivery on orders ৳3,000+
          </p>
          <p>
            <RotateCcw size={19} />
            Easy returns within 7 days · demo policy
          </p>
        </div>
        <div className="product-accordions">
          {[
            ["Material & details", product.material],
            ["Fit & sizing", product.fit],
            ["Care for your clothes", product.care],
            [
              "Shipping & returns",
              "Standard delivery in 3–5 working days. Express in 1–2 working days. Unworn pieces may be returned within 7 days. These are preview policies; no real orders are fulfilled.",
            ],
          ].map(([title, copy]) => (
            <details key={title}>
              <summary>
                {title}
                <Plus size={17} />
              </summary>
              <p>{copy}</p>
            </details>
          ))}
        </div>
        <Link href="/contact" className="underlined">
          A question about this piece? We’re here.
        </Link>
      </div>
      <SizeGuide open={guide} onClose={() => setGuide(false)} />
    </div>
  );
}
