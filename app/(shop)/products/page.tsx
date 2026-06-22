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
    case "audio":
      return "Audio";
    case "laptops":
      return "Laptops";
    case "accessories":
      return "Accessories";
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
    case "audio":
      return "Shop headphones, earbuds, and speakers with premium sound.";
    case "laptops":
      return "Browse powerful laptops for work, creativity, and everyday use.";
    case "accessories":
      return "Find keyboards, chargers, hubs, and essentials for your setup.";
    default:
      return "Browse our full catalog of premium tech — phones, laptops, audio, and more.";
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

function ProductsPageSkeleton({
  pageTitle,
  filters,
}: {
  pageTitle: string;
  filters: ReturnType<typeof parseProductFilters>;
}) {
  return (
    <>
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
          <div className="mt-3 h-4 w-64 animate-pulse rounded-sm bg-shop-border-subtle" />
        </div>
      </div>

      {/* Body */}
      <div className="wrap shop-body">
        <ProductToolbar disabled />
        <Search disabled key={filters.query || ""} />
        <ProductGridSkeleton count={8} />
      </div>
    </>
  );
}

async function ProductsPageContent({
  filters,
  authenticated,
  pageTitle,
}: {
  filters: ReturnType<typeof parseProductFilters>;
  authenticated: boolean;
  pageTitle: string;
}) {
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
    <>
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
        <ProductToolbar />
        <Search key={filters.query || ""} />

        <ListProductsComponent
          products={result.products}
          viewMode={filters.view}
        />

        <ProductPagination
          currentPage={result.page}
          totalPages={result.totalPages}
        />
      </div>
    </>
  );
}

export default async function ProductsPage(props: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const rawParams = (await props.searchParams) ?? {};
  const filters = parseProductFilters(rawParams);
  const pageTitle = getPageTitle(filters.category, filters.query);
  const authenticated = await getCatalogAuthenticated();

  return (
    <main>
      <Suspense fallback={<ProductsPageSkeleton pageTitle={pageTitle} filters={filters} />}>
        <ProductsPageContent
          filters={filters}
          authenticated={authenticated}
          pageTitle={pageTitle}
        />
      </Suspense>
    </main>
  );
}
