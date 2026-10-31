"use client";

import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Leaf } from "lucide-react";
import ProductCard from "../../components/storefront/ProductCard";
import CategoryFilter from "../../components/storefront/CategoryFilter";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackProducts } from "../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";
import { Product } from "../../lib/types";
import { trackEvent } from "../../lib/analytics/events";

export default function ShopPage() {
  const { language, t, localize } = useLanguage();
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setProducts(data.filter((p: any) => p.is_active));
          }
        }
      } catch (err) {
        console.warn("Using fallback products:", err);
      }
    }
    loadProducts();
  }, []);

  // Track search query with debounce
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length >= 3) {
      const timer = setTimeout(() => {
        trackEvent("Search", {
          search_string: trimmed,
        });
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  // Filter & Search
  const filtered = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;
    const nameStr = (p.name.en + " " + p.name.bn).toLowerCase();
    const matchesSearch =
      searchQuery.trim() === "" || nameStr.includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5 text-forest-600" />
          <span>{language === "bn" ? "প্রাকৃতিক বাজার" : "Organic Catalog"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
          {language === "bn" ? "আরণ্যক প্রকৃতি সম্ভার" : "Aronyok Earth Goods"}
        </h1>
        <p className="text-sm text-forest-700/80">
          {language === "bn"
            ? "বিশুদ্ধ চাকভাঙা মধু, ঘানির তেল, ঔষধি গাছ এবং মৃৎশিল্পের বিশ্বস্ত সংগ্রহ।"
            : "Hand-harvested mangrove honey, live therapeutic plants, cold-pressed oils, and terracotta planters."}
        </p>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-cream-50/80 p-4 rounded-2xl border border-forest-100">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-forest-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === "bn" ? "পণ্য অনুসন্ধান করুন..." : "Search products..."}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-forest-800 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{language === "bn" ? "ক্রম:" : "Sort:"}</span>
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white border border-forest-200 text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="featured">
              {language === "bn" ? "বাছাইকৃত পণ্য" : "Featured"}
            </option>
            <option value="price-asc">
              {language === "bn" ? "দাম: কম থেকে বেশি" : "Price: Low to High"}
            </option>
            <option value="price-desc">
              {language === "bn" ? "দাম: বেশি থেকে কম" : "Price: High to Low"}
            </option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Count & Status */}
      <p className="text-xs text-forest-600 font-medium">
        {sorted.length} {t.storefront.itemsFound}
      </p>

      {/* Product Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-cream-50/50 rounded-3xl border border-dashed border-forest-200">
          <p className="text-sm font-semibold text-forest-800">
            {language === "bn" ? "কোনো পণ্য পাওয়া যায়নি।" : "No products matched your search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
