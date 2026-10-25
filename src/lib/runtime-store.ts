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

// In-memory server-side stores
let memoryProducts: Product[] = [...fallbackProducts];
let memoryBlogPosts: BlogPost[] = [...fallbackBlogPosts];
let memoryDynamicPages: DynamicPage[] = [...fallbackDynamicPages];
let memoryTools: ToolMicroApp[] = [...fallbackTools];
let memorySettings: SiteSettings = { ...fallbackSettings };
let memoryOrders: Order[] = [
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
    notes: "Express packaging requested",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

export const runtimeStore = {
  getProducts: () => memoryProducts,
  setProducts: (prods: Product[]) => {
    memoryProducts = prods;
  },
  addProduct: (p: Product) => {
    memoryProducts = [p, ...memoryProducts];
  },
  updateProduct: (id: string, updated: Partial<Product>) => {
    memoryProducts = memoryProducts.map((p) =>
      p.id === id ? { ...p, ...updated } : p
    );
  },
  deleteProduct: (id: string) => {
    memoryProducts = memoryProducts.filter((p) => p.id !== id);
  },

  getBlogs: () => memoryBlogPosts,
  setBlogs: (blogs: BlogPost[]) => {
    memoryBlogPosts = blogs;
  },
  addBlog: (b: BlogPost) => {
    memoryBlogPosts = [b, ...memoryBlogPosts];
  },
  updateBlog: (id: string, updated: Partial<BlogPost>) => {
    memoryBlogPosts = memoryBlogPosts.map((b) =>
      b.id === id ? { ...b, ...updated } : b
    );
  },
  deleteBlog: (id: string) => {
    memoryBlogPosts = memoryBlogPosts.filter((b) => b.id !== id);
  },

  getPages: () => memoryDynamicPages,
  setPages: (pages: DynamicPage[]) => {
    memoryDynamicPages = pages;
  },
  addPage: (pg: DynamicPage) => {
    memoryDynamicPages = [pg, ...memoryDynamicPages];
  },
  updatePage: (id: string, updated: Partial<DynamicPage>) => {
    memoryDynamicPages = memoryDynamicPages.map((pg) =>
      pg.id === id ? { ...pg, ...updated } : pg
    );
  },
  deletePage: (id: string) => {
    memoryDynamicPages = memoryDynamicPages.filter((pg) => pg.id !== id);
  },

  getTools: () => memoryTools,
  updateTool: (id: string, updated: Partial<ToolMicroApp>) => {
    memoryTools = memoryTools.map((t) =>
      t.id === id ? { ...t, ...updated } : t
    );
  },

  getSettings: () => memorySettings,
  updateSettings: (updated: Partial<SiteSettings>) => {
    memorySettings = { ...memorySettings, ...updated };
    return memorySettings;
  },

  getOrders: () => memoryOrders,
  addOrder: (o: Order) => {
    memoryOrders = [o, ...memoryOrders];
  },
  updateOrderStatus: (id: string, status: any) => {
    memoryOrders = memoryOrders.map((o) =>
      o.id === id ? { ...o, order_status: status } : o
    );
  },
  updatePaymentStatus: (id: string, status: any) => {
    memoryOrders = memoryOrders.map((o) =>
      o.id === id ? { ...o, payment_status: status } : o
    );
  },
};
