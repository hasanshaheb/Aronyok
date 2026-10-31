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
  cost_price?: number;
  stock: number;
  sku?: string;
  image_url: string;
  gallery_images?: string[];
  category: string;
  is_active: boolean;
  is_featured?: boolean;
  
  // Specialized Botanical & Plant Care Attributes
  scientific_name?: string;
  variety?: string;
  propagation_method?: string;
  pot_size?: string;
  sunlight?: string;
  watering?: string;
  plant_height?: string;
  plant_age?: string;
  season?: string;
  care_instructions?: LocalizedString;

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
  title?: string;
  image_url?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  district?: string;
  total_amount: number;
  total_price?: number;
  delivery_charge?: number;
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

// -------------------------------------------------------------
// PHASE 2 EXTENSIONS: CRM, LOGISTICS, PROCUREMENT & GOVERNANCE
// -------------------------------------------------------------

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  total_orders: number;
  total_spent: number;
  customer_tags: string[];
  notes?: string;
  last_order_date?: string;
  created_at: string;
}

export interface Lead {
  id: string;
  customer_name: string;
  name?: string;
  phone: string;
  email?: string;
  source: 'website' | 'whatsapp' | 'facebook' | 'phone' | 'nursery_visit' | 'walk_in' | 'referral';
  status: 'new' | 'contacted' | 'negotiating' | 'converted' | 'lost';
  interest_category: string;
  interested_in?: string;
  estimated_value?: number;
  notes?: string;
  follow_up_date?: string;
  created_at: string;
}

export interface Supplier {
  id: string;
  company_name: string;
  name?: string;
  contact_person: string;
  phone: string;
  email?: string;
  address: string;
  categories: string[];
  payment_terms?: string;
  notes?: string;
  status?: 'active' | 'inactive';
  is_active: boolean;
  created_at: string;
}

export interface PurchaseItem {
  id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
}

export interface Purchase {
  id: string;
  po_number: string;
  invoice_number?: string;
  supplier_id: string;
  supplier_name: string;
  total_cost: number;
  total_amount?: number;
  status: 'ordered' | 'received' | 'cancelled' | 'draft';
  invoice_reference?: string;
  expected_delivery_date?: string;
  received_date?: string;
  items: PurchaseItem[];
  notes?: string;
  created_at: string;
}

export interface Shipment {
  id: string;
  order_id: string;
  order_number?: string;
  recipient_name?: string;
  recipient_phone?: string;
  shipping_address?: string;
  city?: string;
  courier_partner?: 'steadfast' | 'pathao' | 'redx' | 'self_delivery';
  courier_name?: string;
  consignment_id?: string;
  tracking_code?: string;
  courier_status: 'manifested' | 'picked_up' | 'in_transit' | 'delivered' | 'returned' | 'cancelled' | 'pending';
  cod_amount?: number;
  courier_charge?: number;
  shipping_fee?: number;
  estimated_delivery?: string;
  notes?: string;
  dispatched_at?: string;
  delivered_at?: string;
  created_at: string;
}

export interface ReturnRefund {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  reason: 'damaged_in_transit' | 'wrong_variety' | 'wilted_seedling' | 'customer_request';
  refund_amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  notes?: string;
  created_at: string;
}
