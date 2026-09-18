"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/domain/catalog";
import { colorsOf, displayVariant, isSale } from "@/services/catalog-query";
import { toggleWishlist, useShopping } from "@/services/shopping-store";
import { Price } from "../ui/shared";

export function WishlistButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { state, ready } = useShopping();
  const saved = state.wishlist.includes(product.id);
  return (
    <button
      disabled={!ready}
      className={`icon-button wishlist-button ${saved ? "saved" : ""} ${className}`}
      aria-label={`${saved ? "Remove" : "Save"} ${product.name} ${saved ? "from" : "to"} wishlist`}
      aria-pressed={saved}
      onClick={() => toggleWishlist(product.id)}
    >
      <Heart size={19} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
export function ProductCard({ product }: { product: Product }) {
  const defaultVariant = displayVariant(product);
  const colors = colorsOf(product);
  const [selectedColor, setSelectedColor] = useState(
    colors[0]?.name ?? defaultVariant?.color?.name ?? "",
  );
  const [imageDirection, setImageDirection] = useState<"next" | "previous">(
    "next",
  );
  const [hasChangedColor, setHasChangedColor] = useState(false);
  const [loadedImageKey, setLoadedImageKey] = useState("");
  const variant =
    product.variants.find(
      (item) => item.color?.name === selectedColor && item.inStock,
    ) ??
    product.variants.find((item) => item.color?.name === selectedColor) ??
    defaultVariant;
  const selectedImages = product.colorImages?.[selectedColor] ?? product.images;
  const image = selectedImages[0];
  if (!variant || !image) return null;
  const imageKey = `${product.id}-${selectedColor}`;
  const soldOut = !product.variants.some((v) => v.inStock);
  const selectedColorInStock = (colorName: string) =>
    product.variants.some(
      (item) => item.color?.name === colorName && item.inStock,
    );
  const selectColor = (colorName: string) => {
    const currentIndex = colors.findIndex(
      (color) => color.name === selectedColor,
    );
    const nextIndex = colors.findIndex((color) => color.name === colorName);
    if (nextIndex !== currentIndex) {
      setImageDirection(nextIndex > currentIndex ? "next" : "previous");
      setHasChangedColor(true);
    }
    setSelectedColor(colorName);
  };
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link
          href={`/products/${product.slug}`}
          className="product-image-link"
          aria-label={`View ${product.name}`}
        >
          <Image
            key={`${imageKey}-primary`}
            src={image.url}
            alt={image.alt}
            fill
            quality={95}
            sizes="(max-width: 600px) 70vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setLoadedImageKey(imageKey)}
            className={`product-image ${
              loadedImageKey === imageKey
                ? hasChangedColor
                  ? `product-image-swatch-change-${imageDirection}`
                  : "product-image-swatch-change"
                : "product-image-swatch-pending"
            }`}
          />
        </Link>
        <div className="badges">
          {product.isNew && <span className="badge badge-new">NEW</span>}
          {isSale(product) && <span className="badge badge-sale">SALE</span>}
        </div>
        <WishlistButton product={product} />
        {soldOut && <span className="stock-label">Out of stock</span>}
      </div>
      <div className="product-info">
        <Link href={`/products/${product.slug}`} className="product-name">
          {product.name}
        </Link>
        <div className="swatches" aria-label={`${product.name} colors`}>
          {colors.map((color) => (
            <button
              key={color.name}
              type="button"
              className={`swatch-button ${
                selectedColor === color.name ? "selected" : ""
              }`}
              title={`View ${product.name} in ${color.name}`}
              aria-label={`View ${product.name} in ${color.name}`}
              aria-pressed={selectedColor === color.name}
              disabled={!selectedColorInStock(color.name)}
              onClick={() => selectColor(color.name)}
            >
              <span className="swatch-dot" style={{ background: color.hex }} />
            </button>
          ))}
        </div>
        <Price
          amount={variant.price.amount}
          original={variant.originalPrice?.amount}
        />
      </div>
    </article>
  );
}
