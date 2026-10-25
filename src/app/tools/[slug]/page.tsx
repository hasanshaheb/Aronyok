"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import HerbalRemedyTool from "../../../components/tools/HerbalRemedyTool";
import SunlightWaterTool from "../../../components/tools/SunlightWaterTool";
import SoilMixerTool from "../../../components/tools/SoilMixerTool";
import { useLanguage } from "../../../context/LanguageContext";

export default function SingleToolPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{language === "bn" ? "সকল টুলসে ফিরুন" : "Back to Eco Tools"}</span>
      </Link>

      {slug === "herbal-remedy-finder" && <HerbalRemedyTool />}
      {slug === "plant-sunlight-advisor" && <SunlightWaterTool />}
      {slug === "soil-compost-ratio" && <SoilMixerTool />}

      {!["herbal-remedy-finder", "plant-sunlight-advisor", "soil-compost-ratio"].includes(slug) && (
        <div className="text-center py-20 bg-white rounded-3xl border border-forest-100 p-8">
          <h2 className="text-xl font-bold text-forest-900">
            {language === "bn" ? "টুলটি পাওয়া যায়নি" : "Tool Not Found"}
          </h2>
          <p className="text-xs text-forest-600 mt-2">
            {language === "bn"
              ? "অনুগ্রহ করে আমাদের টুলস হাব থেকে অন্য কোনো টুল নির্বাচন করুন।"
              : "Please explore our active interactive tools."}
          </p>
        </div>
      )}
    </div>
  );
}
