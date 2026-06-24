import type { MetadataRoute } from "next";
import { getAllProductSlugParams } from "@/app/lib/services/products";
import { absoluteUrl, getSiteUrl } from "@/app/lib/seo";

/** Cache sitemap so Google/crawlers don't hit a cold API on every fetch. */
export const revalidate = 3600;

function staticSitemapEntries(now: Date): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/products"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = staticSitemapEntries(now);

  try {
    const slugParams = await getAllProductSlugParams();
    const productRoutes: MetadataRoute.Sitemap = slugParams.map(({ slug }) => ({
      url: absoluteUrl(`/products/${slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("sitemap: product URLs unavailable, serving static routes only", error);
    return staticRoutes;
  }
}
