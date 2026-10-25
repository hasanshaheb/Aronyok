export type SupportedLanguage = 'en' | 'bn';

export interface LocalizedString {
  en: string;
  bn: string;
}

export interface Product {
  id: string;
  name: LocalizedString;
  slug: string;
  description: LocalizedString;
  price: number;
  compare_at_price?: number | null;
  stock: number;
  image_url: string;
  category: string;
  is_active: boolean;
  is_featured?: boolean;
  seo_title?: LocalizedString;
  seo_description?: LocalizedString;
  created_at?: string;
  updated_at?: string;
}

export interface BlogPost {
  id: string;
  title: LocalizedString;
  slug: string;
  excerpt?: LocalizedString;
  content: LocalizedString;
  image_url?: string;
  category?: string;
  read_time?: string;
  status: 'draft' | 'published';
  author_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DynamicPage {
  id: string;
  page_title: LocalizedString;
  slug: string;
  page_content: LocalizedString;
  is_published: boolean;
  seo_title?: LocalizedString;
  seo_description?: LocalizedString;
  created_at?: string;
  updated_at?: string;
}

export interface ToolMicroApp {
  id: string;
  tool_name: string;
  title: LocalizedString;
  description: LocalizedString;
  endpoint_slug: string;
  icon_name?: string;
  is_active: boolean;
  embed_code_or_config?: Record<string, unknown> | string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  id: string;
  global_seo_title: LocalizedString;
  global_seo_description: LocalizedString;
  analytics_script?: string;
  ad_banner_top_html?: string;
  ai_system_prompt: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  total_amount: number;
  payment_method: 'cod' | 'bkash' | 'nagad' | 'sslcommerz' | 'stripe';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  order_status: 'processing' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_reference?: string;
  notes?: string;
  is_archived?: boolean;
  items?: OrderItem[];
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
