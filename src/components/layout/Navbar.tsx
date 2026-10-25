"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sprout, ShoppingBag, Menu, X, Shield, Sparkles, Globe } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { toBengaliNumerals } from "../../lib/utils";

export default function Navbar() {
  const { language, toggleLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide main store navbar on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { href: "/shop", label: t.nav.shop },
    { href: "/blog", label: t.nav.blog },
    { href: "/tools", label: t.nav.tools },
    { href: "/about-us", label: t.nav.pages },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-forest-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-forest-600 to-forest-800 flex items-center justify-center text-cream-100 shadow-soft-sm group-hover:scale-105 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-mint-300 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-2xl tracking-tight text-forest-900 group-hover:text-forest-700 transition-colors">
                {language === "bn" ? "অরণ্যক" : "Aronyok"}
              </span>
              <span className="text-[11px] font-medium text-earth-600 -mt-1 tracking-wider uppercase">
                {language === "bn" ? "প্রকৃতির শুদ্ধ ছোঁয়া" : "Pure Living & Herbs"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 py-1.5 px-1 relative ${
                    isActive
                      ? "text-forest-700"
                      : "text-forest-900/80 hover:text-forest-700"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Language Toggle, Cart, Admin */}
          <div className="flex items-center gap-3">
            {/* Language Switcher Pill */}
            <button
              onClick={toggleLanguage}
              aria-label="Toggle language"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-forest-200 bg-cream-50 hover:bg-forest-50 text-forest-800 text-xs font-semibold shadow-sm transition-all duration-200 hover:border-forest-300"
              title={language === "en" ? "বাংলায় পরিবর্তন করুন" : "Switch to English"}
            >
              <Globe className="w-3.5 h-3.5 text-forest-600" />
              <span>{language === "en" ? "বাংলা" : "English"}</span>
            </button>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-cream-100 hover:bg-forest-100/60 text-forest-900 transition-colors shadow-sm"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-forest-800" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-forest-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse-glow">
                  {language === "bn" ? toBengaliNumerals(totalItems) : totalItems}
                </span>
              )}
            </button>

            {/* Admin CMS Shortcut Link */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-earth-100/80 hover:bg-earth-200/90 text-earth-800 border border-earth-200/70 transition-colors"
              title="Aronyok Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-earth-700" />
              <span>{t.nav.admin}</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-forest-900 md:hidden hover:bg-forest-100"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-forest-100 bg-[#fdfbf7] px-5 py-4 space-y-3 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-forest-900 hover:text-forest-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-forest-100 flex items-center justify-between">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-semibold text-earth-700 py-1"
            >
              <Shield className="w-4 h-4" />
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
