"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, Heart, Leaf, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function Footer() {
  const { language, t } = useLanguage();
  const pathname = usePathname();

  // Hide main footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-forest-900 text-cream-100 border-t border-forest-800/80 pt-16 pb-12 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-forest-700/80 flex items-center justify-center text-mint-300 border border-forest-600/50">
                <Sprout className="w-5 h-5 text-forest-300" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                {language === "bn" ? "আরণ্যক" : "Aronyok"}
              </span>
            </div>
            <p className="text-forest-200/80 text-sm leading-relaxed">
              {t.footer.aboutText}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-forest-300">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>100% Biodegradable & Chemical-Free</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-earth-300 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-sm text-forest-200">
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
                <Link href="/tools" className="hover:text-white transition-colors">
                  {t.nav.tools}
                </Link>
              </li>
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  {t.nav.pages}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  {t.nav.cart}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Dynamic Pages & Policies */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-earth-300 mb-4">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2.5 text-sm text-forest-200">
              <li>
                <Link href="/about-us" className="hover:text-white transition-colors">
                  {language === "bn" ? "আমাদের পরিচিতি" : "About Us"}
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="hover:text-white transition-colors">
                  {language === "bn" ? "টেকসই অঙ্গীকার" : "Sustainability Pledge"}
                </Link>
              </li>
              <li>
                <Link href="/tools/herbal-remedy-finder" className="hover:text-white transition-colors">
                  {language === "bn" ? "ভেষজ নির্দেশক টুল" : "Herbal Remedy Tool"}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  {language === "bn" ? "অ্যাডমিন প্রবেশদ্বার" : "Admin Portal"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-earth-300">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-forest-200/80 leading-relaxed">
              {t.footer.newsletterDesc}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(
                  language === "bn"
                    ? "সবুজ পরিবারের সাথে যুক্ত হওয়ার জন্য ধন্যবাদ!"
                    : "Thank you for subscribing to our green circle!"
                );
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                required
                placeholder={t.footer.emailPlaceholder}
                className="px-3.5 py-2.5 rounded-xl bg-forest-800/90 border border-forest-700 text-white placeholder-forest-400 text-xs focus:outline-none focus:ring-2 focus:ring-forest-400 flex-1"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-forest-500 hover:bg-forest-400 text-white font-semibold text-xs transition-colors shadow-sm whitespace-nowrap"
              >
                {t.footer.subscribe}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-forest-800 flex flex-col sm:flex-row items-center justify-between text-xs text-forest-300/80 gap-4">
          <p>© {new Date().getFullYear()} Aronyok (আরণ্যক). {t.footer.rights}</p>
          <div className="flex items-center gap-1.5 text-forest-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
            <span>for natural well-being</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
