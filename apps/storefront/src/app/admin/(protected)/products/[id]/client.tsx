"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  Copy,
  Palette,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/admin-provider";
import {
  PRODUCT_IMAGE_MINIMUM,
  PRODUCT_IMAGE_MAXIMUM,
  PRODUCT_SIZES,
  ProductColorMediaEditor,
  productColorMediaId,
} from "@/components/admin/product-media-editor";
import {
  AdminButton,
  AdminPageHeader,
  AdminSelect,
  FieldLabel,
  PreviewLink,
  SaveBar,
  StatusBadge,
} from "@/components/admin/admin-ui";
import type {
  AdminContentStatus,
  AdminCrop,
  AdminMediaAsset,
  AdminSnapshot,
} from "@/domain/admin";
import type { Product, ProductImage, ProductVariant } from "@/domain/catalog";

const HEX_PATTERN = /^#[0-9A-F]{6}$/i;

function slugPart(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "product"
  );
}

function productColors(product: Product) {
  return [
    ...new Map(
      product.variants
        .filter((variant) => variant.color)
        .map((variant) => [variant.color!.name, variant.color!]),
    ).values(),
  ];
}

function syncDefaultMedia(product: Product): Product {
  const firstColor = productColors(product)[0]?.name;
  if (!firstColor) return product;
  const images = product.colorImages?.[firstColor] ?? product.images;
  const cardImage =
    product.colorCardImages?.[firstColor] ?? product.cardImage ?? images[0];
  return { ...product, images, cardImage };
}

function upsertMedia(media: AdminMediaAsset[], nextAsset: AdminMediaAsset) {
  return media.some((asset) => asset.id === nextAsset.id)
    ? media.map((asset) => (asset.id === nextAsset.id ? nextAsset : asset))
    : [...media, nextAsset];
}

