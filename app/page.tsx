import {
  CategoryTiles,
  StorefrontCta,
  StorefrontHero,
  FeaturedProducts,
} from "@/app/ui/shop/storefront-hero";
import ShopShell from "@/app/ui/shop/shop-shell";
import { PosterTicker } from "@/app/ui/shop/poster-ticker";
import type { Metadata } from "next";
import { preload } from "react-dom";
import { buildPageMetadata } from "@/app/lib/seo";
import { websiteJsonLd } from "@/app/lib/seo-structured-data";
import JsonLd from "@/app/ui/seo/json-ld";

const HERO_IMAGE_PATH = "/hero_iphone_17_pro.jpg";

/** Public landing — FeaturedProducts ISR (see app/lib/segment-config.ts) */
export const revalidate = 60;

export const metadata: Metadata = buildPageMetadata({
  title: "Nova Shop - smartphones, tablets, and wearables",
  description:
    "Nova Shop premium smartphones, tablets, and wearables. Secure checkout and fast delivery.",
  pathname: "/",
});

export default function HomePage() {
  preload(HERO_IMAGE_PATH, { as: "image", fetchPriority: "high" });

  return (
    <ShopShell>
      <JsonLd data={websiteJsonLd()} />
      <PosterTicker />
      <StorefrontHero />
      <CategoryTiles />
      <FeaturedProducts />
      <StorefrontCta />
    </ShopShell>
  );
}
