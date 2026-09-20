"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Eye,
  RotateCcw,
  Save,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { AdminContentStatus } from "@/domain/admin";

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="admin-page-header">
      <div>
        <p className="admin-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="admin-page-description">{description}</p>
      </div>
      {action && <div className="admin-page-actions">{action}</div>}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  type = "button",
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet" | "danger";
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      className={`admin-button admin-button-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: AdminContentStatus }) {
  return (
    <span className={`admin-status admin-status-${status}`}>{status}</span>
  );
}

export function SaveBar({
  saved,
  onSave,
  onReset,
}: {
  saved: boolean;
  onSave: () => void;
  onReset?: () => void;
}) {
  return (
    <div className="admin-save-bar">
      <span className={saved ? "is-saved" : ""}>
        {saved ? <Check size={15} /> : <Save size={15} />}
        {saved ? "Saved to this browser" : "Unsaved changes"}
      </span>
      <div>
        {onReset && (
          <AdminButton variant="quiet" onClick={onReset}>
            <RotateCcw size={15} /> Reset
          </AdminButton>
        )}
        <AdminButton onClick={onSave}>
          <Save size={15} /> Save changes
        </AdminButton>
      </div>
    </div>
  );
}

export function PreviewLink({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="admin-button admin-button-secondary">
      <Eye size={15} /> Preview storefront <ArrowUpRight size={14} />
    </Link>
  );
}

export function AdminPagination({
  page,
  pageSize,
  totalItems,
  totalPages,
  onPageChange,
}: {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (!totalItems) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
  const lastPage = Math.min(totalPages, firstPage + 4);
  const pageNumbers = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, index) => firstPage + index,
  );

  return (
    <div className="admin-pagination">
      <span className="admin-pagination-summary">
        Showing {start}–{end} of {totalItems}
      </span>
      {totalPages > 1 && (
        <nav aria-label="Pagination" className="admin-pagination-controls">
          <button
            type="button"
            className="admin-pagination-button"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={15} />
          </button>
          {pageNumbers.map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              className={`admin-pagination-button${pageNumber === page ? " is-active" : ""}`}
              onClick={() => onPageChange(pageNumber)}
              aria-current={pageNumber === page ? "page" : undefined}
            >
              {pageNumber}
            </button>
          ))}
          <button
            type="button"
            className="admin-pagination-button"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={15} />
          </button>
        </nav>
      )}
    </div>
  );
}

export type AdminSelectOption = {
  value: string;
  label: string;
};

export function AdminSelect({
  value,
  options,
  onChange,
  ariaLabel,
  id,
  disabled = false,
  className = "",
}: {
  value: string;
  options: AdminSelectOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}) {
  const selectId = useId().replaceAll(":", "");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      optionRefs.current[highlightedIndex]?.focus();
    }
  }, [highlightedIndex, open]);

  function openMenu(nextIndex = selectedIndex) {
    setHighlightedIndex(nextIndex);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function selectOption(nextValue: string) {
    onChange(nextValue);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function moveHighlight(nextIndex: number) {
    if (!options.length) return;
    setHighlightedIndex(nextIndex);
    optionRefs.current[nextIndex]?.focus();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      openMenu(open ? (highlightedIndex + 1) % options.length : selectedIndex);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(
        open
          ? (highlightedIndex - 1 + options.length) % options.length
          : selectedIndex,
      );
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      closeMenu();
    }
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveHighlight((index + 1) % options.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveHighlight((index - 1 + options.length) % options.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      moveHighlight(0);
    } else if (event.key === "End") {
      event.preventDefault();
      moveHighlight(options.length - 1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[index];
      if (option) selectOption(option.value);
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
    }
  }

  return (
    <div
      ref={rootRef}
      className={`admin-select${open ? " is-open" : ""}${disabled ? " is-disabled" : ""}${className ? ` ${className}` : ""}`}
    >
      <button
        ref={triggerRef}
        id={id}
        type="button"
        className="admin-select-trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`admin-select-menu-${selectId}`}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
      >
        <span>{selectedOption?.label ?? "Select an option"}</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>
      <div
        id={`admin-select-menu-${selectId}`}
        className="admin-select-menu"
        data-open={open}
        role="listbox"
        aria-label={ariaLabel}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <button
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              className={`admin-select-option${isSelected ? " is-selected" : ""}`}
              key={option.value}
              onClick={() => selectOption(option.value)}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
            >
              <span>{option.label}</span>
              <Check size={14} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FieldLabel({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="admin-field">
      <span className="admin-field-label">{label}</span>
      {hint && <span className="admin-field-hint">{hint}</span>}
      {children}
    </label>
  );
}
