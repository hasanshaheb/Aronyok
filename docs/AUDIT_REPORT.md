# ARONYOK (আরণ্যক) — Comprehensive Architecture & Security Audit Report
**Date:** November 1, 2026  
**Auditor:** Lead Software Architect & Engineering Agent  
**Environment:** Next.js 14.2 (App Router) | React 18.3 | TypeScript 5.6 | Tailwind CSS 3.4 | Supabase PostgreSQL & Auth | Vercel Hosting  
**Current Live Domain:** https://aronyok.vercel.app/  
**Git Branch Audited:** `main` (backed up to `backup-pre-upgrade-2026`)

---

## 1. Executive Summary

A comprehensive architectural, functional, performance, and security audit was conducted on the existing **Aronyok (আরণ্যক)** codebase. 

Aronyok is currently structured as a hybrid prototype ecommerce and eco-living platform built on Next.js 14 (App Router) and Supabase. While the user-facing storefront has an attractive visual presentation, bilingual support (English/Bengali), and a responsive layout, **the application currently operates with prototype-level security, extensive client-side rendering ("use client" anti-patterns), mock order processing, and unauthenticated administrative API endpoints that expose sensitive customer and business data.**

To upgrade Aronyok into an enterprise-grade, high-volume production platform, systematic refactoring is required across authentication, API security, database schema normalization, transactional order processing, and administrative module separation.

---

## 2. Technology Stack & Repository Architecture

### 2.1 Core Dependencies & Framework Versions
* **Framework:** Next.js `14.2.18` (React `18.3.1`, React-DOM `18.3.1`)
* **Router Type:** Next.js App Router (`src/app/` directory)
* **Language & Compiler:** TypeScript `5.6.3` (`strict` mode enabled in `tsconfig.json`)
* **Styling:** Tailwind CSS `3.4.15`, PostCSS `8.4.49`, Autoprefixer `10.4.20`, `clsx`, `tailwind-merge`
* **Icons:** `lucide-react` `0.460.0`
* **Database & Auth Client:** `@supabase/supabase-js` `2.46.2`, `@supabase/ssr` `0.5.2`
* **Analytics:** `@vercel/analytics` `2.0.1`

### 2.2 Directory Structure
```
├── .env.example                # Template of environment variables
├── .env.local                  # Local secrets (Supabase keys, OpenRouter)
├── data/
│   └── orders.json             # Local JSON file store for fallback orders
├── docs/                       # Technical architecture & audit documentation
├── public/
│   ├── uploads/                # Local file upload directory
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── [slug]/page.tsx     # Dynamic policy & CMS pages (/about-us, /sustainability)
│   │   ├── admin/              # Admin CMS portal
│   │   │   ├── blog/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── orders/page.tsx
│   │   │   ├── pages/page.tsx
│   │   │   ├── products/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   ├── tools/page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx        # Admin Dashboard
│   │   ├── api/                # API Routes
│   │   │   ├── admin/data/     # Admin generic data query & mutation
│   │   │   ├── admin/git-sync/ # Git commit & push endpoint
│   │   │   ├── chat/           # OpenRouter AI herbal consultation
│   │   │   ├── checkout/       # Order submission endpoint
│   │   │   ├── settings/       # Public settings endpoint
│   │   │   └── upload/         # File & image upload endpoint
│   │   ├── blog/               # Public Blog & Journal
│   │   ├── cart/               # Cart & Checkout Page
│   │   ├── shop/               # Public Product Catalog
│   │   │   ├── [slug]/page.tsx # Product Detail Page
│   │   │   └── page.tsx
│   │   ├── tools/              # Interactive Eco Tools
│   │   ├── globals.css
│   │   ├── layout.tsx          # Root layout with Cart & Language Providers
│   │   └── page.tsx            # Homepage
│   ├── components/             # Reusable UI & Business components
│   ├── context/                # Client state (CartContext, LanguageContext)
│   └── lib/                    # Utilities, types, Supabase clients & fallback data
└── supabase/
    ├── schema.sql              # Initial table DDL & RLS policies
    └── seed.sql                # Seed data (products, pages, settings)
```

---

## 3. Detailed Route & Component Audit

### 3.1 Public Storefront Routes

