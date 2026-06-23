import { getCatalogAuthenticated } from "@/app/lib/catalog-auth";
import {
  getAllProductSlugParams,
  getProductById,
} from "@/app/lib/services/products";
import {
  buildPageMetadata,
  getProductOgDescription,
  getProductOgImage,
  productPath,
} from "@/app/lib/seo";
import {
  getProductGalleryImages,
  parseCommaSeparatedList,
} from "@/app/lib/product-fields";
import { productDetailJsonLd } from "@/app/lib/seo-structured-data";
import JsonLd from "@/app/ui/seo/json-ld";
import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import SlideImage from "./slideImage";
import ProductForm from "./productForm";
import ProductTabs from "./productTabs";
import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  return getAllProductSlugParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const id = slug.split(".").pop() || "";
  const data = await getProductById(id, { authenticated: false });

  return buildPageMetadata({
    title: data.name,
    description: getProductOgDescription(data),
    pathname: productPath({ id: data.id, name: data.name }),
    image: getProductOgImage(data),
  });
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const id = slug.split(".").pop() || "";
  const authenticated = await getCatalogAuthenticated();
  const data = await getProductById(id, { authenticated });
  const { reviews } = data;
  const reviewTotal =
    Array.isArray(reviews) && reviews.length > 0
      ? reviews.length
      : Math.max(0, Number(data.reviewCount) || 0);
  const productRating = Number.isFinite(Number(data.rate))
    ? Number(data.rate)
    : 0;

  const product = {
    ...data,
    colors: parseCommaSeparatedList(data.colors),
    storageOptions: parseCommaSeparatedList(data.storageOptions),
    images: getProductGalleryImages(data),
  };

  let prodDetail: Record<string, unknown> | null = null;
  if (product.detailInformation) {
    try {
      if (typeof product.detailInformation === "object") {
        prodDetail = product.detailInformation as Record<string, unknown>;
      } else {
        const parsed = JSON.parse(product.detailInformation);
        prodDetail = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      }
    } catch (e) {
      console.error("Failed to parse detailInformation:", e);
    }
  }

  return (
    <main className="pdp-main">
      <JsonLd data={productDetailJsonLd(data)} />
      <div className="wrap">
        {/* Breadcrumb */}
        <nav className="crumbs pdp-crumbs">
          <Link href="/products">Shop</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Main grid: gallery + info */}
        <div className="pdp-grid">
          <div className="pdp-gallery">
            <SlideImage images={product.images} name={product.name} />
          </div>

          <div className="pdp-info">
            <div
              className="muted"
              style={{ fontWeight: 700, fontSize: "13.5px", letterSpacing: ".02em" }}
            >
              NOVA
            </div>
            <h1 className="pdp-title" style={{ marginTop: 6 }}>
              {product.name}
            </h1>

            {/* Stars */}
            <div
              style={{
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((r) =>
                  r <= Math.floor(productRating) ? (
                    <StarIcon
                      key={r}
                      style={{ width: 14, height: 14, color: "var(--ink)" }}
                    />
                  ) : (
                    <StarOutlineIcon
                      key={r}
                      style={{ width: 14, height: 14, color: "var(--hair)" }}
                    />
                  ),
                )}
              </div>
              <span className="muted" style={{ fontSize: 13.5 }}>
                {productRating.toFixed(1)} · {reviewTotal.toLocaleString()} reviews
              </span>
            </div>

            <p className="muted pdp-desc">
              {product.description}
            </p>

            <ProductForm product={{ ...product }} />
          </div>
        </div>

        {/* Tabs: Specifications / Shipping / Reviews */}
        <ProductTabs
          productDetail={prodDetail}
          reviews={reviews}
          productRate={product.rate}
          reviewCount={product.reviewCount}
        />
      </div>
    </main>
  );
}
