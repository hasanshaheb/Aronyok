"use client";

import React, { useState } from "react";
import { Sparkles, Sun, Layers, ArrowRight } from "lucide-react";
import HerbalRemedyTool from "../../components/tools/HerbalRemedyTool";
import SunlightWaterTool from "../../components/tools/SunlightWaterTool";
import SoilMixerTool from "../../components/tools/SoilMixerTool";
import { useLanguage } from "../../context/LanguageContext";

export default function ToolsIndexPage() {
  const { language, t } = useLanguage();
  const [activeTool, setActiveTool] = useState<"remedy" | "sunlight" | "soil">("remedy");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>{language === "bn" ? "প্রকৃতি প্রযুক্তি" : "Green Utilities"}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
          {t.tools.title}
        </h1>
        <p className="text-sm text-forest-700/80">{t.tools.subtitle}</p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => setActiveTool("remedy")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
            activeTool === "remedy"
              ? "bg-forest-800 text-white shadow-soft-sm scale-[1.02]"
              : "bg-white text-forest-900 border border-forest-200 hover:bg-cream-50"
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t.tools.remedyTitle}</span>
        </button>

        <button
          onClick={() => setActiveTool("sunlight")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
            activeTool === "sunlight"
              ? "bg-forest-800 text-white shadow-soft-sm scale-[1.02]"
              : "bg-white text-forest-900 border border-forest-200 hover:bg-cream-50"
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>{t.tools.sunTitle}</span>
        </button>

        <button
          onClick={() => setActiveTool("soil")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
            activeTool === "soil"
              ? "bg-forest-800 text-white shadow-soft-sm scale-[1.02]"
              : "bg-white text-forest-900 border border-forest-200 hover:bg-cream-50"
          }`}
        >
          <Layers className="w-4 h-4 text-earth-500" />
          <span>{t.tools.soilTitle}</span>
        </button>
      </div>

      {/* Active Interactive Component */}
      <div>
        {activeTool === "remedy" && <HerbalRemedyTool />}
        {activeTool === "sunlight" && <SunlightWaterTool />}
        {activeTool === "soil" && <SoilMixerTool />}
      </div>
    </div>
  );
}
