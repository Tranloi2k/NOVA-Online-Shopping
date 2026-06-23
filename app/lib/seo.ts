import type { Metadata } from "next";
import { getSafeImageUrl } from "@/app/lib/utils";

export { productPath, productSlug } from "@/app/lib/product-path";
export const SITE_NAME = "NOVA";
export const SITE_TAGLINE = "Premium Tech Store";
export const DEFAULT_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const DEFAULT_DESCRIPTION =
  "Discover premium smartphones, tablets, and wearables. Secure checkout and fast delivery.";

const DEFAULT_OG_IMAGE_PATH = "/hero-shop.jpg";

const SITE_URL_ENV_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXTAUTH_URL",
] as const;

function originFromEnvValue(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function originFromVercel(): string | undefined {
  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (productionUrl) {
    const normalized = productionUrl.startsWith("http")
      ? productionUrl
      : `https://${productionUrl}`;
    const origin = originFromEnvValue(normalized);
    if (origin) return origin;
  }

  const host = process.env.VERCEL_URL?.trim();
  if (!host) return undefined;
  return originFromEnvValue(`https://${host}`);
}

/** `next build` / GitHub Actions often run without a public URL env yet. */
function isBuildWithoutPublicUrl(): boolean {
  return (
    process.env.CI === "true" ||
    process.env.NEXT_PHASE === "phase-production-build"
  );
}

function originForDevelopment(): string {
  const port = process.env.PORT?.trim() || "3000";
  return `http://127.0.0.1:${port}`;
}

/**
 * Canonical site origin.
 * Production runtime: set `NEXT_PUBLIC_APP_URL` (or deploy on Vercel for auto `VERCEL_URL`).
 * Development / CI build: falls back to `http://127.0.0.1:$PORT` when unset.
 */
export function getSiteUrl(): string {
  for (const key of SITE_URL_ENV_KEYS) {
    const origin = originFromEnvValue(process.env[key]);
    if (origin) return origin;
  }

  const vercelOrigin = originFromVercel();
  if (vercelOrigin) return vercelOrigin;

  if (process.env.NODE_ENV === "development" || isBuildWithoutPublicUrl()) {
    return originForDevelopment();
  }

  throw new Error(
    "[seo] Set NEXT_PUBLIC_APP_URL to your public site origin (e.g. https://shop.example.com).",
  );
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, base).toString();
}

export function absoluteImageUrl(src: string): string {
  if (!src) return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const path = src.startsWith("/") ? src : `/${src}`;
  return new URL(path, getSiteUrl()).toString();
}

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/** Facebook-friendly JPG via Cloudinary; keeps other hosts unchanged. */
export function optimizeOgImageUrl(src: string): string {
  const absolute = absoluteImageUrl(src);

  if (absolute.includes("res.cloudinary.com") && absolute.includes("/upload/")) {
    if (absolute.includes("w_1200")) return absolute;
    return absolute.replace(
      "/upload/",
      `/upload/w_${OG_IMAGE_WIDTH},h_${OG_IMAGE_HEIGHT},c_fill,f_jpg,q_auto/`,
    );
  }

  if (absolute.includes("store.storeimages.cdn-apple.com")) {
    try {
      const url = new URL(absolute);
      url.searchParams.set("wid", String(OG_IMAGE_WIDTH));
      url.searchParams.set("hei", String(OG_IMAGE_HEIGHT));
      return url.toString();
    } catch {
      return absolute;
    }
  }

  return absolute;
}

export function getProductOgImage(product: {
  image?: string | null;
  images?: string | null;
}): string {
  const candidates: string[] = [];
  if (product.image) candidates.push(product.image);
  if (product.images) {
    candidates.push(
      ...product.images.split(",").map((entry) => entry.trim()).filter(Boolean),
    );
  }

  for (const candidate of candidates) {
    const safe = getSafeImageUrl(candidate);
    if (safe) return optimizeOgImageUrl(safe);
  }

  return optimizeOgImageUrl(DEFAULT_OG_IMAGE_PATH);
}

export function getProductOgDescription(product: {
  name: string;
  description?: string | null;
  price?: number | string | null;
}): string {
  const raw =
    typeof product.description === "string" ? product.description.trim() : "";
  if (raw && raw !== "-" && raw !== "--" && raw.length >= 10) {
    return raw.slice(0, 160);
  }

  const price = Number(product.price);
  if (Number.isFinite(price) && price > 0) {
    const formatted = price.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });
    return `Shop ${product.name} at NOVA — ${formatted} with secure checkout and fast delivery.`;
  }

  return `Buy ${product.name} at NOVA — premium tech with secure checkout.`;
}

/** Pages that must not appear in search results. */export const NOINDEX_PATH_PREFIXES = [
  "/cart",
  "/login",
  "/checkout",
  "/customers",
  "/api",
] as const;

export function isNoIndexPath(pathname: string): boolean {
  return NOINDEX_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

export function buildPageMetadata(options: {
  title: string;
  description: string;
  pathname: string;
  image?: string | null;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(options.pathname);
  const ogImage = options.image
    ? optimizeOgImageUrl(options.image)
    : optimizeOgImageUrl(DEFAULT_OG_IMAGE_PATH);
  const fullTitle =
    options.title.includes(SITE_NAME) ? options.title : `${options.title} | ${SITE_NAME}`;
  const ogImageEntry = {
    url: ogImage,
    alt: options.title,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  };

  return {
    title: options.title,
    description: options.description,
    alternates: { canonical },
    ...(options.noIndex ? { robots: privateRobots } : {}),
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description: options.description,
      images: [ogImageEntry],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: options.description,
      images: [ogImage],
    },
  };
}

/** Google Search Console — HTML tag verification (root layout) */
const googleSiteVerification =
  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ??
  "bGAC5K-jyxXnQKEZfJ7IXjLUyYhjUENmHJXRoTdOpw0";

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/nova-icon.png",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/nova-icon-white.png",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [
      {
        url: "/nova-icon.png",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/nova-icon-white.png",
        sizes: "512x512",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    shortcut: [
      {
        url: "/nova-icon.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/nova-icon-white.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
  title: {
    template: `%s | ${SITE_NAME}`,
    default: DEFAULT_TITLE,
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  verification: {
    google: googleSiteVerification,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getSiteUrl(),
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: absoluteImageUrl(DEFAULT_OG_IMAGE_PATH), alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [absoluteImageUrl(DEFAULT_OG_IMAGE_PATH)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
