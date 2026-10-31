"use client";

import React from "react";
import {
  LayoutGrid,
  Sprout,
  Droplets,
  HeartPulse,
  Flower2,
  TreePine,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const categories = [
    {
      id: "all",
      label: isBn ? "সকল সম্ভার" : "All Products",
      icon: LayoutGrid,
    },
    {
      id: "plants",
      label: isBn ? "ফলদ ও ওষধি চারা" : "Live Plants",
      icon: TreePine,
    },
    {
      id: "honey",
      label: isBn ? "সুন্দরবনের খাঁটি মধু" : "Forest Honey",
      icon: Droplets,
    },
    {
      id: "herbs",
      label: isBn ? "ভেষজ ও আয়ুর্বেদ" : "Medicinal Herbs",
      icon: Sprout,
    },
    {
      id: "wellness",
      label: isBn ? "প্রাকৃতিক সুস্থতা" : "Herbal Wellness",
      icon: HeartPulse,
    },
    {
      id: "gardening",
      label: isBn ? "মাটির পাত্র ও উপকরণ" : "Pottery & Soil",
      icon: Flower2,
    },
  ];

  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        const Icon = cat.icon;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? "bg-forest-900 text-cream-50 border-forest-900 shadow-soft-md scale-[1.02] ring-2 ring-terracotta-500/40"
                : "bg-cream-100/90 text-charcoal-800 border-forest-200/90 hover:bg-white hover:border-terracotta-400 hover:text-terracotta-700 shadow-xs"
            }`}
          >
            <Icon
              className={`w-4 h-4 transition-colors ${
                isActive ? "text-amber-400" : "text-forest-700"
              }`}
            />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
