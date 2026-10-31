"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Check, Sprout, AlertCircle } from "lucide-react";
import { Product } from "../../lib/types";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { formatCurrency, toBengaliNumerals } from "../../lib/utils";
import { trackEvent } from "../../lib/analytics/events";

export default function ProductCard({ product }: { product: Product }) {
  const { language, t, localize } = useLanguage();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(
    product.image_url ||
      "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
  );

  const isBn = language === "bn";
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product, 1);
    setIsAdded(true);

    trackEvent("AddToCart", {
      content_name: product.name.en || product.name.bn,
      content_category: product.category,
      content_ids: [product.id],
      value: product.price,
      currency: "BDT",
    });

    setTimeout(() => setIsAdded(false), 1600);
  };

  const discountPercent =
    product.compare_at_price && product.compare_at_price > product.price
      ? Math.round(
          ((product.compare_at_price - product.price) /
            product.compare_at_price) *
            100
        )
      : 0;

  // Botanical badge label
  const botanicalBadge =
    product.propagation_method ||
    (product.category === "plants"
      ? isBn
        ? "কলম চারা"
        : "Live Sapling"
      : product.category === "honey"
      ? isBn
        ? "সুন্দরবনের খাঁটি মধু"
        : "Wild Mangrove Honey"
      : product.category === "herbs"
      ? isBn
        ? "ভেষজ উপাদান"
        : "Therapeutic Herb"
      : product.category);

  return (
    <div className="group flex flex-col bg-white rounded-3xl border border-forest-100/90 overflow-hidden shadow-soft-sm hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300">
      {/* Product Image Frame */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden block"
      >
        <Image
          src={imgSrc}
          alt={localize(product.name)}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
            )
          }
        />

        {/* Botanical / Category Pill */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
          {product.category === "plants" && <Sprout className="w-3 h-3 text-emerald-300" />}
          <span>{botanicalBadge}</span>
        </span>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-terracotta-600 text-white text-[10px] font-extrabold shadow-sm">
            -{discountPercent}%
          </span>
        )}

        {/* Stock Alert Overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-xl bg-white text-forest-950 font-bold text-xs shadow-md">
              {isBn ? "স্টক শেষ" : "Out of Stock"}
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
            <AlertCircle className="w-3 h-3" />
            <span>
              {isBn
                ? `মাত্র ${toBengaliNumerals(product.stock)}টি বাকি`
                : `Only ${product.stock} left`}
            </span>
          </span>
        ) : (
          <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-forest-800 text-[10px] font-semibold flex items-center gap-1 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{isBn ? "সতেজ মজুদ" : "In Stock"}</span>
          </span>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Scientific Name (if plant) */}
          {product.scientific_name && (
            <p className="text-[11px] text-forest-600/80 italic font-serif">
              {product.scientific_name}
            </p>
          )}

          <Link href={`/shop/${product.slug}`} className="block mt-0.5">
            <h3 className="font-bold text-forest-950 text-base group-hover:text-forest-700 transition-colors line-clamp-2 leading-snug">
              {localize(product.name)}
            </h3>
          </Link>

          <p className="text-xs text-forest-800/70 mt-1.5 line-clamp-2 leading-relaxed">
            {localize(product.description)}
          </p>

          {/* Plant Specification Micro-tags */}
          {(product.plant_height || product.pot_size || product.variety) && (
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {product.variety && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-forest-50 text-forest-700 border border-forest-100 font-medium">
                  {product.variety}
                </span>
              )}
              {product.plant_height && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-sage-50 text-forest-800 border border-sage-200 font-medium">
                  📏 {product.plant_height}
                </span>
              )}
              {product.pot_size && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-cream-100 text-earth-800 border border-earth-200 font-medium">
                  🪴 {product.pot_size}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-forest-100/60 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-extrabold text-forest-900 tracking-tight">
              {formatCurrency(product.price, language)}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-xs text-stone-400 line-through">
                {formatCurrency(product.compare_at_price, language)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
              isOutOfStock
                ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                : isAdded
                ? "bg-emerald-600 text-white"
                : "bg-forest-700 hover:bg-forest-800 text-white hover:shadow-soft-md active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{isBn ? "যোগ হয়েছে" : "Added"}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{isBn ? "ঝুড়িতে নিন" : "Add to Cart"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
