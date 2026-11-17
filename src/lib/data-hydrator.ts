import { getServerSupabase } from "./supabase/server";
import { runtimeStore } from "./runtime-store";
import { readCloudEntity, writeCloudEntity, CloudEntityName } from "./cloud-store";
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
  StockMovement,
  AdminUser,
  AuditLog,
  AbandonedCart,
} from "./types";

export async function loadLatestProducts(): Promise<Product[]> {
  const cloud = await readCloudEntity<Product[]>("products");
  if (Array.isArray(cloud) && cloud.length > 0) {
    runtimeStore.setProducts(cloud);
    return cloud;
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        runtimeStore.setProducts(data as Product[]);
        return data as Product[];
      }
    } catch {}
  }

  return runtimeStore.getProducts();
}

export async function loadLatestBlogs(): Promise<BlogPost[]> {
  const cloud = await readCloudEntity<BlogPost[]>("blogs");
  if (Array.isArray(cloud) && cloud.length > 0) {
    runtimeStore.setBlogs(cloud);
    return cloud;
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        runtimeStore.setBlogs(data as BlogPost[]);
        return data as BlogPost[];
      }
    } catch {}
  }

  return runtimeStore.getBlogs();
}

export async function loadLatestPages(): Promise<DynamicPage[]> {
  const cloud = await readCloudEntity<DynamicPage[]>("pages");
  if (Array.isArray(cloud) && cloud.length > 0) {
    runtimeStore.setPages(cloud);
    return cloud;
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("dynamic_pages")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        runtimeStore.setPages(data as DynamicPage[]);
        return data as DynamicPage[];
      }
    } catch {}
  }

  return runtimeStore.getPages();
}

export async function loadLatestTools(): Promise<ToolMicroApp[]> {
  const cloud = await readCloudEntity<ToolMicroApp[]>("tools");
  if (Array.isArray(cloud) && cloud.length > 0) {
    runtimeStore.setTools(cloud);
    return cloud;
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase.from("tools").select("*");
      if (!error && Array.isArray(data) && data.length > 0) {
        runtimeStore.setTools(data as ToolMicroApp[]);
        return data as ToolMicroApp[];
      }
    } catch {}
  }

  return runtimeStore.getTools();
}

export async function loadLatestSettings(): Promise<SiteSettings> {
  const cloud = await readCloudEntity<SiteSettings>("settings");
  if (cloud && typeof cloud === "object") {
    return runtimeStore.setSettings(cloud);
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
      if (!error && data) {
        return runtimeStore.updateSettings(data as Partial<SiteSettings>);
      }
    } catch {}
  }

  return runtimeStore.getSettings();
}

export async function loadLatestOrders(): Promise<Order[]> {
  const cloud = await readCloudEntity<Order[]>("orders");
  if (Array.isArray(cloud)) {
    runtimeStore.setOrders(cloud);
    return cloud;
  }

  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, items:order_items(*)")
        .order("created_at", { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        runtimeStore.setOrders(data as Order[]);
        return data as Order[];
      }
    } catch {}
  }

  return runtimeStore.getOrders();
}

export async function loadLatestCustomers(): Promise<Customer[]> {
  const cloud = await readCloudEntity<Customer[]>("customers");
  if (Array.isArray(cloud)) {
    runtimeStore.setCustomers(cloud);
    return cloud;
  }
  return runtimeStore.getCustomers();
}

export async function loadLatestLeads(): Promise<Lead[]> {
  const cloud = await readCloudEntity<Lead[]>("leads");
  if (Array.isArray(cloud)) {
    runtimeStore.setLeads(cloud);
    return cloud;
  }
  return runtimeStore.getLeads();
}

export async function loadLatestSuppliers(): Promise<Supplier[]> {
  const cloud = await readCloudEntity<Supplier[]>("suppliers");
  if (Array.isArray(cloud)) {
    runtimeStore.setSuppliers(cloud);
    return cloud;
  }
  return runtimeStore.getSuppliers();
}

export async function loadLatestPurchases(): Promise<Purchase[]> {
  const cloud = await readCloudEntity<Purchase[]>("purchases");
  if (Array.isArray(cloud)) {
    runtimeStore.setPurchases(cloud);
    return cloud;
  }
  return runtimeStore.getPurchases();
}

export async function loadLatestShipments(): Promise<Shipment[]> {
  const cloud = await readCloudEntity<Shipment[]>("shipments");
  if (Array.isArray(cloud)) {
    runtimeStore.setShipments(cloud);
    return cloud;
  }
  return runtimeStore.getShipments();
}

export async function loadLatestReturns(): Promise<ReturnRefund[]> {
  const cloud = await readCloudEntity<ReturnRefund[]>("returns");
  if (Array.isArray(cloud)) {
    runtimeStore.setReturns(cloud);
    return cloud;
  }
  return runtimeStore.getReturns();
}

export async function loadLatestCoupons(): Promise<Coupon[]> {
  const cloud = await readCloudEntity<Coupon[]>("coupons");
  if (Array.isArray(cloud)) {
    runtimeStore.setCoupons(cloud);
    return cloud;
  }
  return runtimeStore.getCoupons();
}

export async function loadLatestCampaigns(): Promise<CampaignBanner[]> {
  const cloud = await readCloudEntity<CampaignBanner[]>("campaigns");
  if (Array.isArray(cloud)) {
    runtimeStore.setCampaigns(cloud);
    return cloud;
  }
  return runtimeStore.getCampaigns();
}

export async function loadLatestStockMovements(): Promise<StockMovement[]> {
  const cloud = await readCloudEntity<StockMovement[]>("stock_movements");
  if (Array.isArray(cloud)) {
    runtimeStore.setStockMovements(cloud);
    return cloud;
  }
  return runtimeStore.getStockMovements();
}

export async function loadLatestAdminUsers(): Promise<AdminUser[]> {
  const cloud = await readCloudEntity<AdminUser[]>("admin_users");
  if (Array.isArray(cloud)) {
    runtimeStore.setAdminUsers(cloud);
    return cloud;
  }
  return runtimeStore.getAdminUsers();
}

export async function loadLatestAuditLogs(): Promise<AuditLog[]> {
  const cloud = await readCloudEntity<AuditLog[]>("audit_logs");
  if (Array.isArray(cloud)) {
    runtimeStore.setAuditLogs(cloud);
    return cloud;
  }
  return runtimeStore.getAuditLogs();
}

export async function loadLatestAbandonedCarts(): Promise<AbandonedCart[]> {
  const cloud = await readCloudEntity<AbandonedCart[]>("abandoned_carts");
  if (Array.isArray(cloud)) {
    runtimeStore.setAbandonedCarts(cloud);
    return cloud;
  }
  return runtimeStore.getAbandonedCarts();
}

export async function persistCloudSnapshot(entity: CloudEntityName, data: unknown): Promise<boolean> {
  return writeCloudEntity(entity, data);
}
