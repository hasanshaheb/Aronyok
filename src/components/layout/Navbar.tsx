"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sprout,
  ShoppingBag,
  Menu,
  X,
  Shield,
  Search,
  Globe,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { toBengaliNumerals } from "../../lib/utils";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  // Hide main store navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const isBn = language === "bn";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const navLinks = [
    { href: "/shop", label: t.nav.shop },
    { href: "/blog", label: t.nav.blog },
    { href: "/tools", label: t.nav.tools },
    { href: "/order-tracking", label: isBn ? "অর্ডার ট্র্যাকিং" : "Track Order" },
    { href: "/about-us", label: t.nav.pages },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-forest-100/90 transition-all shadow-soft-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Forest + Amber Sprout Accent */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-800 via-forest-900 to-forest-950 flex items-center justify-center text-cream-100 shadow-soft-md group-hover:scale-105 group-hover:shadow-soft-lg transition-all duration-300 border border-forest-700/60 ring-1 ring-forest-500/20">
              <Sprout className="w-6 h-6 text-amber-400 stroke-[2.3] group-hover:rotate-6 transition-transform" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-forest-950 group-hover:text-forest-800 transition-colors">
                  {isBn ? "আরণ্যক" : "ARONYOK"}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-earth-600 -mt-0.5 tracking-wider uppercase">
                {isBn ? "প্রকৃতির শুদ্ধ ছোঁয়া • নার্সারি ও ভেষজ" : "With Nature, Towards The Future"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[16px] font-semibold transition-all duration-200 py-1.5 px-0.5 relative ${
                    isActive
                      ? "text-forest-900 font-bold"
                      : "text-charcoal-700 hover:text-forest-900"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-terracotta-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search Toggle */}
            <div className="relative">
              {searchOpen ? (
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex items-center bg-white border border-forest-200 rounded-full pl-3 pr-1 py-1 shadow-soft-sm animate-in fade-in"
                >
                  <Search className="w-3.5 h-3.5 text-forest-600 mr-1.5" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBn ? "গাছ বা মধু খুঁজুন..." : "Search plants & honey..."}
                    className="w-36 sm:w-48 text-xs bg-transparent focus:outline-none text-charcoal-900 placeholder:text-stone-400 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1 rounded-full text-stone-400 hover:text-forest-900"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 rounded-full hover:bg-forest-100/70 text-forest-850 hover:text-forest-950 transition-colors"
                  title="Search catalog"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest-200 bg-cream-100 hover:bg-white text-forest-900 text-xs font-bold shadow-xs transition-all duration-200 hover:border-forest-400"
              title={language === "en" ? "বাংলায় পরিবর্তন করুন" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 text-terracotta-600" />
              <span>{language === "en" ? "বাংলা" : "EN"}</span>
            </button>

            {/* Cart Trigger Button with Vibrant Terracotta Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-forest-800 hover:bg-forest-900 text-white transition-all shadow-soft-sm hover:scale-105 active:scale-95"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-cream-100" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-terracotta-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-terracotta-sm animate-bounce-subtle">
                  {isBn ? toBengaliNumerals(totalItems) : totalItems}
                </span>
              )}
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-forest-50 hover:bg-forest-100 text-forest-900 border border-forest-200 transition-colors"
              title="Aronyok Admin Portal"
            >
              <Shield className="w-3.5 h-3.5 text-forest-700" />
              <span>{t.nav.admin}</span>
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-forest-950 lg:hidden hover:bg-forest-100"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-forest-100 bg-[#FDFBF7] px-6 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[16px] font-semibold text-forest-950 hover:text-terracotta-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-forest-100 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold text-forest-900 py-1"
            >
              <Shield className="w-4 h-4 text-forest-700" />
              <span>{t.nav.admin}</span>
            </Link>
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold px-3 py-1.5 rounded-full bg-forest-100 text-forest-800"
            >
              {language === "en" ? "বাংলায় দেখুন" : "View in English"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
