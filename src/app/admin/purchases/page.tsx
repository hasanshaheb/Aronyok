"use client";

import React, { useState, useEffect } from "react";
import {
  ClipboardList,
  Search,
  RefreshCw,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Truck,
  Package,
  Eye,
  X,
  Trash2,
  DollarSign,
} from "lucide-react";
import { Purchase, PurchaseItem, Supplier, Product } from "@/lib/types";

export default function AdminPurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);

  // Form State for new PO
  const [supplierId, setSupplierId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const [notes, setNotes] = useState("");
  const [initialStatus, setInitialStatus] = useState<"ordered" | "received">("ordered");
  const [items, setItems] = useState<
    Array<{ product_id: string; product_name: string; quantity: number; unit_cost: number }>
  >([{ product_id: "", product_name: "", quantity: 10, unit_cost: 150 }]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [pRes, sRes, prodRes] = await Promise.all([
        fetch("/api/admin/data?entity=purchases"),
        fetch("/api/admin/data?entity=suppliers"),
        fetch("/api/products"),
      ]);

      if (pRes.ok) {
        const pData = await pRes.json();
        if (Array.isArray(pData)) setPurchases(pData);
      }
      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData)) setSuppliers(sData);
      }
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (Array.isArray(prodData)) setProducts(prodData);
      }
    } catch (err) {
      console.warn("Could not load purchases data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(""), 4000);
  };

  const handleAddItemRow = () => {
    setItems([...items, { product_id: "", product_name: "", quantity: 10, unit_cost: 150 }]);
  };

  const handleRemoveItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemProductSelect = (index: number, pId: string) => {
    const selectedProd = products.find((p) => p.id === pId);
    const updated = [...items];
    updated[index].product_id = pId;
    updated[index].product_name = selectedProd ? selectedProd.name.en : "";
    updated[index].unit_cost = selectedProd?.cost_price || 150;
    setItems(updated);
  };

  const calculateTotal = () => {
    return items.reduce((acc, it) => acc + (it.quantity || 0) * (it.unit_cost || 0), 0);
  };

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      showError("Please select a supplier");
      return;
    }

    const validItems = items.filter((it) => it.product_id && it.quantity > 0);
    if (validItems.length === 0) {
      showError("Please add at least one valid product line item");
      return;
    }

    const selectedSup = suppliers.find((s) => s.id === supplierId);
    const totalAmount = validItems.reduce((acc, it) => acc + it.quantity * it.unit_cost, 0);

    const poNum = invoiceNumber || `PO-${Date.now().toString().slice(-6)}`;
    const newPO: Partial<Purchase> = {
      supplier_id: supplierId,
      supplier_name: selectedSup?.name || selectedSup?.company_name || "Partner Nursery",
      po_number: poNum,
      invoice_number: poNum,
      total_cost: totalAmount,
      total_amount: totalAmount,
      status: initialStatus,
      items: validItems.map((it) => ({
        id: `item-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        product_id: it.product_id,
        product_name: it.product_name,
        quantity: Number(it.quantity),
        unit_cost: Number(it.unit_cost),
        total_cost: Number(it.quantity) * Number(it.unit_cost),
      })),
      notes,
      expected_delivery_date: expectedDate || undefined,
    };

    try {
      const res = await fetch("/api/admin/data?entity=purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPO),
      });

      if (res.ok) {
        showSuccess(
          initialStatus === "received"
            ? "Purchase order created & inventory auto-restocked!"
            : "Purchase order created successfully!"
        );
        setIsCreateModalOpen(false);
        resetForm();
        loadData();
      } else {
        showError("Failed to create purchase order");
      }
    } catch {
      showError("Error submitting purchase order");
    }
  };

  const handleMarkAsReceived = async (po: Purchase) => {
    const poLabel = po.invoice_number || po.po_number || "this PO";
    if (
      !confirm(
        `Confirm receipt for ${poLabel}? This will automatically restock ${
          po.items?.length || 0
        } plant varieties in your product catalog!`
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/admin/data?entity=purchases&action=update_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: po.id, status: "received" }),
      });

      if (res.ok) {
        showSuccess(`PO received! Plant inventory has been automatically incremented.`);
        loadData();
      } else {
        showError("Failed to update PO status");
      }
    } catch {
      showError("Network error marking PO as received");
    }
  };

  const resetForm = () => {
    setSupplierId("");
    setInvoiceNumber("");
    setExpectedDate("");
    setNotes("");
    setInitialStatus("ordered");
    setItems([{ product_id: "", product_name: "", quantity: 10, unit_cost: 150 }]);
  };

  // Filtered
  const filteredPurchases = purchases.filter((p) => {
    const q = search.toLowerCase();
    const poNum = (p.invoice_number || p.po_number || "").toLowerCase();
    const matchesSearch =
      poNum.includes(q) ||
      (p.supplier_name && p.supplier_name.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  // Metrics
  const totalPO = purchases.length;
  const pendingPO = purchases.filter((p) => p.status === "ordered").length;
  const receivedPO = purchases.filter((p) => p.status === "received").length;
  const totalProcuredAmount = purchases
    .filter((p) => p.status === "received")
    .reduce((acc, p) => acc + (p.total_amount || p.total_cost || 0), 0);

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
              <ClipboardList className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-950">
                Purchases & Restocking (ক্রয় ও মজুদ বৃদ্ধি)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Issue purchase orders to nurseries and automatically increment stock upon arrival
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total POs
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">{totalPO}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Procurement records</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
            <Truck className="w-3.5 h-3.5 text-amber-600" />
            Pending Delivery
          </div>
          <div className="mt-2 text-2xl font-bold text-amber-800">{pendingPO}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Awaiting nursery delivery</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Received & Restocked
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{receivedPO}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Inventory updated</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-stone-400" />
            Total Procured
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">
            ৳{totalProcuredAmount.toLocaleString()}
          </div>
          <div className="text-[11px] text-stone-400 mt-0.5">Fulfilled PO expenditure</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by PO invoice, supplier name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {["all", "ordered", "received", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? "bg-forest-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {st} ({st === "all" ? purchases.length : purchases.filter((p) => p.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="p-4">PO & Supplier</th>
                <th className="p-4">Date & Timeline</th>
                <th className="p-4">Items / Saplings</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status & Stock Action</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredPurchases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredPurchases.map((po) => {
                  const poLabel = po.invoice_number || po.po_number || `PO-${po.id.slice(0, 8)}`;
                  const itemCount = po.items?.reduce((acc, it) => acc + (it.quantity || 0), 0) || 0;
                  const displayCost = po.total_amount || po.total_cost || 0;

                  return (
                    <tr key={po.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-forest-950 text-sm">
                          {poLabel}
                        </div>
                        <div className="text-stone-600 font-medium mt-0.5">{po.supplier_name}</div>
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="text-stone-700 font-medium">
                          Created: {new Date(po.created_at).toLocaleDateString()}
                        </div>
                        {po.expected_delivery_date && po.status !== "received" && (
                          <div className="text-[11px] text-amber-700 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Exp: {new Date(po.expected_delivery_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        {po.received_date && (
                          <div className="text-[11px] text-emerald-700 font-medium">
                            Received: {new Date(po.received_date).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="font-semibold text-stone-800">
                          {po.items?.length || 0} plant variet{po.items?.length === 1 ? "y" : "ies"}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {itemCount} total saplings / units
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-forest-900 text-sm">
                          ৳{displayCost.toLocaleString()}
                        </div>
                      </td>

                      <td className="p-4">
                        {po.status === "received" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" />
                            Restocked & Completed
                          </span>
                        ) : po.status === "cancelled" ? (
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-200 text-stone-600">
                            Cancelled
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsReceived(po)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
                            title="Clicking will increment product catalog inventory immediately"
                          >
                            <Package className="w-3.5 h-3.5" />
                            <span>Mark Received & Restock</span>
                          </button>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setViewingPurchase(po)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition"
                          title="View PO Breakdown"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Create PO Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-forest-950 text-base">
                Create Purchase Order & Plant Restock
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Select Supplier Nursery *
                  </label>
                  <select
                    required
                    value={supplierId}
                    onChange={(e) => setSupplierId(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="">-- Choose Partner --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name || s.company_name} ({s.contact_person || s.phone})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Invoice / PO Reference
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    placeholder="PO-2026-001"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="ordered">Ordered (Awaiting Delivery)</option>
                    <option value="received">Received (Restock Immediately)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Expected Delivery Date
                  </label>
                  <input
                    type="date"
                    value={expectedDate}
                    onChange={(e) => setExpectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Items Section */}
              <div className="border border-stone-200 rounded-xl p-3 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Plant Varieties & Quantities
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-stone-200">
                      <div className="flex-1">
                        <select
                          required
                          value={row.product_id}
                          onChange={(e) => handleItemProductSelect(idx, e.target.value)}
                          className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-xs"
                        >
                          <option value="">-- Select Product --</option>
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name.en} ({prod.name.bn}) - Current Stock: {prod.stock}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="w-24">
                        <input
                          type="number"
                          min={1}
                          required
                          placeholder="Qty"
                          value={row.quantity}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].quantity = Number(e.target.value);
                            setItems(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-xs text-center"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          min={0}
                          required
                          placeholder="Unit Cost ৳"
                          value={row.unit_cost}
                          onChange={(e) => {
                            const updated = [...items];
                            updated[idx].unit_cost = Number(e.target.value);
                            setItems(updated);
                          }}
                          className="w-full px-2 py-1.5 border border-stone-200 rounded-lg text-xs text-right"
                        />
                      </div>

                      <div className="w-24 text-right font-bold text-xs text-forest-900 pr-1">
                        ৳{((row.quantity || 0) * (row.unit_cost || 0)).toLocaleString()}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={items.length <= 1}
                        className="p-1 text-stone-400 hover:text-red-500 disabled:opacity-30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2 border-t border-stone-200 text-sm font-bold text-forest-950">
                  <span>Total Purchase Cost: ৳{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Procurement Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Grafting batch quality check notes, transport vehicle details..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold shadow-sm transition"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PO View Modal */}
      {viewingPurchase && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div>
                <h3 className="font-bold text-forest-950 text-base">
                  {viewingPurchase.invoice_number || viewingPurchase.po_number || `PO-${viewingPurchase.id.slice(0, 8)}`}
                </h3>
                <p className="text-xs text-stone-500">Supplier: {viewingPurchase.supplier_name}</p>
              </div>
              <button
                onClick={() => setViewingPurchase(null)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 font-bold text-stone-600">
                    <tr>
                      <th className="p-2.5">Plant / Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Cost (৳)</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {viewingPurchase.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-medium text-stone-800">{it.product_name}</td>
                        <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                        <td className="p-2.5 text-right">৳{it.unit_cost}</td>
                        <td className="p-2.5 text-right font-bold text-forest-900">
                          ৳{it.total_cost.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50 font-bold text-forest-950 border-t border-stone-200">
                    <tr>
                      <td colSpan={3} className="p-2.5 text-right">
                        Grand Total:
                      </td>
                      <td className="p-2.5 text-right text-emerald-800">
                        ৳{(viewingPurchase.total_amount || viewingPurchase.total_cost || 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {viewingPurchase.notes && (
                <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-600">
                  <span className="font-bold text-stone-700">Notes: </span>
                  {viewingPurchase.notes}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setViewingPurchase(null)}
                  className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-semibold hover:bg-stone-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
