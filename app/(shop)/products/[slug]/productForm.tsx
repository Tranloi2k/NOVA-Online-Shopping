"use client";
import { syncCartBadge } from "@/app/lib/cart-events";
import { addToCart } from "@/app/lib/services/cart";
import type { ProductFormProduct } from "@/app/lib/definitions";
import { getProductStock, isOutOfStock } from "@/app/lib/product-stock";
import BuyNowButton from "@/app/ui/products/BuyNowButton";
import {
  TruckIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useRequireAuth } from "@/app/ui/auth/use-require-auth";
import { useState } from "react";
import clsx from "clsx";

const COLOR_NAMES = ["Midnight", "Silver", "Ocean", "Rose", "Forest"];

export default function ProductForm({
  product,
}: {
  product: ProductFormProduct;
}) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [selectedStorage, setSelectedStorage] = useState(
    product.storageOptions[0] || "",
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { requireAuth, isAuthLoading } = useRequireAuth();

  const stock = getProductStock(product.stock);
  const outOfStock = isOutOfStock(stock);
  const maxQuantity = stock;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

  const handleAddToCart = async () => {
    if (outOfStock) return;
    if (!requireAuth()) return;
    setIsAdding(true);
    setError(null);
    try {
      const summary = await addToCart(product.id, quantity, {
        color: selectedColor,
        storage: selectedStorage,
      });
      syncCartBadge(summary.cart?.quantity ?? 0);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not add to bag. Please try again.",
      );
    } finally {
      setIsAdding(false);
    }
  };

  const colorIndex = product.colors.indexOf(selectedColor);
  const colorName = COLOR_NAMES[colorIndex] || selectedColor;

  return (
    <div>
      {/* Price */}
      <div className="pdp-price">
        <span className="price">{fmt(product.price)}</span>
      </div>
      <div className="muted" style={{ fontSize: 13.5 }}>
        or {fmt(Math.round(product.price / 12))}/mo with NovaPay · 0% APR
      </div>

      {outOfStock ? (
        <p className="pdp-stock pdp-stock--oos" role="status">
          Out of stock — unavailable to order right now.
        </p>
      ) : stock <= 5 ? (
        <p className="pdp-stock pdp-stock--low" role="status">
          Only {stock} left in stock
        </p>
      ) : null}

      {/* Color swatches */}
      {product.colors.length > 0 && (
        <div className="pdp-section">
          <div className="pdp-label">
            Finish —{" "}
            <span style={{ color: "var(--ink)" }}>{colorName}</span>
          </div>
          <div className="swatches">
            {product.colors.map((color, i) => (
              <button
                key={i}
                className="swatch"
                style={{ background: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={COLOR_NAMES[i] || color}
                disabled={outOfStock}
              >
                {selectedColor === color && <span className="swatch-ring" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Storage chips */}
      {product.storageOptions.length > 0 && (
        <div className="pdp-section">
          <div className="pdp-label">Storage</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.storageOptions.map((storage) => (
              <button
                key={storage}
                onClick={() => setSelectedStorage(storage)}
                className={clsx("chip", selectedStorage === storage && "is-active")}
                disabled={outOfStock}
              >
                {storage}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty + Add to bag + Fav */}
      <div className="pdp-buy">
        <div className={clsx("qty qty-lg", outOfStock && "opacity-50")}>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Decrease quantity"
            disabled={outOfStock || quantity <= 1}
          >
            −
          </button>
          <span className="mono-num">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            aria-label="Increase quantity"
            disabled={outOfStock || quantity >= maxQuantity}
          >
            +
          </button>
        </div>
        <button
          className={clsx("btn btn-primary btn-lg pdp-add", added && "is-added")}
          onClick={handleAddToCart}
          disabled={outOfStock || isAdding || isAuthLoading}
        >
          {outOfStock
            ? "Out of stock"
            : isAdding
              ? "Adding…"
              : added
                ? "✓ Added to bag"
                : `Add to bag · ${fmt(product.price * quantity)}`}
        </button>
        <button
          className="icon-btn fav-lg"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
          style={{ color: isFavorite ? "var(--sale)" : "var(--ink)" }}
        >
          {isFavorite ? (
            <HeartIconSolid style={{ width: 20, height: 20 }} />
          ) : (
            <HeartIcon style={{ width: 20, height: 20, strokeWidth: 1.5 }} />
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--sale)" }} role="alert">
          {error}
        </p>
      )}

      {/* Buy Now */}
      <div style={{ marginTop: 12 }}>
        <BuyNowButton product={product} quantity={quantity} stock={stock} />
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
  );
}
