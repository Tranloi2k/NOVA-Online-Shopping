import dynamic from "next/dynamic";
import { getSafeImageUrl } from "@/app/lib/utils";
import { SafeImage } from "@/app/ui/shared/safe-image";

const SlideImageGallery = dynamic(() => import("./slideImageGallery"), {
  loading: () => (
    <div className="pdp-stage" aria-hidden>
      <div className="absolute inset-0 animate-pulse bg-[var(--surface-muted)]" />
    </div>
  ),
});

function SingleSlideImage({ src, name }: { src: string; name: string }) {
  return (
    <div>
      <div className="pdp-stage">
        <SafeImage
          src={src}
          alt={name}
          fill
          className="object-contain p-8 md:p-12"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          fetchPriority="high"
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
    </div>
  );
}

export default function SlideImage({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const displayImages = images
    .map(getSafeImageUrl)
    .filter((url): url is string => !!url);

  if (displayImages.length === 0) {
    return (
      <div>
        <div className="pdp-stage" style={{ background: "var(--surface-muted)" }} />
      </div>
    );
  }

  if (displayImages.length === 1) {
    return <SingleSlideImage src={displayImages[0]} name={name} />;
  }

  return <SlideImageGallery images={displayImages} name={name} />;
}
