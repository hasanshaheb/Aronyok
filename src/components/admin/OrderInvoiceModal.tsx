"use client";

import React from "react";
import { Order } from "@/lib/types";
import { Printer, X, ShieldCheck, Mail, Phone, MapPin, Calendar, CreditCard } from "lucide-react";

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderInvoiceModal({ order, onClose }: OrderInvoiceModalProps) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Recent Order";

  const items = order.items && order.items.length > 0
    ? order.items
    : [
        {
          product_id: "item-1",
          product_name: "Aronyok Eco Products Package",
          price: order.total_amount,
          quantity: 1,
        },
      ];

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = order.total_amount > subtotal ? order.total_amount - subtotal : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-forest-100 my-8 overflow-hidden print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none">
        
        {/* Top Action Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 bg-cream-50 border-b border-forest-100 print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-forest-800 uppercase tracking-wider">
              Official Tax Invoice & Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:bg-stone-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-8 sm:p-10 font-sans text-stone-800" id="printable-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b-2 border-forest-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-extrabold text-forest-950 font-serif tracking-tight">
                  অরণ্যক
                </span>
                <span className="text-xl font-bold text-forest-700 font-serif">
                  Aronyok
                </span>
              </div>
              <p className="text-xs text-forest-700 mt-1 font-medium">
                Pure Living, Organic Herbs & Eco Goods
              </p>
              <p className="text-[11px] text-stone-500 mt-1">
                Dhaka, Bangladesh • care@aronyok.com • +880 1700 000000
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-forest-100 text-forest-900 font-extrabold text-xs uppercase tracking-widest rounded-lg">
                INVOICE
              </span>
              <p className="text-sm font-extrabold text-forest-950 mt-2">
                {order.order_number}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-1 sm:justify-end">
                <Calendar className="w-3 h-3 text-forest-600" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Customer & Payment Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-forest-100 text-xs">
            <div>
              <h4 className="font-extrabold text-forest-950 uppercase text-[10px] tracking-wider mb-2 text-stone-400">
                Billed & Shipped To:
              </h4>
              <p className="font-bold text-forest-900 text-sm">{order.customer_name}</p>
              <div className="flex items-center gap-1.5 text-stone-600 mt-1">
                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                <span>{order.customer_phone}</span>
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-1.5 text-stone-600 mt-0.5">
                  <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>{order.customer_email}</span>
                </div>
              )}
              <div className="flex items-start gap-1.5 text-stone-700 mt-1.5">
                <MapPin className="w-3 h-3 text-forest-600 shrink-0 mt-0.5" />
                <span>
                  {order.shipping_address}, {order.city}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <h4 className="font-extrabold text-forest-950 uppercase text-[10px] tracking-wider mb-2 text-stone-400">
                Payment & Fulfillment:
              </h4>
              <div className="space-y-1">
                <p className="text-stone-700">
                  <span className="font-semibold">Gateway: </span>
                  <span className="font-bold uppercase text-forest-800">
                    {order.payment_method === "cod" ? "Cash on Delivery" : order.payment_method.toUpperCase()}
                  </span>
                </p>
                <p className="text-stone-700">
                  <span className="font-semibold">Payment Status: </span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                      order.payment_status === "paid"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {order.payment_status}
                  </span>
                </p>
                <p className="text-stone-700">
                  <span className="font-semibold">Order Status: </span>
                  <span className="font-bold px-2 py-0.5 rounded text-[10px] uppercase bg-forest-100 text-forest-900">
                    {order.order_status}
                  </span>
                </p>
                {order.notes && (
                  <p className="text-[11px] text-stone-500 italic mt-2 bg-cream-50 p-2 rounded-lg border border-forest-50">
                    <strong>Note:</strong> {order.notes}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-forest-50 text-forest-900 uppercase font-bold text-[10px] tracking-wider border-b border-forest-100">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-forest-950">
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 text-stone-400 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold">{item.product_name}</td>
                    <td className="py-3 px-3 text-center font-bold text-stone-700">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-stone-600">৳{item.price}</td>
                    <td className="py-3 px-3 text-right font-bold text-forest-950">৳{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t-2 border-stone-200">
            <div className="max-w-xs text-[11px] text-stone-500">
              <p className="font-bold text-forest-900 mb-1">Return & Satisfaction Policy:</p>
              <p>
                All herbal items and organic oils are packaged sustainably. In case of damaged or broken goods upon delivery, notify us within 24 hours.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs text-right">
              <div className="flex justify-between py-1 text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-900">৳{subtotal}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="flex justify-between py-1 text-stone-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-stone-900">৳{deliveryFee}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-t border-forest-200 text-sm font-extrabold text-forest-950">
                <span>Grand Total</span>
                <span className="text-base text-forest-800">৳{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Footer Signature */}
          <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-400 gap-2">
            <div className="flex items-center gap-1.5 text-forest-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-semibold">Verified Electronic Invoice • Aronyok Living</span>
            </div>
            <p>Printed on {new Date().toLocaleDateString()}</p>
          </div>
        </div>

      </div>
    </div>
  );
}
