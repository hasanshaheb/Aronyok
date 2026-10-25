"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, Sprout, ShieldAlert, BookOpen, ArrowRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

interface RemedyItem {
  id: string;
  ailmentEn: string;
  ailmentBn: string;
  herbEn: string;
  herbBn: string;
  botanical: string;
  preparationEn: string;
  preparationBn: string;
  benefitsEn: string;
  benefitsBn: string;
  relatedSlug?: string;
}

const REMEDIES: RemedyItem[] = [
  {
    id: "cold-cough",
    ailmentEn: "Cold, Cough & Sore Throat",
    ailmentBn: "সর্দি, কাশি ও গলা ব্যথা",
    herbEn: "Krishna Tulsi & Ginger Decoction",
    herbBn: "কৃষ্ণ তুলসী ও আদা কাড়া",
    botanical: "Ocimum tenuiflorum & Zingiber officinale",
    preparationEn: "Boil 6-8 crushed Krishna Tulsi leaves with 1 inch crushed fresh ginger in 2 cups of water until reduced by half. Stir in 1 teaspoon of raw Sundarbans honey when lukewarm.",
    preparationBn: "দুই কাপ পানিতে ৬-৮টি কৃষ্ণ তুলসী পাতা ও ১ টুকরো থেঁতো করা আদা দিয়ে ফুটিয়ে অর্ধেক করে নিন। কুসুম গরম অবস্থায় ১ চা চামচ খাঁটি সুন্দরবনের মধু মিশিয়ে পান করুন।",
    benefitsEn: "Clears bronchus mucus, calms throat irritation, and provides antiviral active compounds.",
    benefitsBn: "ফুসফুস ও শ্বাসনালীর শ্লেষ্মা পরিষ্কার করে, গলার প্রদাহ দূর করে এবং রোগ প্রতিরোধ ক্ষমতা বাড়ায়।",
    relatedSlug: "krishna-tulsi-live-potted-plant",
  },
  {
    id: "sleep-anxiety",
    ailmentEn: "Sleep Issues & Daily Stress",
    ailmentBn: "অনিদ্রা ও মানসিক চাপ",
    herbEn: "Ashwagandha Herbal Infusion",
    herbBn: "অশ্বগন্ধা মূলের নির্যাস",
    botanical: "Withania somnifera",
    preparationEn: "Steep 1 teaspoon of dried Ashwagandha root powder in warm milk or herbal water 30 minutes before sleep.",
    preparationBn: "রাতে ঘুমানোর আধ ঘণ্টা আগে এক কাপ গরম দুধ বা পানিতে ১ চা চামচ অশ্বগন্ধা গুঁড়া মিশিয়ে নিন।",
    benefitsEn: "Potent adaptogen that lowers cortisol, calms overactive nervous system, and deepens restorative sleep.",
    benefitsBn: "কর্টিসোল হরমোনের মাত্রা কমিয়ে স্নায়ুকে শান্ত করে এবং গভীর ঘুমের সহায়ক হিসেবে কাজ করে।",
    relatedSlug: "tulsi-ashwagandha-herbal-tea-100g",
  },
  {
    id: "digestion",
    ailmentEn: "Indigestion, Acidity & Bloating",
    ailmentBn: "হজম সমস্যা, গ্যাস্ট্রিক ও পেট ফাঁপা",
    herbEn: "Triphala & Raw Honey Elixir",
    herbBn: "ত্রিফলা ও কাঁচা মধুর মিশ্রণ",
    botanical: "Emblica officinalis, Terminalia bellirica & chebula",
    preparationEn: "Mix half a teaspoon of organic Triphala powder with 1 spoon of lukewarm water and a dab of raw honey first thing in the morning.",
    preparationBn: "সকালে খালি পেটে আধা চা চামচ ত্রিফলা গুঁড়া সামান্য কুসুম গরম পানি ও এক চামচ কাঁচা মধুর সাথে মিশিয়ে সেবন করুন।",
    benefitsEn: "Gently cleanses intestinal tract, restores microbiome equilibrium, and balances stomach acid.",
    benefitsBn: "অন্ত্রের স্বাভাবিক কার্যক্ষমতা বজায় রাখে, হজমরস ক্ষরণ স্বাভাবিক করে এবং কোষ্ঠকাঠিন্য দূর করে।",
    relatedSlug: "sundarbans-mangrove-raw-honey-500g",
  },
  {
    id: "skin-scalp",
    ailmentEn: "Skin Rashes, Acne & Scalp Dandruff",
    ailmentBn: "ত্বকের ব্রণ, চুলকানি ও খুশকি",
    herbEn: "Cold-Pressed Neem Oil Application",
    herbBn: "ঘানিতে ভাঙা খাঁটি নিম তেল",
    botanical: "Azadirachta indica",
    preparationEn: "Blend 3 drops of pure neem oil with 1 tablespoon of coconut or sesame carrier oil. Gently massage onto affected skin or scalp. Leave for 30 mins before washing.",
    preparationBn: "১ টেবিল চামচ নারকেল তেলের সাথে ৩-৪ ফোঁটা খাঁটি নিম তেল মিশিয়ে আক্রান্ত ত্বক বা মাথার তালুতে ম্যাসাজ করুন। ৩০ মিনিট পর ধুয়ে ফেলুন।",
    benefitsEn: "High concentration of nimbidin and azadirachtin halts fungal proliferation and soothes dermal redness.",
    benefitsBn: "অ্যান্টি-ব্যাকটেরিয়াল ও অ্যান্টি-ফাঙ্গাল উপাদানে ভরপুর, যা ব্রণের জীবাণু ও খুশকি নির্মূল করে।",
    relatedSlug: "cold-pressed-neem-seed-oil-200ml",
  },
];

