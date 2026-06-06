"use client";

import {
  PRODUCT_CATEGORIES,
  SORT_OPTIONS,
  buildProductsSearchParams,
} from "@/app/lib/product-filters";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function ProductToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") || "all";
  const activeSort = searchParams.get("sort") || "popular";

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
    <div className="shop-toolbar">
      <div className="chip-row">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`chip${activeCategory === cat.id ? " is-active" : ""}`}
            onClick={() =>
              pushParams({ category: cat.id === "all" ? null : cat.id })
            }
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="sort-wrap">
        <label className="sort-field">
          <span className="muted">Sort</span>
          <select
            value={activeSort}
            onChange={(e) => pushParams({ sort: e.target.value })}
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