function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function toIsoDate(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function galleryMediaPrefix(productId: string, colorName: string) {
  return productColorMediaId(productId, colorName, "gallery").replace(
    /-gallery$/,
    "-gallery-",
  );
}

function swapGalleryMedia(
  media: AdminMediaAsset[],
  productId: string,
  colorName: string,
  first: number,
  second: number,
) {
  const firstId = productColorMediaId(productId, colorName, "gallery", first);
  const secondId = productColorMediaId(productId, colorName, "gallery", second);
  return media.map((asset) => {
    if (asset.id === firstId) return { ...asset, id: secondId };
    if (asset.id === secondId) return { ...asset, id: firstId };
    return asset;
  });
}

function removeGalleryMedia(
  media: AdminMediaAsset[],
  productId: string,
  colorName: string,
  removedIndex: number,
) {
  const prefix = galleryMediaPrefix(productId, colorName);
  return media.flatMap((asset) => {
    if (!asset.id.startsWith(prefix)) return [asset];
    const index = Number(asset.id.slice(prefix.length));
    if (index === removedIndex) return [];
    return index > removedIndex
      ? [{ ...asset, id: `${prefix}${index - 1}` }]
      : [asset];
  });
}

function publicationIssues(
  product: Product,
  snapshot: AdminSnapshot,
  saved: boolean,
) {
  const issues: string[] = [];
  if (!saved) issues.push("Save the current product information changes.");
  if (!product.name.trim()) issues.push("Add a product name.");
  if (!product.slug.trim()) issues.push("Add a URL slug.");
  if (
    snapshot.products.some(
      (item) => item.id !== product.id && item.slug === product.slug,
    )
  )
    issues.push("Use a unique URL slug.");
  if (!product.categoryIds.length) issues.push("Choose a category.");
  if (!product.description?.trim()) issues.push("Add a product description.");
  if (!product.material?.trim()) issues.push("Add material and details.");
  if (!product.fit?.trim()) issues.push("Add fit and sizing guidance.");
  if (!product.care?.trim()) issues.push("Add care instructions.");

  const colors = productColors(product);
  if (!colors.length) issues.push("Create at least one color variant.");
  for (const color of colors) {
    const colorImages = product.colorImages?.[color.name] ?? [];
    if (colorImages.length < PRODUCT_IMAGE_MINIMUM) {
      issues.push(`${color.name} needs at least one product image.`);
    }
    if (colorImages.length > PRODUCT_IMAGE_MAXIMUM) {
      issues.push(
        `${color.name} can have no more than ${PRODUCT_IMAGE_MAXIMUM} product images.`,
      );
    }
    if (
      !product.variants.some((variant) => variant.color?.name === color.name)
    ) {
      issues.push(`${color.name} needs at least one size.`);
    }
  }
  if (
    product.variants.some(
      (variant) =>
        !variant.sku.trim() ||
        variant.price.amount <= 0 ||
        !variant.size ||
        !Number.isInteger(variant.stock) ||
        (variant.stock ?? -1) < 0,
    )
  )
    issues.push(
      "Every variant needs a size, SKU, price and whole-number stock.",
    );
  return issues;
}

function ProductEditor({ selected }: { selected: Product }) {
  const { snapshot, updateSnapshot } = useAdmin();
  const [name, setName] = useState(selected.name);
  const [slug, setSlug] = useState(selected.slug);
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState(selected.description ?? "");
  const [categoryId, setCategoryId] = useState(
    selected.categoryIds[0] ?? snapshot.categories[0]?.id ?? "",
  );
  const [material, setMaterial] = useState(selected.material ?? "");
  const [fit, setFit] = useState(selected.fit ?? "");
  const [care, setCare] = useState(selected.care ?? "");
  const [keywords, setKeywords] = useState(selected.keywords?.join(", ") ?? "");
  const [seoTitle, setSeoTitle] = useState(selected.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(
    selected.seoDescription ?? "",
  );
  const [releasedAt, setReleasedAt] = useState(
    toDateTimeLocal(selected.releasedAt),
  );
  const [isNew, setIsNew] = useState(Boolean(selected.isNew));
  const [saved, setSaved] = useState(true);
  const [notice, setNotice] = useState("");
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("#1E3028");
  const [price, setPrice] = useState("2490");
  const [originalPrice, setOriginalPrice] = useState("");
  const [stockBySize, setStockBySize] = useState<Record<string, string>>(() =>
    Object.fromEntries(PRODUCT_SIZES.map((size) => [size, "10"])),
  );
  const [skuPrefix, setSkuPrefix] = useState("");
  const [sizes, setSizes] = useState<string[]>([...PRODUCT_SIZES]);
  const status = snapshot.statuses[`product:${selected.id}`] ?? "published";
  const colors = useMemo(() => productColors(selected), [selected]);
  const issues = publicationIssues(selected, snapshot, saved);

  function markChanged() {
    setSaved(false);
    setNotice("");
  }

  function saveProductInformation() {
    const normalizedSlug = slugPart(slug);
    if (
      snapshot.products.some(
        (product) =>
          product.id !== selected.id && product.slug === normalizedSlug,
      )
    ) {
      setNotice("That URL slug is already used by another product.");
      return;
    }
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === selected.id
            ? {
                ...product,
                name: name.trim() || product.name,
                slug: normalizedSlug,
                description,
                categoryIds: categoryId ? [categoryId] : [],
                material,
                fit,
                care,
                keywords: keywords
                  .split(",")
                  .map((keyword) => keyword.trim())
                  .filter(Boolean),
                seoTitle: seoTitle.trim(),
                seoDescription: seoDescription.trim(),
                releasedAt: toIsoDate(releasedAt),
                isNew,
              }
            : product,
        ),
      }),
      {
        action: "Product updated",
        entity: selected.name,
        detail: "Product, merchandising and SEO information saved",
      },
    );
    setSlug(normalizedSlug);
    setSaved(true);
    setNotice("Product information saved.");
  }

  function resetInformation() {
    setName(selected.name);
    setSlug(selected.slug);
    setDescription(selected.description ?? "");
    setCategoryId(selected.categoryIds[0] ?? "");
    setMaterial(selected.material ?? "");
    setFit(selected.fit ?? "");
    setCare(selected.care ?? "");
    setKeywords(selected.keywords?.join(", ") ?? "");
    setSeoTitle(selected.seoTitle ?? "");
    setSeoDescription(selected.seoDescription ?? "");
    setReleasedAt(toDateTimeLocal(selected.releasedAt));
    setIsNew(Boolean(selected.isNew));
    setSlugTouched(false);
    setSaved(true);
  }

  function setStatus(nextStatus: AdminContentStatus) {
    const currentIssues = publicationIssues(selected, snapshot, saved);
    if (
      (nextStatus === "published" || nextStatus === "scheduled") &&
      currentIssues.length
    ) {
      setNotice(
        `Resolve ${currentIssues.length} publishing requirement${currentIssues.length === 1 ? "" : "s"} first.`,
      );
      return;
    }
    if (
      nextStatus === "scheduled" &&
      (!selected.releasedAt ||
        new Date(selected.releasedAt).getTime() <= Date.now())
    ) {
      setNotice("Choose and save a future release date before scheduling.");
      return;
    }
    updateSnapshot(
      (current) => ({
        ...current,
        statuses: {
          ...current.statuses,
          [`product:${selected.id}`]: nextStatus,
        },
      }),
      {
        action: "Product status changed",
        entity: selected.name,
        detail: `Marked ${nextStatus}`,
      },
    );
    setNotice(
      nextStatus === "published"
        ? "Published changes are now available in the local storefront."
        : nextStatus === "scheduled"
          ? "Product scheduled for its saved release date."
          : `Product marked ${nextStatus}.`,
    );
  }

  function addColorVariant() {
    const cleanName = colorName.trim();
    const cleanHex = colorHex.trim().toUpperCase();
    const amount = Math.round(Number(price) * 100);
    const originalAmount = Math.round(Number(originalPrice) * 100);
    if (
      !cleanName ||
      !HEX_PATTERN.test(cleanHex) ||
      !sizes.length ||
      amount <= 0
    ) {
      setNotice(
        "Add a color name, valid six-digit hex code, price and at least one size.",
      );
      return;
    }
    if (
      selected.variants.some(
        (variant) =>
          variant.color?.name.toLowerCase() === cleanName.toLowerCase(),
      )
    ) {
      setNotice("That color already exists. Edit it in its color section.");
      return;
    }
    const prefix =
      skuPrefix.trim().toUpperCase() ||
      `SC-${slugPart(selected.name).slice(0, 8)}-${slugPart(cleanName).slice(0, 6)}`.toUpperCase();
    const variants: ProductVariant[] = sizes.map((size) => ({
      id: `${selected.id}-${slugPart(cleanName)}-${size.toLowerCase()}-${crypto.randomUUID().slice(0, 8)}`,
      sku: `${prefix}-${size}`,
      size,
      color: { name: cleanName, hex: cleanHex },
      price: { amount, currency: "BDT" },
      originalPrice:
        originalAmount > amount
          ? { amount: originalAmount, currency: "BDT" }
          : undefined,
      inStock: Math.max(0, Math.floor(Number(stockBySize[size]) || 0)) > 0,
      stock: Math.max(0, Math.floor(Number(stockBySize[size]) || 0)),
    }));
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === selected.id
            ? syncDefaultMedia({
                ...product,
                variants: [...product.variants, ...variants],
                colorImages: {
                  ...product.colorImages,
                  [cleanName]: [],
                },
              })
            : product,
        ),
      }),
      {
        action: "Product color created",
        entity: selected.name,
        detail: `${cleanName} added in ${sizes.join(", ")}`,
      },
    );
    setColorName("");
    setSkuPrefix("");
    setNotice(`${cleanName} created. Add its card crop and gallery next.`);
  }

  function updateColor(
    oldName: string,
    nextNameValue: string,
    nextHexValue: string,
  ) {
    const nextName = nextNameValue.trim();
    const nextHex = nextHexValue.trim().toUpperCase();
    if (!nextName || !HEX_PATTERN.test(nextHex)) {
      setNotice("Use a color name and a valid six-digit hex code.");
      return;
    }
    if (
      nextName.toLowerCase() !== oldName.toLowerCase() &&
      colors.some(
        (color) => color.name.toLowerCase() === nextName.toLowerCase(),
      )
    ) {
      setNotice("That color name already exists.");
      return;
    }
    const oldPrefix = `product-${selected.id}-color-${slugPart(oldName)}-`;
    const nextPrefix = `product-${selected.id}-color-${slugPart(nextName)}-`;
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) => {
          if (product.id !== selected.id) return product;
          const colorImages = { ...product.colorImages };
          const colorCardImages = { ...product.colorCardImages };
          const images = colorImages[oldName] ?? [];
          const card = colorCardImages[oldName];
          delete colorImages[oldName];
          delete colorCardImages[oldName];
          colorImages[nextName] = images;
          if (card) colorCardImages[nextName] = card;
          return syncDefaultMedia({
            ...product,
            colorImages,
            colorCardImages,
            variants: product.variants.map((variant) =>
              variant.color?.name === oldName
                ? { ...variant, color: { name: nextName, hex: nextHex } }
                : variant,
            ),
          });
        }),
        media: current.media.map((asset) =>
          asset.id.startsWith(oldPrefix)
            ? {
                ...asset,
                id: `${nextPrefix}${asset.id.slice(oldPrefix.length)}`,
              }
            : asset,
        ),
      }),
      {
        action: "Product color updated",
        entity: selected.name,
        detail: `${oldName} changed to ${nextName} (${nextHex})`,
      },
    );
    setNotice(`${nextName} and its storefront swatch were updated.`);
  }

  function deleteColor(colorNameToDelete: string) {
    if (
      !window.confirm(
        `Delete ${colorNameToDelete}, its variants and its images?`,
      )
    )
      return;
    const mediaPrefix = `product-${selected.id}-color-${slugPart(colorNameToDelete)}-`;
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) => {
          if (product.id !== selected.id) return product;
          const colorImages = { ...product.colorImages };
          const colorCardImages = { ...product.colorCardImages };
          delete colorImages[colorNameToDelete];
          delete colorCardImages[colorNameToDelete];
          return syncDefaultMedia({
            ...product,
            colorImages,
            colorCardImages,
            variants: product.variants.filter(
              (variant) => variant.color?.name !== colorNameToDelete,
            ),
          });
        }),
        media: current.media.filter(
          (asset) => !asset.id.startsWith(mediaPrefix),
        ),
      }),
      {
        action: "Product color deleted",
        entity: selected.name,
        detail: `${colorNameToDelete} and its media were removed`,
      },
    );
  }

  function addSize(colorNameToUse: string, size: string) {
    const template = selected.variants.find(
      (variant) => variant.color?.name === colorNameToUse,
    );
    if (!template) return;
    const nextVariant: ProductVariant = {
      ...template,
      id: `${selected.id}-${slugPart(colorNameToUse)}-${size.toLowerCase()}-${crypto.randomUUID().slice(0, 8)}`,
      size,
      sku: `${template.sku.replace(/-(S|M|L|XL)$/i, "")}-${size}`,
      stock: 0,
      inStock: false,
    };
    updateSnapshot((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === selected.id
          ? { ...product, variants: [...product.variants, nextVariant] }
          : product,
      ),
    }));
  }

  function saveCard(colorNameToUse: string, crop: AdminCrop, url: string) {
    const image: ProductImage = {
      id: `${selected.id}-${slugPart(colorNameToUse)}-card`,
      url,
      alt: `${selected.name} in ${colorNameToUse}`,
      width: 1200,
      height: 1440,
    };
    const mediaId = productColorMediaId(selected.id, colorNameToUse, "card");
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === selected.id
            ? syncDefaultMedia({
                ...product,
                colorCardImages: {
                  ...product.colorCardImages,
                  [colorNameToUse]: image,
                },
              })
            : product,
        ),
        media: upsertMedia(current.media, {
          id: mediaId,
          url,
          alt: image.alt,
          slot: "product-card",
          status,
          source: "upload",
          crop,
        }),
      }),
      {
        action: "Product card image saved",
        entity: selected.name,
        detail: `${colorNameToUse} card crop saved`,
      },
    );
  }

  function updateCardAlt(colorNameToUse: string, alt: string) {
    updateSnapshot((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== selected.id) return product;
        const image = product.colorCardImages?.[colorNameToUse];
        if (!image) return product;
        return syncDefaultMedia({
          ...product,
          colorCardImages: {
            ...product.colorCardImages,
            [colorNameToUse]: { ...image, alt },
          },
        });
      }),
    }));
  }

  function saveGalleryImage(
    colorNameToUse: string,
    index: number,
    crop: AdminCrop,
    url: string,
  ) {
    if (index >= PRODUCT_IMAGE_MAXIMUM) return;
    const currentImage = selected.colorImages?.[colorNameToUse]?.[index];
    const image: ProductImage = {
      id:
        currentImage?.id ??
        `${selected.id}-${slugPart(colorNameToUse)}-image-${crypto.randomUUID().slice(0, 8)}`,
      url,
      alt: `${selected.name} in ${colorNameToUse}, view ${index + 1}`,
      width: 1200,
      height: 1600,
    };
    const mediaId = productColorMediaId(
      selected.id,
      colorNameToUse,
      "gallery",
      index,
    );
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) => {
          if (product.id !== selected.id) return product;
          const images = [...(product.colorImages?.[colorNameToUse] ?? [])];
          if (index === images.length) images.push(image);
          else images[index] = image;
          return syncDefaultMedia({
            ...product,
            colorImages: {
              ...product.colorImages,
              [colorNameToUse]: images,
            },
          });
        }),
        media: upsertMedia(current.media, {
          id: mediaId,
          url,
          alt: image.alt,
          slot: "product-gallery",
          status,
          source: "upload",
          crop,
        }),
      }),
      {
        action: "Product gallery updated",
        entity: selected.name,
        detail: `${colorNameToUse} image ${index + 1} saved`,
      },
    );
  }

  function updateImageAlt(colorNameToUse: string, index: number, alt: string) {
    const mediaId = productColorMediaId(
      selected.id,
      colorNameToUse,
      "gallery",
      index,
    );
    updateSnapshot((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== selected.id) return product;
        const images = [...(product.colorImages?.[colorNameToUse] ?? [])];
        const image = images[index];
        if (!image) return product;
        images[index] = { ...image, alt };
        return syncDefaultMedia({
          ...product,
          colorImages: { ...product.colorImages, [colorNameToUse]: images },
        });
      }),
      media: current.media.map((asset) =>
        asset.id === mediaId ? { ...asset, alt } : asset,
      ),
    }));
  }

  function moveImage(colorNameToUse: string, index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    updateSnapshot((current) => ({
      ...current,
      products: current.products.map((product) => {
        if (product.id !== selected.id) return product;
        const images = [...(product.colorImages?.[colorNameToUse] ?? [])];
        if (!images[index] || !images[nextIndex]) return product;
        [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
        return syncDefaultMedia({
          ...product,
          colorImages: { ...product.colorImages, [colorNameToUse]: images },
        });
      }),
      media: swapGalleryMedia(
        current.media,
        selected.id,
        colorNameToUse,
        index,
        nextIndex,
      ),
    }));
  }

  function deleteImage(colorNameToUse: string, index: number) {
    if (!window.confirm(`Delete ${colorNameToUse} image ${index + 1}?`)) return;
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) => {
          if (product.id !== selected.id) return product;
          const images = (product.colorImages?.[colorNameToUse] ?? []).filter(
            (_, imageIndex) => imageIndex !== index,
          );
          return syncDefaultMedia({
            ...product,
            colorImages: { ...product.colorImages, [colorNameToUse]: images },
          });
        }),
        media: removeGalleryMedia(
          current.media,
          selected.id,
          colorNameToUse,
          index,
        ),
      }),
      {
        action: "Product image deleted",
        entity: selected.name,
        detail: `${colorNameToUse} gallery image ${index + 1} removed`,
      },
    );
  }

  function updateVariant(variantId: string, patch: Partial<ProductVariant>) {
    updateSnapshot((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === selected.id
          ? {
              ...product,
              variants: product.variants.map((variant) =>
                variant.id === variantId ? { ...variant, ...patch } : variant,
              ),
            }
          : product,
      ),
    }));
  }

  function removeVariant(variantId: string) {
    if (!window.confirm("Delete this size variant?")) return;
    updateSnapshot(
      (current) => ({
        ...current,
        products: current.products.map((product) =>
          product.id === selected.id
            ? {
                ...product,
                variants: product.variants.filter(
                  (variant) => variant.id !== variantId,
                ),
              }
            : product,
        ),
      }),
      {
        action: "Product variant removed",
        entity: selected.name,
        detail: "A size and color variant was removed",
      },
    );
  }

  return (
    <div className="admin-editor-stack admin-product-editor-stack">
      <section className="admin-panel admin-editor-panel admin-product-copy-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">General and merchandising</p>
            <h2>{selected.name}</h2>
            <p>
              Core storefront copy, URL, badges, release timing and product
              information.
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
        <div className="admin-product-details-grid">
          <FieldLabel label="Product name">
            <input
              value={name}
              onChange={(event) => {
                const value = event.target.value;
                setName(value);
                if (!slugTouched) setSlug(slugPart(value));
                markChanged();
              }}
            />
          </FieldLabel>
          <FieldLabel label="URL slug" hint={`/products/${slugPart(slug)}`}>
            <div className="admin-slug-field">
              <input
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugTouched(true);
                  markChanged();
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setSlug(slugPart(name));
                  setSlugTouched(true);
                  markChanged();
                }}
              >
                Generate
              </button>
            </div>
          </FieldLabel>
          <div className="admin-field">
            <span className="admin-field-label">Category</span>
            <AdminSelect
              value={categoryId}
              ariaLabel="Product category"
              onChange={(value) => {
                setCategoryId(value);
                markChanged();
              }}
              options={snapshot.categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
            />
          </div>
          <div className="admin-field">
            <span className="admin-field-label">Publishing status</span>
            <AdminSelect
              value={status}
              ariaLabel="Product status"
              onChange={(value) => setStatus(value as AdminContentStatus)}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "scheduled", label: "Scheduled" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
          <FieldLabel
            label="Release date"
            hint="Used for scheduling and newest sorting"
          >
            <input
              type="datetime-local"
              value={releasedAt}
              onChange={(event) => {
                setReleasedAt(event.target.value);
                markChanged();
              }}
            />
          </FieldLabel>
          <label className="admin-toggle-field">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(event) => {
                setIsNew(event.target.checked);
                markChanged();
              }}
            />
            <span>
              <strong>New arrival</strong>
              <small>
                Show the NEW badge and include this product in New Arrivals.
              </small>
            </span>
          </label>
          <FieldLabel label="Description">
            <textarea
              rows={5}
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                markChanged();
              }}
            />
          </FieldLabel>
          <FieldLabel label="Material and details">
            <textarea
              rows={5}
              value={material}
              onChange={(event) => {
                setMaterial(event.target.value);
                markChanged();
              }}
            />
          </FieldLabel>
          <FieldLabel label="Fit and sizing">
            <textarea
              rows={4}
              value={fit}
              onChange={(event) => {
                setFit(event.target.value);
                markChanged();
              }}
            />
          </FieldLabel>
          <FieldLabel label="Care instructions">
            <textarea
              rows={4}
              value={care}
              onChange={(event) => {
                setCare(event.target.value);
                markChanged();
              }}
            />
          </FieldLabel>
          <FieldLabel
            label="Search keywords"
            hint="Separate phrases with commas"
          >
            <input
              value={keywords}
              placeholder="oxford, relaxed shirt, cotton"
              onChange={(event) => {
                setKeywords(event.target.value);
                markChanged();
              }}
            />
          </FieldLabel>
        </div>
        <div className="admin-seo-editor">
          <div>
            <p className="admin-eyebrow">Search and sharing</p>
            <h3>Product SEO</h3>
          </div>
          <div className="admin-form-grid">
            <FieldLabel
              label="SEO title"
              hint={`${seoTitle.length} / 60 characters`}
            >
              <input
                maxLength={70}
                value={seoTitle}
                placeholder={name}
                onChange={(event) => {
                  setSeoTitle(event.target.value);
                  markChanged();
                }}
              />
            </FieldLabel>
            <FieldLabel
              label="SEO description"
              hint={`${seoDescription.length} / 160 characters`}
            >
              <textarea
                rows={3}
                maxLength={180}
                value={seoDescription}
                placeholder={description}
                onChange={(event) => {
                  setSeoDescription(event.target.value);
                  markChanged();
                }}
              />
            </FieldLabel>
          </div>
          <div className="admin-seo-preview">
            <small>styleco.local/products/{slugPart(slug)}</small>
            <strong>{seoTitle || name}</strong>
            <p>{seoDescription || description}</p>
          </div>
        </div>
        {notice ? (
          <p className="admin-inline-notice" role="status">
            {notice}
          </p>
        ) : null}
        <SaveBar
          saved={saved}
          onSave={saveProductInformation}
          onReset={resetInformation}
        />
      </section>

      <section className="admin-panel admin-publish-checklist">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Publishing readiness</p>
            <h2>
              {issues.length
                ? `${issues.length} items need attention`
                : "Ready to publish"}
            </h2>
            <p>The storefront receives only complete published products.</p>
          </div>
          {issues.length ? (
            <AlertCircle size={22} />
          ) : (
            <ShieldCheck size={22} />
          )}
        </div>
        <ul>
          {issues.length ? (
            issues.map((issue) => (
              <li key={issue}>
                <AlertCircle size={14} /> {issue}
              </li>
            ))
          ) : (
            <li className="is-complete">
              <Check size={14} /> Product information, media and variants are
              complete.
            </li>
          )}
        </ul>
      </section>

      <section className="admin-panel admin-variant-builder-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Step 2 / Create variant</p>
            <h2>Create a product variant</h2>
            <p>
              A variant is a customer-selectable color. Create it with its
              prices, sizes and independent stock; its image workspace appears
              below after saving.
            </p>
          </div>
          <span className="admin-surface-note">
            <Palette size={14} /> {colors.length} colors
          </span>
        </div>
        <div className="admin-variant-builder-grid">
          <FieldLabel label="Color name" hint="Shown beside the swatch">
            <input
              value={colorName}
              placeholder="e.g. Forest Green"
              onChange={(event) => setColorName(event.target.value)}
            />
          </FieldLabel>
          <div className="admin-field">
            <span className="admin-field-label">Color and hex code</span>
            <div className="admin-color-picker-row">
              <input
                type="color"
                value={HEX_PATTERN.test(colorHex) ? colorHex : "#1E3028"}
                aria-label="Variant color picker"
                onChange={(event) =>
                  setColorHex(event.target.value.toUpperCase())
                }
              />
              <input
                value={colorHex}
                aria-label="Variant hex code"
                spellCheck={false}
                onChange={(event) => setColorHex(event.target.value)}
              />
            </div>
          </div>
          <FieldLabel label="Price" hint="Bangladeshi taka">
            <input
              type="number"
              min="1"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </FieldLabel>
          <FieldLabel
            label="Original price"
            hint="Optional; creates SALE pricing"
          >
            <input
              type="number"
              min="1"
              value={originalPrice}
              onChange={(event) => setOriginalPrice(event.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="SKU prefix" hint="Optional; size is appended">
            <input
              value={skuPrefix}
              placeholder="SC-SHIRT-GRN"
              onChange={(event) => setSkuPrefix(event.target.value)}
            />
          </FieldLabel>
          <fieldset className="admin-size-stock-picker">
            <legend>Available sizes and stock</legend>
            <p>Set inventory independently for every selected size.</p>
            <div className="admin-size-stock-grid">
              {PRODUCT_SIZES.map((size) => (
                <div
                  key={size}
                  className={`admin-size-stock-row${sizes.includes(size) ? " is-selected" : ""}`}
                >
                  <label className="admin-size-toggle">
                    <input
                      type="checkbox"
                      checked={sizes.includes(size)}
                      onChange={(event) =>
                        setSizes((current) =>
                          event.target.checked
                            ? [...current, size]
                            : current.filter((item) => item !== size),
                        )
                      }
                    />
                    <span>{size}</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={stockBySize[size] ?? "0"}
                    disabled={!sizes.includes(size)}
                    aria-label={`Starting stock for size ${size}`}
                    onChange={(event) =>
                      setStockBySize((current) => ({
                        ...current,
                        [size]: event.target.value,
                      }))
                    }
                  />
                </div>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="admin-variant-builder-action">
          <AdminButton onClick={addColorVariant}>
            <Plus size={15} /> Create variant
          </AdminButton>
        </div>
      </section>

      {colors.length ? (
        <div className="admin-product-variant-workspaces">
          <div className="admin-section-intro">
            <div>
              <p className="admin-eyebrow">Step 3 / Variant media</p>
              <h2>Images for each variant</h2>
            </div>
            <p>
              Open each color variant below to upload one required image and up
              to four ordered product images.
            </p>
          </div>
          {colors.map((color) => {
            const variants = selected.variants.filter(
              (variant) => variant.color?.name === color.name,
            );
            const images = selected.colorImages?.[color.name] ?? [];
            const cardImage = selected.colorCardImages?.[color.name];
            return (
              <ProductColorMediaEditor
                key={color.name}
                productId={selected.id}
                productName={selected.name}
                color={color}
                variants={variants}
                images={images}
                cardImage={cardImage}
                media={snapshot.media}
                onUpdateColor={(nextName, nextHex) =>
                  updateColor(color.name, nextName, nextHex)
                }
                onDeleteColor={() => deleteColor(color.name)}
                onAddSize={(size) => addSize(color.name, size)}
                onSaveCard={(crop, url) => saveCard(color.name, crop, url)}
                onCardAlt={(alt) => updateCardAlt(color.name, alt)}
                onSaveImage={(index, crop, url) =>
                  saveGalleryImage(color.name, index, crop, url)
                }
                onImageAlt={(index, alt) =>
                  updateImageAlt(color.name, index, alt)
                }
                onMoveImage={(index, direction) =>
                  moveImage(color.name, index, direction)
                }
                onDeleteImage={(index) => deleteImage(color.name, index)}
              />
            );
          })}
        </div>
      ) : (
        <section className="admin-panel admin-empty-state admin-product-variant-empty-state">
          <Palette size={22} />
          <h2>Variant image uploads will appear here</h2>
          <p>
            Create your first product variant above. Each variant then gets its
            own image uploader for 1–4 product images.
          </p>
        </section>
      )}

      <section className="admin-panel admin-editor-panel admin-variant-matrix-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Step 4 / Inventory</p>
            <h2>Stock by color and size</h2>
            <p>
              Every color and size combination has independent pricing, SKU and
              stock.
            </p>
          </div>
          <span className="admin-surface-note">
            <Check size={14} /> {selected.variants.length} variants
          </span>
        </div>
        {selected.variants.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-variant-table">
              <thead>
                <tr>
                  <th>Color</th>
                  <th>Size</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Original</th>
                  <th>Stock</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {selected.variants.map((variant) => (
                  <tr key={variant.id}>
                    <td>
                      <span
                        className="admin-color-swatch"
                        style={{ backgroundColor: variant.color?.hex }}
                      />
                      {variant.color?.name}
                    </td>
                    <td>
                      <AdminSelect
                        className="admin-table-select"
                        value={variant.size ?? "S"}
                        ariaLabel={`Size for ${variant.color?.name} ${variant.sku}`}
                        onChange={(value) =>
                          updateVariant(variant.id, { size: value })
                        }
                        options={PRODUCT_SIZES.map((size) => ({
                          value: size,
                          label: size,
                        }))}
                      />
                    </td>
                    <td>
                      <input
                        className="admin-sku-input"
                        value={variant.sku}
                        aria-label={`SKU for ${variant.color?.name} ${variant.size}`}
                        onChange={(event) =>
                          updateVariant(variant.id, {
                            sku: event.target.value.toUpperCase(),
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-price-input"
                        type="number"
                        min="1"
                        value={variant.price.amount / 100}
                        aria-label={`Price for ${variant.color?.name} ${variant.size}`}
                        onChange={(event) =>
                          updateVariant(variant.id, {
                            price: {
                              ...variant.price,
                              amount: Math.max(
                                100,
                                Math.round(Number(event.target.value) * 100) ||
                                  100,
                              ),
                            },
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="admin-price-input"
                        type="number"
                        min="0"
                        value={
                          variant.originalPrice?.amount
                            ? variant.originalPrice.amount / 100
                            : ""
                        }
                        placeholder="—"
                        aria-label={`Original price for ${variant.color?.name} ${variant.size}`}
                        onChange={(event) => {
                          const amount = Math.round(
                            Number(event.target.value) * 100,
                          );
                          updateVariant(variant.id, {
                            originalPrice:
                              amount > variant.price.amount
                                ? { amount, currency: variant.price.currency }
                                : undefined,
                          });
                        }}
                      />
                    </td>
                    <td>
                      <input
                        className="admin-stock-input"
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stock ?? 0}
                        onChange={(event) => {
                          const nextStock = Math.max(
                            0,
                            Math.floor(Number(event.target.value) || 0),
                          );
                          updateVariant(variant.id, {
                            stock: nextStock,
                            inStock: nextStock > 0,
                          });
                        }}
                        aria-label={`Stock for ${variant.color?.name} ${variant.size}`}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="admin-icon-button admin-icon-button-danger"
                        onClick={() => removeVariant(variant.id)}
                        aria-label={`Remove ${variant.color?.name} ${variant.size} variant`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty-state admin-variant-empty-state">
            <Palette size={22} />
            <h3>No variants yet</h3>
            <p>Create a product variant above to set its sizes and stock.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export function AdminProductDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { snapshot, updateSnapshot } = useAdmin();
  const product = snapshot.products.find((item) => item.id === params.id);

  if (!product) {
    return (
      <div className="admin-empty-state">
        <h1>Product not found</h1>
        <p>This product is no longer in the local catalog.</p>
        <Link
          href="/admin/products"
          className="admin-button admin-button-secondary"
        >
          <ArrowLeft size={15} /> Back to products
        </Link>
      </div>
    );
  }

  function duplicateProduct() {
    if (!product) return;
    const id = `product-${crypto.randomUUID()}`;
    const slug = `${product.slug}-copy-${Date.now()}`;
    const duplicate: Product = {
      ...structuredClone(product),
      id,
      slug,
      name: `${product.name} copy`,
      releasedAt: new Date().toISOString(),
      adminManaged: true,
      variants: product.variants.map((variant) => ({
        ...variant,
        id: `${id}-${crypto.randomUUID()}`,
        sku: `${variant.sku}-COPY`,
      })),
    };
    updateSnapshot(
      (current) => ({
        ...current,
        products: [...current.products, duplicate],
        statuses: { ...current.statuses, [`product:${id}`]: "draft" },
      }),
      {
        action: "Product duplicated",
        entity: product.name,
        detail: `${duplicate.name} created as a draft`,
      },
    );
    router.push(`/admin/products/${id}`);
  }

  function deleteProduct() {
    if (
      !product ||
      !window.confirm(
        `Delete ${product.name}? This removes its local Admin data.`,
      )
    )
      return;
    updateSnapshot(
      (current) => {
        const statuses = { ...current.statuses };
        delete statuses[`product:${product.id}`];
        return {
          ...current,
          products: current.products.filter((item) => item.id !== product.id),
          media: current.media.filter(
            (asset) => !asset.id.startsWith(`product-${product.id}`),
          ),
          homepageSections: current.homepageSections.map((section) =>
            section.kind === "curated-products"
              ? {
                  ...section,
                  products: section.products.filter(
                    (reference) => reference.productId !== product.id,
                  ),
                }
              : section,
          ),
          statuses,
        };
      },
      {
        action: "Product deleted",
        entity: product.name,
        detail: "Product and its local media were removed",
      },
    );
    router.push("/admin/products");
  }

  const status = snapshot.statuses[`product:${product.id}`] ?? "published";
  const previewHref = `/products/preview?id=${encodeURIComponent(product.id)}`;
  return (
    <>
      <AdminPageHeader
        eyebrow={`Catalog / ${product.slug}`}
        title={`Edit ${product.name}.`}
        description="Control every storefront field, color-specific image, sale state and purchasable variant from one workspace."
        action={
          <>
            <PreviewLink href={previewHref} />
            <AdminButton variant="secondary" onClick={duplicateProduct}>
              <Copy size={15} /> Duplicate
            </AdminButton>
            <Link
              href="/admin/products"
              className="admin-button admin-button-secondary"
            >
              <ArrowLeft size={15} /> Back to products
            </Link>
          </>
        }
      />
      <ProductEditor key={product.id} selected={product} />
      <section className="admin-danger-panel admin-product-danger-zone">
        <div>
          <p className="admin-eyebrow">Danger zone</p>
          <h2>Delete this product</h2>
          <p>
            Removes the product, its variants and local Admin media. This cannot
            be undone after the browser state is saved.
          </p>
        </div>
        <AdminButton variant="danger" onClick={deleteProduct}>
          <Trash2 size={15} /> Delete product
        </AdminButton>
      </section>
      <span className="sr-only">Current status: {status}</span>
    </>
  );
}
