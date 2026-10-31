"use client";

import React, { useState, useEffect } from "react";
import {
  UserCheck,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Key,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Lock,
} from "lucide-react";
import { AdminUser } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: "super_admin" | "store_manager" | "botanist" | "fulfillment_agent";
    is_active: boolean;
  }>({
    name: "",
    email: "",
    phone: "",
    role: "store_manager",
    is_active: true,
  });

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/data?entity=users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data || []);
      }
    } catch (err) {
      console.error("Failed to load admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "store_manager",
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      is_active: u.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      id: editingUser?.id,
      name: formData.name,
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      role: formData.role,
      is_active: formData.is_active,
      permissions:
        formData.role === "super_admin"
          ? ["*"]
          : formData.role === "store_manager"
          ? ["orders", "products", "customers", "coupons", "purchases", "shipments"]
          : formData.role === "botanist"
          ? ["products", "tools", "blog", "pages"]
          : ["orders", "shipments"],
    };

    try {
      const res = await fetch("/api/admin/data?entity=users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsModalOpen(false);
        await loadUsers();
      }
    } catch {
      alert("Failed to save staff user.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this staff member's administrative access?")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=users&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadUsers();
      }
    } catch {}
  };

  const filteredUsers = users.filter((u) => {
    const str = (u.name + " " + u.email + " " + u.role).toLowerCase();
    return searchTerm.trim() === "" || str.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-forest-700" />
            <span>Staff Roles & Access Control (RBAC)</span>
          </h1>
          <p className="text-xs text-forest-600">
            Define permissions, authorized staff identities, botanist access, and fulfillment credentials
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            className="p-2.5 rounded-xl border border-forest-200 bg-white text-forest-700 hover:bg-forest-50 transition-colors"
            title="Refresh Users"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Staff Member</span>
          </button>
        </div>
      </div>

      {/* Role Definitions Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xs text-forest-950">Super Administrator</h3>
          </div>
          <p className="text-[11px] text-forest-600">
            Full root privilege across commerce, Supabase DB sync, git commits, payments and RBAC.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xs text-forest-950">Store Manager</h3>
          </div>
          <p className="text-[11px] text-forest-600">
            Full operations access: Order processing, Customer CRM, Nursery PO restock, and Campaigns.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xs text-forest-950">Botanical Specialist</h3>
          </div>
          <p className="text-[11px] text-forest-600">
            Manages botanical varieties, scientific taxonomy, care calculators, and blog articles.
          </p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-xs text-forest-950">Fulfillment & Courier</h3>
          </div>
          <p className="text-[11px] text-forest-600">
            Dedicated packaging and logistics dispatch: Steadfast tracking, order packaging, courier manifests.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by staff name, email, or role..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
        />
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-forest-900">
            <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Module Permissions</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-forest-50/40 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-forest-950">
                    <div>{user.name}</div>
                    <div className="text-[11px] text-forest-500 font-mono font-normal">
                      ID: {user.id}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="flex items-center gap-1.5 text-forest-800">
                      <Mail className="w-3.5 h-3.5 text-forest-400" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                        <Phone className="w-3.5 h-3.5 text-forest-400" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        user.role === "super_admin"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : user.role === "store_manager"
                          ? "bg-blue-100 text-blue-800"
                          : user.role === "botanist"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {user.permissions.map((p, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-cream-100 text-stone-600 text-[9px] font-mono"
                        >
                          {p === "*" ? "Full Access" : p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        user.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-stone-100 text-stone-600"
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-stone-400" />
                          <span>Suspended</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 text-[11px] font-mono">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-1.5 rounded-lg text-forest-600 hover:bg-forest-100 hover:text-forest-950 transition-colors"
                        title="Edit user"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      {user.role !== "super_admin" && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-forest-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <h3 className="font-extrabold text-base text-forest-950">
                {editingUser ? "Edit Staff Access" : "Add New Staff Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tanvir Hossain"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@aronyok.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="017XXXXXXXX"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Assigned Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="super_admin">Super Administrator (Full Root)</option>
                  <option value="store_manager">Store Manager (Operations & Orders)</option>
                  <option value="botanist">Botanical Specialist (Catalog & Plant Care)</option>
                  <option value="fulfillment_agent">Fulfillment Agent (Dispatch & Logistics)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-forest-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-forest-200 text-xs font-semibold text-forest-700 hover:bg-forest-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
