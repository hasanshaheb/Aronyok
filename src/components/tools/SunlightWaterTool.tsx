"use client";

import React, { useState } from "react";
import { Sun, Droplets, Compass, Sprout, Info } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface PlantProfile {
  id: string;
  nameEn: string;
  nameBn: string;
  baseSunHours: number;
  waterSummer: string;
  waterWinter: string;
  waterMonsoon: string;
  notesEn: string;
  notesBn: string;
}

const PLANTS: PlantProfile[] = [
  {
    id: "tulsi",
    nameEn: "Krishna / Rama Tulsi",
    nameBn: "কৃষ্ণ / রাম তুলসী",
    baseSunHours: 5,
    waterSummer: "Daily (morning)",
    waterWinter: "Every 2-3 days",
    waterMonsoon: "Only when topsoil is dry",
    notesEn: "Tulsi requires abundant direct sun to synthesize its essential aromatic oils. Avoid waterlogging at all costs.",
    notesBn: "তুলসী গাছে প্রচুর রোদ প্রয়োজন। শিকড়ে যাতে পানি না জমে সেদিকে খেয়াল রাখুন এবং টবের নিচে পর্যাপ্ত নিষ্কাশন রাখুন।",
  },
  {
    id: "mint",
    nameEn: "Pudina (Spearmint)",
    nameBn: "পুদিনা পাতা",
    baseSunHours: 4,
    waterSummer: "Twice daily (hot days)",
    waterWinter: "Every 2 days",
    waterMonsoon: "Every 3 days",
    notesEn: "Loves moist soil and partial midday shade. If leaves droop, hydrate immediately.",
    notesBn: "পুদিনা আর্দ্র মাটি পছন্দ করে। কড়া দুপুরের রোদ থেকে সামান্য ছায়ায় রাখলে পাতার সুবাস ভালো থাকে।",
  },
  {
    id: "aloe",
    nameEn: "Aloe Vera (Ghritakumari)",
    nameBn: "ঘৃতকুমারী (অ্যালোভেরা)",
    baseSunHours: 4,
    waterSummer: "Once a week",
    waterWinter: "Every 12-14 days",
    waterMonsoon: "Every 2 weeks (protect from rain)",
    notesEn: "Succulent leaves store water. Overwatering will cause fatal root rot. Needs porous sandy soil.",
    notesBn: "অ্যালোভেরা অতিরিক্ত পানি সহ্য করতে পারে না। বর্ষার একটানা বৃষ্টি থেকে টব সরিয়ে রাখুন।",
  },
  {
    id: "chili",
    nameEn: "Bird's Eye Chili (Morich)",
    nameBn: "কাঁচা মরিচ গাছ",
    baseSunHours: 6,
    waterSummer: "Daily",
    waterWinter: "Every 2 days",
    waterMonsoon: "When soil is dry to 1 inch",
    notesEn: "High sunlight demand for bountiful flowering and fruit set. Keep moist during blooming.",
    notesBn: "ফুল ও ফল আসার জন্য দিনে অন্তত ৫-৬ ঘণ্টা সরাসরি রোদ প্রয়োজন। ফুল ঝরে যাওয়া রোধে পরিমিত পানি দিন।",
  },
];

