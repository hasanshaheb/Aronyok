import fs from "fs";
import path from "path";
import {
  fallbackProducts,
  fallbackBlogPosts,
  fallbackDynamicPages,
  fallbackTools,
  fallbackSettings,
} from "./supabase/fallback-data";
import {
  Product,
  BlogPost,
  DynamicPage,
  ToolMicroApp,
  SiteSettings,
  Order,
  Customer,
  Lead,
  Supplier,
  Purchase,
  Shipment,
  ReturnRefund,
  Coupon,
  CampaignBanner,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const ORDERS_FILE_PATH = path.join(DATA_DIR, "orders.json");
const CUSTOMERS_FILE_PATH = path.join(DATA_DIR, "customers.json");
const LEADS_FILE_PATH = path.join(DATA_DIR, "leads.json");
const SUPPLIERS_FILE_PATH = path.join(DATA_DIR, "suppliers.json");
const PURCHASES_FILE_PATH = path.join(DATA_DIR, "purchases.json");
const SHIPMENTS_FILE_PATH = path.join(DATA_DIR, "shipments.json");
const RETURNS_FILE_PATH = path.join(DATA_DIR, "returns.json");
const COUPONS_FILE_PATH = path.join(DATA_DIR, "coupons.json");
const CAMPAIGNS_FILE_PATH = path.join(DATA_DIR, "campaigns.json");
const FALLBACK_CODE_PATH = path.join(process.cwd(), "src", "lib", "supabase", "fallback-data.ts");

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch {}

function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(fallback) ? Array.isArray(parsed) : typeof parsed === "object") {
        return parsed;
      }
    }
  } catch (err) {
    console.warn(`Could not read ${filePath} from disk:`, err);
  }
  return fallback;
}

function safeWriteJson(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn(`Could not write to ${filePath}:`, err);
  }
}

// Initial Seeds
const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    full_name: "Farhan Ahmed",
    phone: "01712345678",
    email: "farhan@example.com",
    city: "Dhaka",
    address: "House 14, Road 5, Dhanmondi",
    total_orders: 4,
    total_spent: 3450,
    customer_tags: ["VIP", "Repeat", "Balcony Gardener"],
    notes: "Prefers fruit plants and rooftop garden consultation.",
    last_order_date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    created_at: "2026-09-15T10:00:00Z",
  },
  {
    id: "cust-2",
    full_name: "Tahmina Sultana",
    phone: "01819445566",
    email: "tahmina@example.com",
    city: "Dhaka",
    address: "Plot 8, Block C, Banani",
    total_orders: 2,
    total_spent: 1850,
    customer_tags: ["Repeat", "Organic Living"],
    notes: "Regular buyer of pure mangrove honey and neem oil.",
    last_order_date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    created_at: "2026-10-01T14:30:00Z",
  },
  {
    id: "cust-3",
    full_name: "Kazi Nabil",
    phone: "01911223344",
    email: "kazi@example.com",
    city: "Chittagong",
    address: "GEC Circle, Nasirabad",
    total_orders: 1,
    total_spent: 420,
    customer_tags: ["Herbal Wellness"],
    notes: "Requested special terracotta packaging.",
    last_order_date: new Date(Date.now() - 1000 * 60 * 60 * 180).toISOString(),
    created_at: "2026-10-20T11:20:00Z",
  },
];

