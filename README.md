# NovaShop — Online Shopping (Next.js)

Customer-facing storefront for **NovaShop**, built with **Next.js 15** (App Router). Browse products, manage cart and wishlist, pay with Stripe, authenticate via JWT, and chat with an **AI shopping assistant** — powered by [Nova-shop-Nestjs](../Nova-shop-Nestjs).

**Live demo:** [nova-online-shop.xyz](https://nova-online-shop.xyz/)

---

## Features

### E-commerce

- Product catalog — search, filter (category, price, sale), sort, pagination
- Product detail — image gallery, tabs, slug URLs (`/products/[slug]`)
- Shopping cart — drawer + `/cart` page, quantity updates
- Wishlist — add/remove items, account page at `/account/wishlist`
- Stripe Checkout — buy now and cart checkout (`/api/checkout`, `/api/checkout/cart`)
- Order history at `/account/orders`

### Account & security

- NextAuth v5 + JWT from NestJS (access/refresh in httpOnly cookies)
- Middleware auto-refreshes tokens before expiry
- Email/password and Google OAuth sign-in
- Account pages: profile, orders, wishlist (`/account/*`)

### AI shopping assistant

- **xAI Grok** (`grok-3-latest`) via [Vercel AI SDK](https://sdk.vercel.ai/)
- Static store knowledge (`app/lib/chat/site-knowledge.ts`)
- Dynamic product catalog snapshot from the NestJS API
- `searchProducts` tool — search by keyword, category, and price

### UI / SEO / analytics

- Tailwind CSS, Heroicons, responsive layout
- Storefront hero + poster ticker (from `storefront/posters` API)
- SEO: sitemap, robots.txt, JSON-LD, Open Graph
- Google Tag Manager & GA4 (optional)
- Vercel Analytics

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15.5 (App Router, Turbopack dev) |
| UI | React 19, Tailwind CSS 3, Heroicons |
| Auth | NextAuth 5 beta, JWT cookies from NestJS |
| Payments | Stripe Checkout + webhooks |
| AI | Vercel AI SDK, @ai-sdk/openai → x.ai API |
| Data | Server Components + `authFetch` to NestJS |

The backend is called directly — there is no Next.js API proxy. Client and server use `NEXT_PUBLIC_EXTERNAL_API_URL`.

---

## Prerequisites

- Node.js 18+
- **pnpm** (recommended — `pnpm-lock.yaml` present) or npm
- [Nova-shop-Nestjs](../Nova-shop-Nestjs) running on port `5000`
- Stripe account (checkout)
- xAI API key (AI assistant — optional)

---

## Setup

```bash
cd Nova-online-shopping-nextjs
cp .env.example .env.local
pnpm install   # or npm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
pnpm dev      # next dev --turbopack
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # ESLint
```

---

## Environment variables

Create `.env.local` from `.env.example`:

```env
# Backend (required)
NEXT_PUBLIC_EXTERNAL_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth (required) — generate with: openssl rand -base64 32
AUTH_SECRET=your_auth_secret_min_32_chars
NEXTAUTH_SECRET=your_auth_secret_min_32_chars
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional — GOOGLE_CLIENT_ID must match NestJS)
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Stripe (checkout)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_signing_secret
INTERNAL_WEBHOOK_SECRET=change_me_internal_webhook_secret

# AI assistant (optional)
XAI_API_KEY=xai_your_api_key

# Analytics (optional)
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_token
```

Stripe webhook endpoint: `POST /api/stripe/webhook` — events: `checkout.session.completed`, `payment_intent.succeeded`.

---

## Project structure

```
Nova-online-shopping-nextjs/
├── app/
│   ├── (shop)/                  # Storefront route group
│   │   ├── products/            # Catalog + [slug] detail
│   │   ├── cart/
│   │   └── account/             # Profile, orders, wishlist
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth handlers
│   │   ├── chat/                # AI streaming (Grok)
│   │   ├── checkout/            # Stripe sessions
│   │   └── stripe/webhook/
│   ├── checkout/                # Success / cancel pages
│   ├── login/
│   ├── lib/
│   │   ├── chat/                # AI knowledge, tools, prompts
│   │   ├── services/            # products, cart, wishlist, user, posters
│   │   ├── api-client.ts        # authFetch + token refresh
│   │   └── seo.ts
│   └── ui/                      # Components (nova-*, cart, products, …)
├── components/
│   ├── AIChatbotLazy.tsx        # Floating chat widget
│   ├── GoogleAnalytics.tsx
│   └── GoogleTagManager.tsx
├── auth.config.ts
├── middleware.ts                # JWT refresh middleware
└── package.json
```

---

## NestJS API integration

The frontend calls the backend directly (no `/api` prefix):

```typescript
GET  /products              # Catalog (public)
GET  /products/:id          # Detail (public)
GET  /cart                  # Cart (JWT)
POST /cart/add
GET  /wishlist              # Wishlist (JWT)
POST /login, POST /token    # Auth
GET  /user/:id/orders       # Orders (JWT)
GET  /storefront/posters    # Homepage banners
```

Next.js internal API routes:

```typescript
POST /api/chat              # AI streaming
POST /api/checkout          # Buy now → Stripe
POST /api/checkout/cart     # Cart checkout → Stripe
POST /api/stripe/webhook    # Stripe events → confirm order
```

---

## Stripe test cards

```
Visa:       4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
Declined:   4000 0000 0000 0002
```

---

## Deployment

1. Deploy the NestJS backend — update `NEXT_PUBLIC_EXTERNAL_API_URL`
2. Deploy Next.js (e.g. Vercel) — set production env vars and Stripe webhook URL
3. On NestJS: add the production frontend domain to `ALLOWED_ORIGINS`

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [NestJS Docs](https://nestjs.com/)
- [Stripe Docs](https://stripe.com/docs)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [xAI API](https://docs.x.ai/)

---

## Author

**Tran Loi** — [@Tranloi2k](https://github.com/Tranloi2k) · [tranloi20001007@gmail.com](mailto:tranloi20001007@gmail.com)
