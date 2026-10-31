"use client";

import React from "react";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Clock,
  Package,
  AlertTriangle,
  Sprout,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function ShippingAndReturnsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-cream-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-forest-700" />
            <span>{language === "bn" ? "ডেলিভারি ও গ্যারান্টি" : "Logistics & Care Standards"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            {language === "bn"
              ? "শিপিং ও রিটার্ন নীতিমালা"
              : "Shipping & Return Policy"}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {language === "bn"
              ? "লাইভ চারাগাছের বিশেষ সুরক্ষা নিশ্চিতকরণ এবং আরণ্যকের বিশ্বস্ত ৪৮-ঘণ্টা ট্রানজিট গ্যারান্টি সংক্রান্ত নিয়মাবলী।"
              : "Learn how we safely package living saplings, our delivery timelines across Bangladesh, and our 48-Hour Live Plant Transit Guarantee."}
          </p>
        </div>

        {/* Delivery Rates & Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
              <Clock className="w-5 h-5 text-forest-700" />
            </div>
            <h3 className="font-bold text-lg text-forest-950">
              {language === "bn" ? "ঢাকা মহানগরী (Inside Dhaka)" : "Inside Dhaka Metro"}
            </h3>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ডেলিভারি চার্জ:</strong> ৳৭০ (৳১৫০০ টাকার অধিক অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি)।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ডেলিভারি সময়:</strong> ২৪ থেকে ৪৮ ঘণ্টার মধ্যে নিজস্ব ও পার্টনার রাইডারের মাধ্যমে ডেলিভারি।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>পদ্ধতি:</strong> হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি (COD) সুবিধাপ্রাপ্ত।
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-lg text-forest-950">
              {language === "bn" ? "ঢাকার বাইরে সমগ্র বাংলাদেশ" : "Outside Dhaka Metro"}
            </h3>
            <ul className="text-xs text-stone-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ডেলিভারি চার্জ:</strong> ৳১৩০ (৳১৫০০ টাকার অধিক অর্ডারে সম্পূর্ণ ফ্রি)।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>ডেলিভারি সময়:</strong> ৪৮ থেকে ৭২ ঘণ্টার মধ্যে জেলা ও থানা সদরে হোম ডেলিভারি।
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>কুরিয়ার পার্টনার:</strong> স্টেডফাস্ট কুরিয়ার, পাঠাও এবং সুন্দরবন এক্সপ্রেস।
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* 48-Hour Guarantee Banner */}
        <div className="bg-forest-900 text-cream-100 p-8 rounded-3xl shadow-soft space-y-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white">
              {language === "bn"
                ? "আরণ্যক ৪৮-ঘণ্টা লাইভ প্ল্যান্ট ট্রানজিট গ্যারান্টি"
                : "Aronyok 48-Hour Live Plant Transit Guarantee"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed">
            {language === "bn"
              ? "গাছ একটি সংবেদনশীল জীবন্ত সত্ত্বা। পরিবহণে অপ্রত্যাশিত ঝাঁকুনি বা অসাবধানতায় কোনো চারা ক্ষতিগ্রস্থ হলে গ্রাহকের কোনো ক্ষতি হতে দেব না। পার্সেল গ্রহণের ৪৮ ঘণ্টার মধ্যে ক্ষতিগ্রস্ত পাতার ছবি বা আনবক্সিং ভিডিও আমাদের হোয়াটসঅ্যাপে (+৮৮০ ১৭১২-৩৪৫৬৭৮) পাঠালে তাৎক্ষণিক বিনামূল্যে রিপ্লেসমেন্ট প্রদান করা হয়।"
              : "Living plants are delicate organisms. If your saplings arrive wilted beyond recovery or suffer broken main stems during transit, simply message us on WhatsApp with photos or unboxing video within 48 hours of delivery. We will promptly dispatch a fresh replacement sapling at zero additional charge."}
          </p>
        </div>

        {/* Return & Refund Workflow */}
        <div className="bg-white p-8 rounded-3xl border border-forest-100 shadow-soft-sm space-y-6">
          <h2 className="text-xl font-bold text-forest-950 flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-emerald-600" />
            <span>{language === "bn" ? "রিটার্ন ও রিফান্ড প্রক্রিয়া" : "Return & Refund Process"}</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <h4 className="font-bold text-forest-950">
                {language === "bn" ? "১. ছবি ও প্রমাণ জমা দিন:" : "1. Photo Evidence Submission:"}
              </h4>
              <p className="text-stone-600 text-xs">
                {language === "bn"
                  ? "ডেলিভারি রাইডারের কাছ থেকে গ্রহণের সময় কিংবা খোলার সময় চারার অবস্থা পর্যবেক্ষণ করে ছবি তুলে রাখুন।"
                  : "Inspect the root ball and main stem upon unboxing. Take clear photos or a short video highlighting any transit damage."}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <h4 className="font-bold text-forest-950">
                {language === "bn" ? "২. কৃষিবিদ দলের পর্যালোচনা:" : "2. Botanical Triage Review:"}
              </h4>
              <p className="text-stone-600 text-xs">
                {language === "bn"
                  ? "আমাদের কৃষিবিদ দল পর্যবেক্ষণ করে জানান যদি সামান্য পাতা ঝরে যাওয়া সাময়িক ট্রানজিট শক হয় (যা পানি দিলে সুস্থ হয়ে যায়), অথবা মূল কাণ্ডের ক্ষতি রিপ্লেসমেন্টযোগ্য।"
                  : "Our team assesses whether minor leaf wilting is temporary transit shock (curable with shade and moisture) or genuine damage requiring plant replacement."}
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <h4 className="font-bold text-forest-950">
                {language === "bn" ? "৩. রিপ্লেসমেন্ট বা রিফান্ড:" : "3. Replacement or Full Refund:"}
              </h4>
              <p className="text-stone-600 text-xs">
                {language === "bn"
                  ? "অনুমোদনের পর গ্রাহকের ইচ্ছানুযায়ী ২ কার্যদিবসের মধ্যে নতুন চারা পাঠানো হয় অথবা বিকাশ/নগদ/কার্ডের মাধ্যমে সম্পূর্ণ টাকা ফেরত দেওয়া হয়।"
                  : "Upon approval, a fresh nursery sapling is dispatched within 2 working days, or full refund issued to your bKash, Nagad, or original card."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
