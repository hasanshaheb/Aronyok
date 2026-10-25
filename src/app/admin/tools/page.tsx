"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wrench, CheckCircle, XCircle, ExternalLink, Sparkles } from "lucide-react";
import { fallbackTools } from "../../../lib/supabase/fallback-data";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";
import { ToolMicroApp } from "../../../lib/types";

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolMicroApp[]>(fallbackTools);

  const loadTools = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: true });

      if (data && data.length > 0) {
        setTools(data);
      }
    } catch (err) {
      console.warn("Using fallback tools:", err);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  const toggleToolActive = async (tool: ToolMicroApp) => {
    const updated = !tool.is_active;
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("tools")
        .update({ is_active: updated })
        .eq("id", tool.id);
      await loadTools();
    } else {
      setTools((prev) =>
        prev.map((t) => (t.id === tool.id ? { ...t, is_active: updated } : t))
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Tools & Micro-Apps Manager
          </h1>
          <p className="text-xs text-forest-600">
            Activate or deactivate interactive widgets and preview front-end calculators
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="p-6 bg-white rounded-3xl border border-forest-100 shadow-soft-sm flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2.5 rounded-xl bg-forest-50 text-forest-700">
                  <Sparkles className="w-5 h-5" />
                </span>
                <button
                  onClick={() => toggleToolActive(tool)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                    tool.is_active
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-stone-200 text-stone-700 hover:bg-stone-300"
                  }`}
                >
                  {tool.is_active ? "Active" : "Disabled"}
                </button>
              </div>

              <h3 className="font-bold text-base text-forest-950">
                {tool.title.en}
              </h3>
              <p className="text-xs text-forest-700 font-bengali mt-0.5">
                {tool.title.bn}
              </p>
              <p className="text-xs text-forest-600/80 mt-2 line-clamp-3 leading-relaxed">
                {tool.description.en}
              </p>
            </div>

            <div className="pt-4 border-t border-forest-50 flex items-center justify-between text-xs">
              <span className="font-mono text-stone-400">
                /{tool.endpoint_slug}
              </span>
              <Link
                href={`/tools/${tool.endpoint_slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 font-bold text-forest-700 hover:text-forest-950"
              >
                <span>Launch</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