| Route | Implementation Status | Functional Assessment | Architectural Issues |
| :--- | :--- | :--- | :--- |
| `/` (Homepage) | **Working** | Displays hero banner, categories, featured products, botanical tools, and reviews. | Marked `"use client"`. Fetches products via client-side fetch rather than SSR/ISR. |
| `/shop` (Catalog) | **Working** | Category filtering (all, plants, herbs, honey, etc.), search bar, price range sorting. | Client-side filtering only. No pagination; loads all 49 products at once. |
| `/shop/[slug]` (Detail) | **Partially Working** | Displays image, name, price, stock status, description, and "Add to Cart" button. | **Major SEO flaw:** Marked `"use client"`. Calls `/api/admin/data?entity=products` on mount to locate the product in memory. No dynamic OpenGraph/metadata generation. No variant selector. |
| `/cart` | **Working** | Combined cart drawer and single-page checkout form with cash-on-delivery and MFS options. | No multi-step wizard; delivery charges are hardcoded (৳70 if < ৳1500, else free). No Bangladeshi district/thana cascading selectors. |
| `/blog` | **Working** | Lists published botanical articles with reading times and categories. | Client-side only. |
| `/blog/[slug]` | **Working** | Article reading interface with markdown rendering. | Client-side only. |
| `/tools` & `/tools/[slug]` | **Working** | Interactive calculators: Herbal Remedy Explorer, Soil Mixer, Sunlight & Water Advisor. | Good UX, but embedded static configs. |
| `/[slug]` (Dynamic Pages) | **Partially Working** | Renders `/about-us` and `/sustainability`. | Missing dedicated standard routes for `/contact`, `/terms`, `/privacy-policy`, `/shipping-and-returns`, and customer account `/account`. |

### 3.2 Admin Panel Routes (`/admin`)

| Admin Module | Current State | Deficiencies & Production Gaps |
| :--- | :--- | :--- |
| `/admin` (Dashboard) | Prototype | Displays static stat cards, recent order table, and basic analytics. No date filters or real aggregation. |
| `/admin/login` | **CRITICAL SECURITY RISK** | **Credentials hardcoded in client source code** (`hasan@aronyok.com` / `AronyokAdmin#2026`). Uses insecure `localStorage` auth state. |
| `/admin/products` | Working | Product table with inline quick image update, direct Supabase & Git sync. | Lacks variants, cost price, botanical parameters (sunlight, soil, scientific name), SKU, and multi-image galleries. |
| `/admin/orders` | Partially Working | Lists orders with status pill, modal invoice generation, and archiving. | No courier booking (Steadfast, Pathao), no manual payment status verification, no customer communication trigger. |
| `/admin/settings` | Prototype | Basic inputs for SEO meta and OpenRouter system prompt. | Incomplete marketing pixel and social integration. |
| `/admin/pages` | Working | CMS editor for markdown pages. | Basic markdown textarea without preview or revision history. |
| `/admin/blog` | Working | Blog creation and editing modal. | Basic editor; lacks featured image crop and author assignment. |
| `/admin/tools` | Prototype | Toggle switch for enabling/disabling tools. | Minimal functionality. |

---

## 4. API Routes & Server Execution Audit

### 4.1 `/api/admin/data/route.ts` (GET, POST)
* **Vulnerability:** **Completely unauthenticated.** Any client sending `GET /api/admin/data?entity=orders` receives all customer records, including full names, phone numbers, home delivery addresses, and payment references.
* **Privilege Escalation:** Uses `getServerSupabase()`, which initializes with `SUPABASE_SERVICE_ROLE_KEY`. This bypasses Row Level Security (RLS) entirely, giving unauthenticated callers full read, update, and insert access to all tables.
* **Payload Sanitation:** Was partially sanitized in previous commits for products, but dynamic pages and blog posts still pass unfiltered objects into database update functions.

### 4.2 `/api/checkout/route.ts` (POST)
* **Critical Price Tampering Vulnerability:** The checkout endpoint receives `items: [{ product: { price: 500 }, quantity: 1 }]` and `total_amount: 570` directly from the client body and commits them to the database without querying the true product price from Supabase. **An attacker can craft a POST request with `price: 1` and complete orders for ৳1.**
* **No Inventory Verification or Reservation:** Orders are created without verifying `stock > quantity` and without decrementing inventory. In high-traffic scenarios or flash sales, overselling is guaranteed.
* **No Database Transaction (Atomicity Failure):** Orders and order items are inserted via separate operations without an atomic rollback if `order_items` fails.
* **Mock Payment Gateways:** `payment_method` options `stripe`, `sslcommerz`, `bkash`, and `nagad` return mock text instructions rather than initiating verified gateway sessions or processing webhooks.

