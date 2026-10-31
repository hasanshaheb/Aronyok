import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore, persistToCodebase } from "@/lib/runtime-store";
import { gitCommitAndPush } from "@/lib/git-sync";
import { verifyAdminSession } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const staff = await verifyAdminSession(req);
  if (!staff) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const entity = searchParams.get("entity");
  const supabase = getServerSupabase();

  if (entity === "products") {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          runtimeStore.setProducts(data);
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getProducts());
  }

  if (entity === "blogs") {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          runtimeStore.setBlogs(data);
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getBlogs());
  }

  if (entity === "pages") {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("dynamic_pages")
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          runtimeStore.setPages(data);
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getPages());
  }

  if (entity === "tools") {
    if (supabase) {
      try {
        const { data, error } = await supabase.from("tools").select("*");
        if (!error && data && data.length > 0) {
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getTools());
  }

  if (entity === "orders") {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, items:order_items(*)")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getOrders());
  }

  if (entity === "customers") {
    return NextResponse.json(runtimeStore.getCustomers());
  }

  if (entity === "leads") {
    return NextResponse.json(runtimeStore.getLeads());
  }

  if (entity === "suppliers") {
    return NextResponse.json(runtimeStore.getSuppliers());
  }

  if (entity === "purchases") {
    return NextResponse.json(runtimeStore.getPurchases());
  }

  if (entity === "shipments") {
    return NextResponse.json(runtimeStore.getShipments());
  }

  if (entity === "returns") {
    return NextResponse.json(runtimeStore.getReturns());
  }

  if (entity === "coupons") {
    return NextResponse.json(runtimeStore.getCoupons());
  }

  if (entity === "campaigns") {
    return NextResponse.json(runtimeStore.getCampaigns());
  }

  if (entity === "stock_movements") {
    return NextResponse.json(runtimeStore.getStockMovements());
  }

  if (entity === "users") {
    return NextResponse.json(runtimeStore.getAdminUsers());
  }

  if (entity === "audit_logs") {
    return NextResponse.json(runtimeStore.getAuditLogs());
  }

  if (entity === "abandoned_carts") {
    return NextResponse.json(runtimeStore.getAbandonedCarts());
  }

  if (entity === "insights") {
    const products = runtimeStore.getProducts();
    const orders = runtimeStore.getOrders().filter((o) => !o.is_archived);
    const customers = runtimeStore.getCustomers();
    const abandoned = runtimeStore.getAbandonedCarts();

    // 1. Predictive Reorder Intelligence
    const lowStockAlerts = products
      .filter((p) => p.is_active && p.stock <= 5)
      .map((p) => ({
        product_id: p.id,
        name: p.name.en,
        stock: p.stock,
        urgency: p.stock === 0 ? "critical" : p.stock <= 2 ? "high" : "medium",
        recommended_reorder_qty: Math.max(20, (p.stock === 0 ? 30 : 20)),
        estimated_cost: (p.cost_price || p.price * 0.6) * Math.max(20, (p.stock === 0 ? 30 : 20)),
      }));

    // 2. Botanical Seasonality & Monsoon / Winter Planting Advisory
    const currentMonth = new Date().getMonth(); // 0-11
    let seasonalContext = {
      season_name_en: "Late Autumn to Winter Transition",
      season_name_bn: "হেমন্ত থেকে শীতের প্রস্তুতি",
      watering_recommendation: "Reduce watering frequency by 30%. Water live plants only when the top 1 inch of potting soil feels dry to touch.",
      sunlight_advice: "Relocate indoor and balcony plants to south-facing orientations for maximum daytime winter sun exposure.",
      soil_fertilizer_tip: "Top-dress pots with decomposed vermicompost and light bone meal before winter dormancy.",
      high_demand_categories: ["Grafted Citrus & Malta", "Medicinal Herbs (Tulsi, Ashwagandha)", "Indoor Snake Plants"],
    };

    if (currentMonth >= 5 && currentMonth <= 8) {
      seasonalContext = {
        season_name_en: "Monsoon & Rainy Growth Season",
        season_name_bn: "বর্ষা মৌসুম ও চারা রোপণের সেরা সময়",
        watering_recommendation: "Ensure excellent pot drainage to prevent root rot. Pause scheduled watering during heavy downpours.",
        sunlight_advice: "Protect young grafting unions from torrential rain; ensure bright diffused lighting.",
        soil_fertilizer_tip: "Apply organic neem cake powder around roots to prevent fungal infestations and root grubs.",
        high_demand_categories: ["Fruit Seedlings (Mango, Guava, Jamun)", "Flowering Plants (Kamini, Jasmine)"],
      };
    }

    // 3. Customer Retention & Repeat Loyalty Score
    const repeatCustomers = customers.filter((c) => c.total_orders > 1);
    const repeatRate = customers.length > 0
      ? Math.round((repeatCustomers.length / customers.length) * 100)
      : 0;

    // 4. Recoverable Abandoned Cart Revenue
    const recoverableGMV = abandoned
      .filter((c) => c.recovery_status === "abandoned" || c.recovery_status === "contacted")
      .reduce((sum, c) => sum + c.total_value, 0);

    return NextResponse.json({
      lowStockAlerts,
      seasonalContext,
      customerRetention: {
        totalCustomers: customers.length,
        repeatCustomersCount: repeatCustomers.length,
        repeatRatePercentage: repeatRate,
        averageLtv: customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.total_spent, 0) / customers.length) : 0,
      },
      abandonedCartInsights: {
        totalAbandonedCount: abandoned.length,
        recoverableRevenue: recoverableGMV,
        recoveryRate: "42%",
      },
    });
  }

  if (entity === "reports") {
    const orders = runtimeStore.getOrders();
    const products = runtimeStore.getProducts();
    const customers = runtimeStore.getCustomers();
    const shipments = runtimeStore.getShipments();

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

    return NextResponse.json({
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
    });
  }

  if (entity === "settings") {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .limit(1)
          .single();
        if (!error && data) {
          runtimeStore.updateSettings(data);
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getSettings());
  }

  return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
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
      let isSynced = false;
      const productId = body.id;
      const existingProduct = productId
        ? runtimeStore.getProducts().find((p) => p.id === productId || (body.slug && p.slug === body.slug))
        : null;

      if (supabase) {
        try {
          const dbPayload: any = {};
          if (body.image_url !== undefined) dbPayload.image_url = body.image_url;
          if (body.name !== undefined) dbPayload.name = body.name;
          if (body.slug !== undefined) dbPayload.slug = body.slug;
          if (body.description !== undefined) dbPayload.description = body.description;
          if (body.price !== undefined) dbPayload.price = Number(body.price);
          if (body.compare_at_price !== undefined) dbPayload.compare_at_price = body.compare_at_price ? Number(body.compare_at_price) : null;
          if (body.stock !== undefined) dbPayload.stock = Number(body.stock);
          if (body.category !== undefined) dbPayload.category = body.category;
          if (body.is_active !== undefined) dbPayload.is_active = body.is_active;
          if (body.is_featured !== undefined) dbPayload.is_featured = body.is_featured;
          if (body.seo_title !== undefined) dbPayload.seo_title = body.seo_title;
          if (body.seo_description !== undefined) dbPayload.seo_description = body.seo_description;
          dbPayload.updated_at = new Date().toISOString();

          const targetSlug = body.slug || existingProduct?.slug;
          if (targetSlug) {
            const { data, error } = await supabase
              .from("products")
              .update(dbPayload)
              .eq("slug", targetSlug)
              .select("id");
            if (!error && data && data.length > 0) {
              isSynced = true;
            }
          }

          if (!isSynced && productId && !productId.startsWith("prod-")) {
            const { error } = await supabase.from("products").update(dbPayload).eq("id", productId);
            if (!error) isSynced = true;
          }

          if (!isSynced && !productId && dbPayload.name && dbPayload.slug) {
            const { error } = await supabase.from("products").insert(dbPayload);
            if (!error) isSynced = true;
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

      let gitSyncResult = null;
      if (body.sync_git || (action === "change_image" && body.sync_git !== false)) {
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
        items: runtimeStore.getProducts(),
      });
    }

    // 2. BLOGS
    if (entity === "blogs") {
      let isSynced = false;
      if (supabase) {
        try {
          if (body.id && !body.id.startsWith("blog-")) {
            const { error } = await supabase.from("blog_posts").update(body).eq("id", body.id);
            if (!error) isSynced = true;
          } else {
            const { error } = await supabase.from("blog_posts").insert(body);
            if (!error) isSynced = true;
          }
        } catch {}
      }

      const { sync_git, git_message, ...cleanBlog } = body;
      if (cleanBlog.id) {
        runtimeStore.updateBlog(cleanBlog.id, cleanBlog);
      } else {
        const newBlog = { ...cleanBlog, id: `blog-${Date.now()}` };
        runtimeStore.addBlog(newBlog);
      }

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(body.git_message || `Update blog: ${body.title?.en || body.id}`);
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: runtimeStore.getBlogs(),
      });
    }

    // 3. PAGES
    if (entity === "pages") {
      let isSynced = false;
      if (supabase) {
        try {
          if (body.id && !body.id.startsWith("page-")) {
            const { error } = await supabase.from("dynamic_pages").update(body).eq("id", body.id);
            if (!error) isSynced = true;
          } else {
            const { error } = await supabase.from("dynamic_pages").insert(body);
            if (!error) isSynced = true;
          }
        } catch {}
      }

      const { sync_git, git_message, ...cleanPage } = body;
      if (cleanPage.id) {
        runtimeStore.updatePage(cleanPage.id, cleanPage);
      } else {
        const newPage = { ...cleanPage, id: `page-${Date.now()}` };
        runtimeStore.addPage(newPage);
      }

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(body.git_message || `Update page: ${body.title?.en || body.slug}`);
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: runtimeStore.getPages(),
      });
    }

    // 4. TOOLS
    if (entity === "tools") {
      let isSynced = false;
      if (supabase && body.id) {
        try {
          const { error } = await supabase.from("tools").update({ is_active: body.is_active }).eq("id", body.id);
          if (!error) isSynced = true;
        } catch {}
      }
      runtimeStore.updateTool(body.id, { is_active: body.is_active });

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(`Toggle eco tool status: ${body.id}`);
      }

      return NextResponse.json({
        success: true,
        synced: isSynced,
        git_sync: gitSyncResult,
        items: runtimeStore.getTools(),
      });
    }

    // 5. ORDERS
    if (entity === "orders") {
      if (action === "archive") {
        const ids: string[] = body.ids || (body.id ? [body.id] : []);
        runtimeStore.archiveOrders(ids);
        if (supabase) {
          try {
            await supabase.from("orders").update({ is_archived: true }).in("id", ids);
          } catch {}
        }
        return NextResponse.json({
          success: true,
          message: `Archived ${ids.length} order(s)`,
          items: runtimeStore.getOrders(),
        });
      }

      if (action === "unarchive") {
        const ids: string[] = body.ids || (body.id ? [body.id] : []);
        runtimeStore.unarchiveOrders(ids);
        if (supabase) {
          try {
            await supabase.from("orders").update({ is_archived: false }).in("id", ids);
          } catch {}
        }
        return NextResponse.json({
          success: true,
          message: `Unarchived ${ids.length} order(s)`,
          items: runtimeStore.getOrders(),
        });
      }

      if (action === "delete_batch") {
        const ids: string[] = body.ids || [];
        runtimeStore.deleteOrders(ids);
        if (supabase) {
          try {
            await supabase.from("orders").delete().in("id", ids);
          } catch {}
        }
        return NextResponse.json({
          success: true,
          message: `Deleted ${ids.length} order(s)`,
          items: runtimeStore.getOrders(),
        });
      }

      if (action === "update_status") {
        runtimeStore.updateOrderStatus(body.id, body.status);
        if (supabase) {
          try {
            await supabase.from("orders").update({ order_status: body.status }).eq("id", body.id);
          } catch {}
        }
        return NextResponse.json({
          success: true,
          items: runtimeStore.getOrders(),
        });
      }

      if (action === "update_payment") {
        runtimeStore.updatePaymentStatus(body.id, body.status);
        if (supabase) {
          try {
            await supabase.from("orders").update({ payment_status: body.status }).eq("id", body.id);
          } catch {}
        }
        return NextResponse.json({
          success: true,
          items: runtimeStore.getOrders(),
        });
      }

      return NextResponse.json({ error: "Invalid order action" }, { status: 400 });
    }

    // 6. CRM: CUSTOMERS
    if (entity === "customers") {
      if (action === "export_csv") {
        const customers = runtimeStore.getCustomers();
        const headers = ["ID", "Name", "Phone", "Email", "City", "Address", "Total Orders", "Total Spent (BDT)", "Tags", "Last Order Date"];
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
      return NextResponse.json({ success: true, items: runtimeStore.getCustomers() });
    }

    // 7. CRM: LEADS
    if (entity === "leads") {
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
      return NextResponse.json({ success: true, items: runtimeStore.getLeads() });
    }

    // 8. PROCUREMENT: SUPPLIERS
    if (entity === "suppliers") {
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
      return NextResponse.json({ success: true, items: runtimeStore.getSuppliers() });
    }

    // 9. PROCUREMENT: PURCHASES (PURCHASE ORDERS)
    if (entity === "purchases") {
      if (action === "update_status") {
        runtimeStore.updatePurchaseStatus(body.id, body.status);
        return NextResponse.json({
          success: true,
          message: `Purchase status updated to ${body.status}.`,
          items: runtimeStore.getPurchases(),
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
      return NextResponse.json({ success: true, items: runtimeStore.getPurchases() });
    }

    // 10. LOGISTICS: SHIPMENTS
    if (entity === "shipments") {
      if (action === "update_status") {
        runtimeStore.updateShipmentStatus(body.id, body.courier_status);
        return NextResponse.json({
          success: true,
          items: runtimeStore.getShipments(),
        });
      }

      const trackingCode = `TRK-${(body.courier_partner || "EXP").slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
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
      return NextResponse.json({ success: true, items: runtimeStore.getShipments() });
    }

    // 11. RETURNS & REFUNDS
    if (entity === "returns") {
      if (action === "update_status") {
        runtimeStore.updateReturnStatus(body.id, body.status);
        return NextResponse.json({ success: true, items: runtimeStore.getReturns() });
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
      return NextResponse.json({ success: true, items: runtimeStore.getReturns() });
    }

    // 12. COUPONS & PROMOTIONAL DISCOUNTS
    if (entity === "coupons") {
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
      return NextResponse.json({ success: true, items: runtimeStore.getCoupons() });
    }

    // 13. CAMPAIGNS & ANNOUNCEMENT BANNERS
    if (entity === "campaigns") {
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
      return NextResponse.json({ success: true, items: runtimeStore.getCampaigns() });
    }

    // 14. SETTINGS
    if (entity === "settings") {
      let isSynced = false;
      if (supabase) {
        try {
          const { error } = await supabase.from("settings").upsert({
            id: body.id || "00000000-0000-0000-0000-000000000001",
            global_seo_title: body.global_seo_title,
            global_seo_description: body.global_seo_description,
            analytics_script: body.analytics_script,
            ad_banner_top_html: body.ad_banner_top_html,
            ai_system_prompt: body.ai_system_prompt,
            contact_email: body.contact_email,
            contact_phone: body.contact_phone,
            meta_pixel_id: body.meta_pixel_id,
            meta_capi_token: body.meta_capi_token,
            ga4_measurement_id: body.ga4_measurement_id,
            google_site_verification: body.google_site_verification,
            announcement_bar_enabled: body.announcement_bar_enabled,
            announcement_bar_text: body.announcement_bar_text,
            announcement_bar_link: body.announcement_bar_link,
            updated_at: new Date().toISOString(),
          });
          if (!error) isSynced = true;
        } catch {}
      }

      const updated = runtimeStore.updateSettings(body);

      let gitSyncResult = null;
      if (body.sync_git) {
        gitSyncResult = await gitCommitAndPush(body.git_message || "Update store & AI system settings");
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
      const product = runtimeStore.getProducts().find((p) => p.id === body.product_id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const change = Number(body.quantity_change) || 0;
      const newStock = Math.max(0, product.stock + change);
      runtimeStore.updateProduct(product.id, { stock: newStock });

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

      return NextResponse.json({ success: true, movement, newStock, items: runtimeStore.getStockMovements() });
    }

    // 16. ADMIN USERS & RBAC
    if (entity === "users") {
      if (body.id) {
        runtimeStore.updateAdminUser(body.id, body);
        runtimeStore.logAuditEvent(staff.email, "USER_UPDATED", "users", `Updated user ${body.email} (${body.role})`, body.id);
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
        runtimeStore.logAuditEvent(staff.email, "USER_CREATED", "users", `Created staff user ${newUser.email} with role ${newUser.role}`, newUser.id);
      }
      return NextResponse.json({ success: true, items: runtimeStore.getAdminUsers() });
    }

    // 17. ABANDONED CARTS
    if (entity === "abandoned_carts") {
      if (body.id) {
        runtimeStore.updateAbandonedCartStatus(body.id, body.recovery_status, body.notes);
        runtimeStore.logAuditEvent(staff.email, "ABANDONED_CART_UPDATED", "crm", `Updated abandoned cart ${body.id} to ${body.recovery_status}`);
      }
      return NextResponse.json({ success: true, items: runtimeStore.getAbandonedCarts() });
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
      if (supabase) {
        try { await supabase.from("products").delete().eq("id", id); } catch {}
      }
      runtimeStore.deleteProduct(id);
      return NextResponse.json({ success: true, items: runtimeStore.getProducts() });
    }

    if (entity === "blogs") {
      if (supabase) {
        try { await supabase.from("blog_posts").delete().eq("id", id); } catch {}
      }
      runtimeStore.deleteBlog(id);
      return NextResponse.json({ success: true, items: runtimeStore.getBlogs() });
    }

    if (entity === "pages") {
      if (supabase) {
        try { await supabase.from("dynamic_pages").delete().eq("id", id); } catch {}
      }
      runtimeStore.deletePage(id);
      return NextResponse.json({ success: true, items: runtimeStore.getPages() });
    }

    if (entity === "orders") {
      if (supabase) {
        try { await supabase.from("orders").delete().eq("id", id); } catch {}
      }
      runtimeStore.deleteOrders([id]);
      return NextResponse.json({ success: true, items: runtimeStore.getOrders() });
    }

    if (entity === "customers") {
      runtimeStore.deleteCustomer(id);
      return NextResponse.json({ success: true, items: runtimeStore.getCustomers() });
    }

    if (entity === "leads") {
      runtimeStore.deleteLead(id);
      return NextResponse.json({ success: true, items: runtimeStore.getLeads() });
    }

    if (entity === "suppliers") {
      runtimeStore.deleteSupplier(id);
      return NextResponse.json({ success: true, items: runtimeStore.getSuppliers() });
    }

    if (entity === "coupons") {
      runtimeStore.deleteCoupon(id);
      return NextResponse.json({ success: true, items: runtimeStore.getCoupons() });
    }

    if (entity === "campaigns") {
      runtimeStore.deleteCampaign(id);
      return NextResponse.json({ success: true, items: runtimeStore.getCampaigns() });
    }

    if (entity === "users") {
      runtimeStore.deleteAdminUser(id);
      runtimeStore.logAuditEvent(staff.email, "USER_DELETED", "users", `Deleted staff user ${id}`);
      return NextResponse.json({ success: true, items: runtimeStore.getAdminUsers() });
    }

    if (entity === "abandoned_carts") {
      runtimeStore.deleteAbandonedCart(id);
      return NextResponse.json({ success: true, items: runtimeStore.getAbandonedCarts() });
    }

    return NextResponse.json({ error: "Invalid entity for deletion" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
