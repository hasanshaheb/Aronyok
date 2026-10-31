"use client";

import React, { useState, useEffect } from "react";
import {
  Tag,
  Plus,
  Percent,
  Calendar,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Copy,
  Check,
  Search,
  Sparkles,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Coupon } from "@/lib/types";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<{
    code: string;
    discount_type: "percentage" | "fixed";
    discount_value: number;
    min_order_amount: number;
    max_discount: number;
    expiry_date: string;
    usage_limit: number;
    is_active: boolean;
    descriptionEn: string;
    descriptionBn: string;
  }>({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 500,
    max_discount: 300,
    expiry_date: "",
    usage_limit: 500,
    is_active: true,
    descriptionEn: "",
    descriptionBn: "",
  });

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data?entity=coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data || []);
      }
    } catch (err) {
      console.error("Failed to load coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: "",
      discount_type: "percentage",
      discount_value: 10,
      min_order_amount: 500,
      max_discount: 300,
      expiry_date: "2027-12-31",
      usage_limit: 1000,
      is_active: true,
      descriptionEn: "",
      descriptionBn: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Coupon) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discount_type: c.discount_type,
      discount_value: c.discount_value,
      min_order_amount: c.min_order_amount || 0,
      max_discount: c.max_discount || 0,
      expiry_date: c.expiry_date ? c.expiry_date.split("T")[0] : "",
      usage_limit: c.usage_limit || 0,
      is_active: c.is_active,
      descriptionEn: c.description?.en || "",
      descriptionBn: c.description?.bn || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingCoupon?.id,
      code: formData.code.trim().toUpperCase(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value) || 0,
      min_order_amount: Number(formData.min_order_amount) || 0,
      max_discount: formData.discount_type === "percentage" ? (Number(formData.max_discount) || undefined) : undefined,
      expiry_date: formData.expiry_date ? `${formData.expiry_date}T23:59:59Z` : undefined,
      usage_limit: Number(formData.usage_limit) || undefined,
      usage_count: editingCoupon?.usage_count || 0,
      is_active: formData.is_active,
      description: {
        en: formData.descriptionEn,
        bn: formData.descriptionBn,
      },
    };

    try {
      const res = await fetch("/api/admin/data?entity=coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await loadCoupons();
      }
    } catch (err) {
      alert("Failed to save coupon.");
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await fetch("/api/admin/data?entity=coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...coupon,
          is_active: !coupon.is_active,
        }),
      });
      loadCoupons();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=coupons&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadCoupons();
      }
    } catch {}
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = coupons.filter(
    (c) =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.en?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-forest-700" />
            <span>Coupons & Promotional Discounts</span>
          </h1>
          <p className="text-xs text-forest-600">
            Create promotional discount codes (% or fixed ৳) for marketing campaigns and seasonal plant sales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCoupons}
            className="p-2.5 rounded-xl border border-forest-200 bg-white text-forest-700 hover:bg-forest-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Coupon</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Total Coupons
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-1">
            {coupons.length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Active Campaigns
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {coupons.filter((c) => c.is_active).length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Total Redemptions
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-1">
            {coupons.reduce((sum, c) => sum + (c.usage_count || 0), 0)}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Avg Discount
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            15%
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by coupon code or campaign description..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
        />
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-forest-900">
            <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
              <tr>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Min. Spend</th>
                <th className="py-3 px-4">Usage Count</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-forest-950">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-forest-100 text-forest-900 border border-forest-200 tracking-wider">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-forest-400 hover:text-forest-800 transition-colors"
                        title="Copy code"
                      >
                        {copiedCode === coupon.code ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    {coupon.description?.en && (
                      <p className="text-[11px] text-forest-500 font-sans font-normal mt-1 max-w-xs truncate">
                        {coupon.description.en}
                      </p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                    {coupon.discount_type === "percentage" ? (
                      <span>{coupon.discount_value}% OFF</span>
                    ) : (
                      <span>৳{coupon.discount_value} FLAT</span>
                    )}
                    {coupon.max_discount ? (
                      <span className="block text-[10px] text-stone-400 font-normal">
                        Max: ৳{coupon.max_discount}
                      </span>
                    ) : null}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-stone-600">
                    {coupon.min_order_amount ? `৳${coupon.min_order_amount}` : "No min."}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-forest-900">
                      {coupon.usage_count || 0}
                    </span>
                    <span className="text-stone-400 text-[11px]">
                      {coupon.usage_limit ? ` / ${coupon.usage_limit}` : " uses"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                    {coupon.expiry_date
                      ? new Date(coupon.expiry_date).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(coupon)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        coupon.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {coupon.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span>Paused</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(coupon)}
                        className="p-1.5 rounded-lg text-forest-600 hover:bg-forest-100 hover:text-forest-950 transition-colors"
                        title="Edit coupon"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Delete coupon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-forest-400">
                    No promotional coupons found. Click &quot;Create New Coupon&quot; to begin!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-forest-100 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <h3 className="font-extrabold text-base text-forest-950">
                {editingCoupon ? "Edit Coupon" : "Create New Promotional Coupon"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Coupon Code (Uppercase)
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="e.g. MONSOON20"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-mono uppercase font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_type: e.target.value as "percentage" | "fixed",
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="fixed">Fixed Amount (৳ FLAT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Discount Value ({formData.discount_type === "percentage" ? "%" : "৳"})
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount_value: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Min Order Spend (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.min_order_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_amount: Number(e.target.value),
                      })
                    }
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Max Discount Cap (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    disabled={formData.discount_type === "fixed"}
                    value={formData.max_discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_discount: Number(e.target.value),
                      })
                    }
                    placeholder="No limit"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Usage Limit (Max Uses)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usage_limit: Number(e.target.value),
                      })
                    }
                    placeholder="1000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Description (English)
                </label>
                <input
                  type="text"
                  value={formData.descriptionEn}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionEn: e.target.value })
                  }
                  placeholder="15% off medicinal herbs & live fruit plants"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  বিবরণ (বাংলা)
                </label>
                <input
                  type="text"
                  value={formData.descriptionBn}
                  onChange={(e) =>
                    setFormData({ ...formData, descriptionBn: e.target.value })
                  }
                  placeholder="ঔষধি গাছ ও চারায় ১৫% বিশেষ ছাড়"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-forest-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-forest-200 text-xs font-semibold text-forest-700 hover:bg-forest-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
