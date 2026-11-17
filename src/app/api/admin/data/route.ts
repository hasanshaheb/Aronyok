import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";
import { gitCommitAndPush } from "@/lib/git-sync";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import { formatImageLink } from "@/lib/utils";
import {
  loadLatestProducts,
  loadLatestBlogs,
  loadLatestPages,
  loadLatestTools,
  loadLatestSettings,
  loadLatestOrders,
  loadLatestCustomers,
  loadLatestLeads,
  loadLatestSuppliers,
  loadLatestPurchases,
  loadLatestShipments,
  loadLatestReturns,
  loadLatestCoupons,
  loadLatestCampaigns,
  loadLatestStockMovements,
  loadLatestAdminUsers,
  loadLatestAuditLogs,
  loadLatestAbandonedCarts,
  persistCloudSnapshot,
} from "@/lib/data-hydrator";

export const dynamic = "force-dynamic";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function safeRevalidate(paths: Array<[string, ("page" | "layout")?]>) {
  for (const [p, type] of paths) {
    try {
      if (type) revalidatePath(p, type);
      else revalidatePath(p);
    } catch {}
  }
}

export async function GET(req: NextRequest) {
  const staff = await verifyAdminSession(req);
  if (!staff) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required." },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }

  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");

  if (entity === "products") {
    return NextResponse.json(await loadLatestProducts(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "blogs") {
    return NextResponse.json(await loadLatestBlogs(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "pages") {
    return NextResponse.json(await loadLatestPages(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "tools") {
    return NextResponse.json(await loadLatestTools(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "orders") {
    return NextResponse.json(await loadLatestOrders(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "customers") {
    return NextResponse.json(await loadLatestCustomers(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "leads") {
    return NextResponse.json(await loadLatestLeads(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "suppliers") {
    return NextResponse.json(await loadLatestSuppliers(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "purchases") {
    return NextResponse.json(await loadLatestPurchases(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "shipments") {
    return NextResponse.json(await loadLatestShipments(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "returns") {
    return NextResponse.json(await loadLatestReturns(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "coupons") {
    return NextResponse.json(await loadLatestCoupons(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "campaigns") {
    return NextResponse.json(await loadLatestCampaigns(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "stock_movements") {
    return NextResponse.json(await loadLatestStockMovements(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "users") {
    return NextResponse.json(await loadLatestAdminUsers(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "audit_logs") {
    return NextResponse.json(await loadLatestAuditLogs(), { headers: NO_CACHE_HEADERS });
  }
  if (entity === "abandoned_carts") {
    return NextResponse.json(await loadLatestAbandonedCarts(), { headers: NO_CACHE_HEADERS });
  }

  if (entity === "insights") {
    const [products, customers, abandoned] = await Promise.all([
      loadLatestProducts(),
      loadLatestCustomers(),
      loadLatestAbandonedCarts(),
    ]);

    const lowStockAlerts = products
      .filter((p) => p.is_active && p.stock <= 5)
      .map((p) => ({
        product_id: p.id,
        name: p.name.en,
        stock: p.stock,
        urgency: p.stock === 0 ? "critical" : p.stock <= 2 ? "high" : "medium",
        recommended_reorder_qty: Math.max(20, p.stock === 0 ? 30 : 20),
        estimated_cost:
          (p.cost_price || p.price * 0.6) * Math.max(20, p.stock === 0 ? 30 : 20),
      }));

    const currentMonth = new Date().getMonth();
    let seasonalContext = {
      season_name_en: "Late Autumn to Winter Transition",
      season_name_bn: "হেমন্ত থেকে শীতের প্রস্তুতি",
      watering_recommendation:
        "Reduce watering frequency by 30%. Water live plants only when the top 1 inch of potting soil feels dry to touch.",
      sunlight_advice:
        "Relocate indoor and balcony plants to south-facing orientations for maximum daytime winter sun exposure.",
      soil_fertilizer_tip:
        "Top-dress pots with decomposed vermicompost and light bone meal before winter dormancy.",
      high_demand_categories: [
        "Grafted Citrus & Malta",
        "Medicinal Herbs (Tulsi, Ashwagandha)",
        "Indoor Snake Plants",
      ],
    };

    if (currentMonth >= 5 && currentMonth <= 8) {
      seasonalContext = {
        season_name_en: "Monsoon & Rainy Growth Season",
        season_name_bn: "বর্ষা মৌসুম ও চারা রোপণের সেরা সময়",
        watering_recommendation:
          "Ensure excellent pot drainage to prevent root rot. Pause scheduled watering during heavy downpours.",
        sunlight_advice:
          "Protect young grafting unions from torrential rain; ensure bright diffused lighting.",
        soil_fertilizer_tip:
          "Apply organic neem cake powder around roots to prevent fungal infestations and root grubs.",
        high_demand_categories: [
          "Fruit Seedlings (Mango, Guava, Jamun)",
          "Flowering Plants (Kamini, Jasmine)",
        ],
      };
    }

    const repeatCustomers = customers.filter((c) => c.total_orders > 1);
    const repeatRate =
      customers.length > 0
        ? Math.round((repeatCustomers.length / customers.length) * 100)
        : 0;

    const recoverableGMV = abandoned
      .filter((c) => c.recovery_status === "abandoned" || c.recovery_status === "contacted")
      .reduce((sum, c) => sum + c.total_value, 0);

    return NextResponse.json(
      {
        lowStockAlerts,
        seasonalContext,
        customerRetention: {
          totalCustomers: customers.length,
          repeatCustomersCount: repeatCustomers.length,
          repeatRatePercentage: repeatRate,
          averageLtv:
            customers.length > 0
              ? Math.round(customers.reduce((s, c) => s + c.total_spent, 0) / customers.length)
              : 0,
        },
        abandonedCartInsights: {
          totalAbandonedCount: abandoned.length,
          recoverableRevenue: recoverableGMV,
          recoveryRate: "42%",
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  }

  if (entity === "reports") {
    const [orders, products, customers, shipments] = await Promise.all([
      loadLatestOrders(),
      loadLatestProducts(),
      loadLatestCustomers(),
      loadLatestShipments(),
    ]);

    const nonArchivedOrders = orders.filter((o) => !o.is_archived);
    const completedOrders = nonArchivedOrders.filter(
      (o) => o.order_status === "delivered" || o.payment_status === "paid"
    );

    const totalGMV = nonArchivedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const completedRevenue = completedOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const averageOrderValue =
      nonArchivedOrders.length > 0 ? Math.round(totalGMV / nonArchivedOrders.length) : 0;

    let totalEstimatedCOGS = 0;
    nonArchivedOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.product_id);
        const unitCost = prod?.cost_price || Math.round((item.price || 0) * 0.55);
        totalEstimatedCOGS += unitCost * (item.quantity || 1);
      });
    });

    const estimatedGrossProfit = Math.max(0, totalGMV - totalEstimatedCOGS);
    const grossMarginPercent =
      totalGMV > 0 ? Math.round((estimatedGrossProfit / totalGMV) * 100) : 0;

    const categoryCounts: Record<string, number> = {};
    nonArchivedOrders.forEach((o) => {
      (o.items || []).forEach((item) => {
        const prod = products.find((p) => p.id === item.product_id);
        const cat = prod?.category || "plants";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + (item.quantity || 1);
      });
    });

    const deliverySuccessRate =
      shipments.length > 0
        ? Math.round(
            (shipments.filter((s) => s.courier_status === "delivered").length /
              shipments.length) *
              100
          )
        : 100;

    return NextResponse.json(
      {
        totalOrders: nonArchivedOrders.length,
        totalGMV,
        completedRevenue,
        averageOrderValue,
        totalEstimatedCOGS,
        estimatedGrossProfit,
        grossMarginPercent,
        categoryCounts,
        totalCustomers: customers.length,
        repeatCustomerRate:
          customers.length > 0
            ? Math.round(
                (customers.filter((c) => c.total_orders > 1).length / customers.length) * 100
              )
            : 0,
        deliverySuccessRate,
        activeProductsCount: products.filter((p) => p.is_active).length,
        lowStockCount: products.filter((p) => p.stock <= 5).length,
      },
      { headers: NO_CACHE_HEADERS }
    );
  }

  if (entity === "settings") {
    return NextResponse.json(await loadLatestSettings(), { headers: NO_CACHE_HEADERS });
  }

  return NextResponse.json({ error: "Invalid entity" }, { status: 400, headers: NO_CACHE_HEADERS });
}

export async function POST(req: NextRequest) {
  try {
    const staff = await verifyAdminSession(req);
    if (!staff) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity");
    const action = searchParams.get("action");
    const body = await req.json();
    const supabase = getServerSupabase();

    // 1. PRODUCTS
    if (entity === "products") {
      const currentProducts = await loadLatestProducts();
      let isSynced = false;
      const productId = body.id;
      const existingProduct = productId
        ? currentProducts.find((p) => p.id === productId || (body.slug && p.slug === body.slug))
        : null;

      if (typeof body.image_url === "string") {
        body.image_url = formatImageLink(body.image_url);
      }

      if (supabase) {
        try {
          const dbPayload: any = {};
          if (body.image_url !== undefined) dbPayload.image_url = body.image_url;
          if (body.name !== undefined) dbPayload.name = body.name;
          if (body.slug !== undefined) dbPayload.slug = body.slug;
          if (body.description !== undefined) dbPayload.description = body.description;
          if (body.price !== undefined) dbPayload.price = Number(body.price);
          if (body.compare_at_price !== undefined)
            dbPayload.compare_at_price = body.compare_at_price
              ? Number(body.compare_at_price)
              : null;
          if (body.stock !== undefined) dbPayload.stock = Number(body.stock);
          if (body.category !== undefined) dbPayload.category = body.category;
          if (body.is_active !== undefined) dbPayload.is_active = body.is_active;
          if (body.is_featured !== undefined) dbPayload.is_featured = body.is_featured;
          if (body.seo_title !== undefined) dbPayload.seo_title = body.seo_title;
          if (body.seo_description !== undefined) dbPayload.seo_description = body.seo_description;
          dbPayload.updated_at = new Date().toISOString();

          if (productId && UUID_REGEX.test(productId)) {
            const { data, error } = await supabase
              .from("products")
              .update(dbPayload)
              .eq("id", productId)
              .select("id");
            if (!error && data && data.length > 0) isSynced = true;
          }

          const slugsToTry = [existingProduct?.slug, body.slug].filter(
            (s, idx, arr): s is string => Boolean(s) && arr.indexOf(s) === idx
          );
          for (const slugCandidate of slugsToTry) {
            if (isSynced) break;
            const { data, error } = await supabase
              .from("products")
              .update(dbPayload)
              .eq("slug", slugCandidate)
              .select("id");
            if (!error && data && data.length > 0) isSynced = true;
          }

          if (!isSynced) {
            const merged = existingProduct ? { ...existingProduct, ...dbPayload } : dbPayload;
            if (merged.name && merged.slug && merged.image_url !== undefined) {
              const insertPayload = {
                name: merged.name,
                slug: merged.slug,
                description: merged.description || { en: "", bn: "" },
                price: Number(merged.price ?? 0),
                compare_at_price: merged.compare_at_price ? Number(merged.compare_at_price) : null,
                stock: Number(merged.stock ?? 50),
                image_url: merged.image_url,
                category: merged.category || "plants",
                is_active: merged.is_active !== undefined ? merged.is_active : true,
                is_featured: merged.is_featured !== undefined ? merged.is_featured : false,
                seo_title: merged.seo_title || { en: "", bn: "" },
                seo_description: merged.seo_description || { en: "", bn: "" },
                updated_at: new Date().toISOString(),
              };
              const { error } = await supabase
                .from("products")
                .upsert(insertPayload, { onConflict: "slug" });
              if (!error) isSynced = true;
            }
          }
        } catch (dbErr) {
          console.warn("Supabase product update notice:", dbErr);
        }
      }

      const { sync_git, git_message, ...cleanProduct } = body;
      if (productId) {
        runtimeStore.updateProduct(productId, cleanProduct);
      } else {
        const newProduct = { ...cleanProduct, id: `prod-${Date.now()}` };
        runtimeStore.addProduct(newProduct);
      }

      const updatedProducts = runtimeStore.getProducts();
      const cloudSaved = await persistCloudSnapshot("products", updatedProducts);
      isSynced = isSynced || cloudSaved;

      const targetSlug = body.slug || existingProduct?.slug;
      safeRevalidate([
        ["/"],
        ["/shop"],
        ["/shop/[slug]", "page"],
        ...(targetSlug ? [[`/shop/${targetSlug}`] as [string]] : []),
      ]);

      let gitSyncResult = null;
      if (body.sync_git) {
        const prodName = body.name?.en || existingProduct?.name?.en || body.id || "product";
        const defaultCommit =
          action === "change_image"
            ? `Admin CMS: Update picture for "${prodName}"`
            : `Admin CMS: Update product "${prodName}"`;
        gitSyncResult = await gitCommitAndPush(body.git_message || defaultCommit);
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: updatedProducts,
      });
    }

    // 2. BLOGS
    if (entity === "blogs") {
      const currentBlogs = await loadLatestBlogs();
      let isSynced = false;
      const existingBlog = body.id
        ? currentBlogs.find((b) => b.id === body.id || (body.slug && b.slug === body.slug))
        : null;

      if (typeof body.image_url === "string") {
        body.image_url = formatImageLink(body.image_url);
      }

      const { sync_git, git_message, ...cleanBlog } = body;

      if (supabase) {
        try {
          const dbBlog: any = {};
          if (cleanBlog.title !== undefined) dbBlog.title = cleanBlog.title;
          if (cleanBlog.slug !== undefined) dbBlog.slug = cleanBlog.slug;
          if (cleanBlog.excerpt !== undefined) dbBlog.excerpt = cleanBlog.excerpt;
          if (cleanBlog.content !== undefined) dbBlog.content = cleanBlog.content;
          if (cleanBlog.image_url !== undefined) dbBlog.image_url = cleanBlog.image_url;
          if (cleanBlog.category !== undefined) dbBlog.category = cleanBlog.category;
          if (cleanBlog.read_time !== undefined) dbBlog.read_time = cleanBlog.read_time;
          if (cleanBlog.status !== undefined) dbBlog.status = cleanBlog.status;
          dbBlog.updated_at = new Date().toISOString();

          if (cleanBlog.id && UUID_REGEX.test(cleanBlog.id)) {
            const { data, error } = await supabase
              .from("blog_posts")
              .update(dbBlog)
              .eq("id", cleanBlog.id)
              .select("id");
            if (!error && data && data.length > 0) isSynced = true;
          }

          if (!isSynced) {
            const slugMatch = existingBlog?.slug || cleanBlog.slug;
            if (slugMatch) {
              const { data, error } = await supabase
                .from("blog_posts")
                .update(dbBlog)
                .eq("slug", slugMatch)
                .select("id");
              if (!error && data && data.length > 0) isSynced = true;
            }
          }

          if (!isSynced) {
            const merged = existingBlog ? { ...existingBlog, ...dbBlog } : dbBlog;
            if (merged.title && merged.slug && merged.content) {
              const { error } = await supabase.from("blog_posts").upsert(
                {
                  title: merged.title,
                  slug: merged.slug,
                  excerpt: merged.excerpt || { en: "", bn: "" },
                  content: merged.content,
                  image_url: merged.image_url || "",
                  category: merged.category || "Herbal Living",
                  read_time: merged.read_time || "5 min read",
                  status: merged.status || "published",
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "slug" }
              );
              if (!error) isSynced = true;
            }
          }
        } catch (err) {
          console.warn("Supabase blog sync warning:", err);
        }
      }

      if (cleanBlog.id) {
        runtimeStore.updateBlog(cleanBlog.id, cleanBlog);
      } else {
        const newBlog = {
          ...cleanBlog,
          id: `blog-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        runtimeStore.addBlog(newBlog);
      }

      const updatedBlogs = runtimeStore.getBlogs();
      const cloudSaved = await persistCloudSnapshot("blogs", updatedBlogs);
      isSynced = isSynced || cloudSaved;

      safeRevalidate([["/"], ["/blog"], ["/blog/[slug]", "page"]]);

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(
          body.git_message || `Update blog: ${body.title?.en || body.id}`
        );
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: updatedBlogs,
      });
    }

    // 3. PAGES
    if (entity === "pages") {
      const currentPages = await loadLatestPages();
      let isSynced = false;
      const existingPage = body.id
        ? currentPages.find((pg) => pg.id === body.id || (body.slug && pg.slug === body.slug))
        : null;

      const { sync_git, git_message, ...cleanPage } = body;

      if (supabase) {
        try {
          const dbPage: any = {};
          if (cleanPage.page_title !== undefined) dbPage.page_title = cleanPage.page_title;
          if (cleanPage.slug !== undefined) dbPage.slug = cleanPage.slug;
          if (cleanPage.page_content !== undefined) dbPage.page_content = cleanPage.page_content;
          if (cleanPage.is_published !== undefined) dbPage.is_published = cleanPage.is_published;
          if (cleanPage.seo_title !== undefined) dbPage.seo_title = cleanPage.seo_title;
          if (cleanPage.seo_description !== undefined)
            dbPage.seo_description = cleanPage.seo_description;
          dbPage.updated_at = new Date().toISOString();

          if (cleanPage.id && UUID_REGEX.test(cleanPage.id)) {
            const { data, error } = await supabase
              .from("dynamic_pages")
              .update(dbPage)
              .eq("id", cleanPage.id)
              .select("id");
            if (!error && data && data.length > 0) isSynced = true;
          }

          if (!isSynced) {
            const slugMatch = existingPage?.slug || cleanPage.slug;
            if (slugMatch) {
              const { data, error } = await supabase
                .from("dynamic_pages")
                .update(dbPage)
                .eq("slug", slugMatch)
                .select("id");
              if (!error && data && data.length > 0) isSynced = true;
            }
          }

          if (!isSynced) {
            const merged = existingPage ? { ...existingPage, ...dbPage } : dbPage;
            if (merged.page_title && merged.slug && merged.page_content) {
              const { error } = await supabase.from("dynamic_pages").upsert(
                {
                  page_title: merged.page_title,
                  slug: merged.slug,
                  page_content: merged.page_content,
                  is_published: merged.is_published !== undefined ? merged.is_published : true,
                  seo_title: merged.seo_title || { en: "", bn: "" },
                  seo_description: merged.seo_description || { en: "", bn: "" },
                  updated_at: new Date().toISOString(),
                },
                { onConflict: "slug" }
              );
              if (!error) isSynced = true;
            }
          }
        } catch (err) {
          console.warn("Supabase page sync warning:", err);
        }
      }

      if (cleanPage.id) {
        runtimeStore.updatePage(cleanPage.id, cleanPage);
      } else {
        const newPage = { ...cleanPage, id: `page-${Date.now()}` };
        runtimeStore.addPage(newPage);
      }

      const updatedPages = runtimeStore.getPages();
      const cloudSaved = await persistCloudSnapshot("pages", updatedPages);
      isSynced = isSynced || cloudSaved;

      safeRevalidate([["/"], ["/[slug]", "page"]]);

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(
          body.git_message || `Update page: ${body.page_title?.en || body.slug}`
        );
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: updatedPages,
      });
    }

    // 4. TOOLS
    if (entity === "tools") {
      await loadLatestTools();
      let isSynced = false;
      if (supabase && body.id && UUID_REGEX.test(body.id)) {
        try {
          const { error } = await supabase
            .from("tools")
            .update({ is_active: body.is_active, updated_at: new Date().toISOString() })
            .eq("id", body.id);
          if (!error) isSynced = true;
        } catch {}
      }
      runtimeStore.updateTool(body.id, { is_active: body.is_active });
      const updatedTools = runtimeStore.getTools();
      const cloudSaved = await persistCloudSnapshot("tools", updatedTools);
      isSynced = isSynced || cloudSaved;

      safeRevalidate([["/tools"], ["/tools/[slug]", "page"]]);

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(`Toggle eco tool status: ${body.id}`);
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: updatedTools,
      });
    }

    // 5. ORDERS
    if (entity === "orders") {
      await loadLatestOrders();

      if (action === "archive") {
        const ids: string[] = body.ids || (body.id ? [body.id] : []);
        runtimeStore.archiveOrders(ids);
        const updatedOrders = runtimeStore.getOrders();
        await persistCloudSnapshot("orders", updatedOrders);
        return NextResponse.json({
          success: true,
          message: `Archived ${ids.length} order(s)`,
          items: updatedOrders,
        });
      }

      if (action === "unarchive") {
        const ids: string[] = body.ids || (body.id ? [body.id] : []);
        runtimeStore.unarchiveOrders(ids);
        const updatedOrders = runtimeStore.getOrders();
        await persistCloudSnapshot("orders", updatedOrders);
        return NextResponse.json({
          success: true,
          message: `Unarchived ${ids.length} order(s)`,
          items: updatedOrders,
        });
      }

      if (action === "delete_batch") {
        const ids: string[] = body.ids || [];
        runtimeStore.deleteOrders(ids);
        if (supabase) {
          const uuidIds = ids.filter((id) => UUID_REGEX.test(id));
          if (uuidIds.length > 0) {
            try {
              await supabase.from("orders").delete().in("id", uuidIds);
            } catch {}
          }
        }
        const updatedOrders = runtimeStore.getOrders();
        await persistCloudSnapshot("orders", updatedOrders);
        return NextResponse.json({
          success: true,
          message: `Deleted ${ids.length} order(s)`,
          items: updatedOrders,
        });
      }

      // Support BOTH action=update_status ({ id, status }) AND direct ({ id, order_status })
      if (action === "update_status" || body.order_status !== undefined) {
        const nextStatus = body.status ?? body.order_status;
        runtimeStore.updateOrderStatus(body.id, nextStatus);
        if (supabase && body.id && UUID_REGEX.test(body.id)) {
          try {
            await supabase.from("orders").update({ order_status: nextStatus }).eq("id", body.id);
          } catch {}
        }
        const updatedOrders = runtimeStore.getOrders();
        await persistCloudSnapshot("orders", updatedOrders);
        return NextResponse.json({
          success: true,
          items: updatedOrders,
        });
      }

      // Support BOTH action=update_payment ({ id, status }) AND direct ({ id, payment_status })
      if (action === "update_payment" || body.payment_status !== undefined) {
        const nextPayment = body.status ?? body.payment_status;
        runtimeStore.updatePaymentStatus(body.id, nextPayment);
        if (supabase && body.id && UUID_REGEX.test(body.id)) {
          try {
            await supabase.from("orders").update({ payment_status: nextPayment }).eq("id", body.id);
          } catch {}
        }
        const updatedOrders = runtimeStore.getOrders();
        await persistCloudSnapshot("orders", updatedOrders);
        return NextResponse.json({
          success: true,
          items: updatedOrders,
        });
      }

      return NextResponse.json({ error: "Invalid order action" }, { status: 400 });
    }

    // 6. CRM: CUSTOMERS
    if (entity === "customers") {
      await loadLatestCustomers();

      if (action === "export_csv") {
        const customers = runtimeStore.getCustomers();
        const headers = [
          "ID",
          "Name",
          "Phone",
          "Email",
          "City",
          "Address",
          "Total Orders",
          "Total Spent (BDT)",
          "Tags",
          "Last Order Date",
        ];
        const rows = customers.map((c) => [
          c.id,
          `"${(c.full_name || "").replace(/"/g, '""')}"`,
          `"${c.phone}"`,
          `"${c.email || ""}"`,
          `"${c.city || ""}"`,
          `"${(c.address || "").replace(/"/g, '""')}"`,
          c.total_orders,
          c.total_spent,
          `"${(c.customer_tags || []).join(", ")}"`,
          c.last_order_date || "",
        ]);

        const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        return new NextResponse(csvContent, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="aronyok_customers_${Date.now()}.csv"`,
          },
        });
      }

      if (body.id) {
        runtimeStore.updateCustomer(body.id, body);
      } else {
        const newCustomer = {
          ...body,
          id: `cust-${Date.now()}`,
          total_orders: Number(body.total_orders) || 0,
          total_spent: Number(body.total_spent) || 0,
          customer_tags: body.customer_tags || ["Standard"],
          created_at: new Date().toISOString(),
        };
        runtimeStore.addCustomer(newCustomer);
      }
      const updated = runtimeStore.getCustomers();
      await persistCloudSnapshot("customers", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    // 7. CRM: LEADS
    if (entity === "leads") {
      await loadLatestLeads();
      if (body.id) {
        runtimeStore.updateLead(body.id, body);
      } else {
        const newLead = {
          ...body,
          id: `lead-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        runtimeStore.addLead(newLead);
      }
      const updated = runtimeStore.getLeads();
      await persistCloudSnapshot("leads", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    // 8. PROCUREMENT: SUPPLIERS
    if (entity === "suppliers") {
      await loadLatestSuppliers();
      if (body.id) {
        runtimeStore.updateSupplier(body.id, body);
      } else {
        const newSupplier = {
          ...body,
          id: `sup-${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        runtimeStore.addSupplier(newSupplier);
      }
      const updated = runtimeStore.getSuppliers();
      await persistCloudSnapshot("suppliers", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    // 9. PROCUREMENT: PURCHASES (PURCHASE ORDERS)
    if (entity === "purchases") {
      await Promise.all([
        loadLatestPurchases(),
        loadLatestProducts(),
        loadLatestStockMovements(),
        loadLatestAuditLogs(),
      ]);

      if (action === "update_status") {
        runtimeStore.updatePurchaseStatus(body.id, body.status);
        const updatedPurchases = runtimeStore.getPurchases();
        await Promise.all([
          persistCloudSnapshot("purchases", updatedPurchases),
          persistCloudSnapshot("products", runtimeStore.getProducts()),
          persistCloudSnapshot("stock_movements", runtimeStore.getStockMovements()),
          persistCloudSnapshot("audit_logs", runtimeStore.getAuditLogs()),
        ]);
        safeRevalidate([["/"], ["/shop"]]);
        return NextResponse.json({
          success: true,
          message: `Purchase status updated to ${body.status}.`,
          items: updatedPurchases,
        });
      }

      const poNumber = `PO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
      const totalCost = (body.items || []).reduce(
        (sum: number, it: any) => sum + (Number(it.unit_cost) || 0) * (Number(it.quantity) || 0),
        0
      );

      const newPurchase = {
        id: `po-${Date.now()}`,
        po_number: body.po_number || poNumber,
        supplier_id: body.supplier_id,
        supplier_name: body.supplier_name,
        total_cost: totalCost,
        status: body.status || "ordered",
        invoice_reference: body.invoice_reference,
        received_date: body.status === "received" ? new Date().toISOString() : undefined,
        items: body.items || [],
        notes: body.notes,
        created_at: new Date().toISOString(),
      };

      runtimeStore.addPurchase(newPurchase);
      const updatedPurchases = runtimeStore.getPurchases();
      await Promise.all([
        persistCloudSnapshot("purchases", updatedPurchases),
        persistCloudSnapshot("products", runtimeStore.getProducts()),
        persistCloudSnapshot("stock_movements", runtimeStore.getStockMovements()),
        persistCloudSnapshot("audit_logs", runtimeStore.getAuditLogs()),
      ]);
      safeRevalidate([["/"], ["/shop"]]);
      return NextResponse.json({ success: true, items: updatedPurchases });
    }

    // 10. LOGISTICS: SHIPMENTS
    if (entity === "shipments") {
      await Promise.all([loadLatestShipments(), loadLatestOrders()]);

      if (action === "update_status") {
        runtimeStore.updateShipmentStatus(body.id, body.courier_status);
        const updatedShipments = runtimeStore.getShipments();
        await Promise.all([
          persistCloudSnapshot("shipments", updatedShipments),
          persistCloudSnapshot("orders", runtimeStore.getOrders()),
        ]);
        return NextResponse.json({
          success: true,
          items: updatedShipments,
        });
      }

      const trackingCode = `TRK-${(body.courier_partner || "EXP")
        .slice(0, 3)
        .toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newShipment = {
        id: `ship-${Date.now()}`,
        order_id: body.order_id,
        order_number: body.order_number,
        recipient_name: body.recipient_name,
        recipient_phone: body.recipient_phone,
        shipping_address: body.shipping_address,
        city: body.city,
        courier_partner: body.courier_partner || "steadfast",
        consignment_id: body.consignment_id || `CN-${Date.now().toString().slice(-6)}`,
        tracking_code: body.tracking_code || trackingCode,
        courier_status: "manifested" as const,
        cod_amount: Number(body.cod_amount) || 0,
        courier_charge: Number(body.courier_charge) || 70,
        dispatched_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      runtimeStore.createShipment(newShipment);
      const updatedShipments = runtimeStore.getShipments();
      await Promise.all([
        persistCloudSnapshot("shipments", updatedShipments),
        persistCloudSnapshot("orders", runtimeStore.getOrders()),
      ]);
      return NextResponse.json({ success: true, items: updatedShipments });
    }

    // 11. RETURNS & REFUNDS
    if (entity === "returns") {
      await loadLatestReturns();
      if (action === "update_status") {
        runtimeStore.updateReturnStatus(body.id, body.status);
        const updated = runtimeStore.getReturns();
        await persistCloudSnapshot("returns", updated);
        return NextResponse.json({ success: true, items: updated });
      }

      const newReturn = {
        id: `ret-${Date.now()}`,
        order_id: body.order_id,
        order_number: body.order_number,
        customer_name: body.customer_name,
        customer_phone: body.customer_phone,
        reason: body.reason || "damaged_in_transit",
        refund_amount: Number(body.refund_amount) || 0,
        status: "pending" as const,
        notes: body.notes,
        created_at: new Date().toISOString(),
      };

      runtimeStore.addReturn(newReturn);
      const updated = runtimeStore.getReturns();
      await persistCloudSnapshot("returns", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    // 12. COUPONS & PROMOTIONAL DISCOUNTS
    if (entity === "coupons") {
      await loadLatestCoupons();
      if (body.id) {
        runtimeStore.updateCoupon(body.id, body);
      } else {
        const newCoupon = {
          id: `cpn-${Date.now()}`,
          code: (body.code || "").trim().toUpperCase(),
          discount_type: body.discount_type || "percentage",
          discount_value: Number(body.discount_value) || 0,
          min_order_amount: body.min_order_amount ? Number(body.min_order_amount) : undefined,
          max_discount: body.max_discount ? Number(body.max_discount) : undefined,
          expiry_date: body.expiry_date || undefined,
          usage_limit: body.usage_limit ? Number(body.usage_limit) : undefined,
          usage_count: Number(body.usage_count) || 0,
          is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
          description: body.description || undefined,
          created_at: new Date().toISOString(),
        };
        runtimeStore.addCoupon(newCoupon);
      }
      const updated = runtimeStore.getCoupons();
      await persistCloudSnapshot("coupons", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    // 13. CAMPAIGNS & ANNOUNCEMENT BANNERS
    if (entity === "campaigns") {
      await loadLatestCampaigns();
      if (body.id) {
        runtimeStore.updateCampaign(body.id, body);
      } else {
        const newCampaign = {
          id: `camp-${Date.now()}`,
          title: body.title || "Promotional Campaign",
          type: body.type || "announcement_bar",
          content: body.content || { en: "", bn: "" },
          badge_text: body.badge_text || undefined,
          link_url: body.link_url || "/shop",
          is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
          start_date: body.start_date || undefined,
          end_date: body.end_date || undefined,
          created_at: new Date().toISOString(),
        };
        runtimeStore.addCampaign(newCampaign);
      }
      const updated = runtimeStore.getCampaigns();
      await persistCloudSnapshot("campaigns", updated);
      safeRevalidate([["/", "layout"]]);
      return NextResponse.json({ success: true, items: updated });
    }

    // 14. SETTINGS
    if (entity === "settings") {
      await loadLatestSettings();
      const { sync_git, git_message, ...cleanSettings } = body;
      let isSynced = false;

      if (supabase) {
        try {
          // Only write columns that exist in public.settings SQL schema
          const { error } = await supabase.from("settings").upsert({
            id: cleanSettings.id || "00000000-0000-0000-0000-000000000001",
            global_seo_title: cleanSettings.global_seo_title,
            global_seo_description: cleanSettings.global_seo_description,
            analytics_script: cleanSettings.analytics_script,
            ad_banner_top_html: cleanSettings.ad_banner_top_html,
            ai_system_prompt: cleanSettings.ai_system_prompt,
            contact_email: cleanSettings.contact_email,
            contact_phone: cleanSettings.contact_phone,
            updated_at: new Date().toISOString(),
          });
          if (!error) isSynced = true;
        } catch (err) {
          console.warn("Supabase settings SQL sync notice:", err);
        }
      }

      const updated = runtimeStore.updateSettings(cleanSettings);
      const cloudSaved = await persistCloudSnapshot("settings", updated);
      isSynced = isSynced || cloudSaved;

      safeRevalidate([["/", "layout"]]);

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(
          body.git_message || "Update store & AI system settings"
        );
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        settings: updated,
      });
    }

    // 15. STOCK MOVEMENTS (MANUAL ADJUSTMENT)
    if (entity === "stock_movements") {
      const [products] = await Promise.all([
        loadLatestProducts(),
        loadLatestStockMovements(),
        loadLatestAuditLogs(),
      ]);

      const product = products.find((p) => p.id === body.product_id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const change = Number(body.quantity_change) || 0;
      const newStock = Math.max(0, product.stock + change);
      runtimeStore.updateProduct(product.id, { stock: newStock });

      if (supabase) {
        try {
          if (UUID_REGEX.test(product.id)) {
            await supabase
              .from("products")
              .update({ stock: newStock, updated_at: new Date().toISOString() })
              .eq("id", product.id);
          } else if (product.slug) {
            await supabase
              .from("products")
              .update({ stock: newStock, updated_at: new Date().toISOString() })
              .eq("slug", product.slug);
          }
        } catch {}
      }

      const movement = {
        id: `mv-${Date.now()}`,
        product_id: product.id,
        product_name: product.name.en || product.name.bn,
        type: body.type || (change >= 0 ? "manual_adjustment" : "damage_loss"),
        quantity_change: change,
        balance_after: newStock,
        reference: body.reference || "Manual Adjustment",
        performed_by: staff.email || "admin@aronyok.com",
        notes: body.notes || undefined,
        created_at: new Date().toISOString(),
      };
      runtimeStore.addStockMovement(movement as any);

      runtimeStore.logAuditEvent(
        staff.email || "admin@aronyok.com",
        "INVENTORY_MANUAL_ADJUSTMENT",
        "inventory",
        `Adjusted stock for ${product.name.en} by ${change >= 0 ? `+${change}` : change} (New balance: ${newStock})`,
        product.id
      );

      await Promise.all([
        persistCloudSnapshot("products", runtimeStore.getProducts()),
        persistCloudSnapshot("stock_movements", runtimeStore.getStockMovements()),
        persistCloudSnapshot("audit_logs", runtimeStore.getAuditLogs()),
      ]);

      safeRevalidate([["/"], ["/shop"], ["/shop/[slug]", "page"]]);

      return NextResponse.json({
        success: true,
        movement,
        newStock,
        items: runtimeStore.getStockMovements(),
      });
    }

    // 16. ADMIN USERS & RBAC
    if (entity === "users") {
      await Promise.all([loadLatestAdminUsers(), loadLatestAuditLogs()]);
      if (body.id) {
        runtimeStore.updateAdminUser(body.id, body);
        runtimeStore.logAuditEvent(
          staff.email,
          "USER_UPDATED",
          "users",
          `Updated user ${body.email} (${body.role})`,
          body.id
        );
      } else {
        const newUser = {
          id: `usr-${Date.now()}`,
          name: body.name || "Staff Member",
          email: body.email,
          role: body.role || "store_manager",
          permissions: body.permissions || ["orders", "products"],
          is_active: body.is_active !== undefined ? Boolean(body.is_active) : true,
          phone: body.phone,
          created_at: new Date().toISOString(),
        };
        runtimeStore.addAdminUser(newUser as any);
        runtimeStore.logAuditEvent(
          staff.email,
          "USER_CREATED",
          "users",
          `Created staff user ${newUser.email} with role ${newUser.role}`,
          newUser.id
        );
      }
      const updated = runtimeStore.getAdminUsers();
      await Promise.all([
        persistCloudSnapshot("admin_users", updated),
        persistCloudSnapshot("audit_logs", runtimeStore.getAuditLogs()),
      ]);
      return NextResponse.json({ success: true, items: updated });
    }

    // 17. ABANDONED CARTS
    if (entity === "abandoned_carts") {
      await Promise.all([loadLatestAbandonedCarts(), loadLatestAuditLogs()]);
      if (body.id) {
        runtimeStore.updateAbandonedCartStatus(body.id, body.recovery_status, body.notes);
        runtimeStore.logAuditEvent(
          staff.email,
          "ABANDONED_CART_UPDATED",
          "crm",
          `Updated abandoned cart ${body.id} to ${body.recovery_status}`
        );
      }
      const updated = runtimeStore.getAbandonedCarts();
      await Promise.all([
        persistCloudSnapshot("abandoned_carts", updated),
        persistCloudSnapshot("audit_logs", runtimeStore.getAuditLogs()),
      ]);
      return NextResponse.json({ success: true, items: updated });
    }

    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  } catch (error: any) {
    console.error("Admin POST error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const staff = await verifyAdminSession(req);
    if (!staff) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity");
    const id = searchParams.get("id");
    const supabase = getServerSupabase();

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    if (entity === "products") {
      const current = await loadLatestProducts();
      const target = current.find((p) => p.id === id);
      if (supabase) {
        try {
          if (UUID_REGEX.test(id)) {
            await supabase.from("products").delete().eq("id", id);
          } else if (target?.slug) {
            await supabase.from("products").delete().eq("slug", target.slug);
          }
        } catch {}
      }
      runtimeStore.deleteProduct(id);
      const updated = runtimeStore.getProducts();
      await persistCloudSnapshot("products", updated);
      safeRevalidate([["/"], ["/shop"], ["/shop/[slug]", "page"]]);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "blogs") {
      const current = await loadLatestBlogs();
      const target = current.find((b) => b.id === id);
      if (supabase) {
        try {
          if (UUID_REGEX.test(id)) {
            await supabase.from("blog_posts").delete().eq("id", id);
          } else if (target?.slug) {
            await supabase.from("blog_posts").delete().eq("slug", target.slug);
          }
        } catch {}
      }
      runtimeStore.deleteBlog(id);
      const updated = runtimeStore.getBlogs();
      await persistCloudSnapshot("blogs", updated);
      safeRevalidate([["/"], ["/blog"], ["/blog/[slug]", "page"]]);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "pages") {
      const current = await loadLatestPages();
      const target = current.find((p) => p.id === id);
      if (supabase) {
        try {
          if (UUID_REGEX.test(id)) {
            await supabase.from("dynamic_pages").delete().eq("id", id);
          } else if (target?.slug) {
            await supabase.from("dynamic_pages").delete().eq("slug", target.slug);
          }
        } catch {}
      }
      runtimeStore.deletePage(id);
      const updated = runtimeStore.getPages();
      await persistCloudSnapshot("pages", updated);
      safeRevalidate([["/"], ["/[slug]", "page"]]);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "orders") {
      await loadLatestOrders();
      if (supabase && UUID_REGEX.test(id)) {
        try {
          await supabase.from("orders").delete().eq("id", id);
        } catch {}
      }
      runtimeStore.deleteOrders([id]);
      const updated = runtimeStore.getOrders();
      await persistCloudSnapshot("orders", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "customers") {
      await loadLatestCustomers();
      runtimeStore.deleteCustomer(id);
      const updated = runtimeStore.getCustomers();
      await persistCloudSnapshot("customers", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "leads") {
      await loadLatestLeads();
      runtimeStore.deleteLead(id);
      const updated = runtimeStore.getLeads();
      await persistCloudSnapshot("leads", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "suppliers") {
      await loadLatestSuppliers();
      runtimeStore.deleteSupplier(id);
      const updated = runtimeStore.getSuppliers();
      await persistCloudSnapshot("suppliers", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "coupons") {
      await loadLatestCoupons();
      runtimeStore.deleteCoupon(id);
      const updated = runtimeStore.getCoupons();
      await persistCloudSnapshot("coupons", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "campaigns") {
      await loadLatestCampaigns();
      runtimeStore.deleteCampaign(id);
      const updated = runtimeStore.getCampaigns();
      await persistCloudSnapshot("campaigns", updated);
      safeRevalidate([["/", "layout"]]);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "users") {
      await Promise.all([loadLatestAdminUsers(), loadLatestAuditLogs()]);
      runtimeStore.deleteAdminUser(id);
      runtimeStore.logAuditEvent(staff.email, "USER_DELETED", "users", `Deleted staff user ${id}`);
      const updated = runtimeStore.getAdminUsers();
      await Promise.all([
        persistCloudSnapshot("admin_users", updated),
        persistCloudSnapshot("audit_logs", runtimeStore.getAuditLogs()),
      ]);
      return NextResponse.json({ success: true, items: updated });
    }

    if (entity === "abandoned_carts") {
      await loadLatestAbandonedCarts();
      runtimeStore.deleteAbandonedCart(id);
      const updated = runtimeStore.getAbandonedCarts();
      await persistCloudSnapshot("abandoned_carts", updated);
      return NextResponse.json({ success: true, items: updated });
    }

    return NextResponse.json({ error: "Invalid entity for deletion" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
