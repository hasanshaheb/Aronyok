"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { useCart } from "../../../context/CartContext";
import { fallbackProducts } from "../../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";
import { Product } from "../../../lib/types";
import { formatCurrency, toBengaliNumerals } from "../../../lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { language, t, localize } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      // Check fallback first
      const foundFallback = fallbackProducts.find((p) => p.slug === slug);
      if (foundFallback) {
        setProduct(foundFallback);
      }

      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from("products")
            .select("*")
            .eq("slug", slug)
            .single();

          if (data) {
            setProduct(data);
          }
        } catch {
          // Keep fallback
        }
      }
    }
    loadProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-forest-900">
          {language === "bn" ? "পণ্যটি পাওয়া যায়নি" : "Product Not Found"}
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-bold text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "bn" ? "দোকানে ফিরে যান" : "Return to Shop"}</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumb / Back Link */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === "bn" ? "সকল পণ্যে ফিরুন" : "Back to Catalog"}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image Frame */}
        <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-stone-100 border border-forest-100 shadow-soft-md">
          <Image
            src={product.image_url}
            alt={localize(product.name)}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-forest-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        {/* Product Details & Actions */}
        <div className="space-y-6">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              {t.storefront.inStock}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight leading-snug">
              {localize(product.name)}
            </h1>
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-3xl font-extrabold text-forest-900">
                {formatCurrency(product.price, language)}
              </span>
              {product.compare_at_price && (
                <span className="text-base text-stone-400 line-through">
                  {formatCurrency(product.compare_at_price, language)}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-b border-forest-100 py-4">
            <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2">
              {language === "bn" ? "বিবরণ ও কার্যকারিতা" : "Description & Botanical Notes"}
            </h3>
            <p className="text-sm text-forest-800/80 leading-relaxed whitespace-pre-line">
              {localize(product.description)}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                {t.cart.quantity}:
              </span>
              <div className="flex items-center border border-forest-200 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-forest-700 hover:bg-forest-50 rounded-l-xl transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-bold text-forest-900">
                  {language === "bn" ? toBengaliNumerals(quantity) : quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-forest-700 hover:bg-forest-50 rounded-r-xl transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl text-sm font-bold shadow-soft-sm transition-all duration-200 ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-forest-700 hover:bg-forest-800 text-white hover:shadow-soft-md"
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{language === "bn" ? "ঝুড়িতে যুক্ত হয়েছে" : "Added to Basket"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.storefront.addToCart}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-earth-700 hover:bg-earth-800 text-white text-sm font-bold shadow-soft-sm transition-colors"
              >
                {language === "bn" ? "এখনই কিনুন" : "Buy Now (Direct Checkout)"}
              </button>
            </div>
          </div>

          {/* Assurances */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-cream-50 border border-forest-100 flex items-center gap-2 text-xs font-semibold text-forest-800">
              <Leaf className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>100% Organic Origin</span>
            </div>
            <div className="p-3 rounded-xl bg-cream-50 border border-forest-100 flex items-center gap-2 text-xs font-semibold text-forest-800">
              <Truck className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>Safe Nationwide Delivery</span>
            </div>
            <div className="p-3 rounded-xl bg-cream-50 border border-forest-100 flex items-center gap-2 text-xs font-semibold text-forest-800">
              <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>Purity Assured</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
