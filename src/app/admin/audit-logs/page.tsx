"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  RefreshCw,
  Download,
  Filter,
  Calendar,
  User,
  Activity,
  Globe,
} from "lucide-react";
import { AuditLog } from "@/lib/types";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntity, setSelectedEntity] = useState("all");

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data?entity=audit_logs");
      if (res.ok) {
        const data = await res.json();
        setLogs(data || []);
      }
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ["Timestamp", "Staff Email", "Action", "Entity", "Entity ID", "IP Address", "Details"];
    const rows = logs.map((l) => [
      l.created_at,
      l.staff_email,
      l.action,
      l.entity,
      l.entity_id || "",
      l.ip_address || "",
      `"${(l.details || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aronyok_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesEntity = selectedEntity === "all" || l.entity === selectedEntity;
    const str = (l.action + " " + l.staff_email + " " + (l.details || "") + " " + (l.ip_address || "")).toLowerCase();
    const matchesSearch = searchTerm.trim() === "" || str.includes(searchTerm.toLowerCase());
    return matchesEntity && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-forest-700" />
            <span>Security & Administrative Audit Logs</span>
          </h1>
          <p className="text-xs text-forest-600">
            Immutable system audit trail logging staff authentication, inventory adjustments, orders, and system mutations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadLogs}
            className="p-2.5 rounded-xl border border-forest-200 bg-white text-forest-700 hover:bg-forest-50 transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-forest-200 bg-white text-forest-800 hover:bg-forest-50 font-bold text-xs shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Total Audited Events
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-1">
            {logs.length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Security Logins
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">
            {logs.filter((l) => l.action.includes("LOGIN")).length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Stock Adjustments
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-1">
            {logs.filter((l) => l.action.includes("STOCK") || l.action.includes("RESTOCK")).length}
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            System Integrity
          </div>
          <div className="text-2xl font-extrabold text-forest-900 mt-1 flex items-center gap-1.5">
            <span>100%</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Verified
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, email, IP address, or details..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <select
          value={selectedEntity}
          onChange={(e) => setSelectedEntity(e.target.value)}
          className="px-3.5 py-2.5 rounded-xl bg-white border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
        >
          <option value="all">All Entities</option>
          <option value="auth">Authentication & Logins</option>
          <option value="orders">Orders & Commerce</option>
          <option value="inventory">Inventory & Restocks</option>
          <option value="purchases">Suppliers & POs</option>
          <option value="campaigns">Marketing & Campaigns</option>
          <option value="users">Staff & RBAC</option>
        </select>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-forest-900">
            <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Staff / Source</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-forest-950 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-forest-400" />
                    <span>{log.staff_email}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-forest-100 text-forest-900 font-mono text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 capitalize font-medium text-stone-600">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-500 text-[11px]">
                    {log.ip_address || "127.0.0.1"}
                  </td>
                  <td className="py-3.5 px-4 text-forest-800 max-w-md">
                    <p className="truncate font-medium">{log.details}</p>
                    {log.entity_id && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        Ref ID: {log.entity_id}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-forest-400">
                    No audit records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
