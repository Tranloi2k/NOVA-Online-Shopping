import Image from "next/image";
import Link from "next/link";
import { categoryNavHref, productsHref } from "@/app/lib/product-filters";
import { Icon } from "@/app/ui/nova/nova-icons";
import { NovaGlyph } from "@/app/ui/nova/nova-glyphs";
import { Stars } from "@/app/ui/nova/nova-stars";
import { SectionHead } from "@/app/ui/nova/nova-section-head";
import { NovaProductCard } from "@/app/ui/nova/nova-product-card";
import { Reveal } from "@/app/ui/nova/reveal";
import { NovaNewsletter } from "@/app/ui/nova/nova-newsletter";
import { getProducts } from "@/app/lib/services/products";
import type { ProductListItem } from "@/app/lib/definitions";

/* ---- StorefrontHero → Nova HeroA ---------------------------------- */
export function StorefrontHero() {
  return (
    <section className="heroA">
      <div className="wrap">
        <Reveal className="heroA-top">
          <span className="tag dark">
            <Icon name="bolt" size={13} /> New · Nova Season
          </span>
          <h1 className="heroA-title">
            The future,
            <br />
            beautifully simple.
          </h1>
          <p className="heroA-sub">
            Premium laptops, phones, audio and wearables — curated, and ready to
            ship in 2 days.
          </p>
          <div className="heroA-cta">
            <Link href="/products" className="btn btn-primary btn-lg">
              Shop all products
            </Link>
            <Link href="/login" className="btn btn-line btn-lg">
              Sign in
            </Link>
          </div>
        </Reveal>

        <Reveal className="heroA-stage" index={1}>
          <Image
            src="/hero_iphone_17_pro.jpg"
            alt="iPhone 17 Pro"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            priority
            fetchPriority="high"
          />
          <div className="heroA-spec heroA-spec-1">
            <span className="muted" style={{ fontSize: 12, fontWeight: 700 }}>
              FROM
            </span>
            <span className="price" style={{ fontSize: 24 }}>
              $799
            </span>
          </div>
          <div className="heroA-spec heroA-spec-2">
            <Stars r={4.9} />
            <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>
              3,210 reviews
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- CategoryTiles → Nova CategoryStrip --------------------------- */
const cats = [
  { id: "smartphones", label: "Phones", glyph: "phone" as const },
  { id: "tablets", label: "Tablets", glyph: "tablet" as const },
  { id: "wearables", label: "Wearables", glyph: "watch" as const },
  { id: "audio", label: "Audio", glyph: "headphones" as const },
  { id: "laptops", label: "Laptops", glyph: "laptop" as const },
  { id: "accessories", label: "Accessories", glyph: "keyboard" as const },
];

export function CategoryTiles() {
  return (
    <section
      className="section cat-strip-sec"
      style={{ background: "var(--bg)" }}
    >
      <div className="wrap">
        <SectionHead eyebrow="Browse" title="Shop by category" />
        <div className="cat-grid">
          {cats.map((c, index) => (
            <Reveal
              as={Link}
              key={c.id}
              href={categoryNavHref(c.id)}
              className="cat-tile"
              index={index}
            >
              <NovaGlyph type={c.glyph} className="cat-glyph" />
              <span>{c.label}</span>
              <span className="cat-arr">
                <Icon name="arrow" size={16} />
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- FeaturedProducts → Nova FeaturedGrid (async) ----------------- */
export async function FeaturedProducts() {
  let products: ProductListItem[] = [];
  try {
    const result = await getProducts(
      { page: 1, sort: "popular" },
      { authenticated: false },
    );
    products = result.products;
  } catch {
    products = [];
  }

  const featured = products.slice(0, 8);
  if (featured.length === 0) return null;

  return (
    <section className="section" style={{ background: "var(--surface)" }}>
      <div className="wrap">
        <SectionHead eyebrow="Handpicked" title="Featured this week" />
        <div className="prod-grid">
          {featured.map((p, index) => (
            <Reveal key={p.id} index={index} className="prod-grid-cell">
              <NovaProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---- StorefrontCta → Nova PromoBand + ValueRow + Newsletter -------- */
export function StorefrontCta() {
  return (
    <>
      {/* Promo band */}
      <section className="section">
        <div className="wrap">
          <Reveal className="promo">
            <div className="promo-text">
              <div
                className="eyebrow"
                style={{ color: "var(--accent-wash)", marginBottom: 14 }}
              >
                Nova Sound
              </div>
              <h2 style={{ fontSize: "clamp(30px,4vw,52px)", color: "#fff" }}>
                Hear everything.
                <br />
                Miss nothing.
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,.72)",
                  maxWidth: 420,
                  marginTop: 16,
                  fontSize: 17,
                }}
              >
                Adaptive noise cancellation and spatial audio across the Nova
                audio lineup.
              </p>
              <Link
                href={productsHref({ category: "audio" })}
                className="btn btn-primary btn-lg"
                style={{ marginTop: 28, display: "inline-flex" }}
              >
                Shop audio
              </Link>
            </div>
            <NovaGlyph type="headphones" className="promo-glyph" />
          </Reveal>
        </div>
      </section>

      {/* Value row */}
      <section className="section">
        <div className="wrap value-row">
          {(
            [
              ["truck", "Free 2-day shipping", "On every order, no minimum."],
              ["refresh", "30-day returns", "Changed your mind? No problem."],
              ["shield", "2-year warranty", "Protection on all Nova devices."],
              [
                "headset",
                "Real human support",
                "Chat with experts, 7 days a week.",
              ],
            ] as const
          ).map(([ic, t, d], index) => (
            <Reveal className="value-item" key={t} index={index}>
              <div className="value-ic">
                <Icon name={ic} size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 15.5 }}>{t}</div>
                <div className="muted" style={{ fontSize: 13.5, marginTop: 2 }}>
                  {d}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <NovaNewsletter />
    </>
  );
}
