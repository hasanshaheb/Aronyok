"use client";

import React, { useState, useEffect } from "react";
import {
  Boxes,
  Plus,
  Minus,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  History,
  CheckCircle,
  Package,
} from "lucide-react";
import { Product, StockMovement } from "@/lib/types";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ledger" | "movements">("ledger");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Adjustment Modal
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustData, setAdjustData] = useState<{
    quantity_change: number;
    type: "manual_adjustment" | "damage_loss" | "po_receipt";
    reference: string;
    notes: string;
  }>({
    quantity_change: 1,
    type: "manual_adjustment",
    reference: "Physical Nursery Count",
    notes: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [resProd, resMv] = await Promise.all([
        fetch("/api/admin/data?entity=products"),
        fetch("/api/admin/data?entity=stock_movements"),
      ]);
      if (resProd.ok) {
        const prodData = await resProd.json();
        setProducts(prodData || []);
      }
      if (resMv.ok) {
        const mvData = await resMv.json();
        setMovements(mvData || []);
      }
    } catch (err) {
      console.error("Failed to load inventory data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAdjustModal = (product: Product) => {
    setSelectedProduct(product);
    setAdjustData({
      quantity_change: 0,
      type: "manual_adjustment",
      reference: "Physical Nursery Count",
      notes: "",
    });
    setIsAdjustModalOpen(true);
  };

  const handleSaveAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const res = await fetch("/api/admin/data?entity=stock_movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: selectedProduct.id,
          quantity_change: Number(adjustData.quantity_change),
          type: adjustData.type,
          reference: adjustData.reference,
          notes: adjustData.notes,
        }),
      });

      if (res.ok) {
        setIsAdjustModalOpen(false);
        await loadData();
      }
    } catch {
      alert("Failed to record inventory adjustment.");
    }
  };

  // Metrics
  const totalUnitsInStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInventoryCost = products.reduce(
    (acc, p) => acc + (p.cost_price || p.price * 0.6) * (p.stock || 0),
    0
  );
  const totalRetailValuation = products.reduce(
    (acc, p) => acc + p.price * (p.stock || 0),
    0
  );
  const lowStockCount = products.filter((p) => p.is_active && p.stock <= 5).length;

  const filteredProducts = products.filter((p) => {
    const matchesCat = filterCategory === "all" || p.category === filterCategory;
    const nameStr = (p.name.en + " " + p.name.bn + " " + (p.sku || "")).toLowerCase();
    const matchesSearch = searchTerm.trim() === "" || nameStr.includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredMovements = movements.filter((m) => {
    const str = (m.product_name + " " + (m.reference || "") + " " + m.performed_by).toLowerCase();
    return searchTerm.trim() === "" || str.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight flex items-center gap-2.5">
            <Boxes className="w-6 h-6 text-forest-700" />
            <span>Nursery Stock Ledger & Inventory Movements</span>
          </h1>
          <p className="text-xs text-forest-600">
            Real-time multi-channel stock allocation, automated order deductions, restock receipts, and physical audit ledger
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-forest-200 bg-white text-forest-700 hover:bg-forest-50 transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Total Nursery Plants & Items
          </div>
          <div className="text-2xl font-extrabold text-forest-950 mt-1">
            {totalUnitsInStock} <span className="text-xs font-normal text-stone-400">units</span>
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Stock Value (Cost)
          </div>
          <div className="text-2xl font-extrabold text-earth-800 mt-1">
            ৳{Math.round(totalInventoryCost).toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Retail Potential (GMV)
          </div>
          <div className="text-2xl font-extrabold text-forest-900 mt-1">
            ৳{Math.round(totalRetailValuation).toLocaleString()}
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-forest-100 shadow-soft-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-forest-500">
            Low Stock Alerts
          </div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1 flex items-center gap-2">
            <span>{lowStockCount}</span>
            {lowStockCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                Action Required
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-forest-200">
        <button
          onClick={() => setActiveTab("ledger")}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "ledger"
              ? "border-forest-800 text-forest-950"
              : "border-transparent text-forest-600 hover:text-forest-900"
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Active Stock Ledger ({products.length} Items)</span>
        </button>
        <button
          onClick={() => setActiveTab("movements")}
          className={`py-3 px-5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "movements"
              ? "border-forest-800 text-forest-950"
              : "border-transparent text-forest-600 hover:text-forest-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>Stock Movements Trail ({movements.length} Logs)</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              activeTab === "ledger"
                ? "Search by botanical name, Bengali name, or SKU..."
                : "Search by product, PO, or order reference..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        {activeTab === "ledger" && (
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All Categories</option>
            <option value="plants">Live Plants & Trees</option>
            <option value="honey">Raw Forest Honey</option>
            <option value="herbs">Medicinal Herbs</option>
            <option value="pottery">Artisanal Pottery</option>
            <option value="oils">Cold-Pressed Oils</option>
          </select>
        )}
      </div>

      {/* TAB 1: ACTIVE STOCK LEDGER */}
      {activeTab === "ledger" && (
        <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-forest-900">
              <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Plant / Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Cost Price</th>
                  <th className="py-3 px-4">Selling Price</th>
                  <th className="py-3 px-4">Stock on Hand</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {filteredProducts.map((p) => {
                  const isCritical = p.stock <= 2;
                  const isLow = p.stock > 2 && p.stock <= 5;
                  return (
                    <tr key={p.id} className="hover:bg-forest-50/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-forest-950">{p.name.en}</div>
                        <div className="text-stone-500 text-[11px]">{p.name.bn}</div>
                      </td>
                      <td className="py-3 px-4 capitalize font-medium text-stone-600">
                        {p.category}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-600">
                        ৳{p.cost_price || Math.round(p.price * 0.6)}
                      </td>
                      <td className="py-3 px-4 font-bold text-forest-950 font-mono">
                        ৳{p.price}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-mono font-extrabold text-sm ${
                            p.stock === 0
                              ? "text-rose-600"
                              : isCritical
                              ? "text-rose-600"
                              : isLow
                              ? "text-amber-600"
                              : "text-emerald-700"
                          }`}
                        >
                          {p.stock}
                        </span>
                        <span className="text-[10px] text-stone-400 ml-1">units</span>
                      </td>
                      <td className="py-3 px-4">
                        {p.stock === 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                            Sold Out
                          </span>
                        ) : isCritical ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            Critical (&le;2)
                          </span>
                        ) : isLow ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                            Low Stock
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => openAdjustModal(p)}
                          className="px-3 py-1.5 rounded-xl border border-forest-200 bg-forest-50 hover:bg-forest-100 text-forest-800 font-bold text-[11px] transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: STOCK MOVEMENTS AUDIT TRAIL */}
      {activeTab === "movements" && (
        <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-forest-900">
              <thead className="bg-forest-50/70 border-b border-forest-100 text-[10px] uppercase font-bold text-forest-700 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Qty Change</th>
                  <th className="py-3 px-4">Balance After</th>
                  <th className="py-3 px-4">Reference / Order</th>
                  <th className="py-3 px-4">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-50">
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="hover:bg-forest-50/40 transition-colors">
                    <td className="py-3 px-4 text-stone-500 font-mono text-[11px]">
                      {new Date(m.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-forest-950">
                      {m.product_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold uppercase tracking-wider">
                        {m.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      {m.quantity_change > 0 ? (
                        <span className="text-emerald-700 inline-flex items-center gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>+{m.quantity_change}</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 inline-flex items-center gap-0.5">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          <span>{m.quantity_change}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-forest-900">
                      {m.balance_after} units
                    </td>
                    <td className="py-3 px-4 text-stone-600 font-mono text-[11px]">
                      {m.reference || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-[11px]">
                      {m.performed_by}
                    </td>
                  </tr>
                ))}
                {filteredMovements.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-forest-400">
                      No stock movements recorded matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {isAdjustModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-forest-100 shadow-xl">
            <div className="flex items-center justify-between border-b border-forest-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-forest-950">
                  Manual Stock Adjustment
                </h3>
                <p className="text-xs text-forest-600">{selectedProduct.name.en}</p>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAdjustment} className="space-y-4">
              <div className="p-3 bg-cream-50 rounded-2xl border border-forest-100 text-xs space-y-1">
                <div className="flex justify-between text-forest-700">
                  <span>Current Physical Stock:</span>
                  <span className="font-mono font-bold text-forest-950">{selectedProduct.stock} units</span>
                </div>
                <div className="flex justify-between text-forest-700">
                  <span>Adjusted Result:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {Math.max(0, selectedProduct.stock + Number(adjustData.quantity_change))} units
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Quantity Change (+ to Add, - to Deduct)
                </label>
                <input
                  type="number"
                  required
                  value={adjustData.quantity_change}
                  onChange={(e) =>
                    setFormDataAdjust(e.target.value)
                  }
                  placeholder="+5 or -2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-mono font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Adjustment Type / Reason
                </label>
                <select
                  value={adjustData.type}
                  onChange={(e) =>
                    setAdjustData({
                      ...adjustData,
                      type: e.target.value as any,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  <option value="manual_adjustment">Physical Inventory Audit / Reconciliation</option>
                  <option value="po_receipt">Nursery Propagation / Direct Restock</option>
                  <option value="damage_loss">Transit Damage / Seedling Wilt Loss</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-900 mb-1">
                  Audit Reference Tag
                </label>
                <input
                  type="text"
                  value={adjustData.reference}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, reference: e.target.value })
                  }
                  placeholder="e.g. Audit Oct 2026 / Greenhouse inspection"
                  className="w-full px-3.5 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-forest-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-forest-200 text-xs font-semibold text-forest-700 hover:bg-forest-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-xs"
                >
                  Save & Log Movement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  function setFormDataAdjust(val: string) {
    setAdjustData({ ...adjustData, quantity_change: Number(val) || 0 });
  }
}
