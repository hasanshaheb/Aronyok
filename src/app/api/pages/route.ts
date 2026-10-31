import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    let pages = runtimeStore.getPages();

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        let query = supabase.from("dynamic_pages").select("*").eq("is_published", true);
        if (slug) {
          query = query.eq("slug", slug);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          if (slug) {
            return NextResponse.json(data[0]);
          }
          pages = data;
        }
      } catch {}
    }

    if (slug) {
      const page = pages.find((p) => p.slug === slug && p.is_published);
      if (!page) {
        return NextResponse.json({ error: "Page not found" }, { status: 404 });
      }
      return NextResponse.json(page);
    }

    return NextResponse.json(pages.filter((p) => p.is_published));
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch pages" }, { status: 500 });
  }
}
