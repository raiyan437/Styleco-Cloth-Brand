"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { Check, ChevronDown } from "lucide-react";

export type StyledSelectOption = {
  value: string;
  label: ReactNode;
  disabled?: boolean;
};

export function StyledSelect({
  label,
  value,
  options,
  onChange,
  className = "",
}: {
  label: string;
  value: string;
  options: StyledSelectOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const menuId = useId();
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const [highlightedIndex, setHighlightedIndex] = useState(selectedIndex);
  const selectedOption = options[selectedIndex] ?? options[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const moveHighlight = (direction: 1 | -1) => {
    if (options.length === 0) return;
    let next = highlightedIndex;
    for (let attempt = 0; attempt < options.length; attempt += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) {
        setHighlightedIndex(next);
        return;
      }
    }
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    onChange(option.value);
    setHighlightedIndex(index);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
      }
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setHighlightedIndex(selectedIndex);
        setOpen(true);
      } else {
        moveHighlight(event.key === "ArrowDown" ? 1 : -1);
      }
      return;
    }
    if (event.key === "Home" || event.key === "End") {
      if (!open) return;
      event.preventDefault();
      const direction = event.key === "Home" ? 1 : -1;
      let index = event.key === "Home" ? 0 : options.length - 1;
      while (options[index]?.disabled && index >= 0 && index < options.length) {
        index += direction;
      }
      const option = options[index];
      if (option && !option.disabled) setHighlightedIndex(index);
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        setHighlightedIndex(selectedIndex);
        setOpen(true);
      } else {
        choose(highlightedIndex);
      }
    }
  };

  return (
    <div
      ref={rootRef}
      className={`styled-select ${className}`.trim()}
      data-open={open || undefined}
    >
      <span id={labelId} className="styled-select-label">
        {label}
      </span>
      <button
        ref={triggerRef}
        type="button"
        className="styled-select-trigger"
        role="combobox"
        aria-labelledby={labelId}
        aria-controls={open ? menuId : undefined}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-activedescendant={
          open ? `${menuId}-option-${highlightedIndex}` : undefined
        }
        onClick={() => {
          setHighlightedIndex(selectedIndex);
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
      >
        <span className="styled-select-value">{selectedOption?.label}</span>
        <ChevronDown
          className="styled-select-chevron"
          size={17}
          aria-hidden="true"
        />
      </button>
      <div
        id={menuId}
        className="styled-select-menu"
        role="listbox"
        aria-hidden={!open}
        data-state={open ? "open" : "closed"}
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            id={`${menuId}-option-${index}`}
            type="button"
            role="option"
            tabIndex={-1}
            aria-selected={option.value === value}
            disabled={option.disabled}
            className="styled-select-option"
            onMouseEnter={() => setHighlightedIndex(index)}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => choose(index)}
          >
            <span>{option.label}</span>
            {option.value === value && <Check size={15} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </div>
  );
}