### 4.3 `/api/upload/route.ts` (POST)
* **Vulnerabilities:** Does not authenticate the uploading user. File size limit is checked at 5MB, but MIME type verification relies solely on client-provided `file.type`.
* **Execution Risk:** Files stored locally in `public/uploads/` could theoretically be executed or manipulated if executable files are uploaded without extension stripping.

### 4.4 `/api/chat/route.ts` (POST)
* **Vulnerabilities:** No rate limiting. OpenRouter API key can be exhausted by automated denial-of-wallet scripts sending thousands of chat requests.

---

## 5. Security Vulnerabilities Assessment

| Ref | Severity | Vulnerability Description | Impact |
| :---: | :---: | :--- | :--- |
| **SEC-01** | **CRITICAL** | Hardcoded master credentials in `src/app/admin/login/page.tsx` (`hasan@aronyok.com` / `AronyokAdmin#2026`). | Anyone viewing client JavaScript bundles can extract the admin credentials and log in. |
| **SEC-02** | **CRITICAL** | Administrative authentication enforced solely by client-side `localStorage.getItem("aronyok_admin_auth") === "true"`. | Any user can bypass admin login by executing a single console command: `localStorage.setItem('aronyok_admin_auth', 'true')`. |
| **SEC-03** | **CRITICAL** | Unauthenticated `/api/admin/data` endpoint operating with `SUPABASE_SERVICE_ROLE_KEY`. | Full database breach; unauthenticated exfiltration of all customer personal information, order history, and product data. |
| **SEC-04** | **HIGH** | Client-controlled pricing in `/api/checkout`. | Attackers can purchase products at arbitrary prices by altering the HTTP request body. |
| **SEC-05** | **HIGH** | Absence of rate limiting across public endpoints (`/api/checkout`, `/api/chat`, `/api/upload`). | Vulnerable to denial-of-service, spam orders, and API credit exhaustion. |
| **SEC-06** | **MEDIUM** | Missing Next.js Edge Middleware (`middleware.ts`). | Admin routes are not protected at the edge server level, allowing unauthorized access before client scripts mount. |
| **SEC-07** | **MEDIUM** | Insecure direct file uploads in `/api/upload` without server-side magic number / MIME verification. | Potential for malicious file storage and storage quota abuse. |

---

## 6. Performance, SEO & Architectural Flaws

1. **Overuse of `"use client"`:** Virtually every page in `src/app/` (`/`, `/shop`, `/shop/[slug]`, `/blog`, `/[slug]`) is marked as a Client Component. This degrades Core Web Vitals (First Contentful Paint, Largest Contentful Paint) and disables Next.js streaming SSR.
2. **Dynamic Metadata & Social Previews Disabled:** Because `/shop/[slug]` is client-rendered and fetches data on mount, search engine crawlers (Googlebot, Facebook crawler) do not receive product titles, descriptions, prices, or OpenGraph images in initial HTML.
3. **Waterfall Requests:** On product detail pages, the browser loads the client bundle, executes `useEffect`, fetches all products from `/api/admin/data`, filters the array in memory, and then renders the product.
4. **Lack of Image Optimization in Modals:** Certain administrative modals use `unoptimized` image flags, causing large raw image downloads.
5. **No Structured Data (JSON-LD):** Products lack Schema.org `Product`, `Offer`, `BreadcrumbList`, and `Organization` structured data necessary for Google Rich Snippets and Merchant Center listings.

---

## 7. Audit Conclusion & Immediate Roadmap

The current application provides a valuable starting point with a cohesive design aesthetic, bilingual dictionary, and seed catalog. However, **it is not currently safe or architecturally equipped for real financial transactions and live commercial operations.**

### Priority Action Items:
1. **Immediate Security Hardening:** Replace hardcoded admin credentials with Supabase Auth session validation, deploy Next.js Edge Middleware, and require cryptographically verified admin JWTs on all `/api/admin/*` endpoints.
2. **Server-Side Price & Inventory Verification:** Rebuild `/api/checkout` to calculate totals server-side directly from the database and enforce atomic stock reservation.
3. **Database Schema Expansion:** Execute non-destructive PostgreSQL migrations to introduce product variants, inventory tracking, customer CRM records, and courier shipments.
4. **Storefront SSR Refactoring:** Convert `/shop/[slug]`, `/blog/[slug]`, and `/[slug]` into Server Components with dynamic `generateMetadata()`.
