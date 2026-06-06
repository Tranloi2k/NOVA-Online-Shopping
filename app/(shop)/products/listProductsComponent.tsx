"use client";

import type { ProductListItem } from "@/app/lib/definitions";
import type { ProductView } from "@/app/lib/product-filters";
import { productPath } from "@/app/lib/seo";
import { formatMoney } from "@/app/ui/nova/nova-utils";
import { Icon } from "@/app/ui/nova/nova-icons";
import { Stars } from "@/app/ui/nova/nova-stars";
import Link from "next/link";
import Image from "next/image";

function ProductCard({ p, index }: { p: ProductListItem; index: number }) {
  const rating = p.rate ?? p.rating ?? 0;
  const originalPrice = p.discount
    ? Math.round(p.price / (1 - p.discount / 100))
    : undefined;

  return (
    <article className="card prod-card reveal">
      <Link href={productPath(p)} style={{ display: "block", position: "relative" }}>
        <div className="tile" style={{ aspectRatio: "4 / 3" }}>
          <div style={{ width: "64%", display: "grid", placeItems: "center" }}>
            <Image
              src={p.image}
              alt={p.name}
              width={260}
              height={260}
              priority={index < 4}
              className="object-contain"
              style={{ width: "100%", height: "auto", transition: "transform .5s" }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </div>
        <div className="prod-badges">
          {p.isNew && <span className="tag dark">New</span>}
          {p.discount && <span className="tag sale">Save {p.discount}%</span>}
        </div>
      </Link>

      <div className="prod-body">
        <h3 style={{ fontSize: 17, marginTop: 3 }}>
          <Link href={productPath(p)}>{p.name}</Link>
        </h3>
        {rating > 0 && (
          <div style={{ marginTop: 7 }}>
            <Stars r={rating} showNum count={p.reviewCount} />
          </div>
        )}
        <div className="prod-foot">
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span className="price" style={{ fontSize: 19 }}>
              {formatMoney(p.price)}
            </span>
            {originalPrice && (
              <span className="strike" style={{ fontSize: 14 }}>
                {formatMoney(originalPrice)}
              </span>
            )}
          </div>
          <Link
            href={productPath(p)}
            className="add-mini"
            aria-label="View product"
          >
            <Icon name="plus" size={18} sw={2.2} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ListProductsComponent({
  products,
  viewMode,
}: {
  products: ProductListItem[];
  viewMode: ProductView;
}) {
  if (products.length === 0) {
    return (
      <div className="shop-empty">
        <p style={{ fontWeight: 700, fontSize: 18 }}>No products found</p>
        <p className="muted" style={{ marginTop: 8 }}>
          Try a different category or search term.
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 1, marginTop: 28 }}>
        {products.map((p, index) => {
          const rating = p.rate ?? p.rating ?? 0;
          const originalPrice = p.discount
            ? Math.round(p.price / (1 - p.discount / 100))
            : undefined;
          return (
            <article
              key={p.id}
              className="card reveal"
              style={{ display: "flex", gap: 20, marginBottom: 4, padding: 0, overflow: "hidden" }}
            >
              <Link
                href={productPath(p)}
                style={{ flex: "none", width: 160, position: "relative" }}
              >
                <div className="tile" style={{ height: "100%", minHeight: 140 }}>
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={160}
                    height={140}
                    priority={index === 0}
                    className="object-contain p-4"
                    sizes="160px"
                  />
                </div>
              </Link>
              <div style={{ flex: 1, padding: "22px 22px 22px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    {p.isNew && <span className="tag dark">New</span>}
                    {p.discount && <span className="tag sale">Save {p.discount}%</span>}
                  </div>
                  <h3 style={{ fontSize: 17 }}>
                    <Link href={productPath(p)}>{p.name}</Link>
                  </h3>
                  {rating > 0 && (
                    <div style={{ marginTop: 7 }}>
                      <Stars r={rating} showNum count={p.reviewCount} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span className="price" style={{ fontSize: 19 }}>
                      {formatMoney(p.price)}
                    </span>
                    {originalPrice && (
                      <span className="strike" style={{ fontSize: 14 }}>
                        {formatMoney(originalPrice)}
                      </span>
                    )}
                  </div>
                  <Link href={productPath(p)} className="btn btn-dark btn-sm">
                    View product
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    );
  }

  return (
    <div className="prod-grid" style={{ marginTop: 28 }}>
      {products.map((p, index) => (
        <ProductCard key={p.id} p={p} index={index} />
      ))}
    </div>
  );
}
