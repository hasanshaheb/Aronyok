"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, Truck } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { CampaignBanner } from "../../lib/types";

export default function AdBanner() {
  const { language, localize } = useLanguage();
  const [bannerHtml, setBannerHtml] = useState<string>("");
  const [activeCampaign, setActiveCampaign] = useState<CampaignBanner | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  const isBn = language === "bn";

  useEffect(() => {
    // Check if dismissed in sessionStorage
    if (typeof window !== "undefined") {
      const dismissed = sessionStorage.getItem("aronyok_banner_dismissed");
      if (dismissed) setIsDismissed(true);
    }

    async function loadBanner() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data.active_campaign && data.active_campaign.is_active) {
            setActiveCampaign(data.active_campaign);
          } else if (data.ad_banner_top_html) {
            setBannerHtml(data.ad_banner_top_html);
          }
        }
      } catch {}
    }
    loadBanner();
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem("aronyok_banner_dismissed", "true");
    } catch {}
  };

  if (isDismissed) return null;

  // 1. Dynamic Active Campaign from Campaign Manager
  if (activeCampaign && activeCampaign.is_active) {
    const message =
      typeof activeCampaign.content === "object"
        ? localize(activeCampaign.content)
        : activeCampaign.content;

    const badge =
      typeof activeCampaign.badge_text === "object"
        ? localize(activeCampaign.badge_text)
        : activeCampaign.badge_text;

    return (
      <aside
        aria-label="Promotional announcement"
        className="relative w-full bg-forest-900 text-cream-100 py-2 px-4 sm:px-8 border-b border-forest-800/80 transition-all z-50 text-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-center pr-6 flex-wrap">
          {badge && (
            <span className="inline-flex items-center gap-1 bg-terracotta-500 text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              <Sparkles className="w-3 h-3 text-cream-100" />
              <span>{badge}</span>
            </span>
          )}

          <span className="font-medium text-cream-50 leading-tight">
            {message}
          </span>

          {activeCampaign.link_url && (
            <Link
              href={activeCampaign.link_url}
              className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white underline underline-offset-2 ml-1 transition-colors"
            >
              <span>{isBn ? "অর্ডার করুন" : "Shop now"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-forest-300 hover:text-white hover:bg-forest-800 rounded-lg transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  // 2. Custom HTML Banner from CMS Settings (Wrapped in luxury dismissible frame)
  if (bannerHtml && bannerHtml.trim() !== "") {
    return (
      <aside
        aria-label="Promotional announcement"
        className="relative w-full bg-forest-900 text-cream-100 border-b border-forest-800/80 transition-all z-50 text-xs py-1.5 px-4"
      >
        <div
          className="aronyok-top-banner max-w-7xl mx-auto text-center pr-6"
          dangerouslySetInnerHTML={{ __html: bannerHtml }}
        />
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-forest-300 hover:text-white hover:bg-forest-800 rounded-lg transition-colors"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </aside>
    );
  }

  // 3. Default Signature Nursery Announcement
  return (
    <aside
      aria-label="Nursery delivery offer"
      className="relative w-full bg-forest-900 text-cream-100 py-1.5 px-4 border-b border-forest-800/80 transition-all z-50 text-[11px]"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between pr-6">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full bg-terracotta-500 text-white font-bold text-[9px] uppercase tracking-wider shadow-xs">
            {isBn ? "বিশেষ অফার" : "Special Offer"}
          </span>
          <span className="text-cream-100 hidden sm:inline font-medium">
            {isBn
              ? "১৫০০ টাকার অর্ডারে দেশজুড়ে ফ্রি ভেন্টিলেটেড প্যাকেজিং ও চারা ডেলিভারি!"
              : "Free ventilated courier shipping across Bangladesh on orders over ৳1500!"}
          </span>
          <span className="text-cream-100 sm:hidden font-medium">
            {isBn ? "১৫০০ টাকায় ফ্রি ডেলিভারি!" : "Free delivery over ৳1500!"}
          </span>
        </div>

        <div className="flex items-center gap-3.5 text-forest-200">
          <span className="text-amber-400 font-bold hidden md:inline">
            {isBn ? "কুপন: WELCOME10 (১০% ছাড়)" : "Coupon: WELCOME10 (10% Off)"}
          </span>
          <span className="text-forest-700 hidden md:inline">|</span>
          <Link
            href="/order-tracking"
            className="hover:text-cream-50 transition-colors flex items-center gap-1 font-semibold"
          >
            <Truck className="w-3 h-3 text-terracotta-400" />
            <span>{isBn ? "পার্সেল ট্র্যাক" : "Track Order"}</span>
          </Link>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-forest-300 hover:text-white hover:bg-forest-800 rounded-lg transition-colors"
        title="Dismiss announcement"
        aria-label="Dismiss announcement"
      >
        <X className="w-3 h-3" />
      </button>
    </aside>
  );
}
