"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sprout,
  TreePine,
  ShieldCheck,
  Truck,
  Heart,
  Droplets,
  Flower2,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Calendar,
  Quote,
  Award,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function AboutUsPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const milestones = [
    {
      year: "2021",
      title: isBn ? "যাত্রার শুরু ও প্রথম ছাদবাগান ট্রায়াল" : "The Spark & Terrace Trials",
      desc: isBn
        ? "সাভারের ছোট্ট জমিতে দেশীয় আবহাওয়ার উপযোগী কলম চারার প্রথম নার্সারি স্থাপন এবং সুন্দরবনের মৌয়ালদের সাথে সরাসরি যোগাযোগ।"
        : "Initial seedling trials in Savar to cultivate hardy grafted varieties, alongside our first direct fair-trade ties with Sundarbans Mawalis.",
    },
    {
      year: "2023",
      title: isBn ? "ভেন্টিলেটেড লাইভ ট্রানজিট উদ্ভাবন" : "The Ventilated Transit Breakthrough",
      desc: isBn
        ? "গাছের শিকড় ও পাতার সুরক্ষায় ৩-স্তর বিশিষ্ট বায়ুচলাচল কার্টন ও কাঠের ফ্রেম তৈরি, যার ফলে কুরিয়ারে চারা ভাঙার হার শূন্যে নেমে আসে।"
        : "Engineered breathable 3-layer wooden-frame cartons ensuring root systems breathe and branches never snap during nationwide courier transit.",
    },
    {
      year: "2024",
      title: isBn ? "ঘানির খাঁটি তেল ও গ্রামীণ মৃৎশিল্প" : "Cold-Pressed Oils & Rural Pottery",
      desc: isBn
        ? "কাঠের ঘানিতে নিজস্ব তত্ত্বাবধানে খাঁটি তেল এবং যশোর ও রাজশাহীর মৃৎশিল্পীদের নিপুণ হাতে তৈরি মাটির নান্দনিক পাত্র সংযোজন।"
        : "Expanded into artisanal wooden-ghani oils and partnered with generational potters to bring breathable terracotta planters to urban homes.",
    },
    {
      year: "2026",
      title: isBn ? "১২,০০০+ পরিবার ও এআই নেচার ডক্টর" : "12,000+ Homes & AI Agronomy",
      desc: isBn
        ? "১২ হাজারের বেশি সফল ছাদবাগান গড়ে তোলার অভিজ্ঞতা নিয়ে ডিজিটাল টুলস ও স্মার্ট এআই প্ল্যান্ট কেয়ার অ্যাসিস্ট্যান্ট উন্মোচন।"
        : "Celebrating over 12,000 living saplings thriving on balconies across Bangladesh, empowered by our smart AI botanical care assistant.",
    },
  ];

  const pillars = [
    {
      icon: TreePine,
      title: isBn ? "সুস্থ-সবল পরীক্ষিত কলম চারা" : "Scientific Grafting & Healthy Roots",
      desc: isBn
        ? "সাভার ও যশোরের নিজস্ব নার্সারিতে বৈজ্ঞানিক পদ্ধতিতে কলমকৃত রোগমুক্ত ও দ্রুত ফলনশীল চারা। রোপণের জন্য ১০০% তৈরি।"
        : "Disease-screened, climate-resilient grafted fruit & spice saplings raised under expert botanical supervision.",
      color: "from-forest-800 to-forest-900",
      accent: "text-emerald-400",
      bgBadge: "bg-forest-100 border-forest-200 text-forest-900",
    },
    {
      icon: Droplets,
      title: isBn ? "সুন্দরবনের খাঁটি বুনো মধু" : "Raw Sundarbans Mangrove Honey",
      desc: isBn
        ? "সুন্দরবনের গভীর ম্যানগ্রোভ থেকে ঐতিহ্যবাহী মৌয়ালদের হাতে সংগৃহীত খলিসা ও কেওড়া ফুলের অপরিশোধিত ও অপরিবর্তিত খাঁটি মধু।"
        : "100% raw, cold-filtered natural honey harvested ethically by hereditary Mawalis from wild mangrove blooms.",
      color: "from-amber-700 to-amber-800",
      accent: "text-amber-300",
      bgBadge: "bg-amber-100 border-amber-200 text-amber-900",
    },
    {
      icon: Truck,
      title: isBn ? "৪৮ ঘণ্টায় অক্ষত ডেলিভারি গ্যারান্টি" : "48h Guaranteed Safe Plant Transit",
      desc: isBn
        ? "বিশেষ ভেন্টিলেটেড কাঠের ফ্রেমে সুরক্ষিত প্যাকেজিং। ট্রানজিটে চারার কোনো ক্ষতি হলে সম্পূর্ণ বিনামূল্যে রিপ্লেসমেন্ট।"
        : "Custom ventilated protective cartons. If a live plant suffers any transit shock or damage, we replace it free of charge.",
      color: "from-terracotta-600 to-terracotta-700",
      accent: "text-cream-100",
      bgBadge: "bg-terracotta-100 border-terracotta-200 text-terracotta-900",
    },
    {
      icon: Flower2,
      title: isBn ? "আজীবন পরিচর্যা ও কৃষি সহায়তা" : "Lifetime Agronomist Support",
      desc: isBn
        ? "টবের দোআঁশ মাটি প্রস্তুতকরণ, কেঁচো সার প্রয়োগ এবং পোকা দমনে আমাদের অভিজ্ঞ কৃষিবিদ দল সবসময় আপনার সাথে।"
        : "From organic potting mixes to seasonal pruning advice, our agronomists support your balcony sanctuary continuously.",
      color: "from-sage-700 to-sage-800",
      accent: "text-sage-200",
      bgBadge: "bg-sage-100 border-sage-200 text-sage-900",
    },
  ];

  const stats = [
    { value: "১২,০০০+", label: isBn ? "সফলভাবে রোপিত চারাগাছ" : "Live Saplings Planted", enValue: "12,000+" },
    { value: "১০০%", label: isBn ? "রাসায়নিকমুক্ত খাঁটি নিশ্চয়তা" : "Chemical-Free Assurance", enValue: "100%" },
    { value: "৪৮ ঘণ্টা", label: isBn ? "নিরাপদ ট্রানজিট ডেলিভারি" : "Safe Transit Guarantee", enValue: "48h" },
    { value: "৫,৫০০+", label: isBn ? "সন্তুষ্ট ছাদবাগানী পরিবার" : "Satisfied Green Families", enValue: "5,500+" },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Hero & Philosophy Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F5F1E7]/95 via-[#FDFBF7] to-white py-16 sm:py-24 border-b border-forest-100/80">
        <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 rounded-full bg-forest-200/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-terracotta-100/30 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-forest-200 text-forest-900 text-xs font-bold uppercase tracking-wider shadow-soft-sm">
            <Sprout className="w-3.5 h-3.5 text-forest-700" />
            <span>{isBn ? "আমাদের গল্প ও দর্শন" : "Rooted in Bengal's Soil"}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-forest-950 tracking-tight leading-[1.15]">
            {isBn ? (
              <>
                প্রকৃতির সান্নিধ্যে, আগামীর পথে —{" "}
                <span className="text-terracotta-600 underline decoration-terracotta-300 decoration-wavy decoration-2">
                  আরণ্যকের গল্প
                </span>
              </>
            ) : (
              <>
                With Nature, Towards the Future —{" "}
                <span className="text-terracotta-600 underline decoration-terracotta-300 decoration-wavy decoration-2">
                  The Aronyok Journey
                </span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-charcoal-700 leading-relaxed max-w-3xl mx-auto font-normal">
            {isBn
              ? "আরণ্যক কোনো সাধারণ বাণিজ্যিক নার্সারি নয়; এটি বাংলার সমৃদ্ধ ভেষজ ঐতিহ্য, সুন্দরবনের অফুরন্ত বিশুদ্ধতা এবং শহুরে বারান্দায় সবুজ জীবনের মেলবন্ধন ঘটানোর একটি আন্তরিক উদ্যোগ।"
              : "A dedicated botanical enterprise bridging Bengal's rich herbal heritage, raw mangrove harvests, and urban homesteading for conscious families across Bangladesh."}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-500 hover:from-terracotta-700 hover:to-terracotta-600 text-white font-extrabold text-xs sm:text-sm shadow-terracotta-md transition-all active:scale-95"
            >
              <span>{isBn ? "চারা ও পণ্য সম্ভার দেখুন" : "Explore Living Catalog"}</span>
              <ArrowRight className="w-4 h-4 text-cream-100" />
            </Link>

            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100 text-forest-900 font-bold text-xs sm:text-sm border-2 border-forest-800 shadow-soft-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{isBn ? "স্মার্ট ইকো টুলস" : "Smart Eco Tools"}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Impact Numbers Grid (Golden Ratio Stats) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft-sm text-center space-y-1 hover:border-forest-300 hover:shadow-soft-md transition-all"
            >
              <span className="text-2xl sm:text-4xl font-extrabold text-forest-950 block tracking-tight">
                {isBn ? s.value : s.enValue}
              </span>
              <span className="text-xs sm:text-sm text-charcoal-600 font-medium block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Founder & Agronomist's Personal Letter (Personalized Touch) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#FAF7F1] border border-forest-200/90 p-8 sm:p-12 shadow-soft-md relative overflow-hidden">
          <Quote className="absolute top-6 right-6 w-16 h-16 text-terracotta-200/60 pointer-events-none" />

          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-100 text-forest-900 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-forest-700" />
              <span>{isBn ? "প্রতিষ্ঠাতা ও গবেষক দলের বার্তা" : "A Letter from our Green Keepers"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight leading-snug">
              {isBn
                ? "“প্রতিটি ফ্ল্যাটের বারান্দা হয়ে উঠুক একটি সতেজ অক্সিজেন ও ফলের উদ্যান”"
                : "“Every urban balcony can become a thriving sanctuary of clean oxygen and fresh harvest”"}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-normal">
              <p>
                {isBn
                  ? "শহুরে জীবনের ইট-পাথরের ভিড়ে আমরা প্রতিদিন প্রকৃতির স্পর্শ হারিয়ে ফেলছি। নার্সারি থেকে চারা কিনে এনে কয়েকদিনের মাথায় শুকিয়ে যাওয়া কিংবা বাজারে মধুর নামে ভেজাল চিনির সিরাপ দেখে আমরা হতাশ হয়েছিলাম। ঠিক সেই জায়গা থেকেই আরণ্যকের জন্ম।"
                  : "Amidst rapid urban growth, our connection with living nature has steadily diminished. Frustrated by weak saplings that perish within days and counterfeit processed honey in supermarkets, we resolved to build an authentic green alternative."}
              </p>
              <p>
                {isBn
                  ? "আমরা পণ করেছি—আরণ্যকের প্রতিটি ফলদ চারা হবে সাভারের নিজস্ব নার্সারিতে রোগমুক্তভাবে কলমকৃত, মধু আসবে সুন্দরবনের মৌয়ালদের হাত থেকে কোনো কৃত্রিমতা ছাড়াই, এবং প্রতিটি চারা কাঠের সুরক্ষিত প্যাকেজিংয়ে অক্ষতভাবে আপনার দরজায় পৌঁছাবে। কোনো চারা যদি ট্রানজিটে ক্ষতিগ্রস্ত হয়, তা বিনা প্রশ্নে রিপ্লেস করা আমাদের নৈতিক দায়িত্ব।"
                  : "We made a solemn pledge: every live sapling is scientifically grafted and disease-screened at our Savar nurseries, every drop of honey comes straight from Sundarbans Mawalis without artificial heating, and every courier shipment is secured in ventilated wooden frames. If any plant suffers in transit, we replace it unconditionally."}
              </p>
            </div>

            <div className="pt-4 border-t border-forest-200/80 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-forest-800 text-cream-100 flex items-center justify-center font-bold text-base shadow-sm">
                আ
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-forest-950">
                  {isBn ? "আরণ্যক গবেষক ও নার্সারি টিম" : "The Aronyok Agronomy & Nursery Team"}
                </h4>
                <p className="text-xs text-charcoal-500">
                  {isBn ? "সাভার বোটানিক্যাল ফার্ম, ঢাকা" : "Savar Botanical Farm, Dhaka"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The 4 Pillars of Aronyok Authenticity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream-200 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
            <span>{isBn ? "আমাদের চার মূল ভিত্তি" : "Our Four Pillars"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
            {isBn ? "যে কারণে আরণ্যক অন্যদের চেয়ে অনন্য" : "Why Families & Gardeners Trust Aronyok"}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            {isBn
              ? "প্রকৃতি, সততা ও আধুনিক বিজ্ঞানের সমন্বয়ে গঠিত আমাদের প্রতিটি সেবা।"
              : "Where traditional Bengali agronomy meets modern scientific care and zero-compromise logistics."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="flex gap-5 p-7 rounded-3xl bg-white border border-forest-100 shadow-soft-sm hover:shadow-soft-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white flex-shrink-0 shadow-soft-sm`}
                >
                  <Icon className={`w-7 h-7 ${p.accent}`} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-extrabold text-forest-950 text-base sm:text-lg">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. The Journey & Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cream-200 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-forest-700" />
            <span>{isBn ? "ক্রমবিকাশ" : "Our Milestones"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
            {isBn ? "আরণ্যকের পথচলার গল্প" : "Growing Through the Years"}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-600">
            {isBn
              ? "একটি ছোট্ট বারান্দা থেকে দেশজুড়ে ছড়িয়ে পড়া সবুজ বিপ্লব।"
              : "From a small test balcony to greening thousands of homes across Bangladesh."}
          </p>
        </div>

        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 sm:before:left-1/2 before:w-0.5 before:bg-forest-100 before:-translate-x-1/2">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col sm:flex-row gap-6 sm:gap-10 items-start ${
                idx % 2 === 0 ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* Year marker */}
              <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-forest-800 text-white font-extrabold text-[11px] flex items-center justify-center border-4 border-white shadow-soft-sm z-10">
                {idx + 1}
              </div>

              {/* Card */}
              <div
                className={`w-full sm:w-[calc(50%-2rem)] pl-10 sm:pl-0 ${
                  idx % 2 === 0 ? "sm:text-right" : "sm:text-left"
                }`}
              >
                <div className="p-6 rounded-3xl bg-white border border-forest-100 shadow-soft-sm hover:shadow-soft-md transition-shadow space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-terracotta-100 text-terracotta-800 font-extrabold text-xs">
                    {m.year}
                  </span>
                  <h4 className="font-extrabold text-forest-950 text-base">
                    {m.title}
                  </h4>
                  <p className="text-xs text-charcoal-600 leading-relaxed font-normal">
                    {m.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Physical Farm & Nursery Invitation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-forest-900 via-forest-850 to-forest-950 text-white p-8 sm:p-14 relative overflow-hidden shadow-soft-xl border border-forest-800">
          <div className="absolute right-0 top-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-forest-700/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-20 w-72 h-72 rounded-full bg-terracotta-600/15 blur-3xl pointer-events-none" />

          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-forest-800 text-amber-300 text-xs font-bold uppercase tracking-wider border border-forest-700/60">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? "সরাসরি পরিদর্শন করুন" : "Visit Our Living Nursery"}</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-cream-50 leading-snug">
              {isBn
                ? "আমাদের সাভার নার্সারিতে এসে নিজ চোখে মাতৃগাছ ও কলম চারা দেখুন"
                : "Experience Our Mother Orchards & Live Saplings in Person"}
            </h3>

            <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed font-normal">
              {isBn
                ? "আপনি চাইলে সরাসরি আমাদের নার্সারি পরিদর্শনে আসতে পারেন। আমাদের কৃষিবিদদের সাথে বসে এক কাপ চা খেতে খেতে আপনার ছাদবাগানের পরিকল্পনা করুন এবং নিজের পছন্দের চারাটি নিজেই নির্বাচন করে নিয়ে যান।"
                : "We warmly invite you to visit our botanical farm in Savar. Meet our agronomists, inspect our fruiting mother trees, and personally select the perfect saplings for your terrace."}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-cream-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? "খোলা থাকে: প্রতিদিন সকাল ৯টা - সন্ধ্যা ৬টা" : "Open Daily: 9 AM - 6 PM"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isBn ? "বিনামূল্যে অন-স্পট কৃষি পরামর্শ" : "Free On-Site Agronomist Advice"}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-extrabold text-xs sm:text-sm shadow-terracotta-md transition-all active:scale-95"
              >
                <span>{isBn ? "লোকেশন ও দিকনির্দেশনা" : "Get Directions & Contact"}</span>
                <ArrowRight className="w-4 h-4 text-cream-100" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-cream-50 font-bold text-xs sm:text-sm border border-white/20 transition-all"
              >
                <span>{isBn ? "অনলাইনে অর্ডার করুন" : "Browse Online Catalog"}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
