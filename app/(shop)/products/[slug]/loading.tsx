import Link from "next/link";

export default function Loading() {
  return (
    <main className="pdp-main">
      <div className="wrap">
        {/* Breadcrumb — "Shop" is a static link, product name is API → skeleton */}
        <nav className="crumbs pdp-crumbs">
          <Link href="/products">Shop</Link>
          <span>/</span>
          {/* Product name from API */}
          <span className="inline-block h-4 w-32 animate-pulse rounded-sm bg-shop-border-subtle" />
        </nav>

        {/* Product detail layout — everything below is API data */}
        <div className="pdp-grid mt-6">
          {/* Gallery skeleton */}
          <div className="pdp-gallery">
            <div className="pdp-stage animate-pulse bg-shop-surface-muted" />
            <div className="pdp-thumbs mt-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-shop-lg bg-shop-surface-muted"
                />
              ))}
            </div>
          </div>

          {/* Info panel skeleton */}
          <div className="pdp-info animate-pulse space-y-4 pt-2">
            {/* Brand label */}
            <div className="h-3 w-10 rounded-sm bg-shop-border-subtle" />
            {/* Product name */}
            <div className="h-10 w-3/4 rounded-sm bg-shop-surface-muted" />
            {/* Stars */}
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 rounded-sm bg-shop-border-subtle" />
              <div className="h-4 w-32 rounded-sm bg-shop-border-subtle" />
            </div>
            {/* Price */}
            <div className="h-8 w-32 rounded-sm bg-shop-surface-muted" />
            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full rounded-sm bg-shop-border-subtle" />
              <div className="h-4 w-5/6 rounded-sm bg-shop-border-subtle" />
              <div className="h-4 w-2/3 rounded-sm bg-shop-border-subtle" />
            </div>
            {/* Color swatches */}
            <div className="flex gap-3 pt-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-9 w-9 rounded-full bg-shop-surface-muted"
                />
              ))}
            </div>
            {/* Add to cart button */}
            <div className="h-14 w-full rounded-shop bg-shop-surface-muted" />
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="pdp-tabs animate-pulse">
          <div className="tab-row flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-12 w-28 rounded-sm bg-shop-border-subtle" />
            ))}
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-4 w-full rounded-sm bg-shop-border-subtle" />
            <div className="h-4 w-5/6 rounded-sm bg-shop-border-subtle" />
            <div className="h-4 w-3/4 rounded-sm bg-shop-border-subtle" />
          </div>
        </div>
      </div>
    </main>
  );
}

