"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Download,
  Plus,
  Mail,
  Phone,
  MapPin,
  Tag,
  DollarSign,
  ShoppingBag,
  Edit2,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Customer } from "@/lib/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    city: "Dhaka",
    address: "",
    customer_tags: "Repeat",
    notes: "",
  });

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=customers");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCustomers(data);
        }
      }
    } catch (err) {
      console.warn("Could not load customers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(""), 4000);
  };

  const handleExportCSV = () => {
    window.open("/api/admin/data?entity=customers&action=export_csv", "_blank");
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.phone) {
      showError("Name and Phone are required.");
      return;
    }

    try {
      const tagsArray = formData.customer_tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        id: editingCustomer ? editingCustomer.id : undefined,
        full_name: formData.full_name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        customer_tags: tagsArray,
        notes: formData.notes,
      };

      const res = await fetch("/api/admin/data?entity=customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess(editingCustomer ? "Customer profile updated!" : "New customer added successfully!");
        setIsAddModalOpen(false);
        setEditingCustomer(null);
        setFormData({
          full_name: "",
          phone: "",
          email: "",
          city: "Dhaka",
          address: "",
          customer_tags: "Repeat",
          notes: "",
        });
        loadCustomers();
      } else {
        showError("Failed to save customer profile.");
      }
    } catch {
      showError("Network error while saving customer.");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete customer record for "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/data?entity=customers&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showSuccess(`Deleted customer "${name}"`);
        loadCustomers();
      } else {
        showError("Failed to delete customer");
      }
    } catch {
      showError("Network error deleting customer");
    }
  };

  const openEditModal = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormData({
      full_name: cust.full_name,
      phone: cust.phone,
      email: cust.email || "",
      city: cust.city || "Dhaka",
      address: cust.address || "",
      customer_tags: cust.customer_tags ? cust.customer_tags.join(", ") : "",
      notes: cust.notes || "",
    });
    setIsAddModalOpen(true);
  };

  // Filtered customers
  const filteredCustomers = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch =
      c.full_name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.city && c.city.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (selectedTagFilter === "all") return true;
    if (selectedTagFilter === "vip") return c.customer_tags?.includes("VIP");
    if (selectedTagFilter === "repeat") return (c.total_orders || 0) > 1;
    return true;
  });

  // Analytics Metrics
  const totalCustomers = customers.length;
  const repeatBuyers = customers.filter((c) => (c.total_orders || 0) > 1).length;
  const totalLTV = customers.reduce((acc, c) => acc + (c.total_spent || 0), 0);
  const avgOrderValue = totalCustomers > 0 ? Math.round(totalLTV / Math.max(1, customers.reduce((acc, c) => acc + (c.total_orders || 0), 0))) : 0;

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
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-950">
                Customers & CRM (গ্রাহক ব্যবস্থাপনা)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Customer lifetime value (LTV), repeat purchase history, and botanical profiles
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadCustomers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-600/30 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingCustomer(null);
              setFormData({
                full_name: "",
                phone: "",
                email: "",
                city: "Dhaka",
                address: "",
                customer_tags: "New",
                notes: "",
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Customers
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">{totalCustomers}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Profiles in CRM database</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Repeat Buyers
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{repeatBuyers}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {totalCustomers > 0 ? Math.round((repeatBuyers / totalCustomers) * 100) : 0}% retention rate
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-stone-400" />
            Total LTV
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">
            ৳{totalLTV.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Cumulative revenue</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <ShoppingBag className="w-3.5 h-3.5 text-stone-400" />
            Avg Order Value
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">
            ৳{avgOrderValue.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Per fulfilled transaction</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, phone, email, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setSelectedTagFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedTagFilter === "all"
                ? "bg-forest-800 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setSelectedTagFilter("vip")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedTagFilter === "vip"
                ? "bg-amber-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            VIP ({customers.filter((c) => c.customer_tags?.includes("VIP")).length})
          </button>
          <button
            onClick={() => setSelectedTagFilter("repeat")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              selectedTagFilter === "repeat"
                ? "bg-emerald-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            Repeat Buyers ({repeatBuyers})
          </button>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="p-4">Customer</th>
                <th className="p-4">Contact & Location</th>
                <th className="p-4">Orders & LTV</th>
                <th className="p-4">Tags & Segment</th>
                <th className="p-4">Notes & Bio</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-stone-50/50 transition">
                    <td className="p-4">
                      <div className="font-bold text-forest-950 text-sm">{cust.full_name}</div>
                      <div className="text-[10px] text-stone-400 font-mono">ID: {cust.id}</div>
                    </td>

                    <td className="p-4 space-y-1">
                      <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{cust.phone}</span>
                      </div>
                      {cust.email && (
                        <div className="flex items-center gap-1.5 text-stone-500">
                          <Mail className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                      {(cust.city || cust.address) && (
                        <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{cust.address ? `${cust.address}, ` : ""}{cust.city || "Dhaka"}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-forest-900 text-sm">
                        ৳{(cust.total_spent || 0).toLocaleString()}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {cust.total_orders || 0} order{(cust.total_orders || 0) > 1 ? "s" : ""}
                      </div>
                      {cust.last_order_date && (
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Last: {new Date(cust.last_order_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {cust.customer_tags && cust.customer_tags.length > 0 ? (
                          cust.customer_tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                                tag === "VIP"
                                  ? "bg-amber-50 text-amber-800 border-amber-200"
                                  : tag === "Repeat"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-stone-50 text-stone-700 border-stone-200"
                              }`}
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-stone-400 text-[10px]">No tags</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="text-xs text-stone-600 line-clamp-2">
                        {cust.notes || <span className="text-stone-300 italic">No notes</span>}
                      </div>
                    </td>

                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(cust)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                        title="Edit profile & notes"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cust.id, cust.full_name)}
                        className="p-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 transition"
                        title="Delete customer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-forest-950 text-base">
                {editingCustomer ? "Edit Customer Profile" : "Add New Customer"}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Full Name (নাম) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. Farhan Ahmed"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Phone (ফোন) *
                  </label>
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
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Email (ইমেইল)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="customer@example.com"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Dhaka, Chittagong, etc."
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.customer_tags}
                    onChange={(e) => setFormData({ ...formData, customer_tags: e.target.value })}
                    placeholder="VIP, Rooftop Gardener, Fruit Plants"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Delivery Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House 14, Road 5, Dhanmondi"
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Customer Notes & Plant Preferences
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Prefers exotic fruit varieties, morning delivery, etc."
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
                  {editingCustomer ? "Update Profile" : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
