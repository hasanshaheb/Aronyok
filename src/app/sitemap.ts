import { MetadataRoute } from "next";
import { runtimeStore } from "@/lib/runtime-store";
import { getServerSupabase } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aronyok.vercel.app";

  // Static routes with their priority & change frequency
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/order-tracking`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping-and-returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Load products (from Supabase or active runtime store)
  let products = runtimeStore.getProducts();
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data } = await supabase
        .from("products")
        .select("slug, updated_at, is_active")
        .eq("is_active", true);
      if (data && data.length > 0) {
        products = data as any;
      }
    } catch {}
  }

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.is_active && p.slug)
    .map((product) => ({
      url: `${baseUrl}/shop/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  // Load blog posts
  const blogPosts = runtimeStore.getBlogs();
  const blogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.status === "published" && post.slug)
    .map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

  // Load tools
  const tools = runtimeStore.getTools();
  const toolRoutes: MetadataRoute.Sitemap = tools
    .filter((tool) => tool.is_active && tool.endpoint_slug)
    .map((tool) => ({
      url: `${baseUrl}/tools/${tool.endpoint_slug}`,
      lastModified: tool.updated_at ? new Date(tool.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...toolRoutes];
}
