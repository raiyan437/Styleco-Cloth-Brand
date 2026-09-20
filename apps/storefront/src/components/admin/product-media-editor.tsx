"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ImagePlus,
  Palette,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import type { AdminCrop, AdminMediaAsset } from "@/domain/admin";
import type { ProductImage, ProductVariant } from "@/domain/catalog";
import { AdminButton, FieldLabel } from "./admin-ui";
import { MediaCropper } from "./media-cropper";

export const PRODUCT_IMAGE_MINIMUM = 1;
export const PRODUCT_IMAGE_MAXIMUM = 4;
export const PRODUCT_SIZES = ["S", "M", "L", "XL"] as const;

function colorKey(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "color"
  );
}

export function productColorMediaId(
  productId: string,
  colorName: string,
  kind: "card" | "gallery",
  index?: number,
) {
  const base = `product-${productId}-color-${colorKey(colorName)}-${kind}`;
  return index === undefined ? base : `${base}-${index}`;
}

function LockedImageSlot({ index }: { index: number }) {
  return (
    <div className="admin-cropper admin-product-image-locked">
      <div className="admin-cropper-heading">
        <div>
          <p className="admin-eyebrow">Image placement</p>
          <h3>Gallery image {index + 1}</h3>
          <p>Upload the previous image before adding this view.</p>
        </div>
        <span className="admin-ratio-chip">1200 × 1600 px · 0.75:1</span>
      </div>
      <div className="admin-crop-empty-state is-locked">
        <ImagePlus size={23} />
        <strong>Waiting for image {index}</strong>
        <p>Gallery images are added in storefront order.</p>
      </div>
    </div>
  );
}

