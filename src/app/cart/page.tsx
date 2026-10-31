"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CreditCard,
  PhoneCall,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { formatCurrency, toBengaliNumerals } from "../../lib/utils";

export default function CartCheckoutPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { language, t, localize } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    division: "Dhaka",
    city: "Dhaka",
    thana: "",
    notes: "",
    paymentMethod: "cod" as "cod" | "bkash" | "nagad" | "sslcommerz" | "stripe",
    mfsTrxId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  const isDhaka =
    (formData.city || "").toLowerCase().includes("dhaka") ||
    (formData.division || "").toLowerCase().includes("dhaka");
  const deliveryFee = subtotal >= 1500 || subtotal === 0 ? 0 : isDhaka ? 70 : 130;
  const grandTotal = subtotal + deliveryFee;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: formData.address,
          division: formData.division,
          city: formData.city,
          thana: formData.thana,
          notes: `${formData.notes}${
            formData.mfsTrxId ? ` [MFS TrxID: ${formData.mfsTrxId}]` : ""
          }`,
          payment_method: formData.paymentMethod,
          items: items.map((i) => ({
            product_id: i.product.id,
            slug: i.product.slug,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCompletedOrder(data);
        clearCart();
      } else {
        alert(data.error || "Failed to submit order. Please check inputs.");
      }
    } catch {
      alert("Network error while submitting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-soft-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-forest-950">
          {t.checkout.orderSuccess}
        </h1>
        <div className="p-6 rounded-3xl bg-cream-50 border border-forest-100 text-left space-y-3 shadow-soft-sm">
          <div className="flex justify-between text-sm pb-2 border-b border-forest-100">
            <span className="text-forest-600 font-medium">{t.checkout.orderNumber}:</span>
            <span className="font-mono font-extrabold text-forest-950 bg-forest-100/70 px-2 py-0.5 rounded-md">
              {completedOrder.orderNumber}
            </span>
          </div>
          <div className="flex justify-between text-xs text-forest-700">
            <span>{language === "bn" ? "পণ্যের মোট মূল্য:" : "Subtotal:"}</span>
            <span className="font-semibold">{formatCurrency(completedOrder.subtotal, language)}</span>
          </div>
          <div className="flex justify-between text-xs text-forest-700">
            <span>{language === "bn" ? "ডেলিভারি চার্জ:" : "Delivery Fee:"}</span>
            <span className="font-semibold">
              {completedOrder.deliveryCharge === 0
                ? (language === "bn" ? "বিনামূল্যে (Free)" : "Free Delivery")
                : formatCurrency(completedOrder.deliveryCharge, language)}
            </span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-forest-100 font-bold text-forest-950">
            <span>{t.cart.total}:</span>
            <span className="text-base text-emerald-800">
              {formatCurrency(completedOrder.total_amount, language)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-forest-700">
            <span>{language === "bn" ? "পেমেন্ট মাধ্যম:" : "Payment Method:"}</span>
            <span className="font-bold uppercase text-earth-700">
              {completedOrder.payment_method}
            </span>
          </div>
          {completedOrder.paymentInstructions && (
            <div className="mt-4 p-4 bg-white rounded-2xl border border-emerald-200 text-xs text-forest-900 space-y-1.5 shadow-xs">
              <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === "bn" ? "পেমেন্ট নির্দেশিকা" : "Payment Instructions"}</span>
              </p>
              <p className="text-stone-700 leading-relaxed">{completedOrder.paymentInstructions.note}</p>
            </div>
          )}
        </div>
        <p className="text-xs text-forest-700">{t.checkout.weWillContact}</p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/order-tracking"
            className="px-5 py-2.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            {language === "bn" ? "অর্ডার ট্র্যাক করুন" : "Track Order"}
          </Link>
          <button
            onClick={() => window.print()}
            className="px-5 py-2.5 rounded-2xl border border-forest-200 bg-white hover:bg-cream-50 text-forest-900 font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            {language === "bn" ? "ইনভয়েস প্রিন্ট করুন" : "Print Invoice"}
          </button>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition-colors"
          >
            <span>{t.cart.continueShopping}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-forest-50 border border-forest-100 flex items-center justify-center mx-auto text-forest-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-forest-950">
          {t.cart.emptyMessage}
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-sm shadow-md transition-colors"
        >
          <span>{t.cart.continueShopping}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight mb-8">
        {t.checkout.title}
      </h1>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customer details & Payment Gateway selection */}
          <div className="lg:col-span-7 space-y-6">
            {/* Delivery Details */}
            <div className="p-6 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
              <h2 className="text-base font-bold text-forest-950">
                {t.checkout.shippingInfo}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    {t.checkout.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="017xxxxxxxx"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  {t.checkout.email} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    {language === "bn" ? "বিভাগ (Division)" : "Division"} *
                  </label>
                  <select
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 cursor-pointer"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barishal">Barishal (বরিশাল)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rangpur">Rangpur (রংপুর)</option>
                    <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    {language === "bn" ? "জেলা (District)" : "District"} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhaka, Bogura"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    {language === "bn" ? "থানা / উপজেলা" : "Thana / Upazila"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dhanmondi, Gulshan"
                    value={formData.thana}
                    onChange={(e) =>
                      setFormData({ ...formData, thana: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  {t.checkout.address} *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>
            </div>

            {/* Payment Method Scaffolding */}
            <div className="p-6 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
              <h2 className="text-base font-bold text-forest-950">
                {t.checkout.paymentMethod}
              </h2>
              <div className="space-y-3">
                {/* Cash on Delivery */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "cod"
                      ? "border-forest-700 bg-forest-50/50"
                      : "border-forest-100 hover:bg-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "cod" })
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-forest-700" />
                      <span className="font-bold text-sm text-forest-950">
                        {t.checkout.cod}
                      </span>
                    </div>
                    <p className="text-xs text-forest-600 mt-0.5">
                      {t.checkout.codDesc}
                    </p>
                  </div>
                </label>

                {/* bKash / Nagad MFS */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "bkash"
                      ? "border-forest-700 bg-forest-50/50"
                      : "border-forest-100 hover:bg-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={formData.paymentMethod === "bkash"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "bkash" })
                    }
                    className="mt-1"
                  />
                  <div className="w-full">
                    <div className="flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-pink-600" />
                      <span className="font-bold text-sm text-forest-950">
                        {t.checkout.bkash}
                      </span>
                    </div>
                    <p className="text-xs text-forest-600 mt-0.5">
                      {t.checkout.bkashDesc}
                    </p>
                    {formData.paymentMethod === "bkash" && (
                      <div className="mt-3 p-3 bg-white rounded-xl border border-pink-200 text-xs space-y-2">
                        <p className="font-medium text-pink-900">
                          Merchant Number: <strong>01711-223344</strong> (Payment / Send Money)
                        </p>
                        <input
                          type="text"
                          placeholder="Enter Transaction TrxID (e.g. 9J87AK...)"
                          value={formData.mfsTrxId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mfsTrxId: e.target.value,
                            })
                          }
                          className="w-full px-3 py-1.5 rounded-lg border border-pink-300 text-xs"
                        />
                      </div>
                    )}
                  </div>
                </label>

                {/* SSLCommerz Gateway */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "sslcommerz"
                      ? "border-forest-700 bg-forest-50/50"
                      : "border-forest-100 hover:bg-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="sslcommerz"
                    checked={formData.paymentMethod === "sslcommerz"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "sslcommerz" })
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-sm text-forest-950">
                        {t.checkout.sslcommerz}
                      </span>
                    </div>
                    <p className="text-xs text-forest-600 mt-0.5">
                      {t.checkout.sslcommerzDesc}
                    </p>
                  </div>
                </label>

                {/* Stripe Card */}
                <label
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                    formData.paymentMethod === "stripe"
                      ? "border-forest-700 bg-forest-50/50"
                      : "border-forest-100 hover:bg-cream-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="stripe"
                    checked={formData.paymentMethod === "stripe"}
                    onChange={() =>
                      setFormData({ ...formData, paymentMethod: "stripe" })
                    }
                    className="mt-1"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-indigo-700" />
                      <span className="font-bold text-sm text-forest-950">
                        {t.checkout.stripe}
                      </span>
                    </div>
                    <p className="text-xs text-forest-600 mt-0.5">
                      {t.checkout.stripeDesc}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
              <h2 className="text-base font-bold text-forest-950">
                {t.cart.title}
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center gap-3 py-2 border-b border-forest-50 last:border-none"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                      <Image
                        src={item.product.image_url}
                        alt={localize(item.product.name)}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-forest-900 truncate">
                        {localize(item.product.name)}
                      </h4>
                      <p className="text-xs text-forest-600">
                        {formatCurrency(item.product.price, language)} ×{" "}
                        {language === "bn"
                          ? toBengaliNumerals(item.quantity)
                          : item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-extrabold text-forest-900">
                      {formatCurrency(
                        item.product.price * item.quantity,
                        language
                      )}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing totals */}
              <div className="border-t border-forest-100 pt-3 space-y-2 text-xs text-forest-800">
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
                      <span className="text-emerald-700 font-bold">Free</span>
                    ) : (
                      formatCurrency(deliveryFee, language)
                    )}
                  </span>
                </div>
                <div className="border-t border-forest-200 pt-2 flex justify-between text-base font-extrabold text-forest-950">
                  <span>{t.cart.total}</span>
                  <span>{formatCurrency(grandTotal, language)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-700 hover:bg-forest-800 disabled:bg-stone-300 text-white font-bold text-sm shadow-md transition-all duration-200"
              >
                {isSubmitting ? t.checkout.processing : t.checkout.placeOrder}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
