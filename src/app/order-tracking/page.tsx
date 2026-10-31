"use client";

import React, { useState } from "react";
import {
  Search,
  Truck,
  Package,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  MapPin,
  Calendar,
  Phone,
  Sprout,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface TrackedOrder {
  id: string;
  created_at: string;
  order_status: string;
  payment_status: string;
  payment_method: string;
  total_price: number;
  delivery_charge: number;
  customer_name: string;
  city: string;
  district: string;
  items: Array<{
    product_id: string;
    product_name?: string;
    title?: string;
    quantity: number;
    price: number;
    image_url?: string;
  }>;
  shipment: {
    courier_name: string;
    tracking_code: string;
    consignment_id: string;
    status: string;
    estimated_delivery?: string;
  } | null;
}

export default function OrderTrackingPage() {
  const { language } = useLanguage();
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) {
      setError(
        language === "bn"
          ? "দয়া করে অর্ডার নম্বর এবং ফোন নম্বর দুটোই পূরণ করুন।"
          : "Please enter both your Order ID and Phone Number."
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, phone }),
      });

      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(
          data.error ||
            (language === "bn"
              ? "প্রদত্ত তথ্যের সাথে কোনো অর্ডার মেলেনি। অনুগ্রহ করে পুনরায় চেক করুন।"
              : "No order found matching these details. Please check your confirmation SMS.")
        );
      }
    } catch {
      setError(
        language === "bn"
          ? "অর্ডার অনুসন্ধানে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর চেষ্টা করুন।"
          : "Network error looking up order. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper for tracking progress steps
  const getStepStatus = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "delivered") return 4;
    if (s === "shipped" || s === "in_transit") return 3;
    if (s === "processing" || s === "confirmed") return 2;
    return 1;
  };

  const currentStep = order ? getStepStatus(order.order_status) : 1;

  return (
    <div className="min-h-screen bg-cream-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-forest-700" />
            <span>{language === "bn" ? "লাইভ পার্সেল ট্র্যাকিং" : "Live Sapling Tracking"}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-forest-950 tracking-tight">
            {language === "bn" ? "আপনার অর্ডার ট্র্যাক করুন" : "Track Your Order"}
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm max-w-lg mx-auto">
            {language === "bn"
              ? "অর্ডার কনফার্মেশন মেসেজে প্রেরিত অর্ডার আইডি এবং ফোন নম্বর দিয়ে রিয়েল-টাইম কুরিয়ার স্ট্যাটাস জানুন।"
              : "Enter your Order ID (from SMS confirmation) and Phone Number to check real-time courier status."}
          </p>
        </div>

        {/* Tracking Search Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-soft-sm">
          <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "bn" ? "অর্ডার আইডি / ইনভয়েস নম্বর *" : "Order ID / Invoice # *"}
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. ord-12345 or ARN-987"
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === "bn" ? "ফোন নম্বর (অর্ডারে ব্যবহৃত) *" : "Phone Number *"}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017xxxxxxxx"
                className="w-full px-3.5 py-2.5 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-1">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>
                  {isLoading
                    ? language === "bn"
                      ? "খোঁজা হচ্ছে..."
                      : "Searching..."
                    : language === "bn"
                    ? "ট্র্যাক করুন"
                    : "Track Order"}
                </span>
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3.5 bg-red-50 text-red-800 rounded-xl border border-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details & Stepper Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden animate-in fade-in duration-200">
            {/* Header Status Bar */}
            <div className="p-6 bg-forest-900 text-cream-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs text-forest-300 font-semibold uppercase tracking-wider">
                  Order Details
                </div>
                <h2 className="text-xl font-extrabold text-white">#{order.id.slice(0, 10)}</h2>
                <div className="text-xs text-forest-200/80 mt-0.5">
                  Placed on: {new Date(order.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Status: {order.order_status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-forest-800 text-forest-200 border border-forest-700">
                  Payment: {order.payment_status}
                </span>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="p-6 sm:p-8 border-b border-stone-100">
              <div className="grid grid-cols-4 gap-2 text-center">
                {/* Step 1 */}
                <div className="space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      currentStep >= 1
                        ? "bg-forest-800 text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    1
                  </div>
                  <div className="text-[11px] font-bold text-stone-800">
                    {language === "bn" ? "অর্ডার গ্রহণ" : "Confirmed"}
                  </div>
                </div>

                {/* Step 2 */}
                <div className="space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      currentStep >= 2
                        ? "bg-forest-800 text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    2
                  </div>
                  <div className="text-[11px] font-bold text-stone-800">
                    {language === "bn" ? "নার্সারি প্যাকেজিং" : "Packing Saplings"}
                  </div>
                </div>

                {/* Step 3 */}
                <div className="space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      currentStep >= 3
                        ? "bg-forest-800 text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    3
                  </div>
                  <div className="text-[11px] font-bold text-stone-800">
                    {language === "bn" ? "কুরিয়ারে ট্রানজিট" : "In Transit"}
                  </div>
                </div>

                {/* Step 4 */}
                <div className="space-y-2">
                  <div
                    className={`w-10 h-10 rounded-full mx-auto flex items-center justify-center font-bold text-xs ${
                      currentStep >= 4
                        ? "bg-emerald-600 text-white"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    4
                  </div>
                  <div className="text-[11px] font-bold text-stone-800">
                    {language === "bn" ? "ডেলিভারি সম্পন্ন" : "Delivered"}
                  </div>
                </div>
              </div>
            </div>

            {/* Courier Shipment Details Card */}
            {order.shipment ? (
              <div className="p-6 bg-emerald-50/60 border-b border-emerald-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-emerald-700" />
                    <span className="font-bold text-sm text-emerald-950 uppercase tracking-wider">
                      Courier Partner: {order.shipment.courier_name.toUpperCase()}
                    </span>
                  </div>
                  {order.shipment.courier_name === "steadfast" && (
                    <a
                      href={`https://steadfast.com.bd/t/${order.shipment.tracking_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
                    >
                      <span>Live Courier Tracking</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs pt-1">
                  <div>
                    <span className="text-stone-500 font-medium">Tracking Code: </span>
                    <span className="font-bold text-stone-900 font-mono">
                      {order.shipment.tracking_code}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Consignment: </span>
                    <span className="font-bold text-stone-900 font-mono">
                      {order.shipment.consignment_id}
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 font-medium">Logistics Status: </span>
                    <span className="font-bold text-emerald-800 capitalize">
                      {order.shipment.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-50 border-b border-stone-100 text-xs text-stone-600 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  {language === "bn"
                    ? "আপনার পার্সেলটি নার্সারিতে ভেন্টিলেটেড প্যাকেজিং ও শিকড় আর্দ্রকরণ প্রক্রিয়ায় রয়েছে। কুরিয়ারে হ্যান্ডওভার হওয়ামাত্র ট্র্যাকিং কোড সক্রিয় হবে।"
                    : "Your live plant order is currently in the nursery packaging room undergoing root-moisture treatment. Courier tracking ID will appear once dispatched."}
                </span>
              </div>
            )}

            {/* Items Ordered List */}
            <div className="p-6 space-y-4">
              <h3 className="font-bold text-forest-950 text-sm uppercase tracking-wider">
                {language === "bn" ? "অর্ডারের উদ্ভিদসমূহ" : "Ordered Plant Varieties"}
              </h3>

              <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-800">
                        <Sprout className="w-5 h-5 text-forest-700" />
                      </div>
                      <div>
                        <div className="font-bold text-forest-950 text-sm">
                          {item.title || item.product_name || `Plant Item #${idx + 1}`}
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          Quantity: {item.quantity} × ৳{item.price}
                        </div>
                      </div>
                    </div>

                    <div className="font-bold text-forest-950 text-sm">
                      ৳{(item.quantity * item.price).toLocaleString()}
                    </div>
                  </div>
                ))}

                {/* Subtotals */}
                <div className="p-4 bg-stone-50/70 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Charge:</span>
                    <span>৳{order.delivery_charge || 0}</span>
                  </div>
                  <div className="flex justify-between text-forest-950 font-extrabold text-sm pt-2 border-t border-stone-200">
                    <span>Total Amount:</span>
                    <span className="text-emerald-800">৳{order.total_price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Plant Guarantee Footer */}
            <div className="p-6 bg-forest-50 border-t border-forest-100 flex items-center gap-3 text-xs text-forest-900">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>
                {language === "bn"
                  ? "ডেলিভারি গ্রহণের পর কোনো চারা ক্ষতিগ্রস্থ পেলে ৪৮ ঘণ্টার মধ্যে আমাদের জানানোর অনুরোধ করা হলো।"
                  : "All live saplings are backed by Aronyok's 48-Hour Live Plant Transit Guarantee."}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
