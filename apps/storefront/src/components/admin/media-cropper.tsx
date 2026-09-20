"use client";

import Image from "next/image";
import {
  Check,
  ImagePlus,
  Minus,
  Move,
  Plus,
  RotateCcw,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AdminCrop, AdminMediaSlot } from "@/domain/admin";
import { AdminButton } from "./admin-ui";

export const ADMIN_MEDIA_SLOTS: Record<
  AdminMediaSlot,
  {
    label: string;
    description: string;
    aspectRatio: number;
    targetSize: string;
    targetWidth: number;
    targetHeight: number;
  }
> = {
  category: {
    label: "Category panel",
    description: "Tall editorial panel used in the category collage.",
    aspectRatio: 4 / 4.9,
    targetSize: "1200 × 1470 px",
    targetWidth: 1200,
    targetHeight: 1470,
  },
  "product-card": {
    label: "Product card",
    description: "The product tile image shown in listing and carousel cards.",
    aspectRatio: 4 / 4.8,
    targetSize: "1200 × 1440 px",
    targetWidth: 1200,
    targetHeight: 1440,
  },
  "product-gallery": {
    label: "Product gallery",
    description: "The larger image shown on a product detail page.",
    aspectRatio: 3 / 4,
    targetSize: "1200 × 1600 px",
    targetWidth: 1200,
    targetHeight: 1600,
  },
  campaign: {
    label: "Campaign banner",
    description: "Wide editorial artwork used in campaign sections.",
    aspectRatio: 16 / 7,
    targetSize: "2400 × 1050 px",
    targetWidth: 2400,
    targetHeight: 1050,
  },
  "homepage-sale-banner": {
    label: "Explore Current Sale",
    description: "Full-width sale banner displayed below the product rails.",
    aspectRatio: 16 / 7,
    targetSize: "2400 × 1050 px",
    targetWidth: 2400,
    targetHeight: 1050,
  },
  "homepage-favorite": {
    label: "Find your next favorite",
    description: "Large seasonal image in the homepage discovery grid.",
    aspectRatio: 1,
    targetSize: "1800 × 1800 px",
    targetWidth: 1800,
    targetHeight: 1800,
  },
  "homepage-katua": {
    label: "The Katua Collection",
    description: "Upper-right seasonal image in the homepage discovery grid.",
    aspectRatio: 16 / 9,
    targetSize: "1600 × 900 px",
    targetWidth: 1600,
    targetHeight: 900,
  },
  "homepage-slow-morning": {
    label: "Made for slow mornings",
    description: "Lower-right seasonal image in the homepage discovery grid.",
    aspectRatio: 16 / 9,
    targetSize: "1600 × 900 px",
    targetWidth: 1600,
    targetHeight: 900,
  },
  "homepage-brand": {
    label: "Behind The Brand",
    description: "Brand story image displayed beside the homepage copy.",
    aspectRatio: 4 / 3,
    targetSize: "1800 × 1350 px",
    targetWidth: 1800,
    targetHeight: 1350,
  },
};

type CropPosition = { x: number; y: number };
type CropSize = { width: number; height: number };

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function getCropSize(
  imageAspectRatio: number,
  targetAspectRatio: number,
  scale: number,
): CropSize {
  const maximum =
    imageAspectRatio > targetAspectRatio
      ? { width: targetAspectRatio / imageAspectRatio, height: 1 }
      : { width: 1, height: imageAspectRatio / targetAspectRatio };

  return {
    width: maximum.width * scale,
    height: maximum.height * scale,
  };
}

function centerCrop(size: CropSize): CropPosition {
  return {
    x: (1 - size.width) / 2,
    y: (1 - size.height) / 2,
  };
}