const initialLeads: Lead[] = [
  {
    id: "lead-1",
    customer_name: "Dr. Asaduzzaman",
    phone: "01715-667788",
    email: "dr.asad@greenhospitals.com",
    source: "whatsapp",
    status: "contacted",
    interest_category: "Rare Medicinal Fruit Trees for Rooftop Garden",
    notes: "Wants 20 grafted Daruchini and Boroi plants. Follow-up scheduled.",
    follow_up_date: "2026-11-05",
    created_at: "2026-10-28T12:00:00Z",
  },
  {
    id: "lead-2",
    customer_name: "Green Valley Eco Resort",
    phone: "01822-990011",
    email: "procure@greenvalley.bd",
    source: "website",
    status: "negotiating",
    interest_category: "Bulk 50x Kagzi Lemon & Cinnamon live plants",
    notes: "Requires formal corporate quotation with VAT invoice.",
    follow_up_date: "2026-11-03",
    created_at: "2026-10-29T16:45:00Z",
  },
  {
    id: "lead-3",
    customer_name: "Sadia Islam",
    phone: "01933-221100",
    email: "sadia.islam@gmail.com",
    source: "facebook",
    status: "new",
    interest_category: "Sundarbans Raw Honey 5kg Bulk Jar",
    notes: "Inquired via Facebook Messenger about lab purity test certificate.",
    created_at: "2026-10-31T09:15:00Z",
  },
];

const initialSuppliers: Supplier[] = [
  {
    id: "sup-1",
    company_name: "Bengal Agro Forestry Nursery",
    contact_person: "Md. Alamgir Hossain",
    phone: "01711-889900",
    email: "alamgir@bengalagro.bd",
    address: "Sreemangal Botanical Belt, Moulvibazar",
    categories: ["Live Plants", "Grafted Fruit Trees", "Medicinal Seedlings"],
    payment_terms: "Net 15 Days",
    is_active: true,
    created_at: "2026-08-10T10:00:00Z",
  },
  {
    id: "sup-2",
    company_name: "Sundarbans Indigenous Honey Guild",
    contact_person: "Harunur Rashid (Mowal Representative)",
    phone: "01819-334455",
    email: "mowal.guild@satkhira.org",
    address: "Shyamnagar Forest Border, Satkhira",
    categories: ["Raw Forest Honey", "Natural Beeswax"],
    payment_terms: "Advance on Harvest",
    is_active: true,
    created_at: "2026-08-12T12:00:00Z",
  },
  {
    id: "sup-3",
    company_name: "ClayCraft Artisans Guild",
    contact_person: "Gouranga Pal (Master Potter)",
    phone: "01912-778899",
    email: "pal.terracotta@gmail.com",
    address: "Rayerbazar Potter Colony, Dhaka",
    categories: ["Terracotta Planters", "Biodegradable Pots", "Clay Jars"],
    payment_terms: "Cash on Delivery",
    is_active: true,
    created_at: "2026-08-15T15:00:00Z",
  },
  {
    id: "sup-4",
    company_name: "BioRoots Organic Soils & Compost",
    contact_person: "Dr. Anisur Rahman",
    phone: "01611-223344",
    email: "bioroots@agrochem.com",
    address: "Agricultural Research Belt, Gazipur",
    categories: ["Potting Mix", "Vermicompost", "Organic Neem Pest Repellent"],
    payment_terms: "Net 30 Days",
    is_active: true,
    created_at: "2026-08-20T09:00:00Z",
  },
];

const initialPurchases: Purchase[] = [
  {
    id: "po-1",
    po_number: "PO-2026-089",
    supplier_id: "sup-1",
    supplier_name: "Bengal Agro Forestry Nursery",
    total_cost: 12500,
    status: "received",
    invoice_reference: "INV-BAF-9412",
    received_date: "2026-10-25",
    items: [
      { product_id: "prod-7", product_name: "Cinnamon Seedling", quantity: 30, unit_cost: 150, total_cost: 4500 },
      { product_id: "prod-8", product_name: "Indian Jamun Grafted", quantity: 20, unit_cost: 200, total_cost: 4000 },
      { product_id: "prod-9", product_name: "Vietnamese Malta", quantity: 20, unit_cost: 200, total_cost: 4000 },
    ],
    notes: "Stock inspected for root health and received into nursery greenhouse.",
    created_at: "2026-10-24T11:00:00Z",
  },
];

