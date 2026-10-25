"use client";

import React, { useEffect, useState } from "react";
import { fallbackSettings } from "../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";

export default function AdBanner() {
  const [bannerHtml, setBannerHtml] = useState<string>(
    fallbackSettings.ad_banner_top_html || ""
  );

  useEffect(() => {
    async function loadBanner() {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = await res.json();
          if (data?.ad_banner_top_html !== undefined) {
            setBannerHtml(data.ad_banner_top_html);
            return;
          }
        }
      } catch {}

      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from("settings")
            .select("ad_banner_top_html")
            .limit(1)
            .single();

          if (data?.ad_banner_top_html !== undefined) {
            setBannerHtml(data.ad_banner_top_html);
          }
        } catch {}
      }
    }
    loadBanner();
  }, []);

  if (!bannerHtml || bannerHtml.trim() === "") return null;

  return (
    <div
      className="aronyok-top-banner w-full"
      dangerouslySetInnerHTML={{ __html: bannerHtml }}
    />
  );
}
