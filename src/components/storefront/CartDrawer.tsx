"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency, toBengaliNumerals } from "../../lib/utils";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
  } = useCart();
  const { language, t, localize } = useLanguage();

  if (!isCartOpen) return null;

  const isBn = language === "bn";
  const FREE_SHIPPING_THRESHOLD = 1500;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const amountNeeded = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const deliveryFee = isFreeShipping || subtotal === 0 ? 0 : 70;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden transition-opacity">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FDFBF7] shadow-2xl border-l border-forest-200 flex flex-col">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-forest-100 flex items-center justify-between bg-cream-100/70">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-forest-850 flex items-center justify-center text-cream-100 shadow-soft-sm">
                <ShoppingBag className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-forest-950 leading-tight">
                  {t.cart.title}
                </h2>
                <p className="text-[11px] text-charcoal-500">
                  {items.length > 0
                    ? isBn
                      ? `${toBengaliNumerals(items.length)}টি পণ্য যুক্ত আছে`
                      : `${items.length} unique items in basket`
                    : isBn
                    ? "ঝুড়ি খালি"
                    : "Basket is empty"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-charcoal-500 hover:text-forest-950 rounded-xl hover:bg-forest-100/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter with Vibrant Terracotta Gradient */}
          {items.length > 0 && (
            <div className="px-6 py-3.5 bg-forest-50/80 border-b border-forest-100">
              <div className="flex items-center justify-between text-xs font-semibold text-forest-950 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-terracotta-600" />
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-bold">
                      {isBn
                        ? "🎉 অভিনন্দন! অর্ডারে ফ্রি ডেলিভারি আনলক হয়েছে!"
                        : "🎉 Free Eco Delivery Unlocked!"}
                    </span>
                  ) : (
                    <span>
                      {isBn
                        ? `আর মাত্র ${formatCurrency(amountNeeded, language)} যোগ করলেই ফ্রি ডেলিভারি!`
                        : `Add ${formatCurrency(amountNeeded, language)} more for Free Shipping!`}
                    </span>
                  )}
                </span>
                <span className="text-[11px] font-bold text-forest-800">
                  {isBn ? `${toBengaliNumerals(progressPercent)}%` : `${progressPercent}%`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-forest-200/60 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isFreeShipping
                      ? "bg-emerald-600"
                      : "bg-gradient-to-r from-terracotta-500 to-amber-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Body: Items or Empty */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3.5">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-forest-700/60">
                <div className="w-16 h-16 rounded-3xl bg-forest-100/60 border border-forest-200 flex items-center justify-center mb-4 shadow-soft-sm">
                  <ShoppingBag className="w-8 h-8 text-forest-600" />
                </div>
                <p className="text-base font-bold text-forest-950 mb-1">
                  {t.cart.emptyMessage}
                </p>
                <p className="text-xs text-charcoal-500 mb-6 max-w-xs leading-relaxed">
                  {isBn
                    ? "আমাদের ফলদ ও ভেষজ চারা, সুন্দরবনের মধু এবং অর্গানিক সম্ভার থেকে পণ্য বেছে নিন।"
                    : "Add natural herbs, organic honey, and living plants to your basket."}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 rounded-2xl bg-forest-850 hover:bg-forest-900 text-white text-xs font-bold shadow-soft-sm transition-all"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3.5 p-3 rounded-2xl bg-white border border-forest-100 shadow-soft-sm hover:shadow-soft-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-forest-50 flex-shrink-0 border border-forest-50">
                    <Image
                      src={
                        item.product.image_url ||
                        "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={localize(item.product.name)}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1.5">
                        <Link
                          href={`/shop/${item.product.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs sm:text-sm font-bold text-forest-950 hover:text-terracotta-600 line-clamp-1 transition-colors"
                        >
                          {localize(item.product.name)}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          title={t.cart.remove}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-extrabold text-forest-800 mt-0.5">
                        {formatCurrency(item.product.price, language)}
                      </p>
                    </div>

                    {/* Quantity Stepper & Subtotal */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-forest-200 rounded-lg bg-cream-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 text-forest-800 hover:bg-forest-100 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-forest-950">
                          {isBn
                            ? toBengaliNumerals(item.quantity)
                            : item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 text-forest-800 hover:bg-forest-100 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-extrabold text-forest-950">
                        {formatCurrency(
                          item.product.price * item.quantity,
                          language
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-forest-100 bg-cream-50 space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal-700">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-bold text-forest-950">
                    {formatCurrency(subtotal, language)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>{t.cart.shipping}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
                        {isBn ? "বিনামূল্যে (Free)" : "Free"}
                      </span>
                    ) : (
                      <span className="font-semibold text-forest-950">
                        {formatCurrency(deliveryFee, language)}
                      </span>
                    )}
                  </span>
                </div>

                <div className="border-t border-forest-200/80 pt-2 flex justify-between text-sm sm:text-base font-extrabold text-forest-950">
                  <span>{t.cart.total}</span>
                  <span className="text-forest-950">{formatCurrency(grandTotal, language)}</span>
                </div>
              </div>

              {/* Action Buttons: Vibrant Terracotta Conversion Star */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-terracotta-600 via-terracotta-500 to-[#d46d3e] hover:from-terracotta-700 hover:to-terracotta-600 text-white font-extrabold text-sm shadow-terracotta-md hover:shadow-terracotta-lg active:scale-95 transition-all duration-200"
                >
                  <span>{isBn ? "অর্ডার সম্পন্ন করুন (চেকআউট)" : "Proceed to Checkout"}</span>
                  <ArrowRight className="w-4 h-4 text-cream-100" />
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-white hover:bg-cream-100 text-forest-900 font-bold text-xs border border-forest-200 transition-colors"
                >
                  <span>{isBn ? "আরো চারা ও পণ্য যোগ করুন" : "Add More Plants & Goods"}</span>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-charcoal-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
                <span>{isBn ? "ক্যাশ অন ডেলিভারি ও নিরাপদ পেমেন্ট" : "Cash on Delivery & Secure Payments"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
