"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Leaf, ShieldCheck, Heart } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { fallbackDynamicPages } from "../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";
import { DynamicPage } from "../../lib/types";

export default function DynamicPageRoute() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language, localize } = useLanguage();
  const [page, setPage] = useState<DynamicPage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPage() {
      setIsLoading(true);
      // Check fallback first
      const found = fallbackDynamicPages.find((p) => p.slug === slug);
      if (found) setPage(found);

      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase
            .from("dynamic_pages")
            .select("*")
            .eq("slug", slug)
            .eq("is_published", true)
            .single();

          if (data) {
            setPage(data);
          }
        } catch {
          // fallback
        }
      }
      setIsLoading(false);
    }
    loadPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="inline-block w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-forest-950">
          {language === "bn" ? "পৃষ্ঠাটি পাওয়া যায়নি (৪০৪)" : "Page Not Found (404)"}
        </h2>
        <p className="text-sm text-forest-600">
          {language === "bn"
            ? "আপনি যে পৃষ্ঠাটি খুঁজছেন তা মুছে ফেলা হয়েছে অথবা ভুল লিংক দেওয়া হয়েছে।"
            : "The page you are looking for does not exist or has been relocated."}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "bn" ? "হোমে ফিরুন" : "Return to Home"}</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === "bn" ? "মূল পাতায় ফিরুন" : "Back to Home"}</span>
      </Link>

      {/* Header */}
      <div className="space-y-3 border-b border-forest-100 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
          <Leaf className="w-3.5 h-3.5 text-forest-600" />
          <span>Aronyok Living</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-forest-950 tracking-tight">
          {localize(page.page_title)}
        </h1>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-3xl border border-forest-100/90 p-6 sm:p-10 shadow-soft-sm text-forest-900 leading-relaxed text-sm sm:text-base space-y-4">
        <div className="whitespace-pre-line leading-relaxed">
          {localize(page.page_content)}
        </div>
      </div>
    </article>
  );
}
