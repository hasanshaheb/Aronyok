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
  Star,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Hero() {
  const { language, t } = useLanguage();
  const isBn = language === "bn";

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1E7]/90 via-[#FDFBF7] to-white py-14 sm:py-24 border-b border-forest-100/70">
      {/* Botanical Organic Background Blurs */}
      <div className="absolute top-0 right-1/4 -mt-24 w-96 h-96 rounded-full bg-forest-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-sage-200/25 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-4 -mr-20 w-80 h-80 rounded-full bg-terracotta-100/35 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Botanical Dual-Tone Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-forest-200 text-forest-900 text-xs font-bold tracking-wide shadow-soft-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Sprout className="w-3.5 h-3.5 text-forest-700" />
              <span>
                {isBn
                  ? "আরণ্যক নার্সারি ও খাঁটি বনাঞ্চল সম্ভার"
                  : "Aronyok Living Nursery & Forest Apothecary"}
              </span>
            </div>

            {/* Main Editorial Headline with Vibrant Terracotta Accents */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.14]">
              {isBn ? (
                <>
                  বাংলার{" "}
                  <span className="text-terracotta-600 underline decoration-terracotta-400 decoration-wavy decoration-2">
                    সতেজ চারা
                  </span>{" "}
                  ও খাঁটি ভেষজের নির্ভরযোগ্য ঠিকানা
                </>
              ) : (
                <>
                  Rooted in Nature,{" "}
                  <span className="text-terracotta-600 underline decoration-terracotta-400 decoration-wavy decoration-2">
                    Grown with Care
                  </span>{" "}
                  for Your Home
                </>
              )}
            </h1>

            {/* Subtitle / Botanical Philosophy */}
            <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed font-normal max-w-2xl">
              {isBn
                ? "ছাদবাগান ও আঙিনার জন্য শতভাগ রোগমুক্ত কলম ফলদ চারা, সুন্দরবনের প্রাকৃতিক চাকভাঙা মধু, কাঠের ঘানিতে ভাঙা তেল এবং ঐতিহ্যবাহী মৃৎশিল্পীদের তৈরি টেরাকোটা পাত্র। অক্ষত চারা পৌঁছানোর নিশ্চিত গ্যারান্টি।"
                : "Certified disease-free grafted fruit saplings, wild raw mangrove honey, artisanal cold-pressed oils, and terracotta planters hand-crafted in rural Bengal. Safely packaged for live transit."}
            </p>

            {/* CTA Buttons: Vibrant Terracotta + Deep Forest Contrast */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-[#d46d3e] hover:from-terracotta-700 hover:to-terracotta-600 text-white font-extrabold text-sm shadow-terracotta-md hover:shadow-terracotta-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <TreePine className="w-4 h-4 text-cream-100" />
                <span>{isBn ? "চারা ও পণ্য দেখুন" : "Explore Living Store"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-white hover:bg-cream-100 text-forest-900 font-bold text-sm border-2 border-forest-800/80 shadow-soft-sm hover:shadow-soft-md transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isBn ? "স্মার্ট ইকো টুলস" : "Smart Eco Tools"}</span>
              </Link>
            </div>

            {/* 3 Core Trust Badges with Vibrant Color Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-forest-200/60 mt-4">
              <div className="flex items-center gap-2.5 text-xs font-semibold text-forest-950">
                <div className="w-8 h-8 rounded-xl bg-forest-100 border border-forest-200 flex items-center justify-center text-forest-800 flex-shrink-0 shadow-xs">
                  <Truck className="w-4 h-4 text-forest-700" />
                </div>
                <span>{isBn ? "৪৮ ঘণ্টায় নিরাপদ চারা ডেলিভারি" : "Safe 48h Plant Transit"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-forest-950">
                <div className="w-8 h-8 rounded-xl bg-terracotta-100 border border-terracotta-200 flex items-center justify-center text-terracotta-700 flex-shrink-0 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-terracotta-600" />
                </div>
                <span>{isBn ? "১০০% খাঁটি ও রোগমুক্ত গ্যারান্টি" : "100% Disease-Free Guarantee"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs font-semibold text-forest-950">
                <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 flex-shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" />
                </div>
                <span>{isBn ? "বিশেষজ্ঞ রোপণ পরামর্শ" : "Expert Potting Advice"}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Collector's Botanical Spotlight Card (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm lg:max-w-none rounded-3xl bg-white p-3.5 shadow-soft-xl border border-forest-200/70">
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
                  <span className="px-3 py-1 rounded-full bg-forest-900/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sprout className="w-3 h-3 text-emerald-300" />
                    <span>{isBn ? "কলম চারা" : "Grafted Plant"}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-[10px] font-bold shadow-sm">
                    {isBn ? "পটিং রেডি" : "Potting Ready"}
                  </span>
                </div>

                {/* Vibrant Terracotta Discount Seal */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-terracotta-600 text-white text-[10px] font-extrabold shadow-terracotta-sm">
                  {isBn ? "২০% ছাড়" : "-20% OFF"}
                </div>

                {/* Bottom Botanical Details Overlay */}
                <div className="absolute inset-x-3 bottom-3 p-3.5 rounded-xl bg-forest-950/80 backdrop-blur-md text-white flex items-center justify-between border border-white/10 shadow-lg">
                  <div>
                    <p className="text-xs font-bold leading-tight text-cream-50">
                      {isBn ? "ভিয়েতনামি বারোমাসি মাল্টা চারা" : "Vietnamese All-Season Malta"}
                    </p>
                    <p className="text-[10px] text-sage-300 italic">Citrus sinensis • ২.৫-৩ ফুট</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-amber-300">৳৪৫০</span>
                    <span className="block text-[10px] text-stone-300 line-through">৳৫৫০</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Micro-Bar */}
              <div className="mt-3.5 px-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-bold text-[11px] text-forest-900">
                    {isBn ? "নার্সারি স্টকে সতেজ আছে" : "In Stock at Savar Nursery"}
                  </span>
                </div>

                <Link
                  href="/shop/vietnamese-malta-plant"
                  className="inline-flex items-center gap-1 font-bold text-terracotta-600 hover:text-terracotta-700 text-xs group"
                >
                  <span>{isBn ? "বিস্তারিত দেখুন" : "View Plant"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Floating Accents */}
            <div className="hidden sm:flex absolute -bottom-5 -left-4 items-center gap-2 bg-[#F5F1E7] border border-forest-200 px-4 py-2 rounded-2xl shadow-soft-md text-xs font-bold text-forest-950">
              <Leaf className="w-4 h-4 text-forest-700" />
              <span>{isBn ? "অর্গানিক কোকোপিট মিশ্রিত মাটি" : "Enriched Organic Potting Mix"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
