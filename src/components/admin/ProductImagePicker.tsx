"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Link as LinkIcon, CheckCircle, AlertCircle, X, Image as ImageIcon, Cloud } from "lucide-react";
import { formatImageLink } from "../../lib/utils";

interface ProductImagePickerProps {
  value: string;
  onChange: (url: string) => void;
}

export default function ProductImagePicker({ value, onChange }: ProductImagePickerProps) {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [storageType, setStorageType] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size must be less than 10MB");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setStorageType(data.storage === "supabase" ? "Supabase Cloud Storage" : "Local Drive Storage");
      } else {
        throw new Error(data.error || "Failed to upload image");
      }
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image. Please try again or paste a link.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleLinkInput = (text: string) => {
    const directUrl = formatImageLink(text);
    onChange(directUrl);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-forest-900 tracking-wide">
          Product Image *
        </label>
        {/* Toggle between Upload and Link */}
        <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
              mode === "upload"
                ? "bg-forest-700 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-[11px] font-bold transition-all ${
              mode === "link"
                ? "bg-forest-700 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            <span>Paste Link / Drive</span>
          </button>
        </div>
      </div>

      {/* Mode 1: File Upload */}
      {mode === "upload" && (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
            id="product-image-file"
          />

          <label
            htmlFor="product-image-file"
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${
              isUploading
                ? "bg-forest-50 border-forest-400"
                : "bg-cream-50/70 hover:bg-forest-50/50 border-forest-200"
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center text-forest-700 mb-2">
              <Upload className={`w-5 h-5 ${isUploading ? "animate-bounce" : ""}`} />
            </div>
            <p className="text-xs font-bold text-forest-900 text-center">
              {isUploading ? "Uploading to Cloud Storage..." : "Click to browse or drag & drop image"}
            </p>
            <p className="text-[10px] text-stone-500 mt-1">
              Supports PNG, JPG, WEBP, GIF (up to 10MB)
            </p>
          </label>
        </div>
      )}

      {/* Mode 2: Link / Google Drive Input */}
      {mode === "link" && (
        <div className="space-y-1.5">
          <input
            type="url"
            value={value}
            onChange={(e) => handleLinkInput(e.target.value)}
            placeholder="https://images.unsplash.com/... or Google Drive share link"
            className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
          <p className="text-[10px] text-stone-500">
            💡 Google Drive share links are automatically converted into direct image links!
          </p>
        </div>
      )}

      {uploadError && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Preview Box */}
      {value && (
        <div className="p-3 bg-white rounded-2xl border border-forest-100 shadow-soft-sm flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-forest-200/50">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="64px"
              unoptimized
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-forest-950">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Image Attached</span>
            </div>
            <p className="text-[11px] font-mono text-stone-500 truncate mt-0.5">
              {value}
            </p>
            {storageType && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md mt-1">
                <Cloud className="w-3 h-3 text-forest-600" />
                <span>{storageType}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg hover:bg-stone-50 transition-colors"
            title="Remove Image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
