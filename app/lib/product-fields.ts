import { getSafeImageUrl } from "@/app/lib/utils";

export function parseCommaSeparatedList(value?: string | null): string[] {
  if (!value || typeof value !== "string") return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
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
