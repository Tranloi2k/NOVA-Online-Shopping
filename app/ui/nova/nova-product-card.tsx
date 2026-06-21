"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/app/ui/nova/nova-icons";
import { Stars } from "@/app/ui/nova/nova-stars";
import { formatMoney } from "@/app/ui/nova/nova-utils";
import { getSafeImageUrl } from "@/app/lib/utils";

export type NovaProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
};

function productHref(p: NovaProduct) {
  return `/products/${p.name.replace(/ /g, "-")}.${p.id}`;
}

export function NovaProductCard({
  p,
  isFav,
  onFav,
}: {
  p: NovaProduct;
  isFav?: boolean;
  onFav?: (id: number) => void;
}) {
  const rating = p.rating ?? 0;
  const originalPrice = p.discount
    ? Math.round(p.price / (1 - p.discount / 100))
    : undefined;
  const imgSrc = getSafeImageUrl(p.image);

  return (
    <article className="card prod-card">
      <Link href={productHref(p)} style={{ display: "block", position: "relative" }}>
        <div
          className="tile"
          style={{ aspectRatio: "4 / 3", position: "relative", overflow: "hidden" }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={p.name}
              fill
              className="object-contain p-6"
              style={{ transition: "transform .5s" }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "var(--surface-muted)" }} />
          )}
        </div>
        <div className="prod-badges">
          {p.isNew && <span className="tag dark">New</span>}
          {p.discount && (
            <span className="tag sale">Save {p.discount}%</span>
          )}
        </div>
        {onFav && (
          <button
            className="fav-btn"
            aria-label="Save"
            onClick={(e) => {
              e.preventDefault();
              onFav(p.id);
            }}
            style={{ color: isFav ? "var(--sale)" : "var(--ink)" }}
          >
            <Icon name="heart" size={17} />
          </button>
        )}
      </Link>

      <div className="prod-body">
        <h3 style={{ fontSize: 17, marginTop: 3 }}>{p.name}</h3>
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
            href={productHref(p)}
            className="add-mini"
            aria-label="View product"
            onClick={(e) => e.stopPropagation()}
          >
            <Icon name="plus" size={18} sw={2.2} />
          </Link>
        </div>
      </div>
    </article>
  );
}
