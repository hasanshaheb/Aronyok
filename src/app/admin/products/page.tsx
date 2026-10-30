"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  RefreshCw,
  CloudUpload,
  GitBranch,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import DualLangInput from "../../../components/admin/DualLangInput";
import ProductImagePicker from "../../../components/admin/ProductImagePicker";
import QuickImageModal from "../../../components/admin/QuickImageModal";
import { fallbackProducts } from "../../../lib/supabase/fallback-data";
import { Product } from "../../../lib/types";
import { slugify } from "../../../lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [syncToGit, setSyncToGit] = useState(true);
  const [selectedProductForImage, setSelectedProductForImage] = useState<Product | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const openQuickImageModal = (product: Product) => {
    setSelectedProductForImage(product);
    setIsImageModalOpen(true);
  };

  const [form, setForm] = useState({
    name: { en: "", bn: "" },
    slug: "",
    description: { en: "", bn: "" },
    price: 500,
    compare_at_price: 600,
    stock: 50,
    image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    category: "herbs",
    is_active: true,
    seo_title: { en: "", bn: "" },
    seo_description: { en: "", bn: "" },
  });

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=products");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
      }
    } catch (err) {
      console.warn("Using local cache:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm({
      name: { en: "", bn: "" },
      slug: "",
      description: { en: "", bn: "" },
      price: 500,
      compare_at_price: 600,
      stock: 50,
      image_url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
      category: "herbs",
      is_active: true,
      seo_title: { en: "", bn: "" },
      seo_description: { en: "", bn: "" },
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      compare_at_price: p.compare_at_price || 0,
      stock: p.stock,
      image_url: p.image_url,
      category: p.category,
      is_active: p.is_active,
      seo_title: p.seo_title || { en: "", bn: "" },
      seo_description: p.seo_description || { en: "", bn: "" },
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e?: React.FormEvent, forceSyncGit?: boolean) => {
    if (e) e.preventDefault();
    const finalSlug = form.slug || slugify(form.name.en || form.name.bn);

    const shouldSync = forceSyncGit !== undefined ? forceSyncGit : syncToGit;

    const productPayload: any = {
      name: form.name,
      slug: finalSlug,
      description: form.description,
      price: Number(form.price),
      compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
      stock: Number(form.stock),
      image_url: form.image_url,
      category: form.category,
      is_active: form.is_active,
      seo_title: form.seo_title,
      seo_description: form.seo_description,
      sync_git: shouldSync,
      git_message: `${editingProduct ? "Update" : "Add"} product "${form.name.en || form.slug}"`,
    };

    if (editingProduct) {
      productPayload.id = editingProduct.id;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/data?entity=products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productPayload),
      });

      const result = await res.json();
      if (result.items) {
        setProducts(result.items);
      }

      if (result.git_sync?.success) {
        setNotification(`Product saved to Database & Codebase! Pushed to GitHub (${result.git_sync.commitHash || "main"}) 🚀`);
      } else {
        setNotification(editingProduct ? "Product updated in Database & Codebase (fallback-data.ts)!" : "Product added to Database & Codebase!");
      }
      setTimeout(() => setNotification(""), 4000);
      setIsModalOpen(false);
    } catch {
      // Optimistic local update
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
      } else {
        setProducts(prev => [{ ...productPayload, id: `prod-${Date.now()}` }, ...prev]);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this product?")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=products&id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.items) {
        setProducts(result.items);
      }
      setNotification("Product deleted successfully!");
      setTimeout(() => setNotification(""), 3000);
    } catch {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleActive = async (p: Product) => {
    const updatedStatus = !p.is_active;
    try {
      const res = await fetch("/api/admin/data?entity=products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, is_active: updatedStatus }),
      });
      const result = await res.json();
      if (result.items) {
        setProducts(result.items);
      }
    } catch {
      setProducts(prev => prev.map(item => item.id === p.id ? { ...item, is_active: updatedStatus } : item));
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.en.toLowerCase().includes(search.toLowerCase()) ||
      p.name.bn.includes(search) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Products Manager
          </h1>
          <p className="text-xs text-forest-600">
            List, add, and customize bilingual catalog items with dual language fields
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadProducts}
            className="p-2.5 rounded-xl border border-forest-200 bg-white hover:bg-forest-50 text-forest-700 transition-colors shadow-xs"
            title="Refresh Products"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter / Search */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by English or Bengali..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-forest-900 uppercase font-bold text-[10px] tracking-wider border-b border-forest-100">
              <tr>
                <th className="py-3.5 px-5">Image</th>
                <th className="py-3.5 px-5">Name (EN / BN)</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Price</th>
                <th className="py-3.5 px-5">Stock</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 text-forest-900">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <button
                      type="button"
                      onClick={() => openQuickImageModal(product)}
                      className="group relative w-12 h-12 rounded-xl overflow-hidden bg-stone-100 block border border-forest-100 hover:border-emerald-500 shadow-xs transition-all cursor-pointer text-left"
                      title="Click to quick-change picture & deploy"
                    >
                      <Image
                        src={product.image_url}
                        alt={product.name.en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-forest-950/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-4 h-4 text-white drop-shadow" />
                      </div>
                    </button>
                  </td>
                  <td className="py-3 px-5">
                    <p className="font-bold text-forest-950">{product.name.en}</p>
                    <p className="text-[11px] text-forest-700 font-bengali">
                      {product.name.bn}
                    </p>
                  </td>
                  <td className="py-3 px-5 capitalize font-medium text-stone-600">
                    {product.category}
                  </td>
                  <td className="py-3 px-5 font-bold">৳{product.price}</td>
                  <td className="py-3 px-5">{product.stock}</td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => toggleActive(product)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                        product.is_active
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                      }`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right space-x-1 sm:space-x-2">
                    <button
                      onClick={() => openQuickImageModal(product)}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 transition-colors inline-flex items-center cursor-pointer"
                      title="Quick Change Picture & Deploy"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-1.5 rounded-lg text-forest-700 hover:bg-forest-100 transition-colors cursor-pointer"
                      title="Edit Product Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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

      {/* Create / Edit Modal with Dual Inputs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-forest-100 shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-forest-100 pb-4">
              <h3 className="text-lg font-bold text-forest-950">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <DualLangInput
                label="Product Name"
                required
                value={form.name}
                onChange={(name) => setForm({ ...form, name })}
                placeholderEn="e.g., Organic Sundarbans Mangrove Raw Honey (500g)"
                placeholderBn="যেমন: সুন্দরবনের প্রাকৃতিক চাকভাঙা খাঁটি মধু (৫০০ গ্রাম)"
              />

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  URL Slug (auto-generated if empty)
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="sundarbans-mangrove-honey"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <DualLangInput
                label="Detailed Description"
                type="textarea"
                rows={3}
                value={form.description}
                onChange={(description) => setForm({ ...form, description })}
                placeholderEn="Explain botanical sourcing, benefits, and usage..."
                placeholderBn="ভেষজ সংগ্রহ, উপকারিতা ও ব্যবহারের নিয়ম ব্যাখ্যা করুন..."
              />

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Compare Price (৳)
                  </label>
                  <input
                    type="number"
                    value={form.compare_at_price}
                    onChange={(e) =>
                      setForm({ ...form, compare_at_price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="herbs">Medicinal Herbs</option>
                    <option value="honey">Forest Honey</option>
                    <option value="plants">Live Plants</option>
                    <option value="wellness">Herbal Wellness</option>
                    <option value="gardening">Eco Gardening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest-900 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <ProductImagePicker
                value={form.image_url}
                onChange={(image_url) => setForm({ ...form, image_url })}
              />

              <div className="pt-2 border-t border-forest-100">
                <DualLangInput
                  label="SEO Meta Title"
                  value={form.seo_title}
                  onChange={(seo_title) => setForm({ ...form, seo_title })}
                  placeholderEn="SEO Title in English..."
                  placeholderBn="বাংলা এসইও টাইটেল..."
                />
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
                    onClick={() => handleSaveProduct(undefined, false)}
                    className="px-4 py-2 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-900 text-xs font-bold transition-all cursor-pointer border border-forest-300 disabled:opacity-50"
                  >
                    Save Locally & DB
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveProduct(undefined, true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CloudUpload className={`w-3.5 h-3.5 ${isSaving ? "animate-spin" : ""}`} />
                    <span>{isSaving ? "Deploying..." : "Save & Push to GitHub"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Quick Image Change Modal with GitHub & Vercel Sync */}
      <QuickImageModal
        product={selectedProductForImage}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onProductUpdated={(updatedProducts, message) => {
          if (updatedProducts && updatedProducts.length > 0) {
            setProducts(updatedProducts);
          } else {
            loadProducts();
          }
          setNotification(message);
          setTimeout(() => setNotification(""), 5500);
        }}
      />
    </div>
  );
}
