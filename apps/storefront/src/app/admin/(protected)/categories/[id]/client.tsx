"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-provider";
import { MediaCropper } from "@/components/admin/media-cropper";
import {
  AdminButton,
  AdminPageHeader,
  AdminSelect,
  FieldLabel,
  SaveBar,
  StatusBadge,
} from "@/components/admin/admin-ui";
import type { AdminContentStatus, AdminCrop } from "@/domain/admin";
import type { Category } from "@/domain/catalog";

function CategoryEditor({
  selected,
  onDelete,
  canDelete,
}: {
  selected: Category;
  onDelete: () => void;
  canDelete: boolean;
}) {
  const { snapshot, updateSnapshot } = useAdmin();
  const [name, setName] = useState(selected.name);
  const [label, setLabel] = useState(selected.editorialLabel ?? "");
  const [saved, setSaved] = useState(true);
  const status = snapshot.statuses[`category:${selected.id}`] ?? "published";

  function save() {
    updateSnapshot(
      (current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.id === selected.id
            ? { ...category, name, editorialLabel: label }
            : category,
        ),
      }),
      {
        action: "Category updated",
        entity: selected.name,
        detail: "Name and editorial label saved",
      },
    );
    setSaved(true);
  }

  function setStatus(nextStatus: AdminContentStatus) {
    updateSnapshot(
      (current) => ({
        ...current,
        statuses: {
          ...current.statuses,
          [`category:${selected.id}`]: nextStatus,
        },
      }),
      {
        action: "Category status changed",
        entity: selected.name,
        detail: `Marked ${nextStatus}`,
      },
    );
  }

  function saveCrop(crop: AdminCrop, url: string) {
    const selectedImage = selected.image;
    const assetId = `category-${selected.id}`;
    updateSnapshot(
      (current) => ({
        ...current,
        categories: current.categories.map((category) =>
          category.id === selected.id
            ? {
                ...category,
                image: {
                  id: category.image?.id ?? category.id,
                  alt: category.image?.alt ?? selected.name,
                  url,
                  width: 1120,
                  height: 1400,
                },
              }
            : category,
        ),
        media: current.media.some((asset) => asset.id === assetId)
          ? current.media.map((asset) =>
              asset.id === assetId
                ? { ...asset, url, crop, source: "upload" as const }
                : asset,
            )
          : [
              ...current.media,
              {
                id: assetId,
                url,
                alt: selectedImage?.alt ?? selected.name,
                slot: "category",
                status,
                source: "upload",
                crop,
              },
            ],
      }),
      {
        action: "Category image cropped",
        entity: selected.name,
        detail: "Category panel crop saved",
      },
    );
  }

  const categoryAsset = snapshot.media.find(
    (asset) => asset.id === `category-${selected.id}`,
  );

  return (
    <div className="admin-editor-stack admin-category-editor-stack">
      <section className="admin-panel admin-editor-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Editing / {selected.slug}</p>
            <h2>{selected.name}</h2>
          </div>
          <div className="admin-heading-actions">
            <StatusBadge status={status} />
            <AdminButton
              variant="danger"
              onClick={onDelete}
              disabled={!canDelete}
            >
              <Trash2 size={14} /> Delete
            </AdminButton>
          </div>
        </div>
        <div className="admin-form-grid">
          <FieldLabel label="Category name">
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setSaved(false);
              }}
            />
          </FieldLabel>
          <FieldLabel label="Editorial label" hint="Shown beneath the image">
            <input
              value={label}
              onChange={(event) => {
                setLabel(event.target.value);
                setSaved(false);
              }}
            />
          </FieldLabel>
        </div>
        <div className="admin-editor-panel-inner">
          <div className="admin-field">
            <span className="admin-field-label">Content status</span>
            <AdminSelect
              value={status}
              ariaLabel="Content status"
              onChange={(value) => setStatus(value as AdminContentStatus)}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </div>
        </div>
        <SaveBar
          saved={saved}
          onSave={save}
          onReset={() => {
            setName(selected.name);
            setLabel(selected.editorialLabel ?? "");
            setSaved(true);
          }}
        />
      </section>
      <MediaCropper
        slot="category"
        sourceUrl={selected.image?.url ?? categoryAsset?.url ?? ""}
        alt={selected.image?.alt ?? selected.name}
        initialCrop={categoryAsset?.crop}
        onSave={saveCrop}
      />
    </div>
  );
}

export function AdminCategoryDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { snapshot, updateSnapshot } = useAdmin();
  const category = snapshot.categories.find((item) => item.id === params.id);

  function deleteCategory() {
    if (!category || snapshot.categories.length <= 1) return;
    if (!window.confirm(`Delete the ${category.name} category?`)) return;

    updateSnapshot(
      (current) => ({
        ...current,
        categories: current.categories.filter(
          (item) => item.id !== category.id,
        ),
        media: current.media.filter(
          (asset) => asset.id !== `category-${category.id}`,
        ),
        statuses: Object.fromEntries(
          Object.entries(current.statuses).filter(
            ([key]) => key !== `category:${category.id}`,
          ),
        ),
      }),
      {
        action: "Category deleted",
        entity: category.name,
        detail: "Category removed from the local workspace",
      },
    );
    router.push("/admin/categories");
  }

  if (!category) {
    return (
      <div className="admin-empty-state">
        <h1>Category not found</h1>
        <p>This category is no longer in the local catalog.</p>
        <Link
          href="/admin/categories"
          className="admin-button admin-button-secondary"
        >
          <ArrowLeft size={15} /> Back to categories
        </Link>
      </div>
    );
  }

  return (
    <>
      <AdminPageHeader
        eyebrow={`Catalog / ${category.slug}`}
        title={`Edit ${category.name}.`}
        description="Keep the collection naming, publishing status and storefront crop together in one focused workspace."
        action={
          <Link
            href="/admin/categories"
            className="admin-button admin-button-secondary"
          >
            <ArrowLeft size={15} /> Back to categories
          </Link>
        }
      />
      <CategoryEditor
        key={category.id}
        selected={category}
        onDelete={deleteCategory}
        canDelete={snapshot.categories.length > 1}
      />
    </>
  );
}
