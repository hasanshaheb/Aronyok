"use client";

import React from "react";
import { FileText, ShieldAlert, CheckCircle, Scale, Sprout } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function TermsPage() {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-cream-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-forest-700" />
            <span>{language === "bn" ? "ব্যবহারের শর্তাবলী" : "Terms & Conditions"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest-950 tracking-tight">
            {language === "bn" ? "নিয়ম ও শর্তাবলী" : "Terms of Service"}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto">
            {language === "bn"
              ? "আরণ্যক প্ল্যাটফর্ম ব্যবহারের পূর্বে অর্ডার, ক্যান্সেলেশন এবং লাইভ প্ল্যান্ট বিক্রয় সংক্রান্ত নিয়মাবলী জেনে নিন।"
              : "Review the governing terms and policies regarding plant purchases, cancellations, and delivery rights."}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-forest-100 shadow-soft-sm space-y-8 text-stone-700 text-xs sm:text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "১. লাইভ চারাগাছ সংক্রান্ত শর্তাবলী" : "1. Live Botanical Products"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "গাছপালা প্রাকৃতিক জীবন্ত পণ্য বিধায় প্রতিটি চারার পাতা, উচ্চতা এবং আকৃতি ছবিতে প্রদর্শিত নমুনা থেকে কিছুটা ভিন্ন হতে পারে। তবে আমরা শতভাগ জাতের বিশুদ্ধতা (true-to-type) এবং সুস্থ শিকড়ের নিশ্চয়তা প্রদান করি।"
                : "Because plants are biological organisms, individual specimens may vary slightly in height, branching, or leaf density from website reference photos. However, Aronyok guarantees 100% variety authenticity and healthy root systems."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "২. অর্ডার নিশ্চিতকরণ ও মূল্য" : "2. Pricing and Order Confirmation"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "ওয়েবসাইটে উল্লেখিত মূল্য বাংলাদেশি টাকায় (BDT) নির্ধারিত। কোনো পণ্যের স্টক অপ্রত্যাশিতভাবে শেষ হয়ে গেলে গ্রাহকের সাথে পরামর্শক্রমে অর্ডার পরিবর্তন বা অগ্রিম পরিশোধিত অর্থ রিফান্ড করা হবে।"
                : "All prices are listed in Bangladeshi Taka (BDT). In rare events where a plant variety runs out of stock after order placement, we contact the customer for suitable alternatives or prompt full refund."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "৩. অর্ডার বাতিলকরণ নীতি" : "3. Cancellation Policy"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "নার্সারি থেকে পার্সেল কুরিয়ারে হ্যান্ডওভার করার পূর্ব পর্যন্ত গ্রাহক বিনা খরচে অর্ডার বাতিল করতে পারবেন। একবার পার্সেল ট্রানজিটে চলে গেলে তা বাতিলযোগ্য নয় এবং ডেলিভারি চার্জ প্রযোজ্য হবে।"
                : "Orders may be cancelled freely before parcels are dispatched to the courier hub. Once a living sapling crate enters transit, dispatch fees become non-refundable."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold text-forest-950 flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>{language === "bn" ? "৪. আইনগত এখতিয়ার" : "4. Governing Law"}</span>
            </h2>
            <p>
              {language === "bn"
                ? "এই শর্তাবলী গণপ্রজাতন্ত্রী বাংলাদেশের প্রচলিত আইন দ্বারা পরিচালিত ও নিয়ন্ত্রিত হবে।"
                : "These terms and conditions are governed by and construed in accordance with the laws of the People's Republic of Bangladesh."}
            </p>
          </section>

          <div className="pt-4 border-t border-stone-200 text-stone-500 text-xs">
            {language === "bn"
              ? "সর্বশেষ সংস্করণ: নভেম্বর ২০২৬ | আরণ্যক ই-কমার্স প্ল্যাটফর্ম"
              : "Last revised: November 2026 | Aronyok Botanical Platform"}
          </div>
        </div>
      </div>
    </div>
  );
}
