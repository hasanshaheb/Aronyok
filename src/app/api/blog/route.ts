import { NextRequest, NextResponse } from "next/server";
import { loadLatestBlogs } from "@/lib/data-hydrator";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    let blogs = await loadLatestBlogs();

    if (slug) {
      const blog = blogs.find((b) => b.slug === slug && b.status === "published");
      if (!blog) {
        return NextResponse.json(
          { error: "Article not found" },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json(blog, { headers: NO_CACHE_HEADERS });
    }

    if (category && category !== "all") {
      blogs = blogs.filter((b) => b.category === category && b.status === "published");
    } else {
      blogs = blogs.filter((b) => b.status === "published");
    }

    return NextResponse.json(blogs, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch articles" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
