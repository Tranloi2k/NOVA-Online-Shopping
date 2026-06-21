import Link from "next/link";
import {
  HeartIcon,
  ArrowRightIcon,
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

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
        <div className="pdp-grid">
          {/* Gallery skeleton */}
          <div className="pdp-gallery">
            <div className="pdp-stage animate-pulse bg-shop-surface-muted" />
            <div className="pdp-thumbs">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="pdp-thumb tile aspect-square animate-pulse bg-shop-surface-muted"
                />
              ))}
            </div>
          </div>

          {/* Info panel skeleton */}
          <div className="pdp-info space-y-4 pt-2">
            {/* Brand label */}
            <div
              className="muted"
              style={{ fontWeight: 700, fontSize: "13.5px", letterSpacing: ".02em" }}
            >
              NOVA
            </div>
            
            {/* Product name */}
            <div className="animate-pulse" style={{ marginTop: 6, height: 42, width: "75%", borderRadius: "var(--r-xs)", backgroundColor: "var(--hair-soft)" }} />

            {/* Stars */}
            <div className="animate-pulse" style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <div className="h-4 w-24 rounded-sm bg-shop-border-subtle" />
              <div className="h-4 w-32 rounded-sm bg-shop-border-subtle" />
            </div>

            {/* Price skeleton area */}
            <div className="animate-pulse">
              <div className="pdp-price">
                <span className="price" style={{ fontSize: 34 }}>
                  <div className="h-10 w-32 rounded-sm bg-shop-surface-muted" />
                </span>
              </div>
              <div className="h-4.5 w-64 rounded-sm bg-shop-border-subtle" style={{ marginTop: 6 }} />
            </div>

            {/* Description */}
            <div className="animate-pulse space-y-2" style={{ marginTop: 18, maxWidth: 460 }}>
              <div className="h-4.5 w-full rounded-sm bg-shop-border-subtle" />
              <div className="h-4.5 w-5/6 rounded-sm bg-shop-border-subtle" />
              <div className="h-4.5 w-2/3 rounded-sm bg-shop-border-subtle" />
            </div>

            {/* Color swatches */}
            <div className="pdp-section">
              <div className="pdp-label">Finish</div>
              <div className="swatches animate-pulse">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="swatch bg-shop-surface-muted"
                  />
                ))}
              </div>
            </div>

            {/* Storage options */}
            <div className="pdp-section">
              <div className="pdp-label">Storage</div>
              <div className="animate-pulse" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div className="chip pointer-events-none opacity-40">128GB</div>
                <div className="chip pointer-events-none opacity-40">256GB</div>
              </div>
            </div>

            {/* Qty + Add to bag + Fav */}
            <div className="pdp-buy" style={{ marginTop: 30 }}>
              <div className="qty qty-lg pointer-events-none opacity-40">
                <button disabled>−</button>
                <span className="mono-num">1</span>
                <button disabled>+</button>
              </div>
              <button
                className="btn btn-primary btn-lg pdp-add"
                disabled
              >
                Add to bag
              </button>
              <button
                className="icon-btn fav-lg"
                disabled
              >
                <HeartIcon style={{ width: 20, height: 20, strokeWidth: 1.5 }} />
              </button>
            </div>

            {/* Buy Now */}
            <div style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-dark btn-lg btn-block"
                disabled
              >
                Buy now
                <ArrowRightIcon style={{ width: 16, height: 16 }} strokeWidth={2} />
              </button>
            </div>

            {/* Perks */}
            <div className="pdp-perks">
              <div>
                <TruckIcon style={{ width: 16, height: 16, strokeWidth: 1.5 }} />
                Free 2-day shipping
              </div>
              <div>
                <ArrowPathIcon style={{ width: 16, height: 16, strokeWidth: 1.5 }} />
                30-day returns
              </div>
              <div>
                <ShieldCheckIcon style={{ width: 16, height: 16, strokeWidth: 1.5 }} />
                2-year warranty
              </div>
            </div>
          </div>
        </div>

        {/* Tabs skeleton */}
        <div className="pdp-tabs">
          <div className="tab-row">
            <button className="tab is-active" disabled>Specifications</button>
            <button className="tab" disabled>Shipping & returns</button>
            <button className="tab" disabled>Reviews</button>
          </div>
          <div className="mt-6 animate-pulse space-y-3">
            <div className="h-4 w-full rounded-sm bg-shop-border-subtle" />
            <div className="h-4 w-5/6 rounded-sm bg-shop-border-subtle" />
            <div className="h-4 w-3/4 rounded-sm bg-shop-border-subtle" />
          </div>
        </div>
      </div>
    </main>
  );
}
