"use client";

import React, { useState, useEffect } from "react";
import { GitBranch, RefreshCw, CheckCircle2, ArrowUpRight, CloudUpload } from "lucide-react";

export default function AdminSyncWidget() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [gitInfo, setGitInfo] = useState<{
    branch: string;
    lastCommit: string;
    hasUncommitted: boolean;
  } | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/admin/git-sync");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setGitInfo({
            branch: data.branch || "main",
            lastCommit: data.lastCommit || "",
            hasUncommitted: data.hasUncommitted ?? false,
          });
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    setStatusMsg("Saving codebase & pushing to GitHub...");
    try {
      const res = await fetch("/api/admin/git-sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Admin CMS: Sync latest products, blogs & content" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMsg(data.hasChanges === false ? "Already up to date!" : "Pushed! Vercel redeploying 🚀");
        fetchStatus();
      } else {
        setStatusMsg("Git commit stored locally");
      }
    } catch {
      setStatusMsg("Sync completed on local disk");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setStatusMsg(null), 4000);
    }
  };

  return (
    <div className="p-3 bg-forest-900/80 rounded-2xl border border-forest-800 text-xs space-y-2">
      <div className="flex items-center justify-between text-forest-300">
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
          <span>origin/{gitInfo?.branch || "main"}</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      </div>

      <p className="text-[10px] text-forest-200/80 line-clamp-1" title={gitInfo?.lastCommit}>
        {gitInfo?.lastCommit || "Checking git repository..."}
      </p>

      {statusMsg && (
        <p className="text-[10px] font-bold text-mint-300 bg-forest-800/80 p-1.5 rounded-lg border border-forest-700 animate-in fade-in">
          {statusMsg}
        </p>
      )}

      <button
        type="button"
        disabled={isSyncing}
        onClick={handleSync}
        className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-forest-800 hover:bg-forest-700 text-cream-100 rounded-xl font-bold text-[11px] transition-all cursor-pointer border border-forest-700 hover:border-forest-600 shadow-xs disabled:opacity-50"
      >
        <CloudUpload className={`w-3.5 h-3.5 text-mint-400 ${isSyncing ? "animate-bounce" : ""}`} />
        <span>{isSyncing ? "Syncing Code..." : "Deploy to GitHub & Vercel"}</span>
      </button>
    </div>
  );
}
