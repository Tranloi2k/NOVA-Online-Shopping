import type { ProductListItem } from "@/app/lib/definitions";
import type { ProductView } from "@/app/lib/product-filters";
import { productPath } from "@/app/lib/product-path";
import { formatMoney } from "@/app/ui/nova/nova-utils";
import { Stars } from "@/app/ui/nova/nova-stars";
import { NovaProductCard } from "@/app/ui/nova/nova-product-card";
import { Reveal } from "@/app/ui/nova/reveal";
import { getSafeImageUrl } from "@/app/lib/utils";
import { isOutOfStock } from "@/app/lib/product-stock";
import Link from "next/link";
import { SafeImage } from "@/app/ui/shared/safe-image";
import clsx from "clsx";

function toNovaProduct(p: ProductListItem) {
  return {
    id: p.id,
    name: p.name,
    image: p.image,
    price: p.price,
    stock: p.stock,
    rating: p.rate ?? p.rating,
    reviewCount: p.reviewCount,
    isNew: p.isNew,
    discount: p.discount,
  };
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
          const outOfStock = isOutOfStock(p.stock);
          const hasDiscount = (p.discount ?? 0) > 0;
          const originalPrice = hasDiscount
            ? Math.round(p.price / (1 - (p.discount ?? 0) / 100))
            : undefined;
          const listImgSrc = getSafeImageUrl(p.image);
          return (
            <Reveal
              as="article"
              key={p.id}
              index={index}
              className={clsx("card", outOfStock && "is-out-of-stock")}
              style={{ display: "flex", gap: 20, marginBottom: 4, padding: 0, overflow: "hidden" }}
            >
              <Link href={productPath(p)} style={{ flex: "none" }}>
                <div className="prod-list-media">
                  {listImgSrc ? (
                    <SafeImage
                      src={listImgSrc}
                      alt={p.name}
                      fill
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : undefined}
                      className="object-cover"
                      sizes="160px"
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--surface-muted)" }} />
                  )}
                </div>
              </Link>
              <div
                style={{
                  flex: 1,
                  padding: "22px 22px 22px 0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
                    {outOfStock && <span className="tag oos">Out of stock</span>}
                    {!outOfStock && p.isNew && <span className="tag dark">New</span>}
                    {!outOfStock && hasDiscount && (
                      <span className="tag sale">Save {p.discount}%</span>
                    )}
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
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
                  {outOfStock ? (
                    <span className="btn btn-dark btn-sm opacity-50 cursor-not-allowed">
                      Out of stock
                    </span>
                  ) : (
                    <Link href={productPath(p)} className="btn btn-dark btn-sm">
                      View product
                    </Link>
                  )}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    );
  }

  return (
    <div className="prod-grid" style={{ marginTop: 28 }}>
      {products.map((p, index) => (
        <Reveal key={p.id} index={index}>
          <NovaProductCard p={toNovaProduct(p)} />
        </Reveal>
      ))}
    </div>
  );
}
