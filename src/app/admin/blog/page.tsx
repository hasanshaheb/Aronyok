"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, CheckCircle, RefreshCw, CloudUpload } from "lucide-react";
import DualLangInput from "../../../components/admin/DualLangInput";
import ProductImagePicker from "../../../components/admin/ProductImagePicker";
import { fallbackBlogPosts } from "../../../lib/supabase/fallback-data";
import { BlogPost } from "../../../lib/types";
import { slugify } from "../../../lib/utils";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [syncToGit, setSyncToGit] = useState(true);

  const [form, setForm] = useState({
    title: { en: "", bn: "" },
    slug: "",
    excerpt: { en: "", bn: "" },
    content: { en: "", bn: "" },
    image_url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
    category: "Herbal Living",
    read_time: "5 min read",
    status: "published" as "draft" | "published",
  });

  const loadBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=blogs");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
        }
      }
    } catch (err) {
      console.warn("Using local cache:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setForm({
      title: { en: "", bn: "" },
      slug: "",
      excerpt: { en: "", bn: "" },
      content: { en: "", bn: "" },
      image_url: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=800&q=80",
      category: "Herbal Living",
      read_time: "5 min read",
      status: "published",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: BlogPost) => {
    setEditingPost(b);
    setForm({
      title: b.title,
      slug: b.slug,
      excerpt: b.excerpt || { en: "", bn: "" },
      content: b.content,
      image_url: b.image_url || "",
      category: b.category || "Herbal Living",
      read_time: b.read_time || "5 min read",
      status: b.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveBlog = async (e?: React.FormEvent, forceSyncGit?: boolean) => {
    if (e) e.preventDefault();
    const finalSlug = form.slug || slugify(form.title.en || form.title.bn);
    const shouldSync = forceSyncGit !== undefined ? forceSyncGit : syncToGit;

    const payload: any = {
      title: form.title,
      slug: finalSlug,
      excerpt: form.excerpt,
      content: form.content,
      image_url: form.image_url,
      category: form.category,
      read_time: form.read_time,
      status: form.status,
      sync_git: shouldSync,
      git_message: `${editingPost ? "Update" : "Publish"} blog post "${form.title.en || form.slug}"`,
    };

    if (editingPost) {
      payload.id = editingPost.id;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/data?entity=blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.items) {
        setPosts(result.items);
      }

      if (result.git_sync?.success) {
        setNotification(`Article saved to Database & Codebase! Pushed to GitHub (${result.git_sync.commitHash || "main"}) 🚀`);
      } else {
        setNotification(editingPost ? "Article updated in Database & Codebase (fallback-data.ts)!" : "Article saved to Database & Codebase!");
      }
      setTimeout(() => setNotification(""), 4000);
      setIsModalOpen(false);
    } catch {
      if (editingPost) {
        setPosts(prev => prev.map(item => item.id === editingPost.id ? { ...item, ...payload } : item));
      } else {
        setPosts(prev => [{ ...payload, id: `blog-${Date.now()}` }, ...prev]);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=blogs&id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.items) {
        setPosts(result.items);
      }
      setNotification("Article deleted successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch {
      setPosts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleStatus = async (b: BlogPost) => {
    const updatedStatus = b.status === "published" ? "draft" : "published";
    try {
      const res = await fetch("/api/admin/data?entity=blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: b.id, status: updatedStatus }),
      });
      const result = await res.json();
      if (result.items) {
        setPosts(result.items);
      }
    } catch {
      setPosts(prev => prev.map(item => item.id === b.id ? { ...item, status: updatedStatus } : item));
    }
  };

  const filtered = posts.filter(
    (p) =>
      p.title.en.toLowerCase().includes(search.toLowerCase()) ||
      p.title.bn.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Blog Posts Manager
          </h1>
          <p className="text-xs text-forest-600">
            Create and edit nature and herbal guides with dual English/Bengali input fields
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadBlogs}
            className="p-2.5 rounded-xl border border-forest-200 bg-white hover:bg-forest-50 text-forest-700 transition-colors shadow-xs"
            title="Refresh Articles"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Article</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles in EN or BN..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
        />
      </div>

      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-forest-900 uppercase font-bold text-[10px] tracking-wider border-b border-forest-100">
              <tr>
                <th className="py-3.5 px-5">Title (EN / BN)</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Read Time</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 text-forest-900">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-5 max-w-xs">
                    <p className="font-bold text-forest-950">{post.title.en}</p>
                    <p className="text-[11px] text-forest-700 font-bengali">
                      {post.title.bn}
                    </p>
                  </td>
                  <td className="py-3 px-5">{post.category}</td>
                  <td className="py-3 px-5">{post.read_time}</td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => toggleStatus(post)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                      }`}
                    >
                      {post.status}
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right space-x-2">
                    <button
                      onClick={() => openEditModal(post)}
                      className="p-1.5 rounded-lg text-forest-700 hover:bg-forest-100 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
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
                {editingPost ? "Edit Article" : "Write New Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-4">
              <DualLangInput
                label="Article Title"
                required
                value={form.title}
                onChange={(title) => setForm({ ...form, title })}
                placeholderEn="e.g., 7 Miraculous Ayurvedic Herbs Every Household Should Grow"
                placeholderBn="যেমন: প্রতিটি ঘরে রোপণ উপযোগী ৭টি অলৌকিক ভেষজ উদ্ভিদ"
              />

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="7-ayurvedic-herbs-for-immunity"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <DualLangInput
                label="Short Excerpt"
                type="textarea"
                rows={2}
                value={form.excerpt}
                onChange={(excerpt) => setForm({ ...form, excerpt })}
                placeholderEn="Brief summary of the article..."
                placeholderBn="লেখার সংক্ষিপ্ত সারসংক্ষেপ..."
              />

              <DualLangInput
                label="Article Full Content (Markdown supported)"
                type="textarea"
                rows={6}
                required
                value={form.content}
                onChange={(content) => setForm({ ...form, content })}
                placeholderEn="Write the complete article in English..."
                placeholderBn="সম্পূর্ণ লেখাটি বাংলায় লিখুন..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={form.read_time}
                    onChange={(e) =>
                      setForm({ ...form, read_time: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as "draft" | "published",
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <ProductImagePicker
                value={form.image_url}
                onChange={(image_url) => setForm({ ...form, image_url })}
              />

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
                    onClick={() => handleSaveBlog(undefined, false)}
                    className="px-4 py-2 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-900 text-xs font-bold transition-all cursor-pointer border border-forest-300 disabled:opacity-50"
                  >
                    Save Locally & DB
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveBlog(undefined, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CloudUpload className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
                    <span>{isSaving ? "Publishing..." : "Publish & Push to GitHub"}</span>
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
