"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  CloudUpload,
  Camera,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  GitBranch,
} from "lucide-react";
import { Product } from "@/lib/types";
import ProductImagePicker from "./ProductImagePicker";

interface QuickImageModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (updatedProducts: Product[], message: string) => void;
}

export default function QuickImageModal({
  product,
  isOpen,
  onClose,
  onProductUpdated,
}: QuickImageModalProps) {
  if (!isOpen || !product) return null;

  const [imageUrl, setImageUrl] = useState<string>(product.image_url || "");
  const [syncToGit, setSyncToGit] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSaveImage = async (forceGitPush?: boolean) => {
    if (!imageUrl || imageUrl.trim() === "") {
      setErrorMessage("Please select or paste an image URL first.");
      return;
    }

    const shouldPushGit = forceGitPush !== undefined ? forceGitPush : syncToGit;
    setIsSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/data?entity=products&action=change_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: product.id,
          slug: product.slug,
          image_url: imageUrl,
          sync_git: shouldPushGit,
          git_message: `Admin CMS: Update picture for "${product.name.en || product.slug}"`,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        let successNotice = "Product image updated successfully in Database & Codebase!";
        if (result.git_sync?.success) {
          successNotice = `Product picture updated! Pushed to GitHub (${result.git_sync.commitHash || "main"}) 🚀 Vercel deployment triggered.`;
        }
        onProductUpdated(result.items || [], successNotice);
        onClose();
      } else {
        throw new Error(result.error || "Failed to update product image");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-forest-100 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-cream-50 border-b border-forest-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-100 text-forest-800">
              <Camera className="w-4 h-4 text-forest-700" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-forest-950">
                Change Product Picture
              </h3>
              <p className="text-[11px] text-forest-600">
                Upload image or paste Google Drive / web link with automated Vercel sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Product Info Bar */}
          <div className="flex items-center justify-between p-3.5 bg-forest-50/60 rounded-2xl border border-forest-100">
            <div>
              <p className="font-bold text-xs text-forest-950">{product.name.en}</p>
              <p className="text-[11px] text-forest-700 font-bengali font-semibold">
                {product.name.bn}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-forest-200 text-forest-850 tracking-wider">
                {product.category}
              </span>
              <p className="text-xs font-bold text-forest-900 mt-1">৳{product.price}</p>
            </div>
          </div>

          {/* Current vs New Image Comparison */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                Current Picture
              </span>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <Image
                  src={product.image_url}
                  alt={product.name.en}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>New Preview</span>
              </span>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border-2 border-forest-500 shadow-xs">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="New Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs font-semibold">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Picker Widget */}
          <div className="p-4 bg-cream-50/70 rounded-2xl border border-forest-100">
            <ProductImagePicker
              value={imageUrl}
              onChange={(newUrl) => setImageUrl(newUrl)}
            />
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* GitHub & Vercel Auto-deploy checkbox */}
          <div className="p-3 bg-forest-900/5 rounded-2xl border border-forest-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="quickSyncCheck"
              checked={syncToGit}
              onChange={(e) => setSyncToGit(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-forest-300 cursor-pointer"
            />
            <label htmlFor="quickSyncCheck" className="text-xs text-forest-900 cursor-pointer select-none">
              <span className="font-bold flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5 text-emerald-600" />
                <span>Auto-push to GitHub & trigger Vercel deployment</span>
              </span>
              <span className="block text-[11px] text-forest-600 mt-0.5">
                Updates Supabase database, writes to <code className="text-forest-800 font-mono">fallback-data.ts</code>, commits to Git, and deploys live on Vercel.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-cream-50 border-t border-forest-100">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveImage(false)}
              className="px-3.5 py-2 rounded-xl bg-forest-100 hover:bg-forest-200 text-forest-900 text-xs font-bold transition-all cursor-pointer border border-forest-300 disabled:opacity-50"
            >
              Save Locally & DB
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveImage(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className={`w-3.5 h-3.5 ${isSaving ? "animate-bounce" : ""}`} />
              <span>{isSaving ? "Syncing & Deploying..." : "Update & Deploy to GitHub / Vercel"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
