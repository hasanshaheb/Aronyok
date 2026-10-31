"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Truck,
  Leaf,
  CheckCircle2,
  Sparkles,
  TreePine,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Hero() {
  const { language, t } = useLanguage();

  const isBn = language === "bn";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f1e7]/80 via-[#fdfbf7] to-white py-12 sm:py-20 border-b border-forest-100/60">
      {/* Botanical Organic Background Blurs */}
      <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-forest-200/25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-sage-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -mr-24 w-72 h-72 rounded-full bg-terracotta-100/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Botanical Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100/90 border border-forest-200/80 text-forest-850 text-xs font-bold tracking-wide shadow-soft-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <Sprout className="w-3.5 h-3.5 text-forest-600" />
              <span>
                {isBn
                  ? "আরণ্যক লাইভ নার্সারি ও খাঁটি ভেষজ সম্ভার"
                  : "Aronyok Living Nursery & Pure Forest Harvest"}
              </span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
              {isBn ? (
                <>
                  বাংলার <span className="text-forest-700 underline decoration-sage-400 decoration-wavy decoration-2">সতেজ চারা</span> ও খাঁটি ভেষজের নির্ভরযোগ্য ঠিকানা
                </>
              ) : (
                <>
                  Rooted in Nature, <span className="text-forest-700 underline decoration-sage-400 decoration-wavy decoration-2">Grown with Care</span> for Your Home
                </>
              )}
            </h1>

            {/* Subtitle / Philosophy */}
            <p className="text-sm sm:text-base text-forest-850/80 leading-relaxed font-normal max-w-2xl">
              {isBn
                ? "ছাদবাগান ও আঙিনার জন্য শতভাগ রোগমুক্ত কলম ফলদ চারা, সুন্দরবনের খাঁটি চাকভাঙা মধু, কোল্ড-প্রেসড তেল এবং মৃৎশিল্পীদের তৈরি টেরাকোটা প্ল্যান্টার। অক্ষত চারার নিরাপদ হোম ডেলিভারি।"
                : "Certified disease-free grafted saplings for rooftop gardens, wild mangrove honey, cold-pressed artisanal oils, and handcrafted terracotta planters. Delivered safely to your doorstep."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-soft-md hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <TreePine className="w-4 h-4 text-emerald-300" />
                <span>{isBn ? "চারা ও পণ্য দেখুন" : "Explore Living Store"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100/80 text-forest-850 font-bold text-sm border border-forest-200/80 shadow-soft-sm hover:shadow-soft-md transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-forest-600" />
                <span>{isBn ? "স্মার্ট ইকো টুলস" : "Smart Eco Tools"}</span>
              </Link>
            </div>

            {/* 3 Core Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-forest-200/60 mt-4">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-forest-850">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span>{isBn ? "৪৮ ঘণ্টায় নিরাপদ চারা ডেলিভারি" : "Safe 48h Plant Transit"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-forest-850">
                <div className="w-7 h-7 rounded-lg bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700 flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span>{isBn ? "১০০% খাঁটি ও রোগমুক্ত গ্যারান্টি" : "100% Disease-Free Guarantee"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-forest-850">
                <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span>{isBn ? "বিশেষজ্ঞ রোপণ পরামর্শ" : "Expert Potting Advice"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Botanical Spotlight Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none rounded-3xl bg-white p-3.5 shadow-soft-xl border border-forest-100">
              {/* Botanical Featured Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-forest-50">
                <Image
                  src="https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=900&q=80"
                  alt="Aronyok Botanical Seedling"
                  fill
                  priority
                  unoptimized
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Live Stock & Category Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-3 py-1 rounded-full bg-forest-900/85 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    {isBn ? "🌿 কলম চারা" : "🌿 Grafted Sapling"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 text-white text-[10px] font-bold shadow-sm">
                    {isBn ? "পটিং রেডি" : "Potting Ready"}
                  </span>
                </div>

                {/* Compare Discount Tag */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-terracotta-600 text-white text-[10px] font-extrabold shadow-sm">
                  {isBn ? "২০% ছাড়" : "-20% OFF"}
                </div>

                {/* Bottom Botanical Details Overlay */}
                <div className="absolute inset-x-3 bottom-3 p-3 rounded-xl bg-forest-950/75 backdrop-blur-md text-white flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold leading-tight">
                      {isBn ? "ভিয়েতনামি বারোমাসি মাল্টা চারা" : "Vietnamese All-Season Malta"}
                    </p>
                    <p className="text-[10px] text-sage-200 italic">Citrus sinensis • ২.৫-৩ ফুট</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-cream-50">৳৪৫০</span>
                    <span className="block text-[10px] text-stone-300 line-through">৳৫৫০</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Micro-Bar */}
              <div className="mt-3.5 px-2 flex items-center justify-between text-xs text-forest-850">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-[11px] text-forest-800">
                    {isBn ? "নার্সারি স্টকে সতেজ আছে" : "In Stock at Savar Nursery"}
                  </span>
                </div>

                <Link
                  href="/shop/vietnamese-all-season-malta-seedling"
                  className="inline-flex items-center gap-1 font-bold text-forest-700 hover:text-forest-900 text-xs group"
                >
                  <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Floating Accents */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 items-center gap-2 bg-cream-50 border border-forest-200/80 px-3.5 py-2 rounded-2xl shadow-soft-md text-xs font-bold text-forest-900">
              <Leaf className="w-4 h-4 text-forest-600" />
              <span>{isBn ? "অর্গানিক কোকোপিট মিশ্রিত মাটি" : "Mixed Organic Potting Soil"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
