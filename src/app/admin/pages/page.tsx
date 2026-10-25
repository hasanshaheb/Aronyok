"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, FileText, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import DualLangInput from "../../../components/admin/DualLangInput";
import { fallbackDynamicPages } from "../../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";
import { DynamicPage } from "../../../lib/types";
import { slugify } from "../../../lib/utils";

export default function AdminDynamicPagesPage() {
  const [pages, setPages] = useState<DynamicPage[]>(fallbackDynamicPages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<DynamicPage | null>(null);

  const [form, setForm] = useState({
    page_title: { en: "", bn: "" },
    slug: "",
    page_content: { en: "", bn: "" },
    is_published: true,
    seo_title: { en: "", bn: "" },
    seo_description: { en: "", bn: "" },
  });

  const loadPages = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase
        .from("dynamic_pages")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setPages(data);
      }
    } catch (err) {
      console.warn("Using fallback pages:", err);
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

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = form.slug || slugify(form.page_title.en || form.page_title.bn);

    const payload = {
      page_title: form.page_title,
      slug: finalSlug,
      page_content: form.page_content,
      is_published: form.is_published,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
    };

    if (editingPage) {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from("dynamic_pages")
          .update(payload)
          .eq("id", editingPage.id);
        await loadPages();
      } else {
        setPages((prev) =>
          prev.map((item) =>
            item.id === editingPage.id ? { ...item, ...payload } : item
          )
        );
      }
    } else {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("dynamic_pages").insert(payload);
        await loadPages();
      } else {
        const newPage: DynamicPage = {
          id: `page-${Date.now()}`,
          ...payload,
        };
        setPages((prev) => [newPage, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this custom page?")) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from("dynamic_pages").delete().eq("id", id);
      await loadPages();
    } else {
      setPages((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const togglePublished = async (p: DynamicPage) => {
    const updated = !p.is_published;
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("dynamic_pages")
        .update({ is_published: updated })
        .eq("id", p.id);
      await loadPages();
    } else {
      setPages((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, is_published: updated } : item
        )
      );
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

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Page</span>
        </button>
      </div>

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
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        p.is_published
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-200 text-stone-700"
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
                <X className="w-5 h-5" />
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

              <div className="pt-4 border-t border-forest-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md"
                >
                  Save Dynamic Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
