"use client";

import {
  PRODUCT_CATEGORIES,
  buildProductsSearchParams,
  type ProductSort,
} from "@/app/lib/product-filters";
import ProductSortDropdown from "@/app/ui/products/product-sort-dropdown";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductToolbar({ disabled = false }: { disabled?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = (searchParams.get("sort") || "popular") as ProductSort;

  const pushParams = (
    updates: Record<string, string | number | boolean | null | undefined>,
  ) => {
    const next = buildProductsSearchParams(searchParams, {
      page: 1,
      ...updates,
    });
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <div className={`shop-toolbar ${disabled ? "pointer-events-none opacity-60" : ""}`}>
      <div className="chip-row">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`chip${activeCategory === cat.id ? " is-active" : ""}`}
            onClick={() =>
              !disabled && pushParams({ category: cat.id === "all" ? null : cat.id })
            }
            disabled={disabled}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="sort-wrap">
        <ProductSortDropdown
          value={activeSort}
          onChange={(sort) => pushParams({ sort })}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
