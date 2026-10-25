"use client";

import React from "react";
import { useLanguage } from "../../context/LanguageContext";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const { t } = useLanguage();

  const categories = [
    { id: "all", label: t.storefront.allCategories },
    { id: "herbs", label: t.storefront.categoryHerbs },
    { id: "honey", label: t.storefront.categoryHoney },
    { id: "plants", label: t.storefront.categoryPlants },
    { id: "wellness", label: t.storefront.categoryWellness },
    { id: "gardening", label: t.storefront.categoryGardening },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shadow-sm ${
              isActive
                ? "bg-forest-800 text-white shadow-soft-sm scale-[1.02]"
                : "bg-white text-forest-900/80 border border-forest-100 hover:bg-cream-100 hover:border-forest-200"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
