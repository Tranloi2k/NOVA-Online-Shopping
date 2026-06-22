import { CACHE_TAGS } from "@/app/lib/cache-tags";
import type { StorefrontPoster } from "@/app/lib/definitions";

const EMPTY_POSTERS: StorefrontPoster[] = [];

export async function getStorefrontPosters(): Promise<StorefrontPoster[]> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
    return EMPTY_POSTERS;
  }

  try {
    const res = await fetch(`${apiUrl}/storefront/posters`, {
      method: "GET",
      next: { tags: [CACHE_TAGS.posters], revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`Failed to fetch posters: ${res.status}`);
      return EMPTY_POSTERS;
    }

    const data = (await res.json()) as StorefrontPoster[];
    if (!Array.isArray(data)) return EMPTY_POSTERS;

    return data.map((poster) => ({
      ...poster,
      product: {
        ...poster.product,
        description: poster.product?.description ?? "",
        price: Number(poster.product?.price) || 0,
        discount: Number(poster.product?.discount) || 0,
      },
    }));
  } catch (error) {
    console.error("Error fetching storefront posters:", error);
    return EMPTY_POSTERS;
  }
}
