# Aronyok (আরণ্যক) - Bilingual Eco & Botanical Web Platform

A comprehensive, nature-inspired web platform combining an organic e-commerce storefront, an integrated herbal blog, interactive green micro-tools, dynamic informational pages, and a protected custom CMS dashboard.

Featuring a floating **AI Assistant** chat bubble on the frontend that acts as an expert herbalist & botanist, powered entirely by OpenRouter's free AI models (`meta-llama/llama-3.3-70b-instruct:free` or `meta-llama/llama-3-8b-instruct:free`).

---

## 🌿 Tech Stack & Architecture

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript
- **Styling:** Tailwind CSS + Lucide Icons + custom nature theme (forest greens `#1b4332`, warm wood `#936639`, soft cream `#fdfbf7`)
- **State & i18n:** Bilingual Context (`LanguageContext`) with instant switching between English (EN) and Bengali (BN)
- **Database & Auth:** Supabase PostgreSQL with Row Level Security (RLS) & Supabase Auth
- **AI Integration:** OpenRouter API (`/api/chat`) with dynamic DB system prompt customization & botanical fallback engine
- **E-Commerce & Payments:** Client-side Cart Context (`CartContext`), slide-over drawer, and multi-gateway checkout scaffolding (bKash/Nagad MFS, SSLCommerz, Stripe, Cash on Delivery)

---

## 📁 Project Structure

```
├── supabase/
│   ├── schema.sql                     # Complete PostgreSQL tables, RLS policies & triggers
│   └── seed.sql                       # Rich bilingual seed data (Products, Blog, Pages, Tools, Settings)
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root bilingual layout + navbar + floating AI + footer
│   │   ├── page.tsx                   # Storefront homepage (Hero, Products, Tools, Blog)
│   │   ├── globals.css                # Earth tones & custom theme styling
│   │   ├── shop/                      # Product catalog & single product details
│   │   ├── cart/                      # Cart & checkout with payment gateways
│   │   ├── blog/                      # Botanical journal & single post reader
│   │   ├── tools/                     # Interactive Eco Tools (Herbal, Sunlight, Soil)
│   │   ├── [slug]/                    # Dynamic pages template (about-us, sustainability, etc.)
│   │   ├── admin/                     # Protected CMS Dashboard
│   │   │   ├── login/                 # Nature-themed admin login
│   │   │   ├── products/              # Dual input product manager
│   │   │   ├── blog/                  # Dual input blog manager
│   │   │   ├── pages/                 # Dynamic page customizer
│   │   │   ├── tools/                 # Widget toggle dashboard
│   │   │   ├── orders/                # Payment gateway transaction manager
│   │   │   └── settings/              # SEO & AI System Prompt editor
│   │   └── api/
│   │       ├── chat/route.ts          # OpenRouter nature expert assistant
│   │       └── checkout/route.ts      # Multi-gateway order handler
│   ├── components/                    # UI, Layout, Storefront, Tools & Admin components
│   ├── context/                       # Language & Cart React Contexts
│   └── lib/                           # Supabase clients, translations, types & helpers
├── .env.example                       # Environment variables reference
└── package.json
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter (Free models: meta-llama/llama-3.3-70b-instruct:free)
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_MODEL=meta-llama/llama-3.3-70b-instruct:free

# Site Domain
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Note:** The app includes a built-in offline fallback mode. If Supabase or OpenRouter keys are omitted, the storefront, eco tools, and AI demo will run locally using authentic Bengali/English seed data!

### 2. Run Database Migrations in Supabase
1. Open your Supabase Dashboard -> **SQL Editor**.
2. Run the script in `supabase/schema.sql`.
3. Run the script in `supabase/seed.sql` to populate sample products, blogs, and settings.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Protected Admin CMS

- **URL:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Admin Credentials:**
  - Email: `hasan@aronyok.com`
  - Password: `AronyokAdmin#2026`
- **Features:**
  - **Dual Input Fields:** Side-by-side / tabbed fields for English and Bengali for seamless bilingual entry.
  - **Live AI Tuning:** Change the Assistant's system prompt directly in the Settings panel.
  - **Orders & Payments:** Inspect customer orders made via Cash on Delivery, bKash / Nagad, SSLCommerz, and Stripe.
