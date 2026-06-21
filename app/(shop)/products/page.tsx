import ListProductsComponent from "./listProductsComponent";
import Search from "./search";
import ProductToolbar from "@/app/ui/products/product-toolbar";
import ProductPagination from "@/app/ui/products/product-pagination";
import { parseProductFilters } from "@/app/lib/product-filters";
import { getCatalogAuthenticated } from "@/app/lib/catalog-auth";
import { getProducts } from "@/app/lib/services/products";
import { buildPageMetadata } from "@/app/lib/seo";
import { productListJsonLd } from "@/app/lib/seo-structured-data";
import JsonLd from "@/app/ui/seo/json-ld";
import { ProductGridSkeleton } from "@/app/ui/shop/skeletons";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

function getPageTitle(category?: string, query?: string) {
  if (query) return `Results for "${query}"`;
  switch (category) {
    case "smartphones":
      return "Smartphones";
    case "tablets":
      return "Tablets";
    case "wearables":
      return "Wearables";
    default:
      return "All products";
  }
}

function getCatalogDescription(category?: string, query?: string) {
  if (query) {
    return `Search results for "${query}" at NOVA — premium tech and accessories.`;
  }
  switch (category) {
    case "smartphones":
      return "Browse the latest smartphones — flagship performance, premium design.";
    case "tablets":
      return "Shop tablets for work and creativity with vivid displays.";
    case "wearables":
      return "Discover smartwatches and wearables that keep you connected.";
    default:
      return "Browse our full catalog of premium smartphones, tablets, and wearables.";
  }
}

export async function generateMetadata(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}): Promise<Metadata> {
  const rawParams = (await props.searchParams) ?? {};
  const filters = parseProductFilters(rawParams);
  const title = getPageTitle(filters.category, filters.query);
  const pathname =
    filters.query || filters.category || filters.page > 1
      ? `/products?${new URLSearchParams(
          Object.entries(rawParams).filter(([, v]) => v != null) as [string, string][],
        ).toString()}`
      : "/products";

  return buildPageMetadata({
    title,
    description: getCatalogDescription(filters.category, filters.query),
    pathname,
  });
}

export default async function ProductsPage(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const rawParams = (await props.searchParams) ?? {};
  const filters = parseProductFilters(rawParams);
  const pageTitle = getPageTitle(filters.category, filters.query);
  const authenticated = await getCatalogAuthenticated();

  const result = await getProducts(
    {
      query: filters.query,
      page: filters.page,
      category: filters.category,
      sort: filters.sort,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      onSale: filters.onSale,
    },
    { authenticated },
  );

  // Redirect to page 1 if the requested page is out of bounds
  if (result.products.length === 0 && filters.page > 1) {
    const params = new URLSearchParams();
    if (filters.category) params.set("category", filters.category);
    if (filters.query) params.set("q", filters.query);
    if (filters.sort && filters.sort !== "popular") params.set("sort", filters.sort);
    const qs = params.toString();
    redirect(qs ? `/products?${qs}` : "/products");
  }

  return (
    <main>
      {result.products.length > 0 ? (
        <JsonLd data={productListJsonLd(result.products)} />
      ) : null}

      {/* Hero */}
      <div className="shop-hero">
        <div className="wrap">
          <nav className="crumbs">
            <Link href="/">Home</Link>
            <span>/</span>
            <span>{pageTitle}</span>
          </nav>
          <h1 style={{ fontSize: "clamp(32px,4.4vw,54px)", marginTop: 10 }}>
            {pageTitle}
          </h1>
          <p className="muted" style={{ fontSize: 16, marginTop: 10 }}>
            {result.total ?? result.products.length} products · free 2-day shipping on everything
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="wrap shop-body">
        <Suspense fallback={null}>
          <ProductToolbar />
        </Suspense>

        <Suspense fallback={null}>
          <Search />
        </Suspense>

        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <ListProductsComponent
            products={result.products}
            viewMode={filters.view}
          />
        </Suspense>

        <Suspense fallback={null}>
          <ProductPagination
            currentPage={result.page}
            totalPages={result.totalPages}
          />
        </Suspense>
      </div>
    </main>
  );
}
