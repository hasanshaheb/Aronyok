"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, BookOpen, X, Search } from "lucide-react";
import DualLangInput from "../../../components/admin/DualLangInput";
import { fallbackBlogPosts } from "../../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";
import { BlogPost } from "../../../lib/types";
import { slugify } from "../../../lib/utils";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(fallbackBlogPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [search, setSearch] = useState("");

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
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setPosts(data);
      }
    } catch (err) {
      console.warn("Using fallback blogs:", err);
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

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalSlug = form.slug || slugify(form.title.en || form.title.bn);

    const payload = {
      title: form.title,
      slug: finalSlug,
      excerpt: form.excerpt,
      content: form.content,
      image_url: form.image_url,
      category: form.category,
      read_time: form.read_time,
      status: form.status,
    };

    if (editingPost) {
      if (isSupabaseConfigured && supabase) {
        await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", editingPost.id);
        await loadBlogs();
      } else {
        setPosts((prev) =>
          prev.map((item) =>
            item.id === editingPost.id ? { ...item, ...payload } : item
          )
        );
      }
    } else {
      if (isSupabaseConfigured && supabase) {
        await supabase.from("blog_posts").insert(payload);
        await loadBlogs();
      } else {
        const newPost: BlogPost = {
          id: `blog-${Date.now()}`,
          ...payload,
        };
        setPosts((prev) => [newPost, ...prev]);
      }
    }

    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    if (isSupabaseConfigured && supabase) {
      await supabase.from("blog_posts").delete().eq("id", id);
      await loadBlogs();
    } else {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const toggleStatus = async (b: BlogPost) => {
    const updatedStatus = b.status === "published" ? "draft" : "published";
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("blog_posts")
        .update({ status: updatedStatus })
        .eq("id", b.id);
      await loadBlogs();
    } else {
      setPosts((prev) =>
        prev.map((item) =>
          item.id === b.id ? { ...item, status: updatedStatus } : item
        )
      );
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

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </button>
      </div>

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
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
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
                <X className="w-5 h-5" />
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

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
