"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Wrench, ShieldCheck, Leaf } from "lucide-react";
import Hero from "../components/storefront/Hero";
import CategoryFilter from "../components/storefront/CategoryFilter";
import ProductCard from "../components/storefront/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { fallbackProducts, fallbackBlogPosts, fallbackTools } from "../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../lib/supabase/client";
import { Product, BlogPost } from "../lib/types";

export default function HomePage() {
  const { language, t, localize } = useLanguage();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    async function fetchData() {
      if (!isSupabaseConfigured || !supabase) return;

      try {
        // Fetch active products
        const { data: prodData } = await supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (prodData && prodData.length > 0) {
          setProducts(prodData);
        }

        // Fetch published blog posts
        const { data: blogData } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(3);

        if (blogData && blogData.length > 0) {
          setBlogPosts(blogData);
        }
      } catch (err) {
        console.warn("Using offline fallback data:", err);
      }
    }

    fetchData();
  }, []);

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Product Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              <span>{t.storefront.featuredTitle}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-forest-950 tracking-tight">
              {language === "bn"
                ? "প্রকৃতির সতেজ ও বিশুদ্ধ সম্ভার"
                : "Handcrafted & Wild Organic Harvest"}
            </h2>
            <p className="text-sm text-forest-700/80 mt-1 max-w-xl">
              {t.storefront.featuredSubtitle}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900 group"
          >
            <span>{language === "bn" ? "সব পণ্য দেখুন" : "Browse All Products"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Pills Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. Interactive Tools Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 text-white p-8 sm:p-12 relative overflow-hidden shadow-soft-lg">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-forest-700/30 blur-2xl pointer-events-none" />

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-700/80 text-mint-300 text-xs font-bold uppercase tracking-wider border border-forest-600/40">
              <Sparkles className="w-3.5 h-3.5 text-mint-300" />
              <span>{language === "bn" ? "ইন্টারেক্টিভ ইকো টুলস" : "Smart Eco Tools"}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream-50">
              {language === "bn"
                ? "ভেষজ নিরাময় জানুন ও বারান্দার বাগান সাজান"
                : "Explore Herbal Wisdom & Plan Your Green Balcony"}
            </h3>

            <p className="text-sm text-forest-200/90 leading-relaxed">
              {language === "bn"
                ? "আমাদের ফ্রি ইন্টারেক্টিভ টুল ব্যবহার করে আপনার স্বাস্থ্য সমস্যার প্রাকৃতিক প্রতিকার খুঁজুন অথবা আপনার বারান্দার রোদের পরিমাণ হিসাব করুন।"
                : "Leverage our interactive tools to match botanical herbs to your daily wellness needs, calculate soil-compost ratios, and time your plant watering."}
            </p>

            <div className="pt-2">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cream-50 text-forest-900 font-bold text-xs sm:text-sm hover:bg-white shadow-md transition-colors"
              >
                <span>{language === "bn" ? "টুলস ব্যবহার করুন" : "Open Eco Tools"}</span>
                <ArrowRight className="w-4 h-4 text-forest-700" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Latest Journal / Blog Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-100 text-earth-800 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-earth-600" />
              <span>{t.blog.title}</span>
            </div>
            <h2 className="text-3xl font-extrabold text-forest-950 tracking-tight">
              {language === "bn" ? "প্রকৃতি ও স্বাস্থ্য সাময়িকী" : "The Herbal & Green Journal"}
            </h2>
            <p className="text-sm text-forest-700/80 mt-1 max-w-xl">
              {t.blog.subtitle}
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900 group"
          >
            <span>{language === "bn" ? "সব লেখা পড়ুন" : "Read All Articles"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-3xl bg-white border border-forest-100/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-full aspect-[16/9] bg-stone-100 overflow-hidden">
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={localize(post.title)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                  {post.category || "Herbal Living"}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-forest-950 group-hover:text-forest-700 transition-colors">
                    {localize(post.title)}
                  </h3>
                  <p className="text-xs text-forest-700/80 mt-2 line-clamp-2 leading-relaxed">
                    {localize(post.excerpt)}
                  </p>
                </div>
                <div className="pt-3 border-t border-forest-50 flex items-center justify-between text-xs text-forest-600">
                  <span>{post.read_time || "5 min read"}</span>
                  <span className="font-bold text-forest-800 flex items-center gap-1">
                    <span>{t.blog.readMore}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
