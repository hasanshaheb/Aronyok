"use client";

import React from "react";
import Link from "next/link";
import { Sprout, Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Leaf } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Hero() {
  const { language, t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-[#f9f6ef] to-[#fdfbf7] py-16 sm:py-24 border-b border-forest-100/60">
      {/* Decorative nature background elements */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-forest-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-earth-200/25 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-100/80 border border-forest-200 text-forest-800 text-xs font-bold tracking-wide uppercase shadow-soft-sm">
            <Sprout className="w-4 h-4 text-forest-600" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-tight">
            {t.hero.title}
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-forest-900/80 leading-relaxed font-normal max-w-2xl mx-auto">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-soft-md hover:shadow-soft-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{t.hero.shopBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/tools"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-forest-800 font-bold text-sm border border-forest-200 shadow-soft-sm hover:shadow-soft-md transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-forest-600" />
              <span>{t.hero.toolsBtn}</span>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 border-t border-forest-200/60 mt-10">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-forest-800">
              <ShieldCheck className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>{t.hero.trust1}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-forest-800">
              <Leaf className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>{t.hero.trust2}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-forest-800">
              <HeartHandshake className="w-4 h-4 text-forest-600 flex-shrink-0" />
              <span>{t.hero.trust3}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
