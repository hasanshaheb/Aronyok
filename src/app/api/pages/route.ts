import { NextRequest, NextResponse } from "next/server";
import { loadLatestPages } from "@/lib/data-hydrator";

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

    const pages = await loadLatestPages();

    if (slug) {
      const page = pages.find((p) => p.slug === slug && p.is_published);
      if (!page) {
        return NextResponse.json(
          { error: "Page not found" },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json(page, { headers: NO_CACHE_HEADERS });
    }

    return NextResponse.json(
      pages.filter((p) => p.is_published),
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch pages" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
