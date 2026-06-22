import { getStorefrontPosters } from "@/app/lib/services/posters";
import { PosterTickerStrip } from "@/app/ui/shop/poster-ticker-strip";

export async function PosterTicker() {
  const posters = await getStorefrontPosters();
  return <PosterTickerStrip posters={posters} />;
}
