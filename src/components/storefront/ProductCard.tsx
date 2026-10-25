"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Eye } from "lucide-react";
import { Product } from "../../lib/types";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const { language, t, localize } = useLanguage();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0;

  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-forest-100/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden"
      >
        <Image
          src={product.image_url}
          alt={localize(product.name)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
          {product.category}
        </span>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-earth-600 text-white text-[10px] font-extrabold shadow-sm">
            -{discountPercent}%
          </span>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="font-bold text-forest-950 text-base group-hover:text-forest-700 transition-colors line-clamp-2">
              {localize(product.name)}
            </h3>
          </Link>
          <p className="text-xs text-forest-850/70 mt-1.5 line-clamp-2 leading-relaxed">
            {localize(product.description)}
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-forest-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-forest-900">
              {formatCurrency(product.price, language)}
            </span>
            {product.compare_at_price && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.compare_at_price, language)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-forest-700 hover:bg-forest-800 text-white hover:shadow-soft-md"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "যোগ হয়েছে" : "Added"}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.storefront.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
