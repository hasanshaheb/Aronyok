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
} from "./types";

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "orders.json");
const FALLBACK_CODE_PATH = path.join(process.cwd(), "src", "lib", "supabase", "fallback-data.ts");

// Ensure data directory exists
try {
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch {}

// Load persisted orders from file or fallback
function loadOrdersFromFile(): Order[] {
  try {
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn("Could not read orders from disk:", err);
  }
  return [
    {
      id: "ord-1",
      order_number: "ARN-821942",
      customer_name: "Farhan Ahmed",
      customer_email: "farhan@example.com",
      customer_phone: "01712345678",
      shipping_address: "House 14, Road 5, Dhanmondi",
      city: "Dhaka",
      total_amount: 850,
      payment_method: "bkash",
      payment_status: "paid",
      order_status: "confirmed",
      is_archived: false,
      items: [
        {
          product_id: "prod-1",
          product_name: "Organic Sundarbans Mangrove Raw Honey (500g)",
          price: 850,
          quantity: 1,
        },
      ],
      notes: "Leave package at reception. TrxID: 9J87AK29L",
      created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    },
    {
      id: "ord-2",
      order_number: "ARN-821941",
      customer_name: "Tasnim Rahman",
      customer_email: "tasnim@example.com",
      customer_phone: "01898765432",
      shipping_address: "Sector 3, Uttara",
      city: "Dhaka",
      total_amount: 560,
      payment_method: "cod",
      payment_status: "pending",
      order_status: "processing",
      is_archived: false,
      items: [
        {
          product_id: "prod-5",
          product_name: "Krishna Tulsi Live Potted Plant",
          price: 180,
          quantity: 1,
        },
        {
          product_id: "prod-2",
          product_name: "Cold-Pressed Organic Neem Seed Oil (200ml)",
          price: 380,
          quantity: 1,
        },
      ],
      notes: "Call before dispatch",
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "ord-3",
      order_number: "ARN-821940",
      customer_name: "Kazi Nabil",
      customer_email: "kazi@example.com",
      customer_phone: "01911223344",
      shipping_address: "GEC Circle, Nasirabad",
      city: "Chittagong",
      total_amount: 420,
      payment_method: "stripe",
      payment_status: "paid",
      order_status: "confirmed",
      is_archived: false,
      items: [
        {
          product_id: "prod-3",
          product_name: "Artisanal Tulsi & Ashwagandha Herbal Tea (100g)",
          price: 420,
          quantity: 1,
        },
      ],
      notes: "Express packaging requested",
      created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
  ];
}

// In-memory stores initialized from files and fallback
let memoryProducts: Product[] = [...fallbackProducts];
let memoryBlogPosts: BlogPost[] = [...fallbackBlogPosts];
let memoryDynamicPages: DynamicPage[] = [...fallbackDynamicPages];
let memoryTools: ToolMicroApp[] = [...fallbackTools];
let memorySettings: SiteSettings = { ...fallbackSettings };
let memoryOrders: Order[] = loadOrdersFromFile();

// Save orders to persistent disk storage
function saveOrdersToDisk() {
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(memoryOrders, null, 2), "utf-8");
  } catch (err) {
    console.warn("Could not save orders to disk:", err);
  }
}

// Persist live products, blogs, pages, tools, and settings directly to the source code file fallback-data.ts
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

  getTools: () => memoryTools,
  updateTool: (id: string, updated: Partial<ToolMicroApp>) => {
    memoryTools = memoryTools.map((t) =>
      t.id === id ? { ...t, ...updated } : t
    );
    persistToCodebase();
  },

  getSettings: () => memorySettings,
  updateSettings: (updated: Partial<SiteSettings>) => {
    memorySettings = { ...memorySettings, ...updated };
    persistToCodebase();
    return memorySettings;
  },

  // Orders with disk persistence and archive/delete
  getOrders: () => memoryOrders,
  addOrder: (o: Order) => {
    memoryOrders = [o, ...memoryOrders];
    saveOrdersToDisk();
  },
  updateOrderStatus: (id: string, status: any) => {
    memoryOrders = memoryOrders.map((o) =>
      o.id === id ? { ...o, order_status: status } : o
    );
    saveOrdersToDisk();
  },
  updatePaymentStatus: (id: string, status: any) => {
    memoryOrders = memoryOrders.map((o) =>
      o.id === id ? { ...o, payment_status: status } : o
    );
    saveOrdersToDisk();
  },
  archiveOrders: (ids: string[]) => {
    memoryOrders = memoryOrders.map((o) =>
      ids.includes(o.id) ? { ...o, is_archived: true } : o
    );
    saveOrdersToDisk();
  },
  unarchiveOrders: (ids: string[]) => {
    memoryOrders = memoryOrders.map((o) =>
      ids.includes(o.id) ? { ...o, is_archived: false } : o
    );
    saveOrdersToDisk();
  },
  deleteOrders: (ids: string[]) => {
    memoryOrders = memoryOrders.filter((o) => !ids.includes(o.id));
    saveOrdersToDisk();
  },
};
