"use client";

import React, { useState, useEffect } from "react";
import { ShoppingBag, Search, Filter, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";

interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  city: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  notes?: string;
  created_at?: string;
}

const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: "ord-1",
    order_number: "ARN-821942",
    customer_name: "Farhan Ahmed",
    customer_email: "farhan@example.com",
    customer_phone: "01712345678",
    shipping_address: "House 14, Road 5, Dhanmondi",
    city: "Dhaka",
    total_amount: 850,
    payment_method: "bkash",
    payment_status: "paid",
    order_status: "confirmed",
    notes: "Leave package at reception. TrxID: 9J87AK29L",
    created_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
  },
  {
    id: "ord-2",
    order_number: "ARN-821941",
    customer_name: "Tasnim Rahman",
    customer_email: "tasnim@example.com",
    customer_phone: "01898765432",
    shipping_address: "Sector 3, Uttara",
    city: "Dhaka",
    total_amount: 560,
    payment_method: "cod",
    payment_status: "pending",
    order_status: "processing",
    notes: "Call before dispatch",
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: "ord-3",
    order_number: "ARN-821940",
    customer_name: "Kazi Nabil",
    customer_email: "kazi@example.com",
    customer_phone: "01911223344",
    shipping_address: "GEC Circle, Nasirabad",
    city: "Chittagong",
    total_amount: 420,
    payment_method: "stripe",
    payment_status: "paid",
    order_status: "confirmed",
    notes: "Express packaging requested",
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [filterMethod, setFilterMethod] = useState("all");
  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.warn("Using fallback orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (id: string, newStatus: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", id);
      await loadOrders();
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, order_status: newStatus } : o))
      );
    }
  };

  const updatePaymentStatus = async (id: string, newStatus: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", id);
      await loadOrders();
    } else {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, payment_status: newStatus } : o))
      );
    }
  };

  const filtered = orders.filter((o) => {
    const matchesMethod =
      filterMethod === "all" || o.payment_method === filterMethod;
    const matchesSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_phone.includes(search);
    return matchesMethod && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Orders & Payment Gateway Records
          </h1>
          <p className="text-xs text-forest-600">
            Track customer transactions across Cash on Delivery, bKash, SSLCommerz, and Stripe
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-forest-100 shadow-soft-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, or order #..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-cream-50 border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-forest-800">Payment:</span>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-cream-50 border border-forest-200 text-xs font-semibold text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All Gateways</option>
            <option value="cod">Cash on Delivery (COD)</option>
            <option value="bkash">bKash / Nagad MFS</option>
            <option value="sslcommerz">SSLCommerz</option>
            <option value="stripe">Stripe Card</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-forest-100 shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-50 text-forest-900 uppercase font-bold text-[10px] tracking-wider border-b border-forest-100">
              <tr>
                <th className="py-3.5 px-5">Order #</th>
                <th className="py-3.5 px-5">Customer Info</th>
                <th className="py-3.5 px-5">Delivery Address</th>
                <th className="py-3.5 px-5">Amount</th>
                <th className="py-3.5 px-5">Gateway</th>
                <th className="py-3.5 px-5">Payment Status</th>
                <th className="py-3.5 px-5">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forest-50 text-forest-900">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-cream-50/50 transition-colors">
                  <td className="py-3 px-5 font-bold">{order.order_number}</td>
                  <td className="py-3 px-5">
                    <p className="font-bold text-forest-950">{order.customer_name}</p>
                    <p className="text-[11px] text-stone-500">{order.customer_phone}</p>
                    <p className="text-[10px] text-stone-400">{order.customer_email}</p>
                  </td>
                  <td className="py-3 px-5 max-w-[200px]">
                    <p className="text-forest-800 line-clamp-1">{order.shipping_address}</p>
                    <p className="text-[10px] text-stone-500">{order.city}</p>
                    {order.notes && (
                      <p className="text-[10px] text-amber-700 italic mt-0.5 truncate">
                        {order.notes}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-5 font-extrabold text-forest-950">
                    ৳{order.total_amount}
                  </td>
                  <td className="py-3 px-5">
                    <span className="uppercase px-2 py-0.5 rounded-md font-bold text-[10px] bg-forest-50 text-forest-800 border border-forest-200">
                      {order.payment_method}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <select
                      value={order.payment_status}
                      onChange={(e) =>
                        updatePaymentStatus(order.id, e.target.value)
                      }
                      className="px-2 py-1 rounded-lg border border-forest-200 text-[11px] font-semibold bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                    </select>
                  </td>
                  <td className="py-3 px-5">
                    <select
                      value={order.order_status}
                      onChange={(e) =>
                        updateOrderStatus(order.id, e.target.value)
                      }
                      className="px-2 py-1 rounded-lg border border-forest-200 text-[11px] font-semibold bg-white"
                    >
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
