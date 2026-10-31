import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let products = runtimeStore.getProducts();

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        let query = supabase.from("products").select("*").eq("is_active", true);

        if (slug) {
          query = query.eq("slug", slug);
        } else if (category && category !== "all") {
          query = query.eq("category", category);
        }

        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          if (slug) {
            return NextResponse.json(data[0]);
          }
          products = data;
        }
      } catch {}
    }

    if (slug) {
      const product = products.find((p) => p.slug === slug && p.is_active);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json(product);
    }

    // Filter by category if specified
    if (category && category !== "all") {
      products = products.filter((p) => p.category === category && p.is_active);
    } else {
      products = products.filter((p) => p.is_active);
    }

    // Filter by search query if specified
    if (search && search.trim() !== "") {
      const q = search.trim().toLowerCase();
      products = products.filter(
        (p) =>
          p.name.en.toLowerCase().includes(q) ||
          p.name.bn.toLowerCase().includes(q) ||
          p.description.en.toLowerCase().includes(q) ||
          p.description.bn.toLowerCase().includes(q)
      );
    }

    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch products" }, { status: 500 });
  }
}
