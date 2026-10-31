"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Leaf,
  Sun,
  Droplets,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Share2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { Product } from "../../lib/types";
import { formatCurrency, toBengaliNumerals } from "../../lib/utils";

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const router = useRouter();
  const { language, t, localize } = useLanguage();
  const { addToCart } = useCart();

  const [quantity, setQuantity] = useState(1);
  const defaultImg = product.image_url || "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80";
  const [selectedImage, setSelectedImage] = useState(defaultImg);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "guarantee">("details");

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  const galleryImages = [
    product.image_url,
    ...(product.gallery_images || []),
  ].filter(Boolean);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    router.push("/cart");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "bn" ? "← সকল প্রাকৃতিক পণ্যে ফিরুন" : "← Back to Earth Catalog"}</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-forest-100 text-forest-900 capitalize">
            {product.category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-stone-100 border border-forest-100 shadow-soft-sm">
            <Image
              src={selectedImage || defaultImg}
              alt={localize(product.name)}
              fill
              priority
              unoptimized
              className="object-cover"
            />
            {product.is_featured && (
              <span className="absolute top-4 left-4 bg-terracotta-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                {language === "bn" ? "সেরা পছন্দ" : "Curator Choice"}
              </span>
            )}
            {isOutOfStock ? (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="px-5 py-2.5 rounded-2xl bg-white text-forest-950 font-bold text-sm shadow-xl">
                  {language === "bn" ? "স্টক শেষ (Out of Stock)" : "Currently Out of Stock"}
                </span>
              </div>
            ) : isLowStock ? (
              <span className="absolute bottom-4 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>
                  {language === "bn"
                    ? `মাত্র ${toBengaliNumerals(product.stock)}টি বাকি!`
                    : `Only ${product.stock} units left!`}
                </span>
              </span>
            ) : null}
          </div>

          {/* Thumbnails if gallery has multiple */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? "border-forest-700 shadow-md scale-102"
                      : "border-forest-100 opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="Thumbnail" fill unoptimized className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Botanical Spec Quick Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-cream-50/80 rounded-2xl border border-forest-100 text-center space-y-1">
              <Sun className="w-4 h-4 mx-auto text-amber-600" />
              <p className="text-[10px] uppercase font-bold text-forest-700 tracking-wider">
                {language === "bn" ? "সূর্যালোক" : "Sunlight"}
              </p>
              <p className="text-xs font-semibold text-forest-950">
                {product.sunlight || (language === "bn" ? "পূর্ণ রোদ" : "Full Sun")}
              </p>
            </div>
            <div className="p-3 bg-cream-50/80 rounded-2xl border border-forest-100 text-center space-y-1">
              <Droplets className="w-4 h-4 mx-auto text-blue-600" />
              <p className="text-[10px] uppercase font-bold text-forest-700 tracking-wider">
                {language === "bn" ? "পানি সেচ" : "Watering"}
              </p>
              <p className="text-xs font-semibold text-forest-950">
                {product.watering || (language === "bn" ? "নিয়মিত" : "Regular")}
              </p>
            </div>
            <div className="p-3 bg-cream-50/80 rounded-2xl border border-forest-100 text-center space-y-1">
              <Sprout className="w-4 h-4 mx-auto text-emerald-600" />
              <p className="text-[10px] uppercase font-bold text-forest-700 tracking-wider">
                {language === "bn" ? "রোপণ মাধ্যম" : "Propagation"}
              </p>
              <p className="text-xs font-semibold text-forest-950">
                {product.propagation_method || (language === "bn" ? "কলম চারা" : "Grafted")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Botanical Info, Pricing, Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2 border-b border-forest-100 pb-5">
            {product.scientific_name && (
              <p className="text-xs italic font-serif text-forest-700/80 tracking-wide">
                Botanical: {product.scientific_name}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
              {localize(product.name)}
            </h1>
            <p className="text-xs font-bengali text-forest-700 font-medium">
              {product.name.bn}
            </p>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-forest-950">
                {formatCurrency(product.price, language)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-base text-stone-400 line-through font-semibold">
                  {formatCurrency(product.compare_at_price, language)}
                </span>
              )}
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Description Preview */}
          <div className="text-xs sm:text-sm text-forest-800 leading-relaxed space-y-2">
            <p>{localize(product.description)}</p>
          </div>

          {/* Quantity Selector & Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-2xl bg-cream-50 border border-forest-200 p-1">
                <button
                  type="button"
                  disabled={quantity <= 1 || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-xl text-forest-800 hover:bg-forest-100 disabled:opacity-30 cursor-pointer"
                  title="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-extrabold text-forest-950 font-mono">
                  {language === "bn" ? toBengaliNumerals(quantity) : quantity}
                </span>
                <button
                  type="button"
                  disabled={quantity >= product.stock || isOutOfStock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-2 rounded-xl text-forest-800 hover:bg-forest-100 disabled:opacity-30 cursor-pointer"
                  title="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-forest-700">
                <span className="font-semibold">
                  {language === "bn" ? "মোট: " : "Subtotal: "}
                </span>
                <span className="font-extrabold text-forest-950">
                  {formatCurrency(product.price * quantity, language)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-soft-sm transition-all cursor-pointer ${
                  isAdded
                    ? "bg-emerald-600 text-white"
                    : "bg-forest-800 hover:bg-forest-900 text-white"
                } disabled:opacity-50`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === "bn" ? "কার্টে যোগ করা হয়েছে!" : "Added to Cart!"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t.storefront.addToCart}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{language === "bn" ? "সরাসরি অর্ডার করুন" : "Buy It Now"}</span>
              </button>
            </div>
          </div>

          {/* Plant Care & Guarantee Tabs */}
          <div className="border border-forest-100 rounded-2xl overflow-hidden mt-6 bg-white">
            <div className="flex border-b border-forest-100 bg-cream-50/60 text-xs font-bold text-forest-800">
              <button
                onClick={() => setActiveTab("details")}
                className={`flex-1 py-2.5 text-center cursor-pointer transition-colors ${
                  activeTab === "details" ? "bg-white text-forest-950 border-b-2 border-forest-700 font-extrabold" : "hover:text-forest-950"
                }`}
              >
                {language === "bn" ? "বৈশিষ্ট্য" : "Specs"}
              </button>
              <button
                onClick={() => setActiveTab("care")}
                className={`flex-1 py-2.5 text-center cursor-pointer transition-colors ${
                  activeTab === "care" ? "bg-white text-forest-950 border-b-2 border-forest-700 font-extrabold" : "hover:text-forest-950"
                }`}
              >
                {language === "bn" ? "যত্ন ও পরিচর্যা" : "Care Guide"}
              </button>
              <button
                onClick={() => setActiveTab("guarantee")}
                className={`flex-1 py-2.5 text-center cursor-pointer transition-colors ${
                  activeTab === "guarantee" ? "bg-white text-forest-950 border-b-2 border-forest-700 font-extrabold" : "hover:text-forest-950"
                }`}
              >
                {language === "bn" ? "নিরাপদ প্যাকেজিং" : "Delivery Guarantee"}
              </button>
            </div>

            <div className="p-4 text-xs text-forest-800 leading-relaxed space-y-2">
              {activeTab === "details" && (
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{language === "bn" ? "প্রাকৃতিক ও রাসায়নিকমুক্তভাবে লালিত চারা" : "100% Organically cultivated native variety"}</li>
                  <li>{language === "bn" ? "টব বা সরাসরি বাগানের মাটিতে রোপণ উপযোগী" : "Suitable for balcony containers or ground orchard"}</li>
                  <li>{language === "bn" ? "সতেজ শিকড়সহ মজবুত প্যাকেজিংয়ে সরবরাহ" : "Dispatched with rootball moisture lock"}</li>
                </ul>
              )}
              {activeTab === "care" && (
                <p>
                  {language === "bn"
                    ? "চারাটি পাওয়ার পর প্রথম ২ দিন সরাসরি কড়া রোদ থেকে দূরে ছায়াযুক্ত স্থানে রাখুন এবং হালকা পানি দিন। এরপর টবে জৈব সারমিশ্রিত মাটিতে প্রতিস্থাপন করুন।"
                    : "Place the seedling in a shaded, well-ventilated spot for 48 hours after unboxing and water gently before transplanting into your planter."}
                </p>
              )}
              {activeTab === "guarantee" && (
                <div className="flex items-start gap-2.5 text-forest-800">
                  <Truck className="w-4 h-4 shrink-0 text-emerald-700 mt-0.5" />
                  <p>
                    {language === "bn"
                      ? "পরিবহনকালীন চারা বা পাত্রের কোনো ক্ষতি হলে আমরা ৪৮ ঘণ্টার মধ্যে বিনামূল্যে প্রতিস্থাপন বা পূর্ণ মূল্য ফেরত নিশ্চিত করি।"
                      : "Aronyok Plant Arrival Guarantee: If your plant arrives damaged during transit, notify us within 48 hours for immediate replacement."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
