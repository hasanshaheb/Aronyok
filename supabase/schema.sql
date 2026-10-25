-- ==============================================================================
-- ARONYOK (অরণ্যক) - SUPABASE COMPLETE DATABASE SCHEMA
-- Bilingual (EN/BN) Nature & Eco Storefront, Blog, Tools, Pages & Admin CMS
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile row when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.email,
    -- If email matches designated admin or metadata flags it, set as admin, otherwise customer
    COALESCE(new.raw_user_meta_data->>'role', 'customer')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. PRODUCTS TABLE
-- Uses JSONB for localized fields: name, description, seo_title, seo_description
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name jsonb NOT NULL, -- e.g. {"en": "Raw Honey", "bn": "খাঁটি মধু"}
  slug text UNIQUE NOT NULL,
  description jsonb NOT NULL,
  price numeric(10,2) NOT NULL,
  compare_at_price numeric(10,2),
  stock integer DEFAULT 50 NOT NULL,
  image_url text NOT NULL,
  category text NOT NULL, -- 'herbs', 'honey', 'plants', 'wellness', 'gardening'
  is_active boolean DEFAULT true NOT NULL,
  is_featured boolean DEFAULT false NOT NULL,
  seo_title jsonb DEFAULT '{"en": "", "bn": ""}'::jsonb,
  seo_description jsonb DEFAULT '{"en": "", "bn": ""}'::jsonb,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BLOG POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title jsonb NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt jsonb,
  content jsonb NOT NULL,
  image_url text,
  category text DEFAULT 'Nature & Health',
  read_time text DEFAULT '5 min read',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. DYNAMIC PAGES TABLE
CREATE TABLE IF NOT EXISTS public.dynamic_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title jsonb NOT NULL,
  slug text UNIQUE NOT NULL,
  page_content jsonb NOT NULL,
  is_published boolean DEFAULT true NOT NULL,
  seo_title jsonb DEFAULT '{"en": "", "bn": ""}'::jsonb,
  seo_description jsonb DEFAULT '{"en": "", "bn": ""}'::jsonb,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TOOLS & MICRO-APPS TABLE
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name text NOT NULL,
  title jsonb NOT NULL,
  description jsonb NOT NULL,
  endpoint_slug text UNIQUE NOT NULL,
  icon_name text DEFAULT 'Leaf',
  is_active boolean DEFAULT true NOT NULL,
  embed_code_or_config jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. SETTINGS & ADS TABLE
CREATE TABLE IF NOT EXISTS public.settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  global_seo_title jsonb DEFAULT '{"en": "Aronyok - Pure Living & Herbal Eco Store", "bn": "অরণ্যক - বিশুদ্ধ প্রাকৃতিক জীবন ও ভেষজ সম্ভার"}'::jsonb,
  global_seo_description jsonb DEFAULT '{"en": "Discover organic herbs, natural wellness, and green gardening tools.", "bn": "আবিষ্কার করুন জৈব ভেষজ, প্রাকৃতিক সুস্থতা এবং পরিবেশবান্ধব বাগান উপাদান।"}'::jsonb,
  analytics_script text DEFAULT '',
  ad_banner_top_html text DEFAULT '',
  ai_system_prompt text DEFAULT 'You are Aronyok (অরণ্যক), an intelligent, gentle, and highly knowledgeable nature expert, herbalist, and eco-living guide. You are fluent in both English and Bengali. If the user asks in Bengali, reply warmly in Bengali. If in English, reply in English. Help users identify therapeutic herbs, offer plant care advice, suggest organic solutions, and guide them through our eco products.',
  contact_email text DEFAULT 'care@aronyok.com',
  contact_phone text DEFAULT '+880 1700 000000',
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. ORDERS & ORDER ITEMS (Payment Scaffolding: Stripe, SSLCommerz, bKash, COD)
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  shipping_address text NOT NULL,
  city text NOT NULL,
  total_amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('cod', 'bkash', 'nagad', 'sslcommerz', 'stripe')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status text NOT NULL DEFAULT 'processing' CHECK (order_status IN ('processing', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_reference text,
  notes text,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  price numeric(10,2) NOT NULL,
  quantity integer NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access to profiles"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- 2. Products Policies
CREATE POLICY "Anyone can view active products"
  ON public.products FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- 3. Blog Posts Policies
CREATE POLICY "Anyone can view published blog posts"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts FOR DELETE
  USING (public.is_admin());

-- 4. Dynamic Pages Policies
CREATE POLICY "Anyone can view published dynamic pages"
  ON public.dynamic_pages FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admins can insert dynamic pages"
  ON public.dynamic_pages FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update dynamic pages"
  ON public.dynamic_pages FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete dynamic pages"
  ON public.dynamic_pages FOR DELETE
  USING (public.is_admin());

-- 5. Tools Policies
CREATE POLICY "Anyone can view active tools"
  ON public.tools FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert tools"
  ON public.tools FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update tools"
  ON public.tools FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete tools"
  ON public.tools FOR DELETE
  USING (public.is_admin());

-- 6. Settings Policies
CREATE POLICY "Anyone can view settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.settings FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can insert settings"
  ON public.settings FOR INSERT
  WITH CHECK (public.is_admin());

-- 7. Orders Policies
CREATE POLICY "Anyone can create an order"
  ON public.orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Order Items Policies
CREATE POLICY "Anyone can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view order items"
  ON public.order_items FOR SELECT
  USING (public.is_admin());
