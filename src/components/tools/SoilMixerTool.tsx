"use client";

import React, { useState } from "react";
import { Sprout, Layers, Calculator, CheckCircle2 } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { toBengaliNumerals } from "../../lib/utils";

export default function SoilMixerTool() {
  const { language } = useLanguage();
  const [potSizeLiters, setPotSizeLiters] = useState<number>(5); // default 8-inch pot (~5L)
  const [plantCategory, setPlantCategory] = useState<"herbs" | "fruiting" | "succulents">("herbs");

  const recipes = {
    herbs: {
      nameEn: "Medicinal Herbs & Greens (e.g. Tulsi, Mint)",
      nameBn: "ঔষধি ভেষজ ও শাকপাতা (যেমন: তুলসী, পুদিনা)",
      soilPct: 50,
      compostPct: 30,
      cocopeatPct: 20,
      tipsEn: "Creates an airy, nutrient-balanced root zone that retains moisture without compacting.",
      tipsBn: "শিকড়ে পর্যাপ্ত বাতাস ও সঠিক আর্দ্রতা বজায় রাখে যাতে মাটি শক্ত না হয়ে যায়।",
    },
    fruiting: {
      nameEn: "Flowering & Fruiting (e.g. Chili, Tomato, Jasmine)",
      nameBn: "ফুল ও ফল গাছ (যেমন: মরিচ, টমেটো, বেলি)",
      soilPct: 40,
      compostPct: 40,
      cocopeatPct: 20,
      tipsEn: "High organic matter content fuels prolific blossom production and steady fruit ripening.",
      tipsBn: "অতিরিক্ত জৈব সার ফুল ও ফলের প্রাচুর্য নিশ্চিত করে।",
    },
    succulents: {
      nameEn: "Succulents & Cacti (e.g. Aloe Vera)",
      nameBn: "রসালো উদ্ভিদ ও ক্যাকটাস (যেমন: ঘৃতকুমারী/অ্যালোভেরা)",
      soilPct: 35,
      compostPct: 20,
      cocopeatPct: 45, // coarse sand / porous peat
      tipsEn: "Ultra-fast draining mix ensures zero moisture stasis around vulnerable roots.",
      tipsBn: "দ্রুত পানি নিষ্কাশন নিশ্চিত করে যাতে শিকড় পচে না যায়।",
    },
  };

  const recipe = recipes[plantCategory];

  const soilAmount = ((potSizeLiters * recipe.soilPct) / 100).toFixed(1);
  const compostAmount = ((potSizeLiters * recipe.compostPct) / 100).toFixed(1);
  const cocopeatAmount = ((potSizeLiters * recipe.cocopeatPct) / 100).toFixed(1);

  const displayNum = (val: string | number) => {
    return language === "bn" ? toBengaliNumerals(val) : val;
  };

  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-md p-6 sm:p-8">
      <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5 text-forest-600" />
          <span>{language === "bn" ? "মাটির অনুপাত মিক্সার" : "Organic Potting Mix Tool"}</span>
        </div>
        <h3 className="text-2xl font-bold text-forest-950">
          {language === "bn"
            ? "টবের মাটির আদর্শ উপাদান পরিমাপক"
            : "Potting Soil & Vermicompost Calculator"}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Inputs */}
        <div className="space-y-5 bg-cream-50/60 p-5 rounded-2xl border border-forest-100">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
              {language === "bn" ? "১. উদ্ভিদের ধরন নির্বাচন করুন" : "1. Plant Category"}
            </label>
            <div className="space-y-2">
              {[
                { id: "herbs", label: recipe.nameBn, labelEn: recipes.herbs.nameEn },
                { id: "fruiting", label: recipes.fruiting.nameBn, labelEn: recipes.fruiting.nameEn },
                { id: "succulents", label: recipes.succulents.nameBn, labelEn: recipes.succulents.nameEn },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setPlantCategory(item.id as any)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition-all ${
                    plantCategory === item.id
                      ? "bg-forest-800 text-white border-forest-800"
                      : "bg-white text-forest-900 border-forest-200 hover:bg-forest-50"
                  }`}
                >
                  {language === "bn" ? item.label : item.labelEn}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
              {language === "bn" ? "২. টবের আকার / ভলিউম" : "2. Pot Container Size"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "6\" (2 Liters)", val: 2 },
                { label: "8\" (5 Liters)", val: 5 },
                { label: "10\" (9 Liters)", val: 9 },
                { label: "12\" (15 Liters)", val: 15 },
              ].map((pot) => (
                <button
                  key={pot.val}
                  onClick={() => setPotSizeLiters(pot.val)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    potSizeLiters === pot.val
                      ? "bg-forest-800 text-white border-forest-800"
                      : "bg-white text-forest-800 border-forest-200 hover:bg-forest-50"
                  }`}
                >
                  {pot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output Calculations */}
        <div className="lg:col-span-2 bg-[#fbf9f4] rounded-2xl border border-forest-200/80 p-6 space-y-6">
          <h4 className="text-sm font-bold uppercase tracking-wider text-forest-900 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-forest-600" />
            <span>
              {language === "bn"
                ? `প্রস্তাবিত অনুপাত (${displayNum(potSizeLiters)} লিটার টবের জন্য)`
                : `Recommended Mix for ${displayNum(potSizeLiters)} Liters Pot`}
            </span>
          </h4>

          {/* Visual Percentage Bar */}
          <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner border border-stone-200">
            <div
              style={{ width: `${recipe.soilPct}%` }}
              className="bg-earth-700 flex items-center justify-center text-[10px] text-white font-bold"
              title="Garden Soil"
            >
              {displayNum(recipe.soilPct)}%
            </div>
            <div
              style={{ width: `${recipe.compostPct}%` }}
              className="bg-forest-600 flex items-center justify-center text-[10px] text-white font-bold"
              title="Vermicompost"
            >
              {displayNum(recipe.compostPct)}%
            </div>
            <div
              style={{ width: `${recipe.cocopeatPct}%` }}
              className="bg-earth-400 flex items-center justify-center text-[10px] text-white font-bold"
              title="Coco-Peat"
            >
              {displayNum(recipe.cocopeatPct)}%
            </div>
          </div>

          {/* Breakdown cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white border border-earth-300">
              <span className="text-[10px] font-bold text-earth-800 uppercase tracking-wider">
                {language === "bn" ? "দোআঁশ মাটি" : "Garden Loam"}
              </span>
              <p className="text-xl font-extrabold text-forest-950 mt-1">
                {displayNum(soilAmount)}{" "}
                <span className="text-xs font-semibold">{language === "bn" ? "লিটার" : "L"}</span>
              </p>
              <p className="text-[11px] text-stone-500">{displayNum(recipe.soilPct)}% of mix</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-forest-300">
              <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider">
                {language === "bn" ? "কেঁচো সার (ভার্মি)" : "Vermicompost"}
              </span>
              <p className="text-xl font-extrabold text-forest-950 mt-1">
                {displayNum(compostAmount)}{" "}
                <span className="text-xs font-semibold">{language === "bn" ? "লিটার" : "L"}</span>
              </p>
              <p className="text-[11px] text-stone-500">{displayNum(recipe.compostPct)}% of mix</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-earth-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                {language === "bn" ? "কোকোপিট / বালি" : "Coco-Peat / Sand"}
              </span>
              <p className="text-xl font-extrabold text-forest-950 mt-1">
                {displayNum(cocopeatAmount)}{" "}
                <span className="text-xs font-semibold">{language === "bn" ? "লিটার" : "L"}</span>
              </p>
              <p className="text-[11px] text-stone-500">{displayNum(recipe.cocopeatPct)}% of mix</p>
            </div>
          </div>

          {/* Expert tip */}
          <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-200/80">
            <p className="text-xs text-forest-900 leading-relaxed font-medium">
              🌱 {language === "bn" ? recipe.tipsBn : recipe.tipsEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
