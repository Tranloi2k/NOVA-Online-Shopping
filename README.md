# 🛍️ NovaShop — Online Shopping (Next.js)

The customer-facing storefront for **NovaShop**, built with Next.js 15. Browse products, manage your cart, authenticate securely, checkout with Stripe, and get help from an **AI shopping assistant** — powered by the [NovaShop NestJS API](https://github.com/Tranloi2k/nestjs-app).

Next.js
TypeScript
Tailwind CSS
NestJS
Stripe
Vercel AI SDK
xAI Grok

## 🎥 Demo Video

### Demo: [https://nova-online-shop.xyz/](https://nova-online-shop.xyz/)

## ✨ Features

### 🛍️ **E-Commerce Core**

- **Product Management** - Browse, search, and filter products
- **Product Details** - Detailed product pages with image galleries
- **Shopping Cart** - Add to cart and manage quantities
- **Stripe Checkout** - Secure payment processing
- **Order Management** - Track purchases and order history

### 🤖 **AI Shopping Assistant**

- **xAI Grok** - Powered by Grok via [Vercel AI SDK](https://sdk.vercel.ai/)
- **Store Knowledge** - Policies, FAQ, categories, and key pages (`app/lib/chat/site-knowledge.ts`)
- **Live Product Catalog** - Injects product snapshot from the NestJS API into each chat session
- **Product Search Tool** - AI can search products by keyword, category, price, and sale status

### 🔐 **Authentication & Security**

- **NextAuth.js** - Secure user authentication
- **Protected Routes** - Dashboard access control
- **Session Management** - Automatic login/logout
- **Middleware Protection** - Route-level security

### 🎨 **Modern UI/UX**

- **Tailwind CSS** - Utility-first styling
- **Heroicons** - Beautiful icon library
- **Responsive Layout** - Works on all devices
- **Loading States** - Smooth user interactions

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Heroicons** - SVG icon library

### **Backend**

- **NestJS API** - Node.js backend framework
- **API Proxy** - Next.js proxy to NestJS backend
- **RESTful APIs** - Standard HTTP endpoints

### **Authentication**

- **NextAuth.js** - Authentication library
- **JWT Tokens** - Secure session management

### **Payments**

- **Stripe** - Payment processing
- **Stripe Checkout** - Hosted payment pages
- **Webhooks** - Real-time payment events

### **AI**

- **Vercel AI SDK** (`ai`, `@ai-sdk/react`) - Streaming chat and tool calling
- **@ai-sdk/openai** - OpenAI-compatible client for x.ai (`baseURL: https://api.x.ai/v1`)
- **xAI Grok** - `grok-3-latest` via Chat Completions API

## 🚀 Getting Started

### **Prerequisites**

```bash
Node.js 18.0+
pnpm (recommended) or npm
NestJS Backend API running
Stripe account
xAI API key (for AI assistant)
```

### **Installation**

1. **Clone the repository**

```bash
git clone https://github.com/Tranloi2k/nextjs-dashboard.git nova-online-shopping-nextjs
cd nova-online-shopping-nextjs
```

1. **Install dependencies**

```bash
pnpm install
# or
npm install
```

1. **Environment Setup**
  Create `.env.local` file in the root directory:

```env
# NestJS Backend API
NEXT_PUBLIC_EXTERNAL_API_URL="http://localhost:5000"

# Stripe (checkout redirects via server-generated session URL)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
INTERNAL_WEBHOOK_SECRET="change_me_internal_webhook_secret"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# AI Assistant (x.ai)
XAI_API_KEY="xai_your_api_key"

# Authentication (Optional)
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="your_auth_secret"
```

1. **Start NestJS Backend**

```bash
# Make sure your NestJS backend is running on port 5000
# The backend should expose API endpoints at:
# http://localhost:5000/api/products
# http://localhost:5000/api/users
# etc.
```

1. **Run the development server**

```bash
pnpm dev
# or
npm run dev
```

1. **Open your browser**
  Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
nova-online-shopping-nextjs/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── chat/                 # AI chat streaming endpoint (Grok)
│   │   ├── checkout/             # Stripe checkout
│   │   ├── auth/                 # NextAuth handlers
│   │   └── stripe/               # Stripe webhooks
│   ├── lib/
│   │   ├── chat/                 # AI knowledge base & tools
│   │   │   ├── site-knowledge.ts # Store policies, FAQ, rules
│   │   │   ├── product-context.ts# Product catalog formatting
│   │   │   ├── build-system-prompt.ts
│   │   │   └── tools.ts          # searchProducts tool
│   │   ├── services/             # API service layer
│   │   └── ...
│   ├── ui/                       # Reusable UI components
│   ├── (shop)/                   # Storefront routes
│   ├── checkout/                 # Checkout success/cancel pages
│   ├── login/                    # Authentication pages
│   ├── layout.tsx                # Root layout (includes AIChatbot)
│   └── page.tsx                  # Home page
├── components/
│   └── AIChatbot.tsx             # Floating chat widget (client)
├── auth.config.ts                # NextAuth configuration
├── middleware.ts                 # Route protection middleware
├── tailwind.config.ts            # Tailwind CSS configuration
├── pnpm-lock.yaml                # Lockfile (use pnpm install)
└── package.json                  # Dependencies and scripts
```

## 🔧 Configuration

### **NestJS Backend Integration**

1. **API Proxy Setup** - All API calls are proxied to NestJS backend
2. **Environment Variables** - Configure `NEXT_PUBLIC_EXTERNAL_API_URL` to point to your backend
3. **CORS Configuration** - Ensure NestJS backend allows requests from Next.js frontend

### **Stripe Setup**

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up webhooks endpoint: `http://localhost:3000/api/stripe/webhook`
4. Add webhook events: `checkout.session.completed`, `payment_intent.succeeded`

### **Authentication Setup**

1. Configure NextAuth.js providers
2. Set up protected routes in middleware
3. Configure session management

### **AI Assistant Setup**

1. Create an API key at [console.x.ai](https://console.x.ai)
2. Add `XAI_API_KEY` to `.env.local` (and Vercel project settings for production)
3. Ensure the NestJS backend is running so the assistant can load product data
4. Customize store knowledge in `app/lib/chat/site-knowledge.ts` (policies, FAQ, response rules)
5. Change the model in `app/api/chat/route.ts` if needed (default: `grok-3-latest`)

**How the assistant learns about your store:**


| Layer            | File                 | Purpose                          |
| ---------------- | -------------------- | -------------------------------- |
| Static knowledge | `site-knowledge.ts`  | Policies, FAQ, categories, rules |
| Dynamic catalog  | `product-context.ts` | Product snapshot from NestJS API |
| Tool calling     | `tools.ts`           | `searchProducts` for live search |


## 📚 API Integration

### **NestJS Backend Endpoints**

The frontend expects these endpoints from your NestJS backend:

```typescript
GET /api/products              # Get all products
GET /api/products/:id          # Get product by ID
POST /api/products             # Create new product
PUT /api/products/:id          # Update product
DELETE /api/products/:id       # Delete product

```

### **AI Chat Endpoint**

```typescript
POST /api/chat                 # Streaming chat (Vercel AI SDK + xAI Grok)
```

Request body: `{ messages: UIMessage[] }` from `useChat`. Response: streamed UI message protocol.

## 🧪 Testing

### **Test Payment Cards**

```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
Declined: 4000 0000 0000 0002
```

### **Backend Requirements**

- NestJS backend running on port 5000
- CORS enabled for [http://localhost:3000](http://localhost:3000)
- JSON responses for all API calls

## 🚀 Deployment

### **Backend Deployment**

- Deploy your NestJS backend separately
- Update `NEXT_PUBLIC_EXTERNAL_API_URL` to production backend URL
- Ensure CORS allows your production frontend domain

### **Environment Variables for Production**

- Update `NEXT_PUBLIC_APP_URL` to your production domain
- Update Stripe webhook endpoint URL
- Use production Stripe keys
- Add `XAI_API_KEY` to Vercel environment variables

## 🔄 Development Workflow

1. **Start NestJS Backend** (port 5000)
2. **Start Next.js Frontend** (port 3000)
3. **Authentication:** Handled by Next.js with NextAuth.js
4. **Payments:** Handled by Next.js with Stripe

## 📖 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Course](https://nextjs.org/learn)
- [NestJS Documentation](https://nestjs.com/)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [xAI API Documentation](https://docs.x.ai/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👨‍💻 Author

**Tran Loi**

- GitHub: [@Tranloi2k](https://github.com/Tranloi2k)
- Email: [tranloi20001007@gmail.com](mailto:tranloi20001007@gmail.com)
- Live demo: [nova-online-shopping.vercel.app](https://nova-online-shopping.vercel.app/)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [NestJS Team](https://nestjs.com/) for the powerful backend framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Vercel AI SDK](https://sdk.vercel.ai/) and [xAI](https://x.ai/) for the shopping assistant

---

⭐ **Star this repository if you found it helpful!**