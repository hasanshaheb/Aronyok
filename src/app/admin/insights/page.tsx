"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Sun,
  Droplets,
  Sprout,
  Users,
  ShoppingCart,
  MessageCircle,
  CheckCircle2,
  Phone,
  ArrowRight,
  ClipboardList,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import { AbandonedCart } from "@/lib/types";

export default function AdminInsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [abandonedCarts, setAbandonedCarts] = useState<AbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const [resIns, resAb] = await Promise.all([
        fetch("/api/admin/data?entity=insights"),
        fetch("/api/admin/data?entity=abandoned_carts"),
      ]);
      if (resIns.ok) {
        const data = await resIns.json();
        setInsights(data);
      }
      if (resAb.ok) {
        const abData = await resAb.json();
        setAbandonedCarts(abData || []);
      }
    } catch (err) {
      console.error("Failed to load insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleUpdateAbandonedStatus = async (id: string, status: any) => {
    try {
      await fetch("/api/admin/data?entity=abandoned_carts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, recovery_status: status }),
      });
      loadInsights();
    } catch {}
  };

  const generateWhatsAppLink = (cart: AbandonedCart) => {
    const rawPhone = (cart.customer_phone || "").replace(/\D/g, "");
    const phone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
    const name = cart.customer_name || "Valued Customer";
    const items = cart.items.map((i) => i.product_name).join(", ");
    const text = encodeURIComponent(
      `Assalamu Alaikum ${name}! 🌱 We noticed you left some beautiful plants in your Aronyok cart (${items}). We've reserved your items and would love to offer you 10% off with coupon WELCOME10! Complete your order: https://aronyok.vercel.app/cart`
    );
    return `https://wa.me/${phone}?text=${text}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-emerald-600" />
            <span>AI Botanical & Business Intelligence Engine</span>
          </h1>
          <p className="text-xs text-forest-600">
            Automated predictive inventory reordering, seasonal horticultural advice, customer LTV health and abandoned cart recovery
          </p>
        </div>

        <button
          onClick={loadInsights}
          className="p-2.5 rounded-xl border border-forest-200 bg-white text-forest-700 hover:bg-forest-50 transition-colors self-start sm:self-auto flex items-center gap-2 text-xs font-bold"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Analysis</span>
        </button>
      </div>

      {/* SECTION 1: SEASONAL BOTANICAL & HORTICULTURAL ADVISORY */}
      {insights?.seasonalContext && (
        <div className="p-6 sm:p-8 bg-gradient-to-br from-forest-900 to-forest-950 text-cream-100 rounded-3xl border border-forest-800 shadow-soft-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-forest-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-800 text-mint-300 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-mint-300 tracking-wider">
                  Active Climate Diagnostic
                </span>
                <h2 className="text-lg font-extrabold text-white">
                  {insights.seasonalContext.season_name_en} ({insights.seasonalContext.season_name_bn})
                </h2>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-forest-800/80 border border-mint-400/30 text-mint-200 text-xs font-bold self-start sm:self-auto">
              Auto-calibrated for Bangladesh
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-forest-850/60 rounded-2xl border border-forest-800 space-y-1.5">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs">
                <Droplets className="w-4 h-4" />
                <span>Irrigation & Watering Plan</span>
              </div>
              <p className="text-xs text-cream-200 leading-relaxed">
                {insights.seasonalContext.watering_recommendation}
              </p>
            </div>

            <div className="p-4 bg-forest-850/60 rounded-2xl border border-forest-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                <Sun className="w-4 h-4" />
                <span>Balcony & Sunlight Orientation</span>
              </div>
              <p className="text-xs text-cream-200 leading-relaxed">
                {insights.seasonalContext.sunlight_advice}
              </p>
            </div>

            <div className="p-4 bg-forest-850/60 rounded-2xl border border-forest-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <Sprout className="w-4 h-4" />
                <span>Organic Soil Top-Dressing</span>
              </div>
              <p className="text-xs text-cream-200 leading-relaxed">
                {insights.seasonalContext.soil_fertilizer_tip}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: PREDICTIVE INVENTORY REORDER ALERTS */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-5">
        <div className="flex items-center justify-between border-b border-forest-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest-950">
                Predictive Reorder Forecast (Restock Recommendations)
              </h2>
              <p className="text-xs text-forest-600">
                AI recommends purchase order quantities for high-velocity plants at risk of stockout
              </p>
            </div>
          </div>
          <Link
            href="/admin/purchases"
            className="flex items-center gap-1.5 text-xs font-bold text-forest-700 hover:text-forest-950 hover:underline"
          >
            <span>Create Supplier PO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-forest-900">
            <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
              <tr>
                <th className="py-2.5 px-4">Plant Name</th>
                <th className="py-2.5 px-4">Current Stock</th>
                <th className="py-2.5 px-4">Stockout Urgency</th>
                <th className="py-2.5 px-4">Suggested Reorder Qty</th>
                <th className="py-2.5 px-4">Estimated Restock Cost</th>
                <th className="py-2.5 px-4 text-right">Procurement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {insights?.lowStockAlerts?.map((item: any) => (
                <tr key={item.product_id} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-forest-950">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-600">
                    {item.stock} left
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        item.urgency === "critical"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {item.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-forest-900 font-mono">
                    +{item.recommended_reorder_qty} units
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    ৳{Math.round(item.estimated_cost).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/admin/purchases"
                      className="px-3 py-1 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-[11px] shadow-xs"
                    >
                      Draft PO
                    </Link>
                  </td>
                </tr>
              ))}
              {(!insights?.lowStockAlerts || insights?.lowStockAlerts.length === 0) && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-emerald-700 font-medium">
                    ✓ All nursery catalog inventory levels are healthy!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: ABANDONED CART RECOVERY PIPELINE */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-forest-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest-950">
                Abandoned Cart Recovery Pipeline
              </h2>
              <p className="text-xs text-forest-600">
                Recover dropped checkouts via automated 1-click WhatsApp discounts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400">Recoverable GMV</span>
              <div className="text-lg font-extrabold text-emerald-800">
                ৳{insights?.abandonedCartInsights?.recoverableRevenue?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {abandonedCarts.map((cart) => (
            <div
              key={cart.id}
              className="p-5 rounded-2xl border border-forest-100 bg-cream-50/60 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-forest-950">
                    {cart.customer_name || "Guest Customer"}
                  </h4>
                  <div className="text-[11px] text-stone-500 font-mono">
                    {cart.customer_phone || cart.customer_email || "No contact"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-extrabold text-forest-950 font-mono">
                    ৳{cart.total_value}
                  </div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      cart.recovery_status === "recovered"
                        ? "bg-emerald-100 text-emerald-800"
                        : cart.recovery_status === "contacted"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {cart.recovery_status}
                  </span>
                </div>
              </div>

              {/* Items in cart */}
              <div className="text-xs text-forest-700 bg-white p-2.5 rounded-xl border border-forest-100 space-y-1">
                {cart.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate pr-2">{i.product_name}</span>
                    <span className="font-semibold text-stone-500 font-mono">
                      {i.quantity} × ৳{i.price}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <select
                    value={cart.recovery_status}
                    onChange={(e) => handleUpdateAbandonedStatus(cart.id, e.target.value)}
                    className="text-xs font-semibold px-2 py-1 rounded-lg border border-forest-200 bg-white text-forest-900"
                  >
                    <option value="abandoned">Abandoned</option>
                    <option value="contacted">Contacted</option>
                    <option value="recovered">Recovered ✓</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {cart.customer_phone && (
                  <a
                    href={generateWhatsAppLink(cart)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Recovery</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