export default function SunlightWaterTool() {
  const { language } = useLanguage();
  const [selectedPlantId, setSelectedPlantId] = useState("tulsi");
  const [orientation, setOrientation] = useState<"south" | "east" | "west" | "north">("south");
  const [season, setSeason] = useState<"summer" | "monsoon" | "winter">("summer");

  const plant = PLANTS.find((p) => p.id === selectedPlantId) || PLANTS[0];

  // Calculate adjusted sunlight exposure
  let orientationTextEn = "High intensity (6-8 hrs direct sunlight)";
  let orientationTextBn = "সর্বোচ্চ সূর্যালোক (৬-৮ ঘণ্টা সরাসরি রোদ)";
  if (orientation === "east") {
    orientationTextEn = "Gentle morning sun (3-4 hrs direct morning light)";
    orientationTextBn = "স্নিগ্ধ সকালের রোদ (৩-৪ ঘণ্টা সকালের নরম রোদ)";
  } else if (orientation === "west") {
    orientationTextEn = "Intense afternoon heat (4-5 hrs strong western rays)";
    orientationTextBn = "তীব্র দুপুরের রোদ (৪-৫ ঘণ্টা বিকেলের কড়া রোদ)";
  } else if (orientation === "north") {
    orientationTextEn = "Diffused / indirect daylight (no direct rays)";
    orientationTextBn = "ছায়াযুক্ত অপ্রত্যক্ষ আলো (সরাসরি রোদ নেই)";
  }

  const waterSchedule =
    season === "summer"
      ? plant.waterSummer
      : season === "winter"
      ? plant.waterWinter
      : plant.waterMonsoon;

  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-md p-6 sm:p-8">
      <div className="max-w-xl mx-auto text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
          <Sun className="w-3.5 h-3.5 text-amber-600" />
          <span>{language === "bn" ? "রোদ ও পানি নির্দেশক" : "Sun & Water Advisor"}</span>
        </div>
        <h3 className="text-2xl font-bold text-forest-950">
          {language === "bn"
            ? "বারান্দার উদ্ভিদ সূর্যালোক ও সেচ ক্যালকুলেটর"
            : "Balcony Sun & Moisture Calculator"}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="space-y-5 bg-cream-50/60 p-5 rounded-2xl border border-forest-100">
          {/* Select Plant */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
              {language === "bn" ? "১. উদ্ভিদ নির্বাচন করুন" : "1. Select Plant Variety"}
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => setSelectedPlantId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-forest-200 text-sm font-medium text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              {PLANTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {language === "bn" ? p.nameBn : p.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Select Orientation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
              {language === "bn" ? "২. বারান্দার মুখ/দিক" : "2. Balcony Facing"}
            </label>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-forest-200 text-sm font-medium text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            >
              <option value="south">
                {language === "bn" ? "দক্ষিণমুখী (প্রচুর রোদ)" : "South-Facing (Maximum Sunlight)"}
              </option>
              <option value="east">
                {language === "bn" ? "পূর্বমুখী (সকালের রোদ)" : "East-Facing (Morning Gentle Sun)"}
              </option>
              <option value="west">
                {language === "bn" ? "পশ্চিমমুখী (তীব্র বিকেলের রোদ)" : "West-Facing (Hot Afternoon Sun)"}
              </option>
              <option value="north">
                {language === "bn" ? "উত্তরমুখী (ছায়াযুক্ত আলো)" : "North-Facing (Shaded / Indirect)"}
              </option>
            </select>
          </div>

          {/* Select Season */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest-900 mb-2">
              {language === "bn" ? "৩. বর্তমান ঋতু" : "3. Current Season"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "summer", en: "Summer", bn: "গ্রীষ্ম" },
                { id: "monsoon", en: "Monsoon", bn: "বর্ষা" },
                { id: "winter", en: "Winter", bn: "শীত" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeason(s.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    season === s.id
                      ? "bg-forest-800 text-white shadow-sm"
                      : "bg-white text-forest-800 border border-forest-200 hover:bg-forest-50"
                  }`}
                >
                  {language === "bn" ? s.bn : s.en}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-2 bg-[#fbf9f4] rounded-2xl border border-forest-200/80 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sun Card */}
            <div className="p-4 rounded-xl bg-white border border-amber-200/70 shadow-soft-sm">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Sun className="w-4 h-4" />
                <span>{language === "bn" ? "সূর্যালোকের অবস্থা" : "Sunlight Conditions"}</span>
              </div>
              <p className="text-base font-extrabold text-forest-950">
                {language === "bn" ? orientationTextBn : orientationTextEn}
              </p>
              <p className="text-xs text-forest-600 mt-1">
                {language === "bn"
                  ? `এই উদ্ভিদের জন্য ন্যূনতম প্রয়োজন: ${plant.baseSunHours} ঘণ্টা`
                  : `Minimum recommended for ${plant.nameEn}: ${plant.baseSunHours} hrs`}
              </p>
            </div>

            {/* Water Card */}
            <div className="p-4 rounded-xl bg-white border border-blue-200/70 shadow-soft-sm">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Droplets className="w-4 h-4" />
                <span>{language === "bn" ? "প্রস্তাবিত সেচ সময়সূচি" : "Watering Frequency"}</span>
              </div>
              <p className="text-base font-extrabold text-forest-950">
                {waterSchedule}
              </p>
              <p className="text-xs text-forest-600 mt-1">
                {language === "bn"
                  ? "মাটির উপরিভাগে ১ ইঞ্চি শুকিয়ে গেলে তবেই পানি দিন।"
                  : "Perform the 1-inch topsoil finger dry test before watering."}
              </p>
            </div>
          </div>

          {/* Plant specific care note */}
          <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-200/80 space-y-1.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-forest-600" />
              <span>{language === "bn" ? "বিশেষ পরিচর্যা নোট" : "Botanist's Tip"}</span>
            </h5>
            <p className="text-sm text-forest-850 leading-relaxed">
              {language === "bn" ? plant.notesBn : plant.notesEn}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
