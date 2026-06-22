"use client";

import { SORT_OPTIONS, type ProductSort } from "@/app/lib/product-filters";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useEffect, useId, useRef, useState } from "react";

type ProductSortDropdownProps = {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
  disabled?: boolean;
};

export default function ProductSortDropdown({
  value,
  onChange,
  disabled = false,
}: ProductSortDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const activeOption =
    SORT_OPTIONS.find((opt) => opt.value === value) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const select = (next: ProductSort) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={clsx("sort-dropdown", open && "is-open")}
    >
      <button
        type="button"
        className="sort-field sort-dropdown-trigger"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label="Sort products"
      >
        <span className="muted">Sort</span>
        <span className="sort-dropdown-pill">
          <span>{activeOption.label}</span>
          <ChevronDownIcon
            className="sort-dropdown-chevron"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          className="sort-dropdown-menu"
          role="listbox"
          aria-label="Sort options"
        >
          {SORT_OPTIONS.map((opt) => {
            const isActive = opt.value === value;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  className={clsx(
                    "sort-dropdown-option",
                    isActive && "is-active",
                  )}
                  onClick={() => select(opt.value)}
                >
                  <span>{opt.label}</span>
                  {isActive ? (
                    <CheckIcon className="sort-dropdown-check" strokeWidth={2.5} />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