export function MediaCropper({
  slot,
  sourceUrl,
  alt,
  initialCrop,
  onSave,
  onCancel,
  title,
}: {
  slot: AdminMediaSlot;
  sourceUrl: string;
  alt: string;
  initialCrop?: AdminCrop;
  onSave: (crop: AdminCrop, url: string) => void;
  onCancel?: () => void;
  title?: string;
}) {
  const config = ADMIN_MEDIA_SLOTS[slot];
  const displayLabel = title ?? config.label;
  const hasInitialCrop = Boolean(initialCrop);
  const [source, setSource] = useState(sourceUrl);
  const [imageSize, setImageSize] = useState({
    width: config.targetWidth,
    height: config.targetHeight,
  });
  const [cropScale, setCropScale] = useState(1);
  const [position, setPosition] = useState<CropPosition>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [saved, setSaved] = useState(hasInitialCrop);
  const imageRef = useRef<HTMLImageElement>(null);
  const imageShellRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef({ clientX: 0, clientY: 0, position });
  const imageAspectRatio = imageSize.width / imageSize.height;
  const cropSize = getCropSize(imageAspectRatio, config.aspectRatio, cropScale);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSource(sourceUrl);
      setImageSize({
        width: config.targetWidth,
        height: config.targetHeight,
      });
      setCropScale(1);
      setPosition({ x: 0, y: 0 });
      setSaved(hasInitialCrop);
    });

    return () => cancelAnimationFrame(frame);
  }, [config.targetHeight, config.targetWidth, hasInitialCrop, sourceUrl]);

  function onImageLoad(event: React.SyntheticEvent<HTMLImageElement>) {
    const nextSize = {
      width: event.currentTarget.naturalWidth,
      height: event.currentTarget.naturalHeight,
    };
    const nextCropSize = getCropSize(
      nextSize.width / nextSize.height,
      config.aspectRatio,
      1,
    );
    setImageSize(nextSize);
    setCropScale(1);
    setPosition(centerCrop(nextCropSize));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStart.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      position,
    };
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const imageShell = imageShellRef.current;
    if (!dragging || !imageShell) return;
    const bounds = imageShell.getBoundingClientRect();
    const nextX =
      dragStart.current.position.x +
      (event.clientX - dragStart.current.clientX) / bounds.width;
    const nextY =
      dragStart.current.position.y +
      (event.clientY - dragStart.current.clientY) / bounds.height;
    setSaved(false);
    setPosition({
      x: clamp(nextX, 0, 1 - cropSize.width),
      y: clamp(nextY, 0, 1 - cropSize.height),
    });
  }

  function moveCrop(deltaX: number, deltaY: number) {
    setSaved(false);
    setPosition((current) => ({
      x: clamp(current.x + deltaX, 0, 1 - cropSize.width),
      y: clamp(current.y + deltaY, 0, 1 - cropSize.height),
    }));
  }

  function onCropKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 0.05 : 0.01;
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = movement[event.key];
    if (!delta) return;
    event.preventDefault();
    moveCrop(delta[0], delta[1]);
  }

  function updateCropScale(nextScale: number) {
    const scale = clamp(nextScale, 0.35, 1);
    const nextCropSize = getCropSize(
      imageAspectRatio,
      config.aspectRatio,
      scale,
    );
    const centerX = position.x + cropSize.width / 2;
    const centerY = position.y + cropSize.height / 2;
    setCropScale(scale);
    setPosition({
      x: clamp(centerX - nextCropSize.width / 2, 0, 1 - nextCropSize.width),
      y: clamp(centerY - nextCropSize.height / 2, 0, 1 - nextCropSize.height),
    });
    setSaved(false);
  }

  function resetCrop() {
    const nextCropSize = getCropSize(imageAspectRatio, config.aspectRatio, 1);
    setSaved(false);
    setCropScale(1);
    setPosition(centerCrop(nextCropSize));
  }

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setSource(reader.result);
        setSaved(false);
      }
    });
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function saveSelectedCrop() {
    const image = imageRef.current;
    if (!image?.naturalWidth || !image.naturalHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = config.targetWidth;
    canvas.height = config.targetHeight;
    const context = canvas.getContext("2d");
    if (!context) return;

    context.drawImage(
      image,
      position.x * image.naturalWidth,
      position.y * image.naturalHeight,
      cropSize.width * image.naturalWidth,
      cropSize.height * image.naturalHeight,
      0,
      0,
      config.targetWidth,
      config.targetHeight,
    );

    const croppedUrl = canvas.toDataURL("image/webp", 0.9);
    onSave(
      {
        x: position.x,
        y: position.y,
        zoom: cropScale,
        aspectRatio: config.aspectRatio,
      },
      croppedUrl,
    );
    setSource(croppedUrl);
    setSaved(true);
  }

  if (!source) {
    return (
      <div className="admin-cropper admin-cropper-empty">
        <div className="admin-cropper-heading">
          <div>
            <p className="admin-eyebrow">Image placement</p>
            <h3>{displayLabel}</h3>
            <p>{config.description}</p>
          </div>
          <span className="admin-ratio-chip">
            {config.targetSize} · {Math.round(config.aspectRatio * 100) / 100}:1
            viewport
          </span>
        </div>
        <div className="admin-crop-empty-state">
          <ImagePlus size={24} />
          <strong>Choose an image to start cropping</strong>
          <p>The complete photo will open beneath the movable crop area.</p>
          <label className="admin-button admin-button-secondary admin-file-button">
            <Upload size={15} /> Upload image
            <input
              type="file"
              accept="image/*"
              aria-label={`Upload ${displayLabel}`}
              onChange={onFileChange}
            />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-cropper">
      <div className="admin-cropper-heading">
        <div>
          <p className="admin-eyebrow">Image placement</p>
          <h3>{displayLabel}</h3>
          <p>{config.description}</p>
        </div>
        <span className="admin-ratio-chip">
          {config.targetSize} · {Math.round(config.aspectRatio * 100) / 100}:1
          viewport
        </span>
      </div>
      <div
        className="admin-crop-stage"
        role="img"
        aria-label={`Full image with ${displayLabel} crop selection for ${alt}`}
      >
        <div ref={imageShellRef} className="admin-crop-image-shell">
          <Image
            ref={imageRef}
            src={source}
            alt={alt}
            width={imageSize.width}
            height={imageSize.height}
            unoptimized
            draggable={false}
            sizes="(max-width: 720px) 100vw, 720px"
            className="admin-crop-source-image"
            onLoad={onImageLoad}
          />
          <div
            className={`admin-crop-selection${dragging ? " is-dragging" : ""}`}
            style={{
              left: `${position.x * 100}%`,
              top: `${position.y * 100}%`,
              width: `${cropSize.width * 100}%`,
              height: `${cropSize.height * 100}%`,
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            onKeyDown={onCropKeyDown}
            tabIndex={0}
            aria-label={`Move ${displayLabel} crop selection`}
          >
            <span className="admin-crop-grid" aria-hidden="true" />
            <span className="admin-crop-hint">
              <Move size={15} /> Drag crop area
            </span>
            <span
              className="admin-crop-handle is-top-left"
              aria-hidden="true"
            />
            <span
              className="admin-crop-handle is-top-right"
              aria-hidden="true"
            />
            <span
              className="admin-crop-handle is-bottom-left"
              aria-hidden="true"
            />
            <span
              className="admin-crop-handle is-bottom-right"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="admin-crop-controls">
        <label className="admin-range-label">
          <span>Crop size</span>
          <input
            type="range"
            min="0.35"
            max="1"
            step="0.01"
            value={cropScale}
            onChange={(event) => updateCropScale(Number(event.target.value))}
            aria-label="Crop area size"
          />
        </label>
        <div className="admin-crop-buttons">
          <button
            type="button"
            onClick={() => updateCropScale(cropScale - 0.05)}
            aria-label="Make crop smaller"
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            onClick={() => updateCropScale(cropScale + 0.05)}
            aria-label="Make crop larger"
          >
            <Plus size={15} />
          </button>
          <button type="button" onClick={resetCrop} aria-label="Reset crop">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <div className="admin-cropper-footer">
        <span className={`admin-crop-save-state${saved ? " is-saved" : ""}`}>
          {saved ? <Check size={14} /> : <ImagePlus size={14} />}
          {saved ? "Saved preview" : "Preview before saving"}
        </span>
        <label className="admin-button admin-button-quiet admin-file-button">
          <Upload size={15} /> Replace image
          <input
            type="file"
            accept="image/*"
            aria-label={`Replace ${displayLabel}`}
            onChange={onFileChange}
          />
        </label>
        <div className="admin-cropper-footer-actions">
          {onCancel && (
            <AdminButton variant="quiet" onClick={onCancel}>
              <X size={15} /> Cancel
            </AdminButton>
          )}
          <AdminButton onClick={saveSelectedCrop}>
            <ImagePlus size={15} /> Save cropped image
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
