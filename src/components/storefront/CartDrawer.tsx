"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
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

  const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : 70;
  const grandTotal = subtotal + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden transition-opacity">
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-forest-950/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#fdfbf7] shadow-2xl border-l border-forest-100 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-forest-100 flex items-center justify-between bg-cream-50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-100 flex items-center justify-center text-forest-800">
                <ShoppingBag className="w-5 h-5 text-forest-700" />
              </div>
              <h2 className="text-lg font-bold text-forest-900">
                {t.cart.title}
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-forest-600 hover:text-forest-900 rounded-lg hover:bg-forest-100/60 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Items or Empty */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-forest-700/60">
                <div className="w-16 h-16 rounded-full bg-forest-50 border border-forest-200/50 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-forest-400" />
                </div>
                <p className="text-base font-medium text-forest-900 mb-1">
                  {t.cart.emptyMessage}
                </p>
                <p className="text-xs text-forest-600 mb-6 max-w-xs">
                  {language === "bn"
                    ? "আমাদের জৈব ও প্রাকৃতিক সম্ভার থেকে পণ্য বেছে নিন।"
                    : "Add natural herbs, organic honey, and living plants to your basket."}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3.5 rounded-2xl bg-white border border-forest-100/80 shadow-soft-sm hover:shadow-soft-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-forest-50 flex-shrink-0">
                    <Image
                      src={item.product.image_url}
                      alt={localize(item.product.name)}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-forest-900 line-clamp-1">
                          {localize(item.product.name)}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          title={t.cart.remove}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-bold text-forest-700 mt-0.5">
                        {formatCurrency(item.product.price, language)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-forest-200 rounded-lg bg-cream-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 text-forest-700 hover:bg-forest-100 rounded-l-lg transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-forest-900">
                          {language === "bn"
                            ? toBengaliNumerals(item.quantity)
                            : item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="p-1 text-forest-700 hover:bg-forest-100 rounded-r-lg transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-forest-900">
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
            <div className="p-6 border-t border-forest-100 bg-cream-50 space-y-3">
              <div className="space-y-1.5 text-xs text-forest-800">
                <div className="flex justify-between">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-semibold">
                    {formatCurrency(subtotal, language)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t.cart.shipping}</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">
                        {language === "bn" ? "বিনামূল্যে" : "Free"}
                      </span>
                    ) : (
                      formatCurrency(deliveryFee, language)
                    )}
                  </span>
                </div>
                <div className="text-[11px] text-forest-600 italic">
                  {t.cart.freeShippingNotice}
                </div>
                <div className="border-t border-forest-200/60 pt-2 flex justify-between text-sm font-bold text-forest-950">
                  <span>{t.cart.total}</span>
                  <span>{formatCurrency(grandTotal, language)}</span>
                </div>
              </div>

              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-white font-semibold text-sm shadow-md transition-all duration-200 hover:shadow-lg"
              >
                <span>{t.cart.checkout}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
