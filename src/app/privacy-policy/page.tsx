"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-cream-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-forest-700" />
            <span>{language === "bn" ? "নিরাপত্তা ও গোপনীয়তা" : "Data Protection & Privacy"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            {language === "bn" ? "গোপনীয়তা নীতি (Privacy Policy)" : "Privacy Policy"}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto">
            {language === "bn"
              ? "আরণ্যক (Aronyok)-এ আপনার ব্যক্তিগত তথ্যের সুরক্ষা এবং ডেটা সুরক্ষার নিয়মাবলী।"
              : "How Aronyok collects, safeguards, and respects your personal and payment information."}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest-100 shadow-soft-sm space-y-8 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "১. আমরা কী তথ্য সংগ্রহ করি" : "1. Information We Collect"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "অর্ডার প্রক্রিয়া এবং চারাগাছ সরবরাহের স্বার্থে আমরা আপনার নাম, ফোন নম্বর, ডেলিভারি ঠিকানা, ইমেইল এবং নির্বাচিত পেমেন্ট মাধ্যম সংগ্রহ করি। আমরা কখনোই আপনার ডেবিট/ক্রেডিট কার্ডের পিন বা পাসওয়ার্ড সংরক্ষণ করি না।"
                : "When you place an order, we collect essential fulfillment information including your full name, mobile number, delivery address, and email. We do not store card credentials or MFS PIN numbers."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <Eye className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "২. তথ্যের ব্যবহার" : "2. How We Use Your Data"}</span>
            </h2>
            <ul className="space-y-1.5 list-disc pl-5 text-stone-600">
              <li>
                {language === "bn"
                  ? "সঠিক গন্তব্যে কুরিয়ার ও পার্সেল প্রেরণ নিশ্চিত করতে।"
                  : "To fulfill, pack, and courier your botanical orders accurately."}
              </li>
              <li>
                {language === "bn"
                  ? "এসএমএস এবং হোয়াটসঅ্যাপের মাধ্যমে অর্ডার ট্র্যাকিং ও আপডেট সরবরাহ করতে।"
                  : "To provide real-time SMS and WhatsApp delivery tracking notifications."}
              </li>
              <li>
                {language === "bn"
                  ? "চারাগাছের ঋতুভিত্তিক পরিচর্যা এবং বিশেষ সবুজ অফার সংক্রান্ত আপডেট প্রদানে।"
                  : "To share seasonal plant care tips and exclusive subscriber greening offers."}
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "৩. তৃতীয় পক্ষের সাথে তথ্য শেয়ারিং" : "3. Third-Party Sharing"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "আমরা আপনার তথ্য কখনোই কোনো বিজ্ঞাপন সংস্থা বা বাণিজ্যিক ডাটাবেজের কাছে বিক্রি বা শেয়ার করি না। শুধুমাত্র ডেলিভারির উদ্দেশ্যে অনুমোদিত কুরিয়ার পার্টনার (যেমন: স্টেডফাস্ট, পাঠাও) এবং সুরক্ষিত পেমেন্ট গেটওয়ের সাথে প্রয়োজনীয় তথ্য শেয়ার করা হয়।"
                : "We do not sell or monetize customer data. Relevant recipient details are shared strictly with certified courier partners (e.g., Steadfast Courier, Pathao) for dispatch, and encrypted payment gateways."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "৪. কুকিজ ও ট্র্যাকিং নীতি" : "4. Cookies and Web Analytics"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "ওয়েবসাইটে শপিং কার্ট সংরক্ষণ এবং পেজ স্পিড বৃদ্ধির জন্য স্ট্যান্ডার্ড কুকিজ ব্যবহৃত হয়। ব্যবহারকারী যেকোনো সময় ব্রাউজারের সেটিংসে গিয়ে কুকিজ মুছে ফেলতে পারেন।"
                : "Standard web cookies and telemetry are used solely to persist your shopping cart session, remember language preferences, and optimize checkout performance."}
            </p>
          </section>

          <div className="pt-4 border-t border-stone-200 text-stone-500 text-xs">
            {language === "bn"
              ? "সর্বশেষ হালনাগাদ: নভেম্বর ২০২৬। কোনো জিজ্ঞাসা থাকলে আমাদের care@aronyok.com এ ইমেইল করতে পারেন।"
              : "Last updated: November 2026. For privacy concerns or data erasure requests, email care@aronyok.com."}
          </div>
        </div>
      </div>
    </div>
  );
}
