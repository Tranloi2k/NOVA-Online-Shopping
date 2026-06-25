import type { ProductListItem, ProductReview } from "@/app/lib/definitions";
import {
  absoluteImageUrl,
  absoluteUrl,
  DEFAULT_DESCRIPTION,
  getSiteUrl,
  productPath,
  SITE_NAME,
} from "@/app/lib/seo";

/** ISO 3166-1 alpha-2 — matches USD pricing and storefront policies. */
const MERCHANT_COUNTRY = "US";

const KNOWN_PRODUCT_BRANDS = [
  "Apple",
  "Samsung",
  "Google",
  "Sony",
  "Bose",
  "Dell",
  "HP",
  "Lenovo",
  "Microsoft",
  "OnePlus",
  "Xiaomi",
  "Huawei",
  "LG",
  "Motorola",
  "Nothing",
  "Garmin",
  "Fitbit",
  "JBL",
  "Beats",
  "Meta",
  "Amazon",
] as const;

function inferProductBrand(name: string): string {
  const lower = name.toLowerCase();
  for (const brand of KNOWN_PRODUCT_BRANDS) {
    if (lower.startsWith(brand.toLowerCase())) return brand;
  }
  return SITE_NAME;
}

function merchantShippingDetails() {
  return {
    "@type": "OfferShippingDetails",
    shippingRate: {
      "@type": "MonetaryAmount",
      value: 0,
      currency: "USD",
    },
    shippingDestination: {
      "@type": "DefinedRegion",
      addressCountry: MERCHANT_COUNTRY,
    },
    deliveryTime: {
      "@type": "ShippingDeliveryTime",
      handlingTime: {
        "@type": "QuantitativeValue",
        minValue: 0,
        maxValue: 1,
        unitCode: "DAY",
      },
      transitTime: {
        "@type": "QuantitativeValue",
        minValue: 1,
        maxValue: 2,
        unitCode: "DAY",
      },
    },
  };
}

function merchantReturnPolicy() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: MERCHANT_COUNTRY,
    returnPolicyCategory:
      "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: 30,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  };
}

type ProductDetail = {
  id: number | string;
  name: string;
  description?: string;
  images?: string;
  image?: string;
  price: number;
  discount?: number;
  brand?: string;
  gtin?: string;
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
};

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_NAME,
        url: siteUrl,
        logo: absoluteImageUrl("/hero-shop.jpg"),
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        description: DEFAULT_DESCRIPTION,
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/products?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function productListJsonLd(products: ProductListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(productPath(product)),
      name: product.name,
    })),
  };
}

export function productDetailJsonLd(product: ProductDetail) {
  const path = productPath({ id: product.id, name: product.name });
  const images = product.images
    ? product.images.split(",").map((img) => absoluteImageUrl(img.trim()))
    : product.image
      ? [absoluteImageUrl(product.image)]
      : [];

  const rating =
    product.rating ??
    (product.reviews?.length
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : undefined);
  const reviewCount = product.reviewCount ?? product.reviews?.length ?? 0;

  const price = Number(product.price);
  const discount = Number(product.discount ?? 0);
  const offerPrice =
    discount > 0 ? price * (1 - discount / 100) : price;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: getSiteUrl() },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: absoluteUrl("/products"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: absoluteUrl(path),
          },
        ],
      },
      {
        "@type": "Product",
        name: product.name,
        description: product.description ?? product.name,
        image: images.length > 0 ? images : undefined,
        sku: String(product.id),
        brand: {
          "@type": "Brand",
          name: product.brand?.trim() || inferProductBrand(product.name),
        },
        ...(product.gtin?.trim() ? { gtin: product.gtin.trim() } : {}),
        offers: {
          "@type": "Offer",
          url: absoluteUrl(path),
          priceCurrency: "USD",
          price: offerPrice.toFixed(2),
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
          shippingDetails: merchantShippingDetails(),
          hasMerchantReturnPolicy: merchantReturnPolicy(),
        },
        ...(rating && reviewCount > 0
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: Number(rating).toFixed(1),
                reviewCount,
              },
            }
          : {}),
      },
    ],
  };
}
