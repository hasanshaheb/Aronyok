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
  const { language, t } = useLanguage();
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
      label: isBn ? "মাটির শিল্প ও পাত্র" : "Gardening & Pots",
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
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 border ${
              isActive
                ? "bg-forest-800 text-white border-forest-800 shadow-soft-sm scale-[1.02]"
                : "bg-white text-forest-900/85 border-forest-100 hover:bg-cream-100/70 hover:border-forest-200"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive ? "text-emerald-300" : "text-forest-600"
              }`}
            />
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
