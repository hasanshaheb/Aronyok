import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    let blogs = runtimeStore.getBlogs();

    const supabase = getServerSupabase();
    if (supabase) {
      try {
        let query = supabase.from("blog_posts").select("*").eq("status", "published");
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
          blogs = data;
        }
      } catch {}
    }

    if (slug) {
      const blog = blogs.find((b) => b.slug === slug && b.status === "published");
      if (!blog) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    }

    if (category && category !== "all") {
      blogs = blogs.filter((b) => b.category === category && b.status === "published");
    } else {
      blogs = blogs.filter((b) => b.status === "published");
    }

    return NextResponse.json(blogs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch articles" }, { status: 500 });
  }
}
