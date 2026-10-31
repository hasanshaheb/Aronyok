"use client";

import React, { useState, useEffect } from "react";
import {
  Truck,
  Search,
  RefreshCw,
  Plus,
  ExternalLink,
  MapPin,
  Phone,
  CheckCircle,
  AlertCircle,
  Clock,
  Package,
  X,
  Calendar,
  DollarSign,
  ShieldAlert,
} from "lucide-react";
import { Shipment, Order } from "@/lib/types";

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courierFilter, setCourierFilter] = useState("all");
  const [notification, setNotification] = useState("");
  const [errorNotification, setErrorNotification] = useState("");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    order_id: "",
    courier_name: "steadfast" as "steadfast" | "pathao" | "redx" | "self_delivery",
    tracking_code: "",
    consignment_id: "",
    shipping_fee: 70,
    estimated_delivery: "",
    notes: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [sRes, oRes] = await Promise.all([
        fetch("/api/admin/data?entity=shipments"),
        fetch("/api/admin/data?entity=orders"),
      ]);

      if (sRes.ok) {
        const sData = await sRes.json();
        if (Array.isArray(sData)) setShipments(sData);
      }
      if (oRes.ok) {
        const oData = await oRes.json();
        if (Array.isArray(oData)) setOrders(oData);
      }
    } catch (err) {
      console.warn("Could not load shipments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const showError = (msg: string) => {
    setErrorNotification(msg);
    setTimeout(() => setErrorNotification(""), 4000);
  };

  const handleStatusChange = async (shipmentId: string, newStatus: any) => {
    try {
      const res = await fetch("/api/admin/data?entity=shipments&action=update_status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: shipmentId, status: newStatus }),
      });

      if (res.ok) {
        showSuccess(
          newStatus === "delivered"
            ? "Shipment marked as Delivered! Parent order status synchronized."
            : `Shipment status updated to ${newStatus}`
        );
        loadData();
      } else {
        showError("Failed to update shipment status");
      }
    } catch {
      showError("Network error updating status");
    }
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order_id) {
      showError("Please select an Order to dispatch");
      return;
    }

    const targetOrder = orders.find((o) => o.id === formData.order_id);

    const payload: Partial<Shipment> = {
      order_id: formData.order_id,
      order_number: targetOrder?.order_number || targetOrder?.id || "ORD",
      recipient_name: targetOrder?.customer_name || "Customer",
      recipient_phone: targetOrder?.customer_phone || "",
      shipping_address: targetOrder?.shipping_address || "",
      city: targetOrder?.city || "Dhaka",
      courier_partner: formData.courier_name,
      courier_name: formData.courier_name,
      tracking_code: formData.tracking_code || `TRK-${Date.now().toString().slice(-6)}`,
      consignment_id: formData.consignment_id || `CN-${Date.now().toString().slice(-6)}`,
      shipping_fee: Number(formData.shipping_fee) || 70,
      courier_charge: Number(formData.shipping_fee) || 70,
      courier_status: "in_transit",
      estimated_delivery: formData.estimated_delivery || undefined,
      notes: formData.notes || `Recipient: ${targetOrder?.customer_name || "Customer"}`,
    };

    try {
      const res = await fetch("/api/admin/data?entity=shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showSuccess("Shipment dispatched & order status updated to Shipped!");
        setIsCreateModalOpen(false);
        resetForm();
        loadData();
      } else {
        showError("Failed to create shipment");
      }
    } catch {
      showError("Network error creating shipment");
    }
  };

  const resetForm = () => {
    setFormData({
      order_id: "",
      courier_name: "steadfast",
      tracking_code: "",
      consignment_id: "",
      shipping_fee: 70,
      estimated_delivery: "",
      notes: "",
    });
  };

  // Filtered
  const filteredShipments = shipments.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.order_id.toLowerCase().includes(q) ||
      (s.tracking_code && s.tracking_code.toLowerCase().includes(q)) ||
      (s.consignment_id && s.consignment_id.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && s.courier_status !== statusFilter) return false;
    const partner = s.courier_partner || s.courier_name;
    if (courierFilter !== "all" && partner !== courierFilter) return false;
    return true;
  });

  // Metrics
  const totalShipments = shipments.length;
  const inTransitCount = shipments.filter((s) => s.courier_status === "in_transit").length;
  const deliveredCount = shipments.filter((s) => s.courier_status === "delivered").length;
  const returnedCount = shipments.filter((s) => s.courier_status === "returned").length;

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
              <Truck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-forest-950">
                Shipments & Logistics (কুরিয়ার ও পার্সেল ট্র্যাকিং)
              </h1>
              <p className="text-xs text-stone-500 font-medium">
                Manage Steadfast, Pathao, RedX consignments and live sapling transit guarantees
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
            <span>Dispatch Shipment</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Total Dispatched
          </div>
          <div className="mt-2 text-2xl font-bold text-forest-950">{totalShipments}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Parcels processed</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            In Transit
          </div>
          <div className="mt-2 text-2xl font-bold text-blue-800">{inTransitCount}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">With courier riders</div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Delivered
          </div>
          <div className="mt-2 text-2xl font-bold text-emerald-800">{deliveredCount}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">
            {totalShipments > 0 ? Math.round((deliveredCount / totalShipments) * 100) : 0}% success rate
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-red-700 uppercase tracking-wider flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            Returns / Failed
          </div>
          <div className="mt-2 text-2xl font-bold text-red-800">{returnedCount}</div>
          <div className="text-[11px] text-stone-400 mt-0.5">Failed customer acceptance</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by order ID, tracking code, consignment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-forest-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {["all", "in_transit", "delivered", "returned"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                statusFilter === st
                  ? "bg-forest-800 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {st} ({st === "all" ? shipments.length : shipments.filter((s) => s.courier_status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50/80 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                <th className="p-4">Consignment & Courier</th>
                <th className="p-4">Order & Recipient</th>
                <th className="p-4">Delivery Fee</th>
                <th className="p-4">Est. Delivery</th>
                <th className="p-4">Courier Status</th>
                <th className="p-4 text-right">External Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-stone-400">
                    No shipments found in this view.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((ship) => {
                  const relatedOrder = orders.find((o) => o.id === ship.order_id);
                  const partner = ship.courier_partner || ship.courier_name;
                  const courierLabel =
                    partner === "steadfast"
                      ? "Steadfast Courier"
                      : partner === "pathao"
                      ? "Pathao Courier"
                      : partner === "redx"
                      ? "RedX Logistics"
                      : "Self Nursery Delivery";

                  return (
                    <tr key={ship.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-4">
                        <div className="font-bold text-forest-950 text-sm">
                          {ship.tracking_code || ship.consignment_id || "TRK-PENDING"}
                        </div>
                        <div className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700 uppercase tracking-wide">
                          {courierLabel}
                        </div>
                        {ship.consignment_id && (
                          <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                            CN: {ship.consignment_id}
                          </div>
                        )}
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="font-bold text-stone-800">
                          {relatedOrder?.customer_name || ship.recipient_name || "Customer"}
                        </div>
                        <div className="text-stone-500 font-mono text-[11px]">
                          Order #{ship.order_id.slice(0, 8)}
                        </div>
                        {(relatedOrder?.customer_phone || ship.recipient_phone) && (
                          <div className="flex items-center gap-1 text-[11px] text-stone-600">
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{relatedOrder?.customer_phone || ship.recipient_phone}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="font-bold text-stone-800">
                          ৳{(ship.shipping_fee || ship.courier_charge || 70).toLocaleString()}
                        </div>
                      </td>

                      <td className="p-4">
                        {ship.estimated_delivery ? (
                          <div className="flex items-center gap-1 font-medium text-stone-700">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            <span>{new Date(ship.estimated_delivery).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          <span className="text-stone-400 text-xs">Standard (48h)</span>
                        )}
                        {ship.delivered_at && (
                          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            Delivered: {new Date(ship.delivered_at).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={ship.courier_status}
                          onChange={(e) => handleStatusChange(ship.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none transition ${
                            ship.courier_status === "delivered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : ship.courier_status === "in_transit"
                              ? "bg-blue-50 text-blue-800 border-blue-300"
                              : ship.courier_status === "picked_up"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : ship.courier_status === "returned"
                              ? "bg-red-50 text-red-800 border-red-300"
                              : "bg-stone-100 text-stone-600 border-stone-300"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="picked_up">Picked Up</option>
                          <option value="in_transit">In Transit</option>
                          <option value="delivered">Delivered (Sync Order)</option>
                          <option value="returned">Returned / Failed</option>
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        {partner === "steadfast" ? (
                          <a
                            href={`https://steadfast.com.bd/t/${ship.tracking_code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                          >
                            <span>Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-stone-400 text-[11px]">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dispatch Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <h3 className="font-bold text-forest-950 text-base">
                Dispatch Order to Courier
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-200 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateShipment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Select Order to Dispatch *
                </label>
                <select
                  required
                  value={formData.order_id}
                  onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                >
                  <option value="">-- Choose Order --</option>
                  {orders
                    .filter((o) => o.order_status !== "delivered" && o.order_status !== "cancelled")
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        #{o.id.slice(0, 8)} - {o.customer_name} (৳{o.total_amount || o.total_price || 0}) - {o.order_status}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Courier Partner *
                  </label>
                  <select
                    value={formData.courier_name}
                    onChange={(e) => setFormData({ ...formData, courier_name: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  >
                    <option value="steadfast">Steadfast Courier</option>
                    <option value="pathao">Pathao Courier</option>
                    <option value="redx">RedX Logistics</option>
                    <option value="self_delivery">Aronyok Self Nursery Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Delivery Fee (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.shipping_fee}
                    onChange={(e) => setFormData({ ...formData, shipping_fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tracking Code / Consignment ID
                  </label>
                  <input
                    type="text"
                    value={formData.tracking_code}
                    onChange={(e) => setFormData({ ...formData, tracking_code: e.target.value })}
                    placeholder="e.g. STDF-123456"
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.estimated_delivery}
                    onChange={(e) => setFormData({ ...formData, estimated_delivery: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-forest-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Packaging & Handling Instructions
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Fragile live saplings, keep upright with root-ball moisture."
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
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
