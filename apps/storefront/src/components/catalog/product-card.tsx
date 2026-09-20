"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/domain/catalog";
import {
  colorsOf,
  displayVariant,
  imageForVariant,
  isSale,
} from "@/services/catalog-query";
import { toggleWishlist, useShopping } from "@/services/shopping-store";
import { useCommerce } from "../commerce-provider";
import { Dialog } from "../ui/dialog";
import { Price } from "../ui/shared";
import { useStorefrontCatalog } from "../storefront-catalog-provider";

function productHref(product: Product) {
  return product.adminManaged
    ? `/products/preview?id=${encodeURIComponent(product.id)}`
    : `/products/${product.slug}`;
}

function categoryLabel(product: Product) {
  const category = product.categoryIds[0] ?? "Collection";
  if (category === "pant") return "Pants";
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

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

const QUICK_ADD_SIZES = ["S", "M", "L", "XL"];

function QuickAddDialog({
  product,
  colors,
  selectedColor,
  onSelectColor,
  open,
  onClose,
  onExited,
}: {
  product: Product;
  colors: { name: string; hex: string }[];
  selectedColor: string;
  onSelectColor: (colorName: string) => void;
  open: boolean;
  onClose: () => void;
  onExited: () => void;
}) {
  const { addToBag, openCart } = useCommerce();
  const { ready } = useShopping();
  const [size, setSize] = useState("");
  const [feedback, setFeedback] = useState("");
  const selectedVariant = product.variants.find(
    (variant) => variant.color?.name === selectedColor && variant.size === size,
  );
  const previewVariant =
    selectedVariant ??
    product.variants.find(
      (variant) => variant.color?.name === selectedColor && variant.inStock,
    ) ??
    product.variants.find((variant) => variant.inStock);
  const previewImage = imageForVariant(product, previewVariant);

  const addSelectedVariant = () => {
    if (!selectedVariant?.inStock) return;
    if (addToBag(product.id, selectedVariant.id, 1)) {
      setFeedback("Added to your bag.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={`Quick add ${product.name}`}
      portal
      className="quick-add-modal"
      showHeader={false}
      onExited={onExited}
    >
      <div className="quick-add-dialog">
        <div className="quick-add-product">
          {previewImage && (
            <div className="quick-add-product-image">
              <Image
                src={previewImage.url}
                alt={previewImage.alt}
                fill
                sizes="96px"
              />
            </div>
          )}
          <div className="quick-add-product-copy">
            <p className="quick-add-product-category">
              {categoryLabel(product)}
            </p>
            <p className="quick-add-product-name">{product.name}</p>
            {previewVariant && (
              <Price
                amount={previewVariant.price.amount}
                original={previewVariant.originalPrice?.amount}
              />
            )}
          </div>
        </div>
        <p className="quick-add-summary">Choose a color and size.</p>
        <fieldset className="quick-add-fieldset">
          <legend>
            Color <span>— {selectedColor}</span>
          </legend>
          <div className="quick-add-colors">
            {colors.map((color) => {
              const available = product.variants.some(
                (variant) =>
                  variant.color?.name === color.name && variant.inStock,
              );
              return (
                <button
                  key={color.name}
                  type="button"
                  className={`quick-add-color ${
                    selectedColor === color.name ? "selected" : ""
                  }`}
                  aria-label={`Select ${color.name}`}
                  aria-pressed={selectedColor === color.name}
                  disabled={!available}
                  onClick={() => {
                    onSelectColor(color.name);
                    setSize("");
                    setFeedback("");
                  }}
                >
                  <span style={{ background: color.hex }} />
                  <small>{color.name}</small>
                </button>
              );
            })}
          </div>
        </fieldset>
        <fieldset className="quick-add-fieldset">
          <legend>
            Size <span>{size ? `— ${size}` : "— choose one"}</span>
          </legend>
          <div className="size-options quick-add-size-options">
            {QUICK_ADD_SIZES.map((option) => {
              const candidate = product.variants.find(
                (variant) =>
                  variant.color?.name === selectedColor &&
                  variant.size === option,
              );
              return (
                <button
                  key={option}
                  type="button"
                  disabled={!candidate?.inStock}
                  aria-label={`Size ${option}${candidate?.inStock ? "" : " — unavailable"}`}
                  aria-pressed={size === option}
                  className={size === option ? "selected" : ""}
                  onClick={() => {
                    setSize(option);
                    setFeedback("");
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
        <p className="quick-add-feedback" role="status">
          {feedback || "Your selected options will be added as one item."}
        </p>
        <div className="quick-add-actions">
          <button
            type="button"
            className="button full-width"
            disabled={!ready || !selectedVariant?.inStock || Boolean(feedback)}
            onClick={addSelectedVariant}
          >
            {feedback ? "Added to bag" : "Add to bag"}
            <ArrowUpRight size={18} />
          </button>
          {feedback && (
            <button
              type="button"
              className="text-cta quick-add-view-bag"
              onClick={() => {
                onClose();
                openCart();
              }}
            >
              View your bag <ArrowUpRight size={16} />
            </button>
          )}
          <Link
            href={productHref(product)}
            className="quick-add-details-link"
            onClick={onClose}
          >
            View product details
          </Link>
        </div>
      </div>
    </Dialog>
  );
}

export function ProductCard({ product: initialProduct }: { product: Product }) {
  const { productById } = useStorefrontCatalog();
  const product = productById(initialProduct.id) ?? initialProduct;
  const { ready } = useShopping();
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
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddMounted, setQuickAddMounted] = useState(false);
  const [quickAddSession, setQuickAddSession] = useState(0);
  const variant =
    product.variants.find(
      (item) => item.color?.name === selectedColor && item.inStock,
    ) ??
    product.variants.find((item) => item.color?.name === selectedColor) ??
    defaultVariant;
  const image = imageForVariant(product, variant);
  if (!variant || !image) return null;
  const imageKey = `${product.id}-${selectedColor}`;
  const soldOut = !product.variants.some((v) => v.inStock);
  const canAddToBag = ready && variant.inStock && !soldOut;
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
      <div
        className={`product-image-wrap ${loadedImageKey === imageKey ? "is-image-loaded" : ""}`}
      >
        <Link
          href={productHref(product)}
          className="product-image-link"
          aria-label={`View ${product.name}`}
        >
          <Image
            key={`${imageKey}-primary`}
            src={image.url}
            alt={image.alt}
            fill
            quality={85}
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
        {soldOut && <span className="stock-label">Out of stock</span>}
      </div>
      <div className="product-info">
        <div className="product-info-topline">
          <p className="product-category">{categoryLabel(product)}</p>
          <WishlistButton product={product} />
        </div>
        <Link href={productHref(product)} className="product-name">
          {product.name}
        </Link>
        <div className="product-rating-row">
          {product.rating !== undefined && (
            <p
              className="product-rating"
              role="img"
              aria-label={`${product.rating} out of 5 stars${
                product.reviewCount
                  ? ` from ${product.reviewCount} reviews`
                  : ""
              }`}
            >
              <span aria-hidden="true">★</span> {product.rating.toFixed(1)}
              {product.reviewCount !== undefined && (
                <span className="review-count">({product.reviewCount})</span>
              )}
            </p>
          )}
          <div className="swatches">
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
                <span
                  className="swatch-dot"
                  style={{ background: color.hex }}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="product-card-purchase">
          <Price
            amount={variant.price.amount}
            original={variant.originalPrice?.amount}
          />
          <button
            type="button"
            className="product-card-add-to-cart"
            disabled={!canAddToBag}
            aria-label={`Quick add ${product.name}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setQuickAddSession((session) => session + 1);
              setQuickAddMounted(true);
              setQuickAddOpen(true);
            }}
          >
            {soldOut ? "Out of stock" : "Quick add"}
          </button>
        </div>
      </div>
      {quickAddMounted && (
        <QuickAddDialog
          key={quickAddSession}
          product={product}
          colors={colors}
          selectedColor={selectedColor}
          onSelectColor={selectColor}
          open={quickAddOpen}
          onClose={() => setQuickAddOpen(false)}
          onExited={() => setQuickAddMounted(false)}
        />
      )}
    </article>
  );
}
