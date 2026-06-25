import { getSafeImageUrl } from "@/app/lib/utils";

export function parseCommaSeparatedList(value?: string | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

const SWATCH_COLORS: Record<string, string> = {
  black: "#1d1d1f",
  white: "#f5f5f7",
  silver: "#c5c5c7",
  gold: "#f4d03f",
  midnight: "#1a1a2e",
  ocean: "#0077b6",
  rose: "#b76e79",
  forest: "#2d5a27",
  blue: "#007aff",
  red: "#ff3b30",
  green: "#34c759",
  purple: "#af52de",
  pink: "#ff2d55",
  orange: "#ff9500",
  yellow: "#ffcc00",
  gray: "#8e8e93",
  grey: "#8e8e93",
  "natural titanium": "#b8a99a",
  "blue titanium": "#4a5568",
  "white titanium": "#e8e6e1",
  "black titanium": "#3d3d3d",
};

/** CSS background for a color swatch from a product color label or hex value. */
export function getSwatchBackground(color: string): string {
  const trimmed = color.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed)) return trimmed;

  const known = SWATCH_COLORS[trimmed.toLowerCase()];
  if (known) return known;

  let hash = 0;
  for (let i = 0; i < trimmed.length; i++) {
    hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${Math.abs(hash) % 360}, 40%, 48%)`;
}

/** Gallery URLs for PDP — falls back to primary `image` when `images` is empty. */
export function getProductGalleryImages(product: {
  image?: string | null;
  images?: string | null;
}): string[] {
  const fromGallery = parseCommaSeparatedList(product.images)
    .map(getSafeImageUrl)
    .filter((url): url is string => Boolean(url));

  if (fromGallery.length > 0) return fromGallery;

  const primary = getSafeImageUrl(product.image);
  return primary ? [primary] : [];
}
