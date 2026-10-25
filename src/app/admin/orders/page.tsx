"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  CheckCircle,
  Printer,
  Archive,
  RotateCcw,
  Trash2,
  FileText,
  AlertCircle,
  CheckSquare,
  Square,
} from "lucide-react";
import { Order } from "@/lib/types";
import OrderInvoiceModal from "@/components/admin/OrderInvoiceModal";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterMethod, setFilterMethod] = useState("all");
  const [filterTab, setFilterTab] = useState<"active" | "archived" | "all">("active");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");
  
  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);

  // Invoice modal
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/data?entity=orders");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        }
      }
    } catch (err) {
      console.warn("Could not fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(""), 4000);
  };

  // Status updates
  const updateOrderStatus = async (id: string, newStatus: any) => {
    try {
      const res = await fetch("/api/admin/data?entity=orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, order_status: newStatus }),
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      showSuccess(`Order status updated to "${newStatus}"`);
    } catch {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
    }
  };

  const updatePaymentStatus = async (id: string, newStatus: any) => {
    try {
      const res = await fetch("/api/admin/data?entity=orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, payment_status: newStatus }),
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      showSuccess(`Payment status updated to "${newStatus}"`);
    } catch {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, payment_status: newStatus } : o));
    }
  };

  // Archive / Unarchive single order
  const toggleArchiveSingle = async (order: Order) => {
    const isCurrentlyArchived = Boolean(order.is_archived);
    const action = isCurrentlyArchived ? "unarchive" : "archive";
    try {
      const res = await fetch(`/api/admin/data?entity=orders&action=${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [order.id] }),
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      showSuccess(isCurrentlyArchived ? "Order restored to active" : "Order archived successfully");
    } catch {
      showError("Failed to update archive status");
    }
  };

  // Delete single order
  const deleteSingle = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/admin/data?entity=orders&id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      setSelectedIds(prev => prev.filter(item => item !== id));
      showSuccess("Order permanently deleted");
    } catch {
      showError("Failed to delete order");
    }
  };

  // Batch operations
  const handleBatchArchive = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessingBatch(true);
    try {
      const res = await fetch("/api/admin/data?entity=orders&action=archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      showSuccess(`Archived ${selectedIds.length} order(s)`);
      setSelectedIds([]);
    } catch {
      showError("Failed to archive selected orders");
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchUnarchive = async () => {
    if (selectedIds.length === 0) return;
    setIsProcessingBatch(true);
    try {
      const res = await fetch("/api/admin/data?entity=orders&action=unarchive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      showSuccess(`Restored ${selectedIds.length} order(s) to active`);
      setSelectedIds([]);
    } catch {
      showError("Failed to restore selected orders");
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} order(s)? This cannot be undone.`)) return;
    
    setIsProcessingBatch(true);
    try {
      const res = await fetch("/api/admin/data?entity=orders&action=delete_batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const result = await res.json();
      if (result.items) {
        setOrders(result.items);
      }
      showSuccess(`Deleted ${selectedIds.length} order(s)`);
      setSelectedIds([]);
    } catch {
      showError("Failed to delete selected orders");
    } finally {
      setIsProcessingBatch(false);
    }
  };

  // Filtering
  const filtered = orders.filter((o) => {
    // Tab filter
    if (filterTab === "active" && o.is_archived) return false;
    if (filterTab === "archived" && !o.is_archived) return false;

    // Gateway filter
    const matchesMethod =
      filterMethod === "all" || o.payment_method === filterMethod;

    // Search filter
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase());

    return matchesMethod && matchesSearch;
  });

  // Selection helpers
  const isAllSelected = filtered.length > 0 && filtered.every((o) => selectedIds.includes(o.id));
  const isSomeSelected = filtered.some((o) => selectedIds.includes(o.id)) && !isAllSelected;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      // Unselect all in current view
      const visibleIds = new Set(filtered.map((o) => o.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      // Select all in current view
      const visibleIds = filtered.map((o) => o.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...visibleIds])));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const activeCount = orders.filter((o) => !o.is_archived).length;
  const archivedCount = orders.filter((o) => Boolean(o.is_archived)).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Orders & Transaction Management
          </h1>
          <p className="text-xs text-forest-600">
            Track customer orders, manage archiving, print official invoices, and update live payment statuses
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="inline-flex items-center gap-1.5 p-2.5 rounded-xl border border-forest-200 bg-white hover:bg-forest-50 text-forest-700 transition-colors shadow-xs text-xs font-semibold cursor-pointer"
          title="Refresh Orders"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Notifications */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {errorNotification && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-800 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorNotification}</span>
        </div>
      )}

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-forest-100 shadow-soft-sm">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-cream-50 p-1 rounded-xl border border-forest-100 shrink-0">
          <button
            onClick={() => setFilterTab("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === "active"
                ? "bg-white text-forest-950 shadow-xs border border-forest-100"
                : "text-forest-600 hover:text-forest-900"
            }`}
          >
            Active Orders ({activeCount})
          </button>
          <button
            onClick={() => setFilterTab("archived")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === "archived"
                ? "bg-white text-forest-950 shadow-xs border border-forest-100"
                : "text-forest-600 hover:text-forest-900"
            }`}
          >
            Archived ({archivedCount})
          </button>
          <button
            onClick={() => setFilterTab("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterTab === "all"
                ? "bg-white text-forest-950 shadow-xs border border-forest-100"
                : "text-forest-600 hover:text-forest-900"
            }`}
          >
            All ({orders.length})
          </button>
        </div>

        {/* Search & Gateway Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, phone, order #..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600 cursor-pointer"
            >
              <option value="all">All Gateways</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="bkash">bKash / Nagad MFS</option>
              <option value="sslcommerz">SSLCommerz</option>
              <option value="stripe">Stripe Card</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Banner (Visible when items selected) */}
      {selectedIds.length > 0 && (
        <div className="p-3 px-4 bg-forest-900 text-cream-100 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-forest-700 flex items-center justify-center text-xs font-extrabold text-white">
              {selectedIds.length}
            </span>
            <span className="text-xs font-bold">
              {selectedIds.length} order{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {filterTab !== "archived" && (
              <button
                disabled={isProcessingBatch}
                onClick={handleBatchArchive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-bold transition-all cursor-pointer border border-forest-600"
              >
                <Archive className="w-3.5 h-3.5 text-amber-400" />
                <span>Archive Selected</span>
              </button>
            )}

            {(filterTab === "archived" || filterTab === "all") && (
              <button
                disabled={isProcessingBatch}
                onClick={handleBatchUnarchive}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-bold transition-all cursor-pointer border border-forest-600"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Restore to Active</span>
              </button>
            )}

            <button
              disabled={isProcessingBatch}
              onClick={handleBatchDelete}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-900/80 hover:bg-red-800 text-red-100 text-xs font-bold transition-all cursor-pointer border border-red-700"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Permanently</span>
            </button>

            <button
              onClick={() => setSelectedIds([])}
              className="text-xs text-cream-200/80 hover:text-white px-2 py-1 font-semibold"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-forest-900 uppercase font-bold text-[10px] tracking-wider border-b border-forest-100">
              <tr>
                <th className="py-3.5 px-4 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className="cursor-pointer text-forest-700 hover:text-forest-950 flex items-center justify-center"
                    title={isAllSelected ? "Deselect all" : "Select all"}
                  >
                    {isAllSelected ? (
                      <CheckSquare className="w-4 h-4 text-forest-700" />
                    ) : isSomeSelected ? (
                      <div className="w-3.5 h-3.5 rounded bg-forest-700 flex items-center justify-center text-white text-[9px] font-bold">
                        -
                      </div>
                    ) : (
                      <Square className="w-4 h-4 text-stone-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-4">Order #</th>
                <th className="py-3.5 px-4">Customer Details</th>
                <th className="py-3.5 px-4">Shipping Destination</th>
                <th className="py-3.5 px-4">Total Amount</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 text-forest-900">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-stone-400" />
                    <p className="font-semibold text-xs text-stone-600">No orders found in this view</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      {search ? "Try adjusting your search query." : "Orders placed by customers will persist here."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const isSelected = selectedIds.includes(order.id);
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-cream-50/60 transition-colors ${
                        isSelected ? "bg-forest-50/60" : ""
                      } ${order.is_archived ? "opacity-75" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => toggleSelectRow(order.id)}
                          className="cursor-pointer text-forest-700 flex items-center justify-center mx-auto"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-forest-700" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-300 hover:text-stone-500" />
                          )}
                        </button>
                      </td>

                      {/* Order Number */}
                      <td className="py-3 px-4 font-bold font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>{order.order_number}</span>
                          {order.is_archived && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                              Archived
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 block font-sans">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : ""}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-forest-950">{order.customer_name}</p>
                        <p className="text-[11px] text-stone-600">{order.customer_phone}</p>
                        <p className="text-[10px] text-stone-400 truncate max-w-[150px]">
                          {order.customer_email}
                        </p>
                      </td>

                      {/* Address */}
                      <td className="py-3 px-4 max-w-[180px]">
                        <p className="text-forest-800 line-clamp-1">{order.shipping_address}</p>
                        <p className="text-[10px] text-stone-500 font-semibold">{order.city}</p>
                        {order.notes && (
                          <p className="text-[10px] text-amber-800 italic mt-0.5 truncate bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                            {order.notes}
                          </p>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-4 font-extrabold text-forest-950 text-sm">
                        ৳{order.total_amount}
                      </td>

                      {/* Gateway & Payment Status */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="inline-block uppercase px-2 py-0.5 rounded-md font-bold text-[9px] bg-forest-50 text-forest-800 border border-forest-200">
                            {order.payment_method}
                          </span>
                          <select
                            value={order.payment_status}
                            onChange={(e) =>
                              updatePaymentStatus(order.id, e.target.value)
                            }
                            className={`block w-full px-2 py-0.5 rounded-md border text-[10px] font-bold cursor-pointer ${
                              order.payment_status === "paid"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                : "bg-amber-50 text-amber-800 border-amber-300"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </div>
                      </td>

                      {/* Order Status */}
                      <td className="py-3 px-4">
                        <select
                          value={order.order_status}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="px-2 py-1 rounded-lg border border-forest-200 text-[11px] font-semibold bg-white cursor-pointer hover:border-forest-400"
                        >
                          <option value="processing">Processing</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Invoice Button */}
                          <button
                            onClick={() => setSelectedInvoiceOrder(order)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest-800 border border-forest-200 text-[11px] font-bold transition-colors cursor-pointer"
                            title="Print Invoice / Details"
                          >
                            <Printer className="w-3.5 h-3.5 text-forest-700" />
                            <span className="hidden lg:inline">Invoice</span>
                          </button>

                          {/* Archive / Restore Toggle */}
                          <button
                            onClick={() => toggleArchiveSingle(order)}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
                            title={order.is_archived ? "Restore order to active" : "Archive order"}
                          >
                            {order.is_archived ? (
                              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Archive className="w-3.5 h-3.5 text-stone-500" />
                            )}
                          </button>

                          {/* Delete Order */}
                          <button
                            onClick={() => deleteSingle(order.id)}
                            className="p-1.5 rounded-lg border border-stone-200 hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="Delete order"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      <OrderInvoiceModal
        order={selectedInvoiceOrder}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
}
