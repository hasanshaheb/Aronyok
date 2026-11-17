import { NextRequest, NextResponse } from "next/server";
import { loadLatestProducts } from "@/lib/data-hydrator";

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
    const search = searchParams.get("search");

    let products = await loadLatestProducts();

    if (slug) {
      const product = products.find((p) => p.slug === slug && p.is_active);
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404, headers: NO_CACHE_HEADERS }
        );
      }
      return NextResponse.json(product, { headers: NO_CACHE_HEADERS });
    }

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category && p.is_active);
    } else {
      products = products.filter((p) => p.is_active);
    }

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

    return NextResponse.json(products, { headers: NO_CACHE_HEADERS });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch products" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
