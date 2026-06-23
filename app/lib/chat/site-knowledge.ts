import { CATEGORY_NAV_ITEMS } from "@/app/lib/product-filters";
import { DEFAULT_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/app/lib/seo";

/**
 * Edit this file to teach the AI about your store.
 * Update when policies, FAQ, or company info changes.
 */
export const SITE_KNOWLEDGE = {
  brand: {
    name: SITE_NAME,
    tagline: SITE_TAGLINE,
    description: DEFAULT_DESCRIPTION,
  },
  categories: CATEGORY_NAV_ITEMS.map((c) => c.label),
  policies: {
    shipping:
      "Free 2-day shipping on every order, no minimum. Orders placed before 2pm ship the same day.",
    returns:
      "Free 30-day returns. Full refund if you are not satisfied.",
    warranty:
      "2-year warranty on all NOVA devices, covering manufacturing defects.",
    support:
      "Customer support 7 days a week via chat, email, and phone.",
    payment:
      "Secure checkout via Stripe (credit/debit cards). Google sign-in supported.",
  },
  pages: {
    products: "/products",
    cart: "/cart",
    account: "/account",
    login: "/login",
    checkout: "Checkout via Stripe after adding items to your cart.",
  },
  faq: [
    {
      q: "How do I track my order?",
      a: "Sign in to your account and go to Account > Orders to view order status.",
    },
    {
      q: "Can I return an item?",
      a: "Yes, within 30 days of delivery with free return shipping.",
    },
    {
      q: "How much is shipping?",
      a: "Free 2-day shipping on all orders.",
    },
  ],
  rules: [
    "Only answer based on NOVA store information provided in context.",
    "If unsure or data is missing, say so and suggest contacting support.",
    "Never invent prices, stock levels, or policies not in the data.",
    "Suggest the /products page when customers want to browse more.",
    "Always respond in English, even if the customer writes in another language.",
  ],
} as const;

export function formatSiteKnowledge(): string {
  const { brand, categories, policies, pages, faq, rules } = SITE_KNOWLEDGE;

  const faqBlock = faq
    .map((item) => `- Q: ${item.q}\n  A: ${item.a}`)
    .join("\n");

  return [
    `## Brand`,
    `- Name: ${brand.name}`,
    `- Tagline: ${brand.tagline}`,
    `- Description: ${brand.description}`,
    ``,
    `## Product categories`,
    categories.map((c) => `- ${c}`).join("\n"),
    ``,
    `## Policies`,
    `- Shipping: ${policies.shipping}`,
    `- Returns: ${policies.returns}`,
    `- Warranty: ${policies.warranty}`,
    `- Support: ${policies.support}`,
    `- Payment: ${policies.payment}`,
    ``,
    `## Key pages`,
    `- Products: ${pages.products}`,
    `- Cart: ${pages.cart}`,
    `- Account: ${pages.account}`,
    `- Login: ${pages.login}`,
    `- Checkout: ${pages.checkout}`,
    ``,
    `## FAQ`,
    faqBlock,
    ``,
    `## Response rules`,
    rules.map((r) => `- ${r}`).join("\n"),
  ].join("\n");
}
