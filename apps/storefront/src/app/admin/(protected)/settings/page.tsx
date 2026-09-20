"use client";

import { AlertTriangle, RotateCcw, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "@/components/admin/admin-provider";
import { MediaCropper } from "@/components/admin/media-cropper";
import {
  AdminButton,
  AdminPageHeader,
  FieldLabel,
  PreviewLink,
} from "@/components/admin/admin-ui";
import type { AdminCrop } from "@/domain/admin";
import {
  ADMIN_HOMEPAGE_IMAGE_SLOTS,
  createHomepageMediaAssets,
  type AdminHomepageImageSlot,
} from "@/services/admin-media";

function HomepageImageManager() {
  const { snapshot, updateSnapshot } = useAdmin();
  const fallbackAssets = createHomepageMediaAssets(snapshot.homepageContent);

  function saveImage(
    slot: AdminHomepageImageSlot,
    crop: AdminCrop,
    url: string,
  ) {
    updateSnapshot(
      (current) => {
        const existing = current.media.find((asset) => asset.id === slot.id);
        const nextAsset = {
          id: slot.id,
          url,
          alt: existing?.alt ?? slot.label,
          slot: slot.slot,
          status: existing?.status ?? "draft",
          source: "upload" as const,
          crop,
        };

        return {
          ...current,
          media: existing
            ? current.media.map((asset) =>
                asset.id === slot.id ? nextAsset : asset,
              )
            : [...current.media, nextAsset],
        };
      },
      {
        action: "Homepage image updated",
        entity: slot.label,
        detail: "Section image cropped and saved",
      },
    );
  }

  return (
    <section className="admin-panel admin-editor-panel admin-homepage-media-panel">
      <div className="admin-panel-heading">
        <div>
          <p className="admin-eyebrow">Storefront imagery</p>
          <h2>Shape every photo slot.</h2>
          <p className="admin-muted-copy">
            Upload a photo for a homepage section and frame it inside the exact
            target viewport used by the storefront.
          </p>
        </div>
        <span className="admin-surface-note">Crop previews save instantly</span>
      </div>
      <div className="admin-homepage-media-grid">
        {ADMIN_HOMEPAGE_IMAGE_SLOTS.map((slot) => {
          const asset =
            snapshot.media.find((item) => item.id === slot.id) ??
            fallbackAssets.find((item) => item.id === slot.id);
          if (!asset) return null;

          return (
            <MediaCropper
              key={slot.id}
              slot={slot.slot}
              sourceUrl={asset.url}
              alt={asset.alt}
              initialCrop={asset.crop}
              onSave={(crop, url) => saveImage(slot, crop, url)}
            />
          );
        })}
      </div>
    </section>
  );
}

export default function AdminSettingsPage() {
  const { snapshot, updateSnapshot, resetDemoData } = useAdmin();
  const [form, setForm] = useState(snapshot.settings);
  const [saved, setSaved] = useState(true);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function save() {
    updateSnapshot(
      (current) => ({
        ...current,
        settings: form,
        homepageContent: {
          ...current.homepageContent,
          announcement: form.announcement,
        },
      }),
      {
        action: "Store settings updated",
        entity: "Settings",
        detail: "Store profile and SEO settings saved",
      },
    );
    setSaved(true);
  }

  return (
    <>
      <AdminPageHeader
        eyebrow="Workspace / Settings"
        title="Set the tone behind the scenes."
        description="Keep the store identity, announcement and search details in one place."
        action={<PreviewLink />}
      />
      <section className="admin-panel admin-editor-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Store identity</p>
            <h2>Public-facing basics</h2>
          </div>
          <ShieldCheck size={20} />
        </div>
        <div className="admin-form-grid">
          <FieldLabel label="Store name">
            <input
              value={form.storeName}
              onChange={(event) => update("storeName", event.target.value)}
            />
          </FieldLabel>
          <FieldLabel label="Delivery note">
            <input
              value={form.deliveryNote}
              onChange={(event) => update("deliveryNote", event.target.value)}
            />
          </FieldLabel>
        </div>
        <FieldLabel
          label="Announcement strip"
          hint="Also updates the homepage announcement field."
        >
          <input
            value={form.announcement}
            onChange={(event) => update("announcement", event.target.value)}
          />
        </FieldLabel>
      </section>
      <section className="admin-panel admin-editor-panel">
        <div className="admin-panel-heading">
          <div>
            <p className="admin-eyebrow">Search engine preview</p>
            <h2>Default metadata</h2>
          </div>
          <span className="admin-surface-note">Public pages only</span>
        </div>
        <FieldLabel label="SEO title">
          <input
            value={form.seoTitle}
            onChange={(event) => update("seoTitle", event.target.value)}
          />
        </FieldLabel>
        <FieldLabel label="SEO description">
          <textarea
            rows={4}
            value={form.seoDescription}
            onChange={(event) => update("seoDescription", event.target.value)}
          />
        </FieldLabel>
        <div className="admin-seo-preview">
          <span className="admin-seo-label">Google preview</span>
          <strong>{form.seoTitle || "Your store title"}</strong>
          <a href="#" onClick={(event) => event.preventDefault()}>
            styleco.example
          </a>
          <p>
            {form.seoDescription || "Your store description will appear here."}
          </p>
        </div>
      </section>
      <HomepageImageManager />
      <div className="admin-save-bar">
        <span className={saved ? "is-saved" : ""}>
          {saved ? <ShieldCheck size={15} /> : <Save size={15} />}
          {saved ? "Saved to this browser" : "Unsaved changes"}
        </span>
        <AdminButton onClick={save}>
          <Save size={15} /> Save settings
        </AdminButton>
      </div>
      <section className="admin-panel admin-danger-panel">
        <div>
          <p className="admin-eyebrow">Demo maintenance</p>
          <h2>Reset this browser workspace</h2>
          <p className="admin-muted-copy">
            Remove local Admin edits and return to the original catalog/content
            snapshot. This does not delete source files.
          </p>
        </div>
        <AdminButton
          variant="danger"
          onClick={() => {
            if (window.confirm("Reset all Admin changes in this browser?"))
              resetDemoData();
          }}
        >
          <RotateCcw size={15} /> Reset demo data
        </AdminButton>
      </section>
      <div className="admin-warning-note">
        <AlertTriangle size={16} />
        <p>
          Security note: `admin` / `admin` is intentionally a frontend demo
          credential. Replace it with server-managed Appwrite Auth before
          production.
        </p>
      </div>
    </>
  );
}
