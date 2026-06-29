"use client";

import Link from "next/link";
import { useState } from "react";
import { SafeImage } from "@/app/ui/shared/safe-image";
import { getSafeImageUrl } from "@/app/lib/utils";
import { formatMoney } from "@/app/ui/nova/nova-utils";
import { removeFromWishlist } from "@/app/lib/services/wishlist";
import type { WishlistItem } from "@/app/lib/definitions";
import { isOutOfStock } from "@/app/lib/product-stock";
import { useWishlist } from "@/app/ui/wishlist/wishlist-context";
import clsx from "clsx";

function productHref(item: WishlistItem) {
  return `/products/${item.product.name.replace(/ /g, "-")}.${item.product.id}`;
}

export default function WishlistList({
  initialItems,
}: {
  initialItems: WishlistItem[];
}) {
  const { syncProductIds } = useWishlist();
  const [items, setItems] = useState(initialItems);
  const [removingId, setRemovingId] = useState<number | null>(null);

  const handleRemove = async (productId: number) => {
    setRemovingId(productId);
    try {
      const summary = await removeFromWishlist(productId);
      setItems(summary.items);
      syncProductIds(summary.items.map((item) => item.productId));
    } catch {
      // keep list unchanged on error
    } finally {
      setRemovingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty" style={{ paddingBlock: 48 }}>
        <div className="empty-glyph big">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            style={{ width: 40, height: 40 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        </div>
        <p style={{ fontWeight: 700, fontSize: 17, marginTop: 16 }}>
          Your wishlist is empty
        </p>
        <p className="muted" style={{ fontSize: 14, marginTop: 4 }}>
          Save items you love and come back to them anytime.
        </p>
        <Link href="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-grid">
      {items.map((item) => {
        const { product } = item;
        const outOfStock = isOutOfStock(product.stock);
        const imgSrc = getSafeImageUrl(product.image);

        return (
          <article key={item.id} className="wishlist-item">
            <Link href={productHref(item)} className="wishlist-item-media">
              {imgSrc ? (
                <SafeImage
                  src={imgSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    background: "var(--surface-muted)",
                  }}
                />
              )}
            </Link>

            <div className="wishlist-item-body">
              <Link href={productHref(item)} className="wishlist-item-name">
                {product.name}
              </Link>
              <div className="wishlist-item-price">{formatMoney(product.price)}</div>
              {outOfStock ? (
                <span className="tag oos" style={{ marginTop: 8 }}>
                  Out of stock
                </span>
              ) : (
                <span className="muted" style={{ fontSize: 13, marginTop: 8 }}>
                  In stock
                </span>
              )}
            </div>

            <div className="wishlist-item-actions">
              <Link
                href={productHref(item)}
                className={clsx("btn btn-primary btn-sm", outOfStock && "is-disabled")}
                aria-disabled={outOfStock}
                tabIndex={outOfStock ? -1 : undefined}
              >
                {outOfStock ? "Unavailable" : "View product"}
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => handleRemove(product.id)}
                disabled={removingId === product.id}
              >
                {removingId === product.id ? "Removing…" : "Remove"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