const initialShipments: Shipment[] = [
  {
    id: "ship-1",
    order_id: "ord-1",
    order_number: "ARN-821942",
    recipient_name: "Farhan Ahmed",
    recipient_phone: "01712345678",
    shipping_address: "House 14, Road 5, Dhanmondi, Dhaka",
    city: "Dhaka",
    courier_partner: "steadfast",
    consignment_id: "STDF-9912041",
    tracking_code: "TRK-ARN-9912",
    courier_status: "in_transit",
    cod_amount: 850,
    courier_charge: 70,
    dispatched_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

const initialReturns: ReturnRefund[] = [];

const initialCoupons: Coupon[] = [
  {
    id: "cpn-1",
    code: "ARONYOKGREEN",
    discount_type: "percentage",
    discount_value: 15,
    min_order_amount: 1000,
    max_discount: 500,
    expiry_date: "2027-12-31T23:59:59Z",
    usage_limit: 1000,
    usage_count: 18,
    is_active: true,
    description: {
      en: "15% off medicinal herbs & live fruit plants on orders over ৳1000",
      bn: "১০০০ টাকার বেশি অর্ডারে ঔষধি গাছ ও চারায় ১৫% ছাড়",
    },
    created_at: "2026-03-01T00:00:00Z",
  },
  {
    id: "cpn-2",
    code: "NATURE100",
    discount_type: "fixed",
    discount_value: 100,
    min_order_amount: 800,
    expiry_date: "2027-12-31T23:59:59Z",
    usage_limit: 500,
    usage_count: 34,
    is_active: true,
    description: {
      en: "৳100 flat discount on nursery and eco products over ৳800",
      bn: "৮০০ টাকার অর্ডারে ১০০ টাকা ফ্ল্যাট ছাড়",
    },
    created_at: "2026-03-15T00:00:00Z",
  },
  {
    id: "cpn-3",
    code: "WELCOME10",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 500,
    max_discount: 300,
    expiry_date: "2027-12-31T23:59:59Z",
    usage_limit: 2000,
    usage_count: 62,
    is_active: true,
    description: {
      en: "10% off welcome gift for new botanical lovers",
      bn: "নতুন গ্রাহকদের জন্য ১০% স্বাগতম ছাড়",
    },
    created_at: "2026-01-01T00:00:00Z",
  },
];

const initialCampaigns: CampaignBanner[] = [
  {
    id: "camp-1",
    title: "Spring Eco Planting Special",
    type: "announcement_bar",
    content: {
      en: "Enjoy 15% off all medicinal herbs and living plants with code ARONYOKGREEN 🌱",
      bn: "কুপন কোড ARONYOKGREEN দিয়ে ঔষধি গাছ ও চারায় পাচ্ছেন ১৫% বিশেষ ছাড়! 🌱",
    },
    badge_text: {
      en: "Spring Eco Special",
      bn: "বসন্ত সবুজ অফার",
    },
    link_url: "/shop",
    is_active: true,
    created_at: "2026-03-01T00:00:00Z",
  },
];

// In-memory stores
let memoryProducts: Product[] = [...fallbackProducts];
let memoryBlogPosts: BlogPost[] = [...fallbackBlogPosts];
let memoryDynamicPages: DynamicPage[] = [...fallbackDynamicPages];
let memoryTools: ToolMicroApp[] = [...fallbackTools];
let memorySettings: SiteSettings = { ...fallbackSettings };
let memoryOrders: Order[] = safeReadJson<Order[]>(ORDERS_FILE_PATH, []);
let memoryCustomers: Customer[] = safeReadJson<Customer[]>(CUSTOMERS_FILE_PATH, initialCustomers);
let memoryLeads: Lead[] = safeReadJson<Lead[]>(LEADS_FILE_PATH, initialLeads);
let memorySuppliers: Supplier[] = safeReadJson<Supplier[]>(SUPPLIERS_FILE_PATH, initialSuppliers);
let memoryPurchases: Purchase[] = safeReadJson<Purchase[]>(PURCHASES_FILE_PATH, initialPurchases);
let memoryShipments: Shipment[] = safeReadJson<Shipment[]>(SHIPMENTS_FILE_PATH, initialShipments);
let memoryReturns: ReturnRefund[] = safeReadJson<ReturnRefund[]>(RETURNS_FILE_PATH, initialReturns);
let memoryCoupons: Coupon[] = safeReadJson<Coupon[]>(COUPONS_FILE_PATH, initialCoupons);
let memoryCampaigns: CampaignBanner[] = safeReadJson<CampaignBanner[]>(CAMPAIGNS_FILE_PATH, initialCampaigns);

// Codebase Fallback Persistence
export function persistToCodebase() {
  try {
    const fileContent = `import { Product, BlogPost, DynamicPage, ToolMicroApp, SiteSettings } from "../types";

export const fallbackSettings: SiteSettings = ${JSON.stringify(memorySettings, null, 2)};

export const fallbackProducts: Product[] = ${JSON.stringify(memoryProducts, null, 2)};

export const fallbackBlogPosts: BlogPost[] = ${JSON.stringify(memoryBlogPosts, null, 2)};

export const fallbackDynamicPages: DynamicPage[] = ${JSON.stringify(memoryDynamicPages, null, 2)};

export const fallbackTools: ToolMicroApp[] = ${JSON.stringify(memoryTools, null, 2)};
`;
    fs.writeFileSync(FALLBACK_CODE_PATH, fileContent, "utf-8");
  } catch (err) {
    console.warn("Could not write to fallback-data.ts:", err);
  }
}

export const runtimeStore = {
  // PRODUCTS
  getProducts: () => memoryProducts,
  setProducts: (prods: Product[]) => {
    memoryProducts = prods;
    persistToCodebase();
  },
  addProduct: (p: Product) => {
    memoryProducts = [p, ...memoryProducts];
    persistToCodebase();
  },
  updateProduct: (id: string, updated: Partial<Product>) => {
    memoryProducts = memoryProducts.map((p) =>
      p.id === id || (updated.slug && p.slug === updated.slug) ? { ...p, ...updated } : p
    );
    persistToCodebase();
  },
  deleteProduct: (id: string) => {
    memoryProducts = memoryProducts.filter((p) => p.id !== id);
    persistToCodebase();
  },

  // BLOGS
  getBlogs: () => memoryBlogPosts,
  setBlogs: (blogs: BlogPost[]) => {
    memoryBlogPosts = blogs;
    persistToCodebase();
  },
  addBlog: (b: BlogPost) => {
    memoryBlogPosts = [b, ...memoryBlogPosts];
    persistToCodebase();
  },
  updateBlog: (id: string, updated: Partial<BlogPost>) => {
    memoryBlogPosts = memoryBlogPosts.map((b) =>
      b.id === id ? { ...b, ...updated } : b
    );
    persistToCodebase();
  },
  deleteBlog: (id: string) => {
    memoryBlogPosts = memoryBlogPosts.filter((b) => b.id !== id);
    persistToCodebase();
  },

  // DYNAMIC PAGES
  getPages: () => memoryDynamicPages,
  setPages: (pages: DynamicPage[]) => {
    memoryDynamicPages = pages;
    persistToCodebase();
  },
  addPage: (pg: DynamicPage) => {
    memoryDynamicPages = [pg, ...memoryDynamicPages];
    persistToCodebase();
  },
  updatePage: (id: string, updated: Partial<DynamicPage>) => {
    memoryDynamicPages = memoryDynamicPages.map((pg) =>
      pg.id === id ? { ...pg, ...updated } : pg
    );
    persistToCodebase();
  },
  deletePage: (id: string) => {
    memoryDynamicPages = memoryDynamicPages.filter((pg) => pg.id !== id);
    persistToCodebase();
  },

  // TOOLS
  getTools: () => memoryTools,
  updateTool: (id: string, updated: Partial<ToolMicroApp>) => {
    memoryTools = memoryTools.map((t) =>
      t.id === id ? { ...t, ...updated } : t
    );
    persistToCodebase();
  },

  // SETTINGS
  getSettings: () => memorySettings,
  updateSettings: (updated: Partial<SiteSettings>) => {
    memorySettings = { ...memorySettings, ...updated };
    persistToCodebase();
    return memorySettings;
  },

  // ORDERS
  getOrders: () => memoryOrders,
  addOrder: (o: Order) => {
    memoryOrders = [o, ...memoryOrders];
    safeWriteJson(ORDERS_FILE_PATH, memoryOrders);
    // Auto-update CRM customer records
    runtimeStore.syncCustomerFromOrder(o);
  },
  updateOrderStatus: (id: string, status: any) => {
    memoryOrders = memoryOrders.map((o) =>
      o.id === id ? { ...o, order_status: status } : o
    );
    safeWriteJson(ORDERS_FILE_PATH, memoryOrders);
  },
  updatePaymentStatus: (id: string, status: any) => {
    memoryOrders = memoryOrders.map((o) =>
      o.id === id ? { ...o, payment_status: status } : o
    );
    safeWriteJson(ORDERS_FILE_PATH, memoryOrders);
  },
  archiveOrders: (ids: string[]) => {
    memoryOrders = memoryOrders.map((o) =>
      ids.includes(o.id) ? { ...o, is_archived: true } : o
    );
    safeWriteJson(ORDERS_FILE_PATH, memoryOrders);
  },
  unarchiveOrders: (ids: string[]) => {
    memoryOrders = memoryOrders.map((o) =>
      ids.includes(o.id) ? { ...o, is_archived: false } : o
    );
    safeWriteJson(ORDERS_FILE_PATH, memoryOrders);
  },
  deleteOrders: (ids: string[]) => {
    memoryOrders = memoryOrders.filter((o) => !ids.includes(o.id));
    safeWriteJson(ORDERS_FILE_PATH, memoryOrders);
  },

  // CRM: CUSTOMERS
  getCustomers: () => memoryCustomers,
  syncCustomerFromOrder: (order: Order) => {
    const phone = order.customer_phone?.trim();
    if (!phone) return;

    const existingIndex = memoryCustomers.findIndex((c) => c.phone === phone);
    if (existingIndex >= 0) {
      const existing = memoryCustomers[existingIndex];
      const tags = new Set(existing.customer_tags || []);
      tags.add("Repeat");
      if (existing.total_spent + order.total_amount > 5000) {
        tags.add("VIP");
      }

      memoryCustomers[existingIndex] = {
        ...existing,
        full_name: order.customer_name || existing.full_name,
        email: order.customer_email || existing.email,
        address: order.shipping_address || existing.address,
        city: order.city || existing.city,
        total_orders: existing.total_orders + 1,
        total_spent: existing.total_spent + order.total_amount,
        customer_tags: Array.from(tags),
        last_order_date: new Date().toISOString(),
      };
    } else {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}`,
        full_name: order.customer_name || "Guest Customer",
        phone,
        email: order.customer_email || undefined,
        address: order.shipping_address,
        city: order.city,
        total_orders: 1,
        total_spent: order.total_amount,
        customer_tags: ["New Buyer"],
        last_order_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      memoryCustomers = [newCustomer, ...memoryCustomers];
    }
    safeWriteJson(CUSTOMERS_FILE_PATH, memoryCustomers);
  },
  addCustomer: (c: Customer) => {
    memoryCustomers = [c, ...memoryCustomers];
    safeWriteJson(CUSTOMERS_FILE_PATH, memoryCustomers);
  },
  updateCustomer: (id: string, updated: Partial<Customer>) => {
    memoryCustomers = memoryCustomers.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    );
    safeWriteJson(CUSTOMERS_FILE_PATH, memoryCustomers);
  },
  deleteCustomer: (id: string) => {
    memoryCustomers = memoryCustomers.filter((c) => c.id !== id);
    safeWriteJson(CUSTOMERS_FILE_PATH, memoryCustomers);
  },

  // CRM: LEADS
  getLeads: () => memoryLeads,
  addLead: (l: Lead) => {
    memoryLeads = [l, ...memoryLeads];
    safeWriteJson(LEADS_FILE_PATH, memoryLeads);
  },
  updateLead: (id: string, updated: Partial<Lead>) => {
    memoryLeads = memoryLeads.map((l) =>
      l.id === id ? { ...l, ...updated } : l
    );
    safeWriteJson(LEADS_FILE_PATH, memoryLeads);
  },
  deleteLead: (id: string) => {
    memoryLeads = memoryLeads.filter((l) => l.id !== id);
    safeWriteJson(LEADS_FILE_PATH, memoryLeads);
  },

  // PROCUREMENT: SUPPLIERS
  getSuppliers: () => memorySuppliers,
  addSupplier: (s: Supplier) => {
    memorySuppliers = [s, ...memorySuppliers];
    safeWriteJson(SUPPLIERS_FILE_PATH, memorySuppliers);
  },
  updateSupplier: (id: string, updated: Partial<Supplier>) => {
    memorySuppliers = memorySuppliers.map((s) =>
      s.id === id ? { ...s, ...updated } : s
    );
    safeWriteJson(SUPPLIERS_FILE_PATH, memorySuppliers);
  },
  deleteSupplier: (id: string) => {
    memorySuppliers = memorySuppliers.filter((s) => s.id !== id);
    safeWriteJson(SUPPLIERS_FILE_PATH, memorySuppliers);
  },

  // PROCUREMENT: PURCHASES & AUTO-RESTOCKING
  getPurchases: () => memoryPurchases,
  addPurchase: (p: Purchase) => {
    memoryPurchases = [p, ...memoryPurchases];
    safeWriteJson(PURCHASES_FILE_PATH, memoryPurchases);

    // If already marked as received, restock immediately
    if (p.status === "received") {
      runtimeStore.applyPurchaseRestock(p);
    }
  },
  updatePurchaseStatus: (id: string, status: "ordered" | "received" | "cancelled") => {
    const purchase = memoryPurchases.find((p) => p.id === id);
    if (!purchase) return;

    const previousStatus = purchase.status;
    memoryPurchases = memoryPurchases.map((p) =>
      p.id === id ? { ...p, status, received_date: status === "received" ? new Date().toISOString() : p.received_date } : p
    );
    safeWriteJson(PURCHASES_FILE_PATH, memoryPurchases);

    // If transitioned to received, increment inventory
    if (previousStatus !== "received" && status === "received") {
      runtimeStore.applyPurchaseRestock(purchase);
    }
  },
  applyPurchaseRestock: (p: Purchase) => {
    if (!p.items || !Array.isArray(p.items)) return;
    for (const item of p.items) {
      const product = memoryProducts.find((prod) => prod.id === item.product_id);
      if (product) {
        runtimeStore.updateProduct(product.id, {
          stock: product.stock + item.quantity,
          cost_price: item.unit_cost || product.cost_price,
        });
      }
    }
  },

  // LOGISTICS: SHIPMENTS & COURIER TRACKING
  getShipments: () => memoryShipments,
  createShipment: (s: Shipment) => {
    memoryShipments = [s, ...memoryShipments];
    safeWriteJson(SHIPMENTS_FILE_PATH, memoryShipments);

    // Update parent order status to 'shipped'
    runtimeStore.updateOrderStatus(s.order_id, "shipped");
  },
  updateShipmentStatus: (id: string, courier_status: any) => {
    memoryShipments = memoryShipments.map((s) =>
      s.id === id ? { ...s, courier_status, delivered_at: courier_status === "delivered" ? new Date().toISOString() : s.delivered_at } : s
    );
    safeWriteJson(SHIPMENTS_FILE_PATH, memoryShipments);

    const ship = memoryShipments.find((s) => s.id === id);
    if (ship && courier_status === "delivered") {
      runtimeStore.updateOrderStatus(ship.order_id, "delivered");
      runtimeStore.updatePaymentStatus(ship.order_id, "paid");
    }
  },

  // RETURNS & REFUNDS
  getReturns: () => memoryReturns,
  addReturn: (r: ReturnRefund) => {
    memoryReturns = [r, ...memoryReturns];
    safeWriteJson(RETURNS_FILE_PATH, memoryReturns);
  },
  updateReturnStatus: (id: string, status: any) => {
    memoryReturns = memoryReturns.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    safeWriteJson(RETURNS_FILE_PATH, memoryReturns);
  },

  // PHASE 3: MARKETING, COUPONS & PROMOTIONAL CAMPAIGNS
  getCoupons: () => memoryCoupons,
  addCoupon: (c: Coupon) => {
    memoryCoupons = [c, ...memoryCoupons];
    safeWriteJson(COUPONS_FILE_PATH, memoryCoupons);
  },
  updateCoupon: (id: string, updated: Partial<Coupon>) => {
    memoryCoupons = memoryCoupons.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    );
    safeWriteJson(COUPONS_FILE_PATH, memoryCoupons);
  },
  deleteCoupon: (id: string) => {
    memoryCoupons = memoryCoupons.filter((c) => c.id !== id);
    safeWriteJson(COUPONS_FILE_PATH, memoryCoupons);
  },
  validateCoupon: (code: string, subtotal: number): {
    valid: boolean;
    discount: number;
    message: string;
    coupon?: Coupon;
  } => {
    const normalizedCode = (code || "").trim().toUpperCase();
    if (!normalizedCode) {
      return { valid: false, discount: 0, message: "Please provide a valid coupon code." };
    }

    const coupon = memoryCoupons.find(
      (c) => c.code.trim().toUpperCase() === normalizedCode
    );

    if (!coupon) {
      return { valid: false, discount: 0, message: `Coupon code "${normalizedCode}" does not exist.` };
    }

    if (!coupon.is_active) {
      return { valid: false, discount: 0, message: `Coupon "${normalizedCode}" is currently inactive.` };
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return { valid: false, discount: 0, message: `Coupon "${normalizedCode}" has expired.` };
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { valid: false, discount: 0, message: `Coupon "${normalizedCode}" usage limit has been reached.` };
    }

    if (coupon.min_order_amount && subtotal < coupon.min_order_amount) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of ৳${coupon.min_order_amount} required to use "${normalizedCode}".`,
      };
    }

    let discount = 0;
    if (coupon.discount_type === "percentage") {
      discount = Math.round((subtotal * coupon.discount_value) / 100);
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }

    // Discount cannot exceed cart subtotal
    discount = Math.min(discount, subtotal);

    return {
      valid: true,
      discount,
      message: `Coupon "${coupon.code}" applied! You saved ৳${discount}.`,
      coupon,
    };
  },
  incrementCouponUsage: (code: string) => {
    const normalizedCode = (code || "").trim().toUpperCase();
    memoryCoupons = memoryCoupons.map((c) =>
      c.code.trim().toUpperCase() === normalizedCode
        ? { ...c, usage_count: (c.usage_count || 0) + 1 }
        : c
    );
    safeWriteJson(COUPONS_FILE_PATH, memoryCoupons);
  },

  // CAMPAIGNS & ANNOUNCEMENT BANNERS
  getCampaigns: () => memoryCampaigns,
  addCampaign: (c: CampaignBanner) => {
    memoryCampaigns = [c, ...memoryCampaigns];
    safeWriteJson(CAMPAIGNS_FILE_PATH, memoryCampaigns);
  },
  updateCampaign: (id: string, updated: Partial<CampaignBanner>) => {
    memoryCampaigns = memoryCampaigns.map((c) =>
      c.id === id ? { ...c, ...updated } : c
    );
    safeWriteJson(CAMPAIGNS_FILE_PATH, memoryCampaigns);
  },
  deleteCampaign: (id: string) => {
    memoryCampaigns = memoryCampaigns.filter((c) => c.id !== id);
    safeWriteJson(CAMPAIGNS_FILE_PATH, memoryCampaigns);
  },
};
