"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { CampaignBanner } from "@/lib/types";

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignBanner[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignBanner | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    type: "announcement_bar" | "popup_modal" | "banner";
    contentEn: string;
    contentBn: string;
    badgeEn: string;
    badgeBn: string;
    link_url: string;
    is_active: boolean;
  }>({
    title: "",
    type: "announcement_bar",
    contentEn: "",
    contentBn: "",
    badgeEn: "Special Offer",
    badgeBn: "বিশেষ অফার",
    link_url: "/shop",
    is_active: true,
  });

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data?entity=campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data || []);
      }
    } catch (err) {
      console.error("Failed to load campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      title: "Spring Botanical Discount",
      type: "announcement_bar",
      contentEn: "Enjoy 15% off all medicinal herbs and living plants with code ARONYOKGREEN 🌱",
      contentBn: "কুপন কোড ARONYOKGREEN দিয়ে ঔষধি গাছ ও চারায় পাচ্ছেন ১৫% বিশেষ ছাড়! 🌱",
      badgeEn: "Spring Eco Special",
      badgeBn: "বসন্ত সবুজ অফার",
      link_url: "/shop",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: CampaignBanner) => {
    setEditingCampaign(c);
    setFormData({
      title: c.title,
      type: c.type,
      contentEn: c.content?.en || "",
      contentBn: c.content?.bn || "",
      badgeEn: c.badge_text?.en || "",
      badgeBn: c.badge_text?.bn || "",
      link_url: c.link_url || "/shop",
      is_active: c.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingCampaign?.id,
      title: formData.title,
      type: formData.type,
      content: {
        en: formData.contentEn,
        bn: formData.contentBn,
      },
      badge_text: {
        en: formData.badgeEn,
        bn: formData.badgeBn,
      },
      link_url: formData.link_url,
      is_active: formData.is_active,
    };

    try {
      const res = await fetch("/api/admin/data?entity=campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await loadCampaigns();
      }
    } catch {
      alert("Failed to save campaign.");
    }
  };

  const handleToggleActive = async (camp: CampaignBanner) => {
    try {
      await fetch("/api/admin/data?entity=campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...camp,
          is_active: !camp.is_active,
        }),
      });
      loadCampaigns();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this campaign?")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=campaigns&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadCampaigns();
      }
    } catch {}
  };

  const activeCampaign = campaigns.find((c) => c.is_active);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-6 h-6 text-forest-700" />
            <span>Campaigns & Marketing Banners</span>
          </h1>
          <p className="text-xs text-forest-600">
            Configure announcement bars, seasonal notices, and top storefront promo banners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCampaigns}
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
            <span>New Announcement Banner</span>
          </button>
        </div>
      </div>

      {/* Live Preview of Active Announcement Bar */}
      {activeCampaign && (
        <div className="p-6 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-600 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-forest-500" />
              <span>Live Storefront Preview (Active Banner)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Broadcasting Live
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-inner border border-forest-800 bg-forest-900 text-cream-100 py-2.5 px-4 text-xs font-medium flex flex-wrap items-center justify-center gap-2.5">
            {activeCampaign.badge_text?.en && (
              <span className="bg-forest-700 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                {activeCampaign.badge_text.en}
              </span>
            )}
            <span className="text-center">{activeCampaign.content?.en}</span>
            {activeCampaign.link_url && (
              <span className="text-mint-300 font-bold hover:underline inline-flex items-center gap-1 text-[11px]">
                <span>Shop now</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
      )}

      {/* Campaigns Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-forest-900">
            <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
              <tr>
                <th className="py-3 px-4">Campaign Title</th>
                <th className="py-3 px-4">Banner Type</th>
                <th className="py-3 px-4">Announcement Text (EN / BN)</th>
                <th className="py-3 px-4">Target Link</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-forest-950">
                    <div>{camp.title}</div>
                    <span className="text-[10px] text-stone-400 font-normal">
                      Created: {new Date(camp.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-cream-100 text-earth-800 text-[11px] font-bold uppercase tracking-wider">
                      {camp.type.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="truncate font-medium text-forest-900">
                      {camp.content?.en || "No English text"}
                    </p>
                    <p className="truncate text-stone-500 text-[11px]">
                      {camp.content?.bn || "No Bengali text"}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-forest-600">
                    {camp.link_url || "/shop"}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleActive(camp)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        camp.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {camp.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(camp)}
                        className="p-1.5 rounded-lg text-forest-600 hover:bg-forest-100 hover:text-forest-950 transition-colors"
                        title="Edit campaign"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(camp.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Delete campaign"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {campaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-forest-400">
                    No marketing campaigns configured yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-forest-100 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <h3 className="font-extrabold text-base text-forest-950">
                {editingCampaign ? "Edit Campaign Banner" : "New Campaign Banner"}
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
                  Campaign Title (Internal Reference)
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Monsoon Plantation Drive"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Badge Text (English)
                  </label>
                  <input
                    type="text"
                    value={formData.badgeEn}
                    onChange={(e) =>
                      setFormData({ ...formData, badgeEn: e.target.value })
                    }
                    placeholder="Spring Eco Special"
                    className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    ব্যাজ টেক্সট (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={formData.badgeBn}
                    onChange={(e) =>
                      setFormData({ ...formData, badgeBn: e.target.value })
                    }
                    placeholder="বসন্ত সবুজ অফার"
                    className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Announcement Message (English)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.contentEn}
                  onChange={(e) =>
                    setFormData({ ...formData, contentEn: e.target.value })
                  }
                  placeholder="Enjoy 15% off all medicinal herbs and living plants with code ARONYOKGREEN 🌱"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  ঘোষণা বার্তা (বাংলা)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.contentBn}
                  onChange={(e) =>
                    setFormData({ ...formData, contentBn: e.target.value })
                  }
                  placeholder="কুপন কোড ARONYOKGREEN দিয়ে ঔষধি গাছ ও চারায় পাচ্ছেন ১৫% বিশেষ ছাড়! 🌱"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Action Link URL
                </label>
                <input
                  type="text"
                  value={formData.link_url}
                  onChange={(e) =>
                    setFormData({ ...formData, link_url: e.target.value })
                  }
                  placeholder="/shop"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs font-mono text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
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
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
