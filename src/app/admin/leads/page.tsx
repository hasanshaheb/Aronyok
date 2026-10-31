"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  Search,
  RefreshCw,
  Plus,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  MessageSquare,
  UserCheck,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { Lead } from "@/lib/types";

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");

  // Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "website",
    interested_in: "",
    estimated_value: 0,
    status: "new" as "new" | "contacted" | "negotiating" | "converted" | "lost",
    follow_up_date: "",
    notes: "",
  });

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=leads");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setLeads(data);
        }
      }
    } catch (err) {
      console.warn("Could not load leads:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(""), 4000);
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showError("Name and Phone are required.");
      return;
    }

    try {
      const payload: Partial<Lead> = {
        id: editingLead ? editingLead.id : undefined,
        customer_name: formData.name,
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        source: formData.source as any,
        interest_category: formData.interested_in,
        interested_in: formData.interested_in,
        status: formData.status,
        follow_up_date: formData.follow_up_date,
        notes: formData.notes,
        estimated_value: Number(formData.estimated_value) || 0,
      };

      const res = await fetch("/api/admin/data?entity=leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess(editingLead ? "Lead updated successfully!" : "New prospective lead created!");
        setIsAddModalOpen(false);
        setEditingLead(null);
        resetForm();
        loadLeads();
      } else {
        showError("Failed to save lead.");
      }
    } catch {
      showError("Network error while saving lead.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      source: "website",
      interested_in: "",
      estimated_value: 0,
      status: "new",
      follow_up_date: "",
      notes: "",
    });
  };

  const handleStatusChange = async (leadId: string, newStatus: any) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    try {
      const res = await fetch("/api/admin/data?entity=leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, status: newStatus }),
      });
      if (res.ok) {
        showSuccess(`Lead status updated to ${newStatus}`);
        loadLeads();
      }
    } catch {
      showError("Could not update lead status");
    }
  };

  const handleConvertToCustomer = async (lead: Lead) => {
    const leadName = lead.name || lead.customer_name;
    if (!confirm(`Convert "${leadName}" to an active CRM customer?`)) return;

    try {
      // 1. Mark lead as converted
      await fetch("/api/admin/data?entity=leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, status: "converted" }),
      });

      // 2. Create customer entry
      await fetch("/api/admin/data?entity=customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: leadName,
          phone: lead.phone,
          email: lead.email || "",
          customer_tags: ["Converted Lead", lead.source],
          notes: `Converted from lead. Interested in: ${lead.interested_in || lead.interest_category || "N/A"}. Lead notes: ${lead.notes || ""}`,
        }),
      });

      showSuccess(`Successfully converted "${leadName}" to CRM Customer!`);
      loadLeads();
    } catch {
      showError("Error converting lead to customer");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete lead "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/data?entity=leads&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("Lead deleted");
        loadLeads();
      }
    } catch {
      showError("Failed to delete lead");
    }
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setFormData({
      name: lead.name || lead.customer_name,
      phone: lead.phone,
      email: lead.email || "",
      source: lead.source || "website",
      interested_in: lead.interested_in || lead.interest_category || "",
      estimated_value: lead.estimated_value || 0,
      status: lead.status,
      follow_up_date: lead.follow_up_date || "",
      notes: lead.notes || "",
    });
    setIsAddModalOpen(true);
  };

  // Filtered
  const filteredLeads = leads.filter((l) => {
    const q = search.toLowerCase();
    const leadName = (l.name || l.customer_name || "").toLowerCase();
    const leadInterest = (l.interested_in || l.interest_category || "").toLowerCase();
    const matchesSearch =
      leadName.includes(q) ||
      l.phone.includes(q) ||
      leadInterest.includes(q);

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    return true;
  });

  // Metrics
  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;
  const pipelineValue = leads
    .filter((l) => l.status !== "lost" && l.status !== "converted")
    .reduce((acc, l) => acc + (l.estimated_value || 0), 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Notifications */}
      {notification && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}
      {errorNotification && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm font-semibold">{errorNotification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-cream-100">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-950">
                Leads Pipeline (সম্ভাব্য ক্রেতা ট্র্যাকিং)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Track enquiries from WhatsApp, Facebook, plant exhibitions, and rooftop garden consultations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadLeads}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditingLead(null);
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Lead</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Pipeline
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">{totalLeads}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">All prospective clients</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            New / Uncontacted
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-800">{newLeads}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Require immediate follow-up</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Converted Leads
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{convertedLeads}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0}% conversion rate
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-stone-400" />
            Active Pipeline Value
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">
            ৳{pipelineValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Negotiating & prospective</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search leads by name, phone, varieties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-auto">
          {["all", "new", "contacted", "negotiating", "converted", "lost"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? "bg-forest-800 text-white shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {st} ({st === "all" ? leads.length : leads.filter((l) => l.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="p-4">Lead & Source</th>
                <th className="p-4">Contact & Quick Connect</th>
                <th className="p-4">Interests & Est. Value</th>
                <th className="p-4">Status</th>
                <th className="p-4">Follow-Up & Notes</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    No leads found in this view.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const leadName = lead.name || lead.customer_name;
                  const rawPhone = lead.phone.replace(/[^0-9]/g, "");
                  const bdPhone = rawPhone.startsWith("88") ? rawPhone : `88${rawPhone}`;
                  const isOverdue =
                    lead.follow_up_date &&
                    new Date(lead.follow_up_date) < new Date() &&
                    lead.status !== "converted" &&
                    lead.status !== "lost";

                  return (
                    <tr key={lead.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-forest-950 text-sm">{leadName}</div>
                        <div className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200 uppercase tracking-wide">
                          Source: {lead.source || "Website"}
                        </div>
                      </td>

                      <td className="p-4 space-y-1.5">
                        <div className="flex items-center gap-2 font-medium text-stone-800">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{lead.phone}</span>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2 text-stone-500">
                            <Mail className="w-3.5 h-3.5 text-stone-400" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        <div className="pt-1 flex items-center gap-2">
                          <a
                            href={`https://wa.me/${bdPhone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-[10px] border border-emerald-200 transition"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-600" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded bg-stone-100 text-stone-700 hover:bg-stone-200 font-semibold text-[10px] border border-stone-200 transition"
                          >
                            <Phone className="w-3 h-3 text-stone-600" />
                            <span>Call</span>
                          </a>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-stone-900 line-clamp-2">
                          {lead.interested_in || lead.interest_category || "General consultation"}
                        </div>
                        <div className="text-forest-900 font-bold mt-1 text-sm">
                          ৳{(lead.estimated_value || 0).toLocaleString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none transition ${
                            lead.status === "new"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : lead.status === "contacted"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : lead.status === "negotiating"
                              ? "bg-purple-50 text-purple-800 border-purple-300"
                              : lead.status === "converted"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : "bg-stone-100 text-stone-500 border-stone-300"
                          }`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="negotiating">Negotiating</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      </td>

                      <td className="p-4 max-w-xs">
                        {lead.follow_up_date && (
                          <div
                            className={`flex items-center gap-1.5 font-semibold text-[11px] mb-1 ${
                              isOverdue ? "text-red-600" : "text-stone-600"
                            }`}
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>
                              Follow-up: {new Date(lead.follow_up_date).toLocaleDateString()}
                              {isOverdue && " (Overdue!)"}
                            </span>
                          </div>
                        )}
                        <div className="text-stone-500 text-xs line-clamp-2">
                          {lead.notes || <span className="text-stone-300 italic">No notes</span>}
                        </div>
                      </td>

                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        {lead.status !== "converted" && (
                          <button
                            onClick={() => handleConvertToCustomer(lead)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-600 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px] transition shadow-xs"
                            title="Convert to CRM Customer"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Convert</span>
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(lead)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                          title="Edit lead"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, leadName)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition"
                          title="Delete lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-forest-950 text-base">
                {editingLead ? "Edit Lead" : "Add New Lead"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Lead Name (সম্ভাব্য ক্রেতার নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dr. Mahmud Hasan"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="017xxxxxxxx"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="lead@example.com"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="website">Website Enquiry</option>
                    <option value="facebook">Facebook / Instagram</option>
                    <option value="whatsapp">WhatsApp Direct</option>
                    <option value="nursery_visit">Nursery Visit</option>
                    <option value="phone">Phone Call</option>
                    <option value="referral">Referral / Word of mouth</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Estimated Value (৳)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.estimated_value}
                    onChange={(e) => setFormData({ ...formData, estimated_value: Number(e.target.value) })}
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Pipeline Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="negotiating">Negotiating</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Next Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Interested Plants & Quantities (আগ্রহী গাছ ও পরিমাণ)
                </label>
                <input
                  type="text"
                  value={formData.interested_in}
                  onChange={(e) => setFormData({ ...formData, interested_in: e.target.value })}
                  placeholder="e.g. 5x Katimon Mango, 2x Thai Guava, 10x Snake Plants"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Notes & Discussion Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Requested quotation for rooftop garden layout, delivery by next Friday."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition"
                >
                  {editingLead ? "Update Lead" : "Save Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