export function ProductColorMediaEditor({
  productId,
  productName,
  color,
  variants,
  images,
  cardImage,
  media,
  onUpdateColor,
  onDeleteColor,
  onAddSize,
  onSaveCard,
  onCardAlt,
  onSaveImage,
  onImageAlt,
  onMoveImage,
  onDeleteImage,
}: {
  productId: string;
  productName: string;
  color: { name: string; hex: string };
  variants: ProductVariant[];
  images: ProductImage[];
  cardImage?: ProductImage;
  media: AdminMediaAsset[];
  onUpdateColor: (name: string, hex: string) => void;
  onDeleteColor: () => void;
  onAddSize: (size: string) => void;
  onSaveCard: (crop: AdminCrop, url: string) => void;
  onCardAlt: (alt: string) => void;
  onSaveImage: (index: number, crop: AdminCrop, url: string) => void;
  onImageAlt: (index: number, alt: string) => void;
  onMoveImage: (index: number, direction: -1 | 1) => void;
  onDeleteImage: (index: number) => void;
}) {
  const [nextName, setNextName] = useState(color.name);
  const [nextHex, setNextHex] = useState(color.hex.toUpperCase());
  const gallerySlotCount =
    images.length < PRODUCT_IMAGE_MAXIMUM ? images.length + 1 : images.length;
  const missingSizes = PRODUCT_SIZES.filter(
    (size) => !variants.some((variant) => variant.size === size),
  );
  const previewImage = cardImage ?? images[0];
  const previewVariant =
    variants.find((variant) => variant.inStock) ?? variants[0];
  const cardAsset = media.find(
    (asset) => asset.id === productColorMediaId(productId, color.name, "card"),
  );

  return (
    <section className="admin-panel admin-color-media-panel">
      <div className="admin-panel-heading admin-color-media-heading">
        <div>
          <p className="admin-eyebrow">Color storefront</p>
          <h2>
            <span
              className="admin-color-swatch"
              style={{ backgroundColor: color.hex }}
            />
            {color.name}
          </h2>
          <p>
            This variant&apos;s color, stock, card crop and 1–4 ordered images
            appear when a shopper selects {color.name}.
          </p>
        </div>
        <span
          className={`admin-requirement-chip${images.length >= PRODUCT_IMAGE_MINIMUM ? " is-complete" : ""}`}
        >
          {images.length} / {PRODUCT_IMAGE_MAXIMUM} images
        </span>
      </div>

      <div className="admin-color-settings-row">
        <FieldLabel label="Color name">
          <input
            value={nextName}
            onChange={(event) => setNextName(event.target.value)}
          />
        </FieldLabel>
        <div className="admin-field">
          <span className="admin-field-label">Color and hex code</span>
          <div className="admin-color-picker-row">
            <input
              type="color"
              value={/^#[0-9A-F]{6}$/i.test(nextHex) ? nextHex : color.hex}
              aria-label={`${color.name} color picker`}
              onChange={(event) => setNextHex(event.target.value.toUpperCase())}
            />
            <input
              value={nextHex}
              aria-label={`${color.name} hex code`}
              spellCheck={false}
              onChange={(event) => setNextHex(event.target.value)}
            />
          </div>
        </div>
        <div className="admin-color-settings-actions">
          <AdminButton
            variant="secondary"
            onClick={() => onUpdateColor(nextName, nextHex)}
          >
            <Save size={15} /> Save color
          </AdminButton>
          <AdminButton variant="danger" onClick={onDeleteColor}>
            <Trash2 size={15} /> Delete color
          </AdminButton>
        </div>
      </div>

      <div className="admin-color-size-row">
        <span>
          <Palette size={15} /> Sizes in this color
        </span>
        <div>
          {PRODUCT_SIZES.map((size) => {
            const exists = !missingSizes.includes(size);
            return (
              <button
                type="button"
                key={size}
                disabled={exists}
                className={exists ? "is-complete" : ""}
                onClick={() => onAddSize(size)}
                aria-label={
                  exists
                    ? `${color.name} size ${size} already exists`
                    : `Add ${color.name} size ${size}`
                }
              >
                {exists ? <Check size={13} /> : <Plus size={13} />}
                {size}
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-card-media-layout">
        <div>
          <p className="admin-media-note">
            Optional card crop. If you skip it, the storefront uses image 1.
          </p>
          <MediaCropper
            slot="product-card"
            title={`${color.name} product card`}
            sourceUrl={cardImage?.url ?? images[0]?.url ?? ""}
            alt={cardImage?.alt ?? `${productName} in ${color.name}`}
            initialCrop={cardAsset?.crop}
            onSave={onSaveCard}
          />
          {cardImage ? (
            <FieldLabel label="Card image alt text">
              <input
                value={cardImage.alt}
                onChange={(event) => onCardAlt(event.target.value)}
              />
            </FieldLabel>
          ) : null}
        </div>
        <div className="admin-live-product-card">
          <p className="admin-eyebrow">Live card preview</p>
          <div className="admin-live-product-card-image">
            {previewImage ? (
              <Image
                src={previewImage.url}
                alt={previewImage.alt}
                fill
                unoptimized
                sizes="260px"
              />
            ) : (
              <ImagePlus size={28} />
            )}
          </div>
          <small>Collection</small>
          <strong>{productName}</strong>
          <div>
            <span
              className="admin-color-swatch"
              style={{ backgroundColor: color.hex }}
            />
            <span>
              {previewVariant
                ? `৳${new Intl.NumberFormat("en-BD").format(previewVariant.price.amount / 100)}`
                : "Add pricing"}
            </span>
          </div>
        </div>
      </div>

      <div className="admin-color-gallery-heading">
        <div>
          <p className="admin-eyebrow">Variant images</p>
          <h3>{color.name} product images</h3>
        </div>
        <span>Upload at least 1 image, up to 4. Image 1 is primary.</span>
      </div>
      <div className="admin-product-gallery-grid">
        {Array.from({ length: gallerySlotCount }, (_, index) => {
          const image = images[index];
          if (!image && index > images.length) {
            return <LockedImageSlot key={index} index={index} />;
          }
          const asset = media.find(
            (item) =>
              item.id ===
              productColorMediaId(productId, color.name, "gallery", index),
          );
          return (
            <div className="admin-gallery-item" key={image?.id ?? index}>
              <MediaCropper
                slot="product-gallery"
                title={`Gallery image ${index + 1}${index === 0 ? " · primary" : ""}`}
                sourceUrl={image?.url ?? ""}
                alt={
                  image?.alt ??
                  `${productName} in ${color.name} view ${index + 1}`
                }
                initialCrop={asset?.crop}
                onSave={(crop, url) => onSaveImage(index, crop, url)}
              />
              {image ? (
                <div className="admin-gallery-item-controls">
                  <FieldLabel label={`Image ${index + 1} alt text`}>
                    <input
                      value={image.alt}
                      onChange={(event) =>
                        onImageAlt(index, event.target.value)
                      }
                    />
                  </FieldLabel>
                  <div>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => onMoveImage(index, -1)}
                      aria-label={`Move ${color.name} image ${index + 1} earlier`}
                    >
                      <ArrowUp size={14} /> Earlier
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => onMoveImage(index, 1)}
                      aria-label={`Move ${color.name} image ${index + 1} later`}
                    >
                      <ArrowDown size={14} /> Later
                    </button>
                    <button
                      type="button"
                      className="is-danger"
                      onClick={() => onDeleteImage(index)}
                      aria-label={`Delete ${color.name} image ${index + 1}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
