"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Search,
  RefreshCw,
  Plus,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Sprout,
  ShieldCheck,
} from "lucide-react";
import { Supplier } from "@/lib/types";

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    categories: "Live Plants, Fruit Saplings",
    payment_terms: "cash_on_delivery",
    notes: "",
    status: "active" as "active" | "inactive",
  });

  const loadSuppliers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=suppliers");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setSuppliers(data);
        }
      }
    } catch (err) {
      console.warn("Could not load suppliers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(""), 4000);
  };

  const handleSaveSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showError("Supplier Name and Phone are required.");
      return;
    }

    try {
      const catsArray = formData.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      const payload: Partial<Supplier> = {
        id: editingSupplier ? editingSupplier.id : undefined,
        company_name: formData.name,
        name: formData.name,
        contact_person: formData.contact_person,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        categories: catsArray,
        payment_terms: formData.payment_terms,
        notes: formData.notes,
        is_active: formData.status === "active",
        status: formData.status,
      };

      const res = await fetch("/api/admin/data?entity=suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess(editingSupplier ? "Supplier updated!" : "New partner nursery added!");
        setIsAddModalOpen(false);
        setEditingSupplier(null);
        resetForm();
        loadSuppliers();
      } else {
        showError("Failed to save supplier.");
      }
    } catch {
      showError("Network error saving supplier.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact_person: "",
      phone: "",
      email: "",
      address: "",
      categories: "Live Plants, Fruit Saplings",
      payment_terms: "cash_on_delivery",
      notes: "",
      status: "active",
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove supplier "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/data?entity=suppliers&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess("Supplier removed");
        loadSuppliers();
      } else {
        showError("Failed to delete supplier");
      }
    } catch {
      showError("Network error deleting supplier");
    }
  };

  const openEditModal = (sup: Supplier) => {
    const sName = sup.name || sup.company_name;
    setEditingSupplier(sup);
    setFormData({
      name: sName,
      contact_person: sup.contact_person || "",
      phone: sup.phone,
      email: sup.email || "",
      address: sup.address || "",
      categories: sup.categories ? sup.categories.join(", ") : "",
      payment_terms: sup.payment_terms || "cash_on_delivery",
      notes: sup.notes || "",
      status: sup.status || (sup.is_active ? "active" : "inactive"),
    });
    setIsAddModalOpen(true);
  };

  // Filtered
  const filteredSuppliers = suppliers.filter((s) => {
    const q = search.toLowerCase();
    const supName = (s.name || s.company_name || "").toLowerCase();
    return (
      supName.includes(q) ||
      s.phone.includes(q) ||
      (s.contact_person && s.contact_person.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q))
    );
  });

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
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-950">
                Suppliers & Nurseries (সরবরাহকারী নার্সারি)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Manage partner growers, tissue culture labs, potting soil vendors, and seed banks
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadSuppliers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              setEditingSupplier(null);
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Supplier</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Suppliers
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">{suppliers.length}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Verified botanical partners</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Active Suppliers
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">
            {suppliers.filter((s) => s.status === "active" || s.is_active).length}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Ready for procurement POs</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <Sprout className="w-3.5 h-3.5 text-forest-700" />
            Primary Categories
          </div>
          <div className="mt-2 text-base font-bold text-forest-950 line-clamp-1">
            Grafted Fruits, Indoor, Organic Manure
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Specialized live varieties</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search suppliers by nursery name, person, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="p-4">Nursery / Supplier</th>
                <th className="p-4">Contact Person & Info</th>
                <th className="p-4">Supply Categories</th>
                <th className="p-4">Payment Terms</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    No suppliers found.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((sup) => {
                  const sName = sup.name || sup.company_name;
                  const isActive = sup.status === "active" || sup.is_active;

                  return (
                    <tr key={sup.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-forest-950 text-sm">{sName}</div>
                        {sup.address && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{sup.address}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="font-semibold text-stone-800">
                          {sup.contact_person || "Manager"}
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <span>{sup.phone}</span>
                        </div>
                        {sup.email && (
                          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                            <Mail className="w-3 h-3 text-stone-400" />
                            <span>{sup.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {sup.categories && sup.categories.length > 0 ? (
                            sup.categories.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200"
                              >
                                {cat}
                              </span>
                            ))
                          ) : (
                            <span className="text-stone-400 text-[10px]">General Nursery</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700 uppercase tracking-wide">
                          <CreditCard className="w-3 h-3 text-stone-400" />
                          <span>{sup.payment_terms?.replace(/_/g, " ") || "COD"}</span>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-stone-200 text-stone-600"
                          }`}
                        >
                          {isActive ? "active" : "inactive"}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => openEditModal(sup)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                          title="Edit supplier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(sup.id, sName)}
                          className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition"
                          title="Delete supplier"
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

      {/* Add / Edit Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-forest-950 text-base">
                {editingSupplier ? "Edit Nursery Supplier" : "Add Partner Nursery"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nursery / Supplier Name (নার্সারির নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Savar Agro & Nursery"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contact_person}
                    onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                    placeholder="e.g. Master Rafiqul Islam"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nursery@example.com"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Payment Terms</label>
                  <select
                    value={formData.payment_terms}
                    onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="cash_on_delivery">Cash On Delivery (COD)</option>
                    <option value="advance">Advance Payment (MFS/Bank)</option>
                    <option value="net_15">Net 15 Days</option>
                    <option value="net_30">Net 30 Days</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Supply Categories (Comma separated)
                </label>
                <input
                  type="text"
                  value={formData.categories}
                  onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
                  placeholder="Grafted Fruits, Exotic Saplings, Terracotta Pots"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Address / Nursery Location</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Hemayetpur, Savar, Dhaka"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  {editingSupplier ? "Update Supplier" : "Save Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
