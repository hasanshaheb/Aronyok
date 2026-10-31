"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Heart,
  Leaf,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  CheckCircle2,
  TreePine,
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
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 pt-16 pb-12 mt-20 transition-colors relative overflow-hidden">
      {/* Decorative nature backdrop */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-forest-800/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-forest-900/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
          {/* Col 1: Brand & Philosophy (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-mint-300 border border-forest-700/60 shadow-sm">
                <Sprout className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block leading-tight">
                  {isBn ? "আরণ্যক" : "ARONYOK"}
                </span>
                <span className="text-[11px] text-sage-300 tracking-wider font-medium">
                  {isBn ? "প্রকৃতির সান্নিধ্যে, আগামীর পথে" : "With Nature, Towards the Future"}
                </span>
              </div>
            </div>

            <p className="text-forest-200/80 text-xs sm:text-sm leading-relaxed max-w-sm">
              {isBn
                ? "আরণ্যক একটি অগ্রগামী দ্বিভাষিক পরিবেশবান্ধব উদ্যোগ যা সুস্থ কলম চারা, সুন্দরবনের খাঁটি মধু, কোল্ড-প্রেসড ভেষজ তেল এবং বাংলার ঐতিহ্যবাহী মৃৎশিল্পকে পৌঁছে দেয় আপনার আঙিনায়।"
                : "A pioneering botanical enterprise delivering healthy grafted fruit saplings, wild raw mangrove honey, cold-pressed therapeutic oils, and rural terracotta pottery to your home."}
            </p>

            <div className="space-y-2 pt-2 text-xs text-forest-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>+880 1712-345678 (সকাল ৯টা - রাত ৯টা)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>care@aronyok.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>সাভার নার্সারি ও বোটানিক্যাল ফার্ম, ঢাকা</span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-300 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-forest-200/90">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  {t.nav.blog}
                </Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-white transition-colors">
                  {isBn ? "অর্ডার ট্র্যাকিং" : "Track Order"}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {isBn ? "যোগাযোগ ও নার্সারি" : "Contact Nursery"}
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition-colors">
                  {t.nav.tools}
                </Link>
              </li>
              <li>
                <Link href="/chat" className="hover:text-white transition-colors">
                  {isBn ? "এআই প্ল্যান্ট অ্যাসিস্ট্যান্ট" : "AI Plant Doctor"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dynamic Pages & Policies (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-300 mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-forest-200/90">
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  {isBn ? "আমাদের গল্প ও দর্শন" : "Our Story & Vision"}
                </Link>
              </li>
              <li>
                <Link href="/shipping-and-returns" className="hover:text-white transition-colors">
                  {isBn ? "চারা ডেলিভারি ও রিপ্লেসমেন্ট পলিসি" : "Plant Transit & Replacement"}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  {isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  {isBn ? "সেবা ও ক্রয়ের শর্তাবলী" : "Terms & Conditions"}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  {isBn ? "ব্যবস্থাপনা পোর্টাল (অ্যাডমিন)" : "Management Portal (Admin)"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Community (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-earth-300">
              {isBn ? "সবুজ পরিবারে যুক্ত হোন" : "Join the Green Circle"}
            </h4>
            <p className="text-xs text-forest-200/80 leading-relaxed">
              {isBn
                ? "প্রথম অর্ডারে ১০% ছাড় পেতে কুপন কোড WELCOME10 ব্যবহার করুন। প্রতি সপ্তাহে পাবেন ছাদবাগান পরিচর্যা টিপস।"
                : "Enjoy 10% off your first harvest with coupon WELCOME10. Receive seasonal plant care guides and early discounts."}
            </p>

            {subscribed ? (
              <div className="p-3 rounded-2xl bg-forest-800/80 border border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2">
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-forest-900 border border-forest-750 text-white placeholder-forest-400 text-xs focus:outline-none focus:ring-2 focus:ring-forest-400"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 rounded-xl bg-forest-600 hover:bg-forest-500 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {isBn ? "যুক্ত হোন (১০% ছাড় পান)" : "Subscribe & Get 10% Off"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Accepted Payment Methods & Trust Badges */}
        <div className="pt-8 border-t border-forest-850 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-forest-300">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-forest-200">
              {isBn ? "নিরাপদ পেমেন্ট মাধ্যম:" : "Secure Payment Options:"}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-1 rounded-md bg-forest-900 border border-forest-800 text-[10px] font-bold text-white">
                bKash
              </span>
              <span className="px-2 py-1 rounded-md bg-forest-900 border border-forest-800 text-[10px] font-bold text-white">
                Nagad
              </span>
              <span className="px-2 py-1 rounded-md bg-forest-900 border border-forest-800 text-[10px] font-bold text-white">
                Rocket
              </span>
              <span className="px-2 py-1 rounded-md bg-forest-900 border border-forest-800 text-[10px] font-bold text-white">
                Visa / Master
              </span>
              <span className="px-2 py-1 rounded-md bg-forest-900 border border-forest-800 text-[10px] font-bold text-emerald-400">
                Cash on Delivery (ক্যাশ অন ডেলিভারি)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-forest-300/90">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? "সারা দেশে হোম ডেলিভারি" : "Nationwide Delivery"}</span>
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isBn ? "লাইভ প্ল্যান্ট রিপ্লেসমেন্ট" : "Live Replacement Guarantee"}</span>
            </span>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 mt-6 border-t border-forest-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-400/80 gap-3">
          <p>© {new Date().getFullYear()} Aronyok (আরণ্যক). {t.footer.rights}</p>
          <div className="flex items-center gap-1.5 text-forest-300">
            <span>{isBn ? "প্রকৃতির সুরক্ষায় নিবেদিত" : "Crafted with"}</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-400 fill-terracotta-400" />
            <span>{isBn ? "সবুজ বাংলাদেশের জন্য" : "for living harmony"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
