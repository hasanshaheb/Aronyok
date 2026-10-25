"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ExternalLink, CheckCircle, RefreshCw, CloudUpload } from "lucide-react";
import Link from "next/link";
import DualLangInput from "../../../components/admin/DualLangInput";
import { fallbackDynamicPages } from "../../../lib/supabase/fallback-data";
import { DynamicPage } from "../../../lib/types";
import { slugify } from "../../../lib/utils";

export default function AdminDynamicPagesPage() {
  const [pages, setPages] = useState<DynamicPage[]>(fallbackDynamicPages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [syncToGit, setSyncToGit] = useState(true);

  const [form, setForm] = useState({
    page_title: { en: "", bn: "" },
    slug: "",
    page_content: { en: "", bn: "" },
    is_published: true,
    seo_title: { en: "", bn: "" },
    seo_description: { en: "", bn: "" },
  });

  const loadPages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=pages");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPages(data);
        }
      }
    } catch (err) {
      console.warn("Using local cache:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const openCreateModal = () => {
    setEditingPage(null);
    setForm({
      page_title: { en: "", bn: "" },
      slug: "",
      page_content: { en: "", bn: "" },
      is_published: true,
      seo_title: { en: "", bn: "" },
      seo_description: { en: "", bn: "" },
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: DynamicPage) => {
    setEditingPage(p);
    setForm({
      page_title: p.page_title,
      slug: p.slug,
      page_content: p.page_content,
      is_published: p.is_published,
      seo_title: p.seo_title || { en: "", bn: "" },
      seo_description: p.seo_description || { en: "", bn: "" },
    });
    setIsModalOpen(true);
  };

  const handleSavePage = async (e?: React.FormEvent, forceSyncGit?: boolean) => {
    if (e) e.preventDefault();
    const finalSlug = form.slug || slugify(form.page_title.en || form.page_title.bn);
    const shouldSync = forceSyncGit !== undefined ? forceSyncGit : syncToGit;

    const payload: any = {
      page_title: form.page_title,
      slug: finalSlug,
      page_content: form.page_content,
      is_published: form.is_published,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      sync_git: shouldSync,
      git_message: `${editingPage ? "Update" : "Create"} custom page "${form.page_title.en || form.slug}"`,
    };

    if (editingPage) {
      payload.id = editingPage.id;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/data?entity=pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.items) {
        setPages(result.items);
      }

      if (result.git_sync?.success) {
        setNotification(`Page saved to Database & Codebase! Pushed to GitHub (${result.git_sync.commitHash || "main"}) 🚀`);
      } else {
        setNotification(editingPage ? "Page updated in Database & Codebase (fallback-data.ts)!" : "Page created in Database & Codebase!");
      }
      setTimeout(() => setNotification(""), 4000);
      setIsModalOpen(false);
    } catch {
      if (editingPage) {
        setPages(prev => prev.map(item => item.id === editingPage.id ? { ...item, ...payload } : item));
      } else {
        setPages(prev => [{ ...payload, id: `page-${Date.now()}` }, ...prev]);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom page?")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=pages&id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.items) {
        setPages(result.items);
      }
      setNotification("Page deleted successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch {
      setPages(prev => prev.filter(p => p.id !== id));
    }
  };

  const togglePublished = async (p: DynamicPage) => {
    const updated = !p.is_published;
    try {
      const res = await fetch("/api/admin/data?entity=pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_published: updated }),
      });
      const result = await res.json();
      if (result.items) {
        setPages(result.items);
      }
    } catch {
      setPages(prev => prev.map(item => item.id === p.id ? { ...item, is_published: updated } : item));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Dynamic Pages Customizer
          </h1>
          <p className="text-xs text-forest-600">
            Create dynamic informational pages with localized slugs and markdown content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPages}
            className="p-2.5 rounded-xl border border-forest-200 bg-white hover:bg-forest-50 text-forest-700 transition-colors shadow-xs"
            title="Refresh Pages"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-forest-900 uppercase font-bold text-[10px] tracking-wider border-b border-forest-100">
              <tr>
                <th className="py-3.5 px-5">Page Title (EN / BN)</th>
                <th className="py-3.5 px-5">Slug</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 text-forest-900">
              {pages.map((p) => (
                <tr key={p.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <p className="font-bold text-forest-950">{p.page_title.en}</p>
                    <p className="text-[11px] text-forest-700 font-bengali">
                      {p.page_title.bn}
                    </p>
                  </td>
                  <td className="py-3 px-5 font-mono text-[11px] text-stone-600">
                    /{p.slug}
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => togglePublished(p)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        p.is_published
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {p.is_published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right space-x-2">
                    <Link
                      href={`/${p.slug}`}
                      target="_blank"
                      className="p-1.5 rounded-lg text-forest-700 hover:bg-forest-100 inline-block"
                      title="View Public Page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 rounded-lg text-forest-700 hover:bg-forest-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Dual Inputs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-forest-100 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-forest-100 pb-4">
              <h3 className="text-lg font-bold text-forest-950">
                {editingPage ? "Edit Dynamic Page" : "Create Dynamic Page"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4">
              <DualLangInput
                label="Page Title"
                required
                value={form.page_title}
                onChange={(page_title) => setForm({ ...form, page_title })}
                placeholderEn="e.g., Fair Trade & Bee Stewardship"
                placeholderBn="যেমন: ন্যায্য মজুরি ও মৌয়াল উন্নয়ন"
              />

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  URL Route Slug (e.g. fair-trade) *
                </label>
                <input
                  type="text"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="fair-trade-stewardship"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <DualLangInput
                label="Page Content (Markdown supported)"
                type="textarea"
                rows={6}
                required
                value={form.page_content}
                onChange={(page_content) => setForm({ ...form, page_content })}
                placeholderEn="Write content in English..."
                placeholderBn="বাংলায় সম্পূর্ণ বিবরণ লিখুন..."
              />

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={form.is_published}
                  onChange={(e) =>
                    setForm({ ...form, is_published: e.target.checked })
                  }
                  className="rounded text-forest-700"
                />
                <label
                  htmlFor="pubCheck"
                  className="text-xs font-bold text-forest-900 cursor-pointer"
                >
                  Publish immediately (accessible to public)
                </label>
              </div>

              {/* Sync Options */}
              <div className="pt-3 border-t border-forest-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-forest-800 font-semibold select-none">
                  <input
                    type="checkbox"
                    checked={syncToGit}
                    onChange={(e) => setSyncToGit(e.target.checked)}
                    className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-forest-300"
                  />
                  <span>Commit code & trigger Vercel deployment on save</span>
                </label>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSavePage(undefined, false)}
                    className="px-4 py-2 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-900 text-xs font-bold transition-all cursor-pointer border border-forest-300 disabled:opacity-50"
                  >
                    Save Locally & DB
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSavePage(undefined, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CloudUpload className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
                    <span>{isSaving ? "Publishing..." : "Save & Push to GitHub"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
