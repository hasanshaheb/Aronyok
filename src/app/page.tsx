"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  ShieldCheck,
  Leaf,
  Sprout,
  Truck,
  HeartHandshake,
  Star,
  Quote,
  TreePine,
  CheckCircle2,
} from "lucide-react";
import Hero from "../components/storefront/Hero";
import CategoryFilter from "../components/storefront/CategoryFilter";
import ProductCard from "../components/storefront/ProductCard";
import { useLanguage } from "../context/LanguageContext";
import { fallbackProducts, fallbackBlogPosts } from "../lib/supabase/fallback-data";
import { Product, BlogPost } from "../lib/types";

export default function HomePage() {
  const { language, t, localize } = useLanguage();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const isBn = language === "bn";

  useEffect(() => {
    async function fetchData() {
      try {
        const [prodRes, blogRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/blog"),
        ]);
        if (prodRes.ok) {
          const prods = await prodRes.json();
          if (Array.isArray(prods) && prods.length > 0) {
            setProducts(prods.filter((p: any) => p.is_active));
          }
        }
        if (blogRes.ok) {
          const blogs = await blogRes.json();
          if (Array.isArray(blogs) && blogs.length > 0) {
            setBlogPosts(blogs.filter((b: any) => b.status === "published" || b.is_published));
          }
        }
      } catch (err) {
        console.warn("Using fallback data:", err);
      }
    }

    fetchData();
  }, []);

  const livePlants = products.filter((p) => p.category === "plants");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const testimonials = [
    {
      name: isBn ? "ডা. ফারহানা চৌধুরী" : "Dr. Farhana Chowdhury",
      location: isBn ? "ধানমন্ডি, ঢাকা" : "Dhanmondi, Dhaka",
      text: isBn
        ? "আরণ্যক থেকে আনা দারুচিনি ও মাল্টা চারা দুটি ছাদবাগানে খুব দ্রুত পাতা ছেড়েছে। প্যাকেজিং এত চমৎকার ছিল যে একটি পাতাও নষ্ট হয়নি।"
        : "The Cinnamon and Malta saplings arrived in pristine condition in Dhanmondi. The ventilated packaging kept every leaf crisp and vibrant.",
      plant: isBn ? "ভেষজ ও ফলদ চারা ক্রেতা" : "Terrace Garden Customer",
      rating: 5,
    },
    {
      name: isBn ? "ইঞ্জিনিয়ার তানভীর আহমেদ" : "Engr. Tanveer Ahmed",
      location: isBn ? "উত্তরা, ঢাকা" : "Uttara, Dhaka",
      text: isBn
        ? "সুন্দরবনের খলিসা ফুলের কাঁচা মধুর স্বাদ ও গন্ধ অসাধারণ। পরিবারের সবার জন্য নিয়মিত নিচ্ছি। শতভাগ খাঁটি পণ্যের বিশ্বস্ত প্রতিষ্ঠান।"
        : "The raw Khalisa honey from Sundarbans is exceptional. Truly pure, untreated, and our entire family enjoys it every morning.",
      plant: isBn ? "সুন্দরবন মধু নিয়মিত গ্রাহক" : "Verified Honey Subscriber",
      rating: 5,
    },
    {
      name: isBn ? "নাসরিন সুলতানা" : "Nasreen Sultana",
      location: isBn ? "নাসিরাবাদ, চট্টগ্রাম" : "Nasirabad, Chattogram",
      text: isBn
        ? "টবের মাটির ভার্মিকম্পোস্ট অনুপাত টুলটি ব্যবহার করে এবার বারান্দার মরিচ ও তুলসী গাছে চমৎকার ফলন পেয়েছি। আরণ্যকের কৃষি পরামর্শ অতুলনীয়।"
        : "Using Aronyok's Balcony Compost tool made all the difference for our chili and holy basil pots. Their agronomist support is top notch.",
      plant: isBn ? "বারান্দা বাগানপ্রেমী" : "Balcony Gardener",
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Why Choose Aronyok: 3 Botanical Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex gap-4 p-6 rounded-3xl bg-cream-50/70 border border-forest-100 shadow-soft-sm hover:shadow-soft-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-750 flex-shrink-0">
              <TreePine className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-forest-950 text-base">
                {isBn ? "সুস্থ-সবল কলম চারা" : "Healthy Grafted Saplings"}
              </h3>
              <p className="text-xs text-forest-800/75 mt-1.5 leading-relaxed">
                {isBn
                  ? "সাভার ও যশোরের নিজস্ব নার্সারিতে বৈজ্ঞানিক গ্রাফটিং পদ্ধতিতে উৎপাদিত রোগমুক্ত ও দ্রুত ফলনশীল চারা।"
                  : "Scientifically propagated, disease-screened fruit & herbal saplings raised at our nursery for quick fruiting."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-3xl bg-cream-50/70 border border-forest-100 shadow-soft-sm hover:shadow-soft-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 flex items-center justify-center text-emerald-800 flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-forest-950 text-base">
                {isBn ? "নিরাপদ ট্রানজিট প্যাকেজিং" : "Safe Transit Packaging"}
              </h3>
              <p className="text-xs text-forest-800/75 mt-1.5 leading-relaxed">
                {isBn
                  ? "বিশেষ ভেন্টিলেটেড কাঠের ফ্রেম ও সুরক্ষিত বায়ুচলাচল কার্টনে চারা অক্ষত অবস্থায় সারা দেশে পৌঁছানো হয়।"
                  : "Reinforced ventilated cartons ensure live root systems breathe and branches never break in courier transit."}
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-6 rounded-3xl bg-cream-50/70 border border-forest-100 shadow-soft-sm hover:shadow-soft-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100/60 flex items-center justify-center text-terracotta-700 flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-forest-950 text-base">
                {isBn ? "আজীবন পরিচর্যা পরামর্শ" : "Lifetime Plant Care Advice"}
              </h3>
              <p className="text-xs text-forest-800/75 mt-1.5 leading-relaxed">
                {isBn
                  ? "টবের মাটি তৈরি, জৈব সার প্রয়োগ ও পোকা দমনে আমাদের অভিজ্ঞ কৃষিবিদ দল সবসময় আপনার পাশে।"
                  : "From potting mix formulation to pest control, our agronomists support your green journey continuously."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Seasonal Live Plants Spotlight */}
      {livePlants.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-850 text-xs font-bold uppercase tracking-wider mb-2">
                <Sprout className="w-3.5 h-3.5 text-forest-600" />
                <span>{isBn ? "নার্সারি স্পটলাইট" : "Living Nursery Spotlight"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
                {isBn ? "মৌসুমি সতেজ কলম চারা সম্ভার" : "Seasonal Grafted Seedlings & Plants"}
              </h2>
              <p className="text-xs sm:text-sm text-forest-800/80 mt-1 max-w-xl">
                {isBn
                  ? "ছাদবাগান ও আঙিনায় কম জায়গায় প্রচুর ফলনের উপযোগী প্রিমিয়াম জাতের চারা।"
                  : "High-yield fruit, spice, and herbal seedlings optimized for container and rooftop cultivation."}
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-750 hover:text-forest-950 group"
            >
              <span>{isBn ? "সকল চারা দেখুন" : "View All Plants"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {livePlants.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 4. Complete Product Catalog Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-850 text-xs font-bold uppercase tracking-wider mb-2">
              <Leaf className="w-3.5 h-3.5 text-forest-600" />
              <span>{t.storefront.featuredTitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
              {isBn
                ? "প্রকৃতির সতেজ ও বিশুদ্ধ সম্ভার"
                : "Handcrafted & Wild Organic Harvest"}
            </h2>
            <p className="text-xs sm:text-sm text-forest-800/80 mt-1 max-w-xl">
              {t.storefront.featuredSubtitle}
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-750 hover:text-forest-950 group"
          >
            <span>{isBn ? "পুরো ক্যাটালগ দেখুন" : "Browse All Catalog"}</span>
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

      {/* 5. Interactive Eco Tools Spotlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-forest-950 via-forest-900 to-forest-850 text-white p-8 sm:p-12 relative overflow-hidden shadow-soft-xl">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-forest-700/25 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-sage-500/10 blur-2xl pointer-events-none" />

          <div className="max-w-2xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-800/80 text-mint-300 text-xs font-bold uppercase tracking-wider border border-forest-600/40">
              <Sparkles className="w-3.5 h-3.5 text-mint-300" />
              <span>{isBn ? "ইন্টারেক্টিভ ইকো টুলস" : "Smart Eco Tools"}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cream-50 leading-snug">
              {isBn
                ? "ভেষজ নিরাময় জানুন ও বারান্দার বাগান সাজান"
                : "Explore Herbal Wisdom & Calculate Terrace Ratios"}
            </h3>

            <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed font-normal">
              {isBn
                ? "আমাদের ফ্রি ইন্টারেক্টিভ টুল ব্যবহার করে আপনার স্বাস্থ্য সমস্যার প্রাকৃতিক সমাধান খুঁজুন, বারান্দার রোদের পরিমাণ নির্ধারণ করুন অথবা মাটির আদর্শ কম্পোস্ট অনুপাত হিসাব করুন।"
                : "Leverage our interactive tools to match botanical herbs to your daily wellness needs, calculate soil-compost ratios, and calculate optimal watering schedules."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cream-50 text-forest-950 font-bold text-xs sm:text-sm hover:bg-white shadow-md transition-all hover:shadow-lg"
              >
                <span>{isBn ? "টুলস ব্যবহার করুন" : "Launch Eco Tools"}</span>
                <ArrowRight className="w-4 h-4 text-forest-750" />
              </Link>

              <Link
                href="/chat"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-forest-800/90 text-white font-bold text-xs sm:text-sm hover:bg-forest-700 border border-forest-600/60 transition-colors"
              >
                <span>{isBn ? "এআই বোটানিক্যাল অ্যাসিস্ট্যান্ট" : "AI Nature Assistant"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. What Rooftop Gardeners Say: Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200/70 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <Quote className="w-3.5 h-3.5 text-forest-700" />
            <span>{isBn ? "গ্রাহকদের অভিজ্ঞতা" : "Customer Voices"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
            {isBn ? "ছাদবাগান ও প্রকৃতিপ্রেমীদের অভিমত" : "Trusted by Terrace Gardeners"}
          </h2>
          <p className="text-xs sm:text-sm text-forest-800/80">
            {isBn
              ? "সারা দেশের শত শত সন্তুষ্ট ছাদবাগানী ও পরিবারের বাস্তব অভিজ্ঞতা।"
              : "Real reviews from green-thumb enthusiasts and organic families across Bangladesh."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between p-6 rounded-3xl bg-white border border-forest-100 shadow-soft-sm hover:shadow-soft-md transition-shadow"
            >
              <div className="space-y-3">
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-forest-900/85 leading-relaxed italic">
                  &ldquo;{item.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-forest-50 mt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-forest-950">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-forest-600">{item.location}</p>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-forest-50 text-forest-800 font-semibold border border-forest-100">
                  {item.plant}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Latest Journal / Blog Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-100 text-earth-850 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5 text-earth-700" />
              <span>{t.blog.title}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
              {isBn ? "প্রকৃতি ও স্বাস্থ্য সাময়িকী" : "The Herbal & Green Journal"}
            </h2>
            <p className="text-xs sm:text-sm text-forest-800/80 mt-1 max-w-xl">
              {t.blog.subtitle}
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-750 hover:text-forest-950 group"
          >
            <span>{isBn ? "সব লেখা পড়ুন" : "Read All Articles"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.slice(0, 2).map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group flex flex-col rounded-3xl bg-white border border-forest-100/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative w-full aspect-[16/9] bg-stone-100 overflow-hidden">
                {post.image_url && (
                  <Image
                    fill
                    unoptimized
                    src={post.image_url}
                    alt={localize(post.title)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase">
                  {post.category || "Herbal Living"}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-forest-950 group-hover:text-forest-700 transition-colors">
                    {localize(post.title)}
                  </h3>
                  <p className="text-xs text-forest-800/75 mt-2 line-clamp-2 leading-relaxed">
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
