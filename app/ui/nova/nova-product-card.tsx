import Link from "next/link";
import clsx from "clsx";
import { Icon } from "@/app/ui/nova/nova-icons";
import { Stars } from "@/app/ui/nova/nova-stars";
import { formatMoney } from "@/app/ui/nova/nova-utils";
import { getSafeImageUrl } from "@/app/lib/utils";
import { SafeImage } from "@/app/ui/shared/safe-image";
import { isOutOfStock } from "@/app/lib/product-stock";

export type NovaProduct = {
  id: number;
  name: string;
  image: string;
  price: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  discount?: number;
};

function productHref(p: NovaProduct) {
  return `/products/${p.name.replace(/ /g, "-")}.${p.id}`;
}

export function NovaProductCard({ p }: { p: NovaProduct }) {
  const rating = p.rating ?? 0;
  const outOfStock = isOutOfStock(p.stock);
  const hasDiscount = (p.discount ?? 0) > 0;
  const originalPrice = hasDiscount
    ? Math.round(p.price / (1 - (p.discount ?? 0) / 100))
    : undefined;
  const imgSrc = getSafeImageUrl(p.image);

  return (
    <article className={clsx("card prod-card", outOfStock && "is-out-of-stock")}>
      <Link href={productHref(p)} style={{ display: "block", position: "relative" }}>
        <div className="prod-card-media" style={{ aspectRatio: "4 / 3" }}>
          {imgSrc ? (
            <SafeImage
              src={imgSrc}
              alt={p.name}
              fill
              className="object-cover"
              style={{ transition: "transform .5s" }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "var(--surface-muted)" }} />
          )}
        </div>
        <div className="prod-badges">
          {outOfStock && <span className="tag oos">Out of stock</span>}
          {!outOfStock && p.isNew && <span className="tag dark">New</span>}
          {!outOfStock && hasDiscount && (
            <span className="tag sale">Save {p.discount}%</span>
          )}
        </div>
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
          {outOfStock ? (
            <button disabled className="add-mini is-disabled" aria-label="Out of stock">
              <Icon name="plus" size={18} sw={2.2} />
            </button>
          ) : (
            <Link
              href={productHref(p)}
              className="add-mini"
              aria-label="View product"
            >
              <Icon name="plus" size={18} sw={2.2} />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
