"use client";

import React, { useState, useEffect } from "react";
import { Save, Sparkles, Globe, Code, Megaphone, CheckCircle, RefreshCw, CloudUpload } from "lucide-react";
import DualLangInput from "../../../components/admin/DualLangInput";
import { fallbackSettings } from "../../../lib/supabase/fallback-data";
import { SiteSettings } from "../../../lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [syncedNotice, setSyncedNotice] = useState("");
  const [syncToGit, setSyncToGit] = useState(true);

  const loadSettings = async () => {
    try {
      const res = await fetch("/api/admin/data?entity=settings");
      if (res.ok) {
        const data = await res.json();
        if (data && data.global_seo_title) {
          setSettings(data);
        }
      }
    } catch (err) {
      console.warn("Using local settings:", err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e?: React.FormEvent, forceSyncGit?: boolean) => {
    if (e) e.preventDefault();
    setLoading(true);

    const shouldSync = forceSyncGit !== undefined ? forceSyncGit : syncToGit;
    const payload = {
      ...settings,
      sync_git: shouldSync,
      git_message: "Admin CMS: Update store SEO, banners & AI Assistant prompt",
    };

    try {
      const res = await fetch("/api/admin/data?entity=settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.settings) {
        setSettings(result.settings);
      }

      setIsSaved(true);
      if (result.git_sync?.success) {
        setSyncedNotice(`Settings saved to Database & Codebase! Pushed to GitHub (${result.git_sync.commitHash || "main"}) 🚀`);
      } else {
        setSyncedNotice(result.synced ? "Synced to Supabase & Codebase (fallback-data.ts)!" : "Saved to active runtime cache & Codebase!");
      }
      setTimeout(() => {
        setIsSaved(false);
        setSyncedNotice("");
      }, 4000);
    } catch {
      alert("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetDefaultPrompt = () => {
    setSettings((prev) => ({
      ...prev,
      ai_system_prompt:
        "You are Aronyok (অরণ্যক), an intelligent, gentle, and highly knowledgeable nature expert, herbalist, and eco-living guide. You are fluent in both English and Bengali. If the user asks in Bengali, reply warmly in Bengali. If in English, reply in English. Help users identify therapeutic herbs, offer plant care advice, suggest organic solutions, and guide them through our eco products.",
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Settings & AI Configuration
          </h1>
          <p className="text-xs text-forest-600">
            Customize global SEO metadata, top ad banners, and dynamic OpenRouter AI Assistant instructions
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>{syncedNotice || "Settings saved successfully!"}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: AI Assistant Configuration */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-forest-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-forest-950">
                  AI Assistant System Prompt
                </h2>
                <p className="text-xs text-forest-600">
                  Controls the personality, botanical expertise, and bilingual tone of the floating chat assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetDefaultPrompt}
              className="text-xs text-forest-700 hover:text-forest-900 font-bold hover:underline"
            >
              Reset to Default
            </button>
          </div>

          <div>
            <textarea
              rows={5}
              value={settings.ai_system_prompt}
              onChange={(e) =>
                setSettings({ ...settings, ai_system_prompt: e.target.value })
              }
              className="w-full p-4 rounded-2xl bg-cream-50 border border-forest-200 text-xs sm:text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 leading-relaxed font-mono"
            />
            <p className="text-[11px] text-stone-400 mt-1.5">
              💡 Changes here immediately take effect for the floating AI assistant!
            </p>
          </div>
        </div>

        {/* Section 2: Global SEO */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-forest-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-earth-100 text-earth-700 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest-950">
                Global SEO Metadata
              </h2>
              <p className="text-xs text-forest-600">
                Default bilingual search engine title and meta description
              </p>
            </div>
          </div>

          <DualLangInput
            label="Global SEO Title"
            value={settings.global_seo_title}
            onChange={(global_seo_title) =>
              setSettings({ ...settings, global_seo_title })
            }
            placeholderEn="Aronyok | Pure Living, Herbs & Eco Store"
            placeholderBn="অরণ্যক | বিশুদ্ধ জীবনধারা, জৈব ভেষজ ও পরিবেশবান্ধব পণ্য"
          />

          <DualLangInput
            label="Global Meta Description"
            type="textarea"
            rows={2}
            value={settings.global_seo_description}
            onChange={(global_seo_description) =>
              setSettings({ ...settings, global_seo_description })
            }
            placeholderEn="Discover pure wild mangrove honey, cold-pressed oils..."
            placeholderBn="আবিষ্কার করুন সুন্দরবনের খাঁটি প্রাকৃতিক মধু, ঘানিতে ভাঙা তেল..."
          />
        </div>

        {/* Section 3: Ad Banner & Analytics Scripts */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-forest-100 pb-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-forest-950">
                Top Ad / Promo Banner HTML & Analytics
              </h2>
              <p className="text-xs text-forest-600">
                Paste raw HTML for the top promotional alert banner or embed scripts for analytics
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-forest-600" />
              <span>Top Notification / Ad Banner HTML</span>
            </label>
            <textarea
              rows={3}
              value={settings.ad_banner_top_html || ""}
              onChange={(e) =>
                setSettings({ ...settings, ad_banner_top_html: e.target.value })
              }
              placeholder='<div class="bg-forest-800 text-cream-100 py-2 text-center text-xs">...</div>'
              className="w-full p-3.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-mono text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1.5 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-forest-600" />
              <span>Analytics / Custom Script Tag</span>
            </label>
            <textarea
              rows={2}
              value={settings.analytics_script || ""}
              onChange={(e) =>
                setSettings({ ...settings, analytics_script: e.target.value })
              }
              placeholder="<!-- Google Tag or script here -->"
              className="w-full p-3.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-mono text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
        </div>

        {/* Section 4: Contact Details */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-forest-100 shadow-soft-sm space-y-4">
          <h2 className="text-base font-bold text-forest-950 border-b border-forest-100 pb-3">
            Public Contact Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) =>
                  setSettings({ ...settings, contact_email: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-forest-900 mb-1">
                Contact Phone / WhatsApp
              </label>
              <input
                type="text"
                value={settings.contact_phone || ""}
                onChange={(e) =>
                  setSettings({ ...settings, contact_phone: e.target.value })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-forest-100 shadow-soft-sm">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-forest-800 font-semibold select-none">
            <input
              type="checkbox"
              checked={syncToGit}
              onChange={(e) => setSyncToGit(e.target.checked)}
              className="w-4 h-4 rounded text-forest-700 focus:ring-forest-600 border-forest-300"
            />
            <span>Commit code & trigger Vercel deployment on save</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(undefined, false)}
              className="px-5 py-3 rounded-2xl bg-forest-100 hover:bg-forest-200 text-forest-900 font-bold text-xs transition-all cursor-pointer border border-forest-300 disabled:opacity-50"
            >
              Save Locally & DB
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleSave(undefined, true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest-700 hover:bg-forest-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <CloudUpload className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Deploying..." : "Save & Push to GitHub"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
