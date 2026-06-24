import { getAllProductSlugParams } from "@/app/lib/services/products";
import { absoluteUrl, getSiteUrl } from "@/app/lib/seo";

export const revalidate = 3600;

type SitemapEntry = {
  loc: string;
  lastmod: string;
  changefreq: "daily" | "weekly";
  priority: number;
};

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  const body = entries
    .map(
      (entry) =>
        `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

function staticEntries(now: string): SitemapEntry[] {
  return [
    {
      loc: getSiteUrl(),
      lastmod: now,
      changefreq: "daily",
      priority: 1,
    },
    {
      loc: absoluteUrl("/products"),
      lastmod: now,
      changefreq: "daily",
      priority: 0.9,
    },
  ];
}

export async function GET() {
  const now = new Date().toISOString();
  const entries = staticEntries(now);

  try {
    const slugParams = await getAllProductSlugParams();
    for (const { slug } of slugParams) {
      entries.push({
        loc: absoluteUrl(`/products/${slug}`),
        lastmod: now,
        changefreq: "weekly",
        priority: 0.8,
      });
    }
  } catch (error) {
    console.error("sitemap.xml: product URLs unavailable", error);
  }

  const xml = buildSitemapXml(entries);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
