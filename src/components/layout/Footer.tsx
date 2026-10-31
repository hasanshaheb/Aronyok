"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Heart,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  TreePine,
  ArrowRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { language, t } = useLanguage();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const isBn = language === "bn";

  // Hide main footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="bg-gradient-to-b from-forest-900 via-forest-850 to-forest-950 text-cream-100 border-t border-forest-800/90 pt-16 pb-12 mt-20 transition-colors relative overflow-hidden">
      {/* Botanical Organic Background Blurs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-forest-700/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-terracotta-600/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -mt-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand & Philosophy (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-forest-800 border border-forest-700/80 flex items-center justify-center text-cream-100 shadow-soft-md ring-1 ring-forest-500/20">
                <Sprout className="w-6 h-6 text-amber-400 stroke-[2.3]" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block leading-tight">
                  {isBn ? "আরণ্যক" : "ARONYOK"}
                </span>
                <span className="text-[11px] text-sage-300 tracking-wider font-semibold uppercase">
                  {isBn ? "প্রকৃতির সান্নিধ্যে, আগামীর পথে" : "With Nature, Towards the Future"}
                </span>
              </div>
            </div>

            <p className="text-cream-200/90 text-xs sm:text-sm leading-relaxed max-w-sm font-normal">
              {isBn
                ? "আরণ্যক একটি অগ্রগামী দ্বিভাষিক পরিবেশবান্ধব প্ল্যাটফর্ম যা রোগমুক্ত সুস্থ কলম চারা, সুন্দরবনের খাঁটি বুনো মধু, কোল্ড-প্রেসড ভেষজ তেল এবং বাংলার ঐতিহ্যবাহী মৃৎশিল্প পৌঁছে দেয় আপনার আঙিনায়।"
                : "A pioneering botanical enterprise delivering healthy grafted fruit saplings, wild raw mangrove honey, cold-pressed therapeutic oils, and rural terracotta pottery to your home."}
            </p>

            <div className="space-y-2 pt-2 text-xs text-cream-200">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-terracotta-400 flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span>+880 1712-345678 (সকাল ৯টা - রাত ৯টা)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-terracotta-400 flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span>care@aronyok.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-forest-800 flex items-center justify-center text-terracotta-400 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <span>সাভার নার্সারি ও বোটানিক্যাল ফার্ম, ঢাকা</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 flex items-center gap-1.5">
              <TreePine className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.footer.quickLinks}</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-cream-200/90 font-medium">
              <li>
                <Link href="/shop" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "অর্ডার ট্র্যাকিং" : "Track Order"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "যোগাযোগ ও নার্সারি" : "Contact Nursery"}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {t.nav.tools}
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "এআই প্ল্যান্ট ডক্টর" : "AI Plant Doctor"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dynamic Pages & Policies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-4 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.footer.legal}</span>
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-cream-200/90 font-medium">
              <li>
                <Link href="/about-us" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "আমাদের গল্প ও দর্শন" : "Our Story & Vision"}
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-returns" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "চারা ডেলিভারি ও রিপ্লেসমেন্ট" : "Plant Transit & Replacement"}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "সেবা ও ক্রয়ের শর্তাবলী" : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-300 hover:translate-x-1 inline-block transition-all">
                  {isBn ? "ব্যবস্থাপনা পোর্টাল (অ্যাডমিন)" : "Management Portal (Admin)"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter with Vibrant Terracotta Action (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <span>{isBn ? "সবুজ পরিবারে যুক্ত হোন" : "Join the Green Circle"}</span>
            </h4>
            <p className="text-xs text-cream-200/85 leading-relaxed font-normal">
              {isBn ? (
                <>
                  প্রথম অর্ডারে ১০% ছাড় পেতে ব্যবহার করুন কুপন কোড:{" "}
                  <span className="text-terracotta-300 font-bold bg-forest-950/80 px-2 py-0.5 rounded border border-terracotta-500/40 inline-block mt-1">
                    WELCOME10
                  </span>
                </>
              ) : (
                <>
                  Enjoy 10% off your first harvest with coupon:{" "}
                  <span className="text-terracotta-300 font-bold bg-forest-950/80 px-2 py-0.5 rounded border border-terracotta-500/40 inline-block mt-1">
                    WELCOME10
                  </span>
                </>
              )}
            </p>

            {subscribed ? (
              <div className="p-3.5 rounded-2xl bg-forest-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  {isBn
                    ? "ধন্যবাদ! আপনার ইমেইল সফলভাবে যুক্ত হয়েছে।"
                    : "Welcome! You're now subscribed."}
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.emailPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-950/90 border border-forest-700 text-white placeholder-forest-300/60 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white font-extrabold text-xs shadow-terracotta-md hover:shadow-terracotta-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{isBn ? "যুক্ত হোন (১০% ছাড় পান)" : "Subscribe & Get 10% Off"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Accepted Payment Methods & Trust Badges */}
        <div className="pt-8 border-t border-forest-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-200">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold text-cream-100 text-xs">
              {isBn ? "নিরাপদ পেমেন্ট মাধ্যম:" : "Secure Payment Options:"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-[#E2136E] text-white text-[11px] font-black shadow-xs tracking-wider">
                bKash
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#F7941D] text-white text-[11px] font-black shadow-xs tracking-wider">
                Nagad
              </span>
              <span className="px-3 py-1 rounded-lg bg-[#8C3494] text-white text-[11px] font-black shadow-xs tracking-wider">
                Rocket
              </span>
              <span className="px-3 py-1 rounded-lg bg-white text-forest-950 text-[11px] font-black shadow-xs tracking-wider">
                Visa / Master
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-700 text-cream-50 text-[11px] font-bold shadow-xs">
                {isBn ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-cream-200 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-terracotta-400" />
              <span>{isBn ? "সারাদেশে চারা ট্রানজিট" : "Nationwide Plant Transit"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{isBn ? "লাইভ রিপ্লেসমেন্ট গ্যারান্টি" : "Live Replacement Guarantee"}</span>
            </span>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 mt-6 border-t border-forest-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300 gap-3">
          <p>© {new Date().getFullYear()} Aronyok (আরণ্যক). {t.footer.rights}</p>
          <div className="flex items-center gap-1.5 text-cream-200">
            <span>{isBn ? "প্রকৃতির ভালোবাসায় তৈরি" : "Crafted with"}</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-500 fill-terracotta-500" />
            <span>{isBn ? "সবুজ বাংলাদেশের জন্য" : "for living harmony"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
