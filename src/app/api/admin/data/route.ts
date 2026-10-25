import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";

export async function GET(req: NextRequest) {
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
          .select("*")
          .order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return NextResponse.json(data);
        }
      } catch {}
    }
    return NextResponse.json(runtimeStore.getOrders());
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
    const { searchParams } = new URL(req.url);
    const entity = searchParams.get("entity");
    const body = await req.json();
    const supabase = getServerSupabase();

    if (entity === "products") {
      let isSynced = false;
      if (supabase) {
        try {
          if (body.id && !body.id.startsWith("prod-")) {
            const { error } = await supabase.from("products").update(body).eq("id", body.id);
            if (!error) isSynced = true;
          } else {
            const { error } = await supabase.from("products").insert(body);
            if (!error) isSynced = true;
          }
        } catch {}
      }

      if (body.id) {
        runtimeStore.updateProduct(body.id, body);
      } else {
        const newProduct = { ...body, id: `prod-${Date.now()}` };
        runtimeStore.addProduct(newProduct);
      }
      return NextResponse.json({ success: true, synced: isSynced, items: runtimeStore.getProducts() });
    }

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

      if (body.id) {
        runtimeStore.updateBlog(body.id, body);
      } else {
        const newBlog = { ...body, id: `blog-${Date.now()}` };
        runtimeStore.addBlog(newBlog);
      }
      return NextResponse.json({ success: true, synced: isSynced, items: runtimeStore.getBlogs() });
    }

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

      if (body.id) {
        runtimeStore.updatePage(body.id, body);
      } else {
        const newPage = { ...body, id: `page-${Date.now()}` };
        runtimeStore.addPage(newPage);
      }
      return NextResponse.json({ success: true, synced: isSynced, items: runtimeStore.getPages() });
    }

    if (entity === "tools") {
      let isSynced = false;
      if (supabase && body.id) {
        try {
          const { error } = await supabase.from("tools").update({ is_active: body.is_active }).eq("id", body.id);
          if (!error) isSynced = true;
        } catch {}
      }
      runtimeStore.updateTool(body.id, { is_active: body.is_active });
      return NextResponse.json({ success: true, synced: isSynced, items: runtimeStore.getTools() });
    }

    if (entity === "orders") {
      let isSynced = false;
      if (supabase && body.id) {
        try {
          const updateData: any = {};
          if (body.order_status) updateData.order_status = body.order_status;
          if (body.payment_status) updateData.payment_status = body.payment_status;
          const { error } = await supabase.from("orders").update(updateData).eq("id", body.id);
          if (!error) isSynced = true;
        } catch {}
      }
      if (body.order_status) runtimeStore.updateOrderStatus(body.id, body.order_status);
      if (body.payment_status) runtimeStore.updatePaymentStatus(body.id, body.payment_status);
      return NextResponse.json({ success: true, synced: isSynced, items: runtimeStore.getOrders() });
    }

    if (entity === "settings") {
      let isSynced = false;
      if (supabase) {
        try {
          const { error } = await supabase.from("settings").upsert({
            id: body.id || "00000000-0000-0000-0000-000000000001",
            ...body,
            updated_at: new Date().toISOString(),
          });
          if (!error) isSynced = true;
        } catch {}
      }
      const updated = runtimeStore.updateSettings(body);
      return NextResponse.json({ success: true, synced: isSynced, settings: updated });
    }

    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
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

    return NextResponse.json({ error: "Invalid entity" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
