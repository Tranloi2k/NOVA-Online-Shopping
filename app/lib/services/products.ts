"use server";
import { authFetch } from "@/app/lib/api-client";
import { CACHE_TAGS } from "@/app/lib/cache-tags";
import type { ProductListItem } from "@/app/lib/definitions";
import { productSlug } from "@/app/lib/product-path";
import { isNextNavigationError } from "@/app/lib/utils";

const productsPerPage = 8; /** Page size when prebuilding product URLs at build time (sitemap, generateStaticParams). */
const staticBuildPageSize = 50;
const staticBuildMaxPages = 100;

export type ProductsQuery = {
  query?: string;
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
};

export type ProductSlugParam = { slug: string };

export type ProductsPageResult = {
  products: ProductListItem[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const EMPTY_RESULT: ProductsPageResult = {
  products: [],
  total: 0,
  page: 1,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
};

type CatalogFetchInit = {
  tags: string[];
  cache?: RequestCache;
};

async function fetchCatalogResponse(
  url: string,
  authenticated: boolean,
  init: CatalogFetchInit,
): Promise<Response> {
  const publicInit: RequestInit = {
    method: "GET",
    next: { tags: init.tags, revalidate: 60 },
  };

  let res = authenticated
    ? await authFetch(url, {
        method: "GET",
        cache: init.cache ?? "no-store",
        next: { tags: init.tags },
      })
    : await fetch(url, publicInit);

  if (res.status === 401 && authenticated) {
    res = await fetch(url, publicInit);
  }

  return res;
}

export async function getProducts(
  filters: ProductsQuery = {},
  options?: { authenticated?: boolean },
): Promise<ProductsPageResult> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    console.error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
    return EMPTY_RESULT;
  }

  const {
    query = "",
    page = 1,
    category,
    sort = "popular",
    minPrice,
    maxPrice,
    onSale,
  } = filters;

  const params = new URLSearchParams();
  if (query) params.set("search", query);
  if (category) params.set("category", category);
  if (sort) params.set("sort", sort);
  if (minPrice !== undefined) params.set("minPrice", String(minPrice));
  if (maxPrice !== undefined) params.set("maxPrice", String(maxPrice));
  if (onSale) params.set("onSale", "true");
  params.set("page", String(page));
  params.set("limit", String(filters.limit ?? productsPerPage));

  const url = `${apiUrl}/products?${params.toString()}`;
  const authenticated = options?.authenticated ?? false;

  const productTags = [CACHE_TAGS.products, CACHE_TAGS.catalog];

  try {
    const res = await fetchCatalogResponse(url, authenticated, {
      tags: productTags,
    });

    if (!res.ok) {
      console.error("Failed to fetch products:", res.status);
      return EMPTY_RESULT;
    }

    const data = await res.json();
    return {
      products: data.products ?? [],
      total: data.total ?? 0,
      page: data.page ?? page,
      totalPages: data.totalPages ?? 0,
      hasNextPage: data.hasNextPage ?? false,
      hasPrevPage: data.hasPrevPage ?? false,
    };
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    console.error("Error fetching products:", error);
    return EMPTY_RESULT;
  }
}

/** @deprecated Use getProducts() which returns pagination metadata */
export async function getProductsList(
  query: string,
  page: number = 1,
  options?: { authenticated?: boolean },
) {
  const result = await getProducts({ query, page }, options);
  return result.products;
}

export async function getProductById(
  id: string,
  options?: { authenticated?: boolean },
) {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }

  const authenticated = options?.authenticated ?? false;
  const url = `${apiUrl}/products/${id}`;
  const tags = [CACHE_TAGS.products, CACHE_TAGS.product(id)];

  const res = await fetchCatalogResponse(url, authenticated, { tags });

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }
  const data = await res.json();
  return data;
}

/**
 * All product slugs for `generateStaticParams` and sitemap.
 * Uses public catalog fetch (no auth). Returns [] if API is unavailable at build time.
 */
export async function getAllProductSlugParams(): Promise<ProductSlugParam[]> {
  const params: ProductSlugParam[] = [];
  let page = 1;
  let hasNext = true;

  try {
    while (hasNext && page <= staticBuildMaxPages) {
      const result = await getProducts(
        { page, limit: staticBuildPageSize },
        { authenticated: false },
      );

      for (const product of result.products) {
        if (!product?.name || product.id == null) continue;
        params.push({ slug: productSlug(product.name, product.id) });
      }

      hasNext = result.hasNextPage;
      page += 1;
    }
  } catch (error) {
    if (isNextNavigationError(error)) {
      throw error;
    }
    console.error("getAllProductSlugParams:", error);
  }

  return params;
}
