import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProductDetailClient from "@/components/storefront/ProductDetailClient";
import { runtimeStore } from "@/lib/runtime-store";
import { getServerSupabase } from "@/lib/supabase/server";
import { fallbackProducts } from "@/lib/supabase/fallback-data";
import { Product } from "@/lib/types";

interface PageProps {
  params: { slug: string };
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (!error && data) {
        return data as Product;
      }
    } catch {}
  }

  // Fallback to runtime store
  const found = runtimeStore.getProducts().find((p) => p.slug === slug && p.is_active);
  if (found) return found;

  const foundFallback = fallbackProducts.find((p) => p.slug === slug && p.is_active);
  return foundFallback || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Product Not Found | Aronyok (আরণ্যক)",
      description: "The requested organic product or plant seedling was not found.",
    };
  }

  const title = `${product.name?.en || product.slug} (${product.name?.bn || ""}) | Aronyok (আরণ্যক)`;
  const description =
    product.seo_description?.en ||
    (typeof product.description === "object" ? product.description?.en : product.description)?.slice(0, 160) ||
    "Discover certified organic botanicals and plants from Aronyok.";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aronyok.vercel.app";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteUrl}/shop/${product.slug}`,
      siteName: "Aronyok (আরণ্যক)",
      images: [
        {
          url: product.image_url || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
          width: 800,
          height: 800,
          alt: product.name?.en || product.slug,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image_url || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-forest-950">Product Not Found</h2>
        <p className="text-xs text-forest-700">The product you are looking for is currently unavailable or has been relocated.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest-700 text-white font-bold text-xs shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name?.en || product.slug,
    alternateName: product.name?.bn || "",
    image: product.image_url,
    description: (typeof product.description === "object" ? product.description?.en : product.description) || "",
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Aronyok (আরণ্যক)",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
