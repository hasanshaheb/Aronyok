"use client";

import React, { useState } from "react";
import { LocalizedString } from "../../lib/types";

interface DualLangInputProps {
  label: string;
  value: LocalizedString;
  onChange: (newValue: LocalizedString) => void;
  type?: "input" | "textarea";
  rows?: number;
  placeholderEn?: string;
  placeholderBn?: string;
  required?: boolean;
}

export default function DualLangInput({
  label,
  value,
  onChange,
  type = "input",
  rows = 3,
  placeholderEn = "Enter in English...",
  placeholderBn = "বাংলায় লিখুন...",
  required = false,
}: DualLangInputProps) {
  const [activeTab, setActiveTab] = useState<"en" | "bn">("en");

  const handleEnChange = (val: string) => {
    onChange({ ...value, en: val });
  };

  const handleBnChange = (val: string) => {
    onChange({ ...value, bn: val });
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-forest-900 tracking-wide">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {/* EN / BN Tab Switcher */}
        <div className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
          <button
            type="button"
            onClick={() => setActiveTab("en")}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
              activeTab === "en"
                ? "bg-forest-700 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bn")}
            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all ${
              activeTab === "bn"
                ? "bg-forest-700 text-white shadow-xs"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            বাংলা
          </button>
        </div>
      </div>

      {activeTab === "en" ? (
        type === "input" ? (
          <input
            type="text"
            required={required}
            value={value.en || ""}
            onChange={(e) => handleEnChange(e.target.value)}
            placeholder={placeholderEn}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        ) : (
          <textarea
            required={required}
            rows={rows}
            value={value.en || ""}
            onChange={(e) => handleEnChange(e.target.value)}
            placeholder={placeholderEn}
            className="w-full px-3.5 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 font-sans"
          />
        )
      ) : type === "input" ? (
        <input
          type="text"
          required={required}
          value={value.bn || ""}
          onChange={(e) => handleBnChange(e.target.value)}
          placeholder={placeholderBn}
          className="w-full px-3.5 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 font-bengali"
        />
      ) : (
        <textarea
          required={required}
          rows={rows}
          value={value.bn || ""}
          onChange={(e) => handleBnChange(e.target.value)}
          placeholder={placeholderBn}
          className="w-full px-3.5 py-2 rounded-xl bg-white border border-forest-200 text-xs sm:text-sm text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600 font-bengali"
        />
      )}
    </div>
  );
}
