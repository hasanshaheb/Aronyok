"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Percent,
  RefreshCw,
  Truck,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Sprout,
  CheckCircle,
  PieChart,
  Calendar,
  Download,
} from "lucide-react";

interface ReportData {
  totalOrders: number;
  totalGMV: number;
  completedRevenue: number;
  averageOrderValue: number;
  totalEstimatedCOGS: number;
  estimatedGrossProfit: number;
  grossMarginPercent: number;
  categoryCounts: Record<string, number>;
  totalCustomers: number;
  repeatCustomerRate: number;
  deliverySuccessRate: number;
  activeProductsCount: number;
  lowStockCount: number;
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.warn("Could not load reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-cream-100">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-950">
                Financial & Business Reports (ব্যবসায়িক প্রতিবেদন)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Real-time Gross Merchandise Value (GMV), gross margin, COGS, and logistics efficiency
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadReports}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
            title="Refresh Report Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Low stock warning if applicable */}
      {reports && reports.lowStockCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <span className="font-bold">Inventory Alert: </span>
              <span>{reports.lowStockCount} plant varieties are running low on stock (≤ 5 units remaining).</span>
            </div>
          </div>
          <a
            href="/admin/purchases"
            className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold hover:bg-amber-700 transition"
          >
            Create Restock PO
          </a>
        </div>
      )}

      {/* Main Financial KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Total GMV
            </span>
            <div className="w-7 h-7 rounded-lg bg-forest-50 text-forest-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-forest-950">
            ৳{reports ? reports.totalGMV.toLocaleString() : "0"}
          </div>
          <div className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
            <span>Completed: ৳{reports ? reports.completedRevenue.toLocaleString() : "0"}</span>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Estimated Profit
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-800">
            ৳{reports ? reports.estimatedGrossProfit.toLocaleString() : "0"}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            COGS: ৳{reports ? reports.totalEstimatedCOGS.toLocaleString() : "0"}
          </div>
        </div>

        {/* Gross Margin % */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Gross Margin
            </span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-forest-950">
            {reports ? reports.grossMarginPercent : 0}%
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            Healthy live-plant margin target: &gt;45%
          </div>
        </div>

        {/* Average Order Value */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              Avg Order Value
            </span>
            <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-forest-950">
            ৳{reports ? reports.averageOrderValue.toLocaleString() : "0"}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            From {reports ? reports.totalOrders : 0} orders
          </div>
        </div>
      </div>

      {/* Operational Efficiency Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Logistics Delivery Success */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-950 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Courier Delivery Rate</span>
            </h3>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              {reports ? reports.deliverySuccessRate : 100}%
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Successful delivery rate across Steadfast, Pathao, and self-logistics. Low return rate ensures healthy cash-flow on COD shipments.
          </p>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${reports ? reports.deliverySuccessRate : 100}%` }}
            />
          </div>
        </div>

        {/* Customer Retention Rate */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-950 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-forest-700" />
              <span>Repeat Buyer Retention</span>
            </h3>
            <span className="text-xs font-extrabold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
              {reports ? reports.repeatCustomerRate : 0}%
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Percentage of customers who have returned for secondary purchases. Botanical consultation and organic care tips boost this metric.
          </p>
          <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-forest-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${reports ? reports.repeatCustomerRate : 0}%` }}
            />
          </div>
        </div>

        {/* Catalog Health */}
        <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-forest-950 text-sm flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>Active Plant Catalog</span>
            </h3>
            <span className="text-xs font-extrabold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded-full">
              {reports ? reports.activeProductsCount : 0} Live Items
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Varieties published on the storefront. Ensure regular replenishment of exotic grafting saplings to maintain high GMV.
          </p>
          <div className="text-xs font-semibold text-stone-600 pt-1">
            Replenishment status: {reports && reports.lowStockCount === 0 ? "Optimal" : "Attention needed"}
          </div>
        </div>
      </div>

      {/* Category Volume Breakdown */}
      <div className="p-5 bg-white rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <h3 className="font-bold text-forest-950 text-base">
          Sales Volume by Botanical Category (ক্যাটাগরি অনুযায়ী বিক্রয়)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {reports?.categoryCounts &&
            Object.entries(reports.categoryCounts).map(([cat, count]) => (
              <div key={cat} className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  {cat}
                </div>
                <div className="mt-2 text-2xl font-extrabold text-forest-950">{count} units</div>
                <div className="text-[11px] text-stone-400 mt-0.5">Sold in recorded orders</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
