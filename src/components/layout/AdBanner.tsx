"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { CampaignBanner } from "../../lib/types";

export default function AdBanner() {
  const { language, localize } = useLanguage();
  const [bannerHtml, setBannerHtml] = useState<string>("");
  const [activeCampaign, setActiveCampaign] = useState<CampaignBanner | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

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
          if (data.active_campaign) {
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

  // 1. Render Dynamic Active Campaign if available
  if (activeCampaign && activeCampaign.is_active) {
    const message = language === "bn"
      ? (activeCampaign.content?.bn || activeCampaign.content?.en)
      : (activeCampaign.content?.en || activeCampaign.content?.bn);

    const badge = language === "bn"
      ? (activeCampaign.badge_text?.bn || activeCampaign.badge_text?.en)
      : (activeCampaign.badge_text?.en || activeCampaign.badge_text?.bn);

    return (
      <div className="relative w-full bg-forest-900 text-cream-100 py-2 px-4 sm:px-8 border-b border-forest-800 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2.5 text-xs text-center pr-6">
          {badge && (
            <span className="inline-flex items-center gap-1 bg-forest-700/80 text-mint-200 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-forest-600/50">
              <Sparkles className="w-3 h-3 text-mint-300" />
              <span>{badge}</span>
            </span>
          )}
          <span className="font-medium text-cream-50 leading-tight">
            {message}
          </span>
          {activeCampaign.link_url && (
            <Link
              href={activeCampaign.link_url}
              className="inline-flex items-center gap-1 font-bold text-mint-300 hover:text-white underline underline-offset-2 ml-1 transition-colors"
            >
              <span>{language === "bn" ? "অর্ডার করুন" : "Shop now"}</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-forest-300 hover:text-white transition-colors"
          title="Dismiss"
          aria-label="Dismiss banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  // 2. Fallback to HTML banner
  if (!bannerHtml || bannerHtml.trim() === "") return null;

  return (
    <div
      className="aronyok-top-banner w-full"
      dangerouslySetInnerHTML={{ __html: bannerHtml }}
    />
  );
}