export default function HerbalRemedyTool() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRemedy, setSelectedRemedy] = useState<RemedyItem>(REMEDIES[0]);

  const filtered = REMEDIES.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.ailmentEn.toLowerCase().includes(term) ||
      item.ailmentBn.includes(term) ||
      item.herbEn.toLowerCase().includes(term) ||
      item.herbBn.includes(term)
    );
  });

  return (
    <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-md p-6 sm:p-8">
      {/* Search Header */}
      <div className="max-w-xl mx-auto text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-forest-600" />
          <span>{language === "bn" ? "ভেষজ নির্দেশক" : "Botanical Directory"}</span>
        </div>
        <h3 className="text-2xl font-bold text-forest-950">
          {language === "bn"
            ? "আপনার স্বাস্থ্য সমস্যা লিখুন বা নির্বাচন করুন"
            : "Search an Ailment or Wellness Need"}
        </h3>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-forest-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              language === "bn"
                ? "যেমন: সর্দি, অনিদ্রা, কাশি, ত্বক..."
                : "e.g., cold, cough, sleep, anxiety, skin..."
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream-50 border border-forest-200 text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>
      </div>

      {/* Grid: Left selection list, Right detail card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selection buttons */}
        <div className="space-y-3">
          {filtered.map((item) => {
            const isSelected = selectedRemedy.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedRemedy(item)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-forest-800 text-white border-forest-800 shadow-soft-sm"
                    : "bg-cream-50/60 hover:bg-forest-50 border-forest-100 text-forest-900"
                }`}
              >
                <p className="font-bold text-sm">
                  {language === "bn" ? item.ailmentBn : item.ailmentEn}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isSelected ? "text-forest-200" : "text-forest-600"
                  }`}
                >
                  {language === "bn" ? item.herbBn : item.herbEn}
                </p>
              </button>
            );
          })}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2 bg-[#fbf9f4] rounded-2xl border border-forest-200/80 p-6 space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-forest-100 pb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-earth-700">
                {language === "bn" ? "প্রস্তাবিত ভেষজ সমাধান" : "Recommended Remedy"}
              </span>
              <h4 className="text-xl font-extrabold text-forest-950 mt-1">
                {language === "bn"
                  ? selectedRemedy.herbBn
                  : selectedRemedy.herbEn}
              </h4>
              <p className="text-xs italic text-forest-600 mt-0.5">
                {selectedRemedy.botanical}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
              <Sprout className="w-6 h-6" />
            </div>
          </div>

          {/* How to prepare */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-forest-600" />
              <span>{language === "bn" ? "প্রস্তুত ও সেবন প্রণালী" : "Preparation & Method"}</span>
            </h5>
            <p className="text-sm text-forest-850 leading-relaxed bg-white p-4 rounded-xl border border-forest-100">
              {language === "bn"
                ? selectedRemedy.preparationBn
                : selectedRemedy.preparationEn}
            </p>
          </div>

          {/* Biological action */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-forest-900">
              {language === "bn" ? "কার্যকারিতা ও উপকারিতা" : "Biological Action"}
            </h5>
            <p className="text-sm text-forest-700 leading-relaxed">
              {language === "bn"
                ? selectedRemedy.benefitsBn
                : selectedRemedy.benefitsEn}
            </p>
          </div>

          {/* Related product link */}
          {selectedRemedy.relatedSlug && (
            <div className="pt-4 border-t border-forest-100 flex items-center justify-between">
              <span className="text-xs text-forest-700">
                {language === "bn"
                  ? "আমাদের দোকানে উপাদানটি দেখতে চান?"
                  : "Find this natural item in our store:"}
              </span>
              <Link
                href={`/shop/${selectedRemedy.relatedSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 hover:text-forest-600 bg-white px-3 py-1.5 rounded-xl border border-forest-200 shadow-sm"
              >
                <span>{language === "bn" ? "পণ্যটি দেখুন" : "View Product"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
