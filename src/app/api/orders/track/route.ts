import { NextResponse } from "next/server";
import { loadLatestOrders, loadLatestShipments } from "@/lib/data-hydrator";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderId = body.orderId;
    const phone = body.phone;

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Order ID and Phone Number are required / অর্ডার নম্বর এবং ফোন নম্বর প্রয়োজন" },
        { status: 400 }
      );
    }

    const cleanOrderId = String(orderId).trim().toLowerCase();
    const cleanPhone = String(phone).replace(/[^0-9]/g, "");

    if (cleanPhone.length < 6) {
      return NextResponse.json(
        { error: "Please enter a valid phone number / সঠিক ফোন নম্বর দিন" },
        { status: 400 }
      );
    }

    const [orders, shipments] = await Promise.all([
      loadLatestOrders(),
      loadLatestShipments(),
    ]);

    const order = orders.find((o) => {
      const matchId =
        String(o.id).toLowerCase() === cleanOrderId ||
        String(o.id).toLowerCase().includes(cleanOrderId) ||
        (o as any).invoice_number?.toLowerCase() === cleanOrderId ||
        (o as any).order_number?.toLowerCase() === cleanOrderId;

      const orderPhone = String(o.customer_phone || "").replace(/[^0-9]/g, "");
      const matchPhone =
        orderPhone.length >= 6 &&
        cleanPhone.length >= 6 &&
        (orderPhone.includes(cleanPhone) || cleanPhone.includes(orderPhone));

      return matchId && matchPhone;
    });

    if (!order) {
      return NextResponse.json(
        {
          error:
            "No order found matching this Order ID and Phone Number. Please check your confirmation SMS or contact Aronyok support. / প্রদত্ত তথ্য অনুযায়ী কোনো অর্ডার পাওয়া যায়নি।",
        },
        { status: 404 }
      );
    }

    const shipment = shipments.find(
      (s) => s.order_id === order.id || (order.order_number && s.order_number === order.order_number)
    );

    return NextResponse.json({
      order: {
        id: order.id,
        created_at: order.created_at,
        order_status: order.order_status,
        payment_status: order.payment_status,
        payment_method: order.payment_method,
        total_price: order.total_amount || order.total_price || 0,
        delivery_charge: (order as any).delivery_charge || 0,
        customer_name: order.customer_name,
        city: (order as any).city || "Dhaka",
        district: (order as any).district || "Dhaka",
        items: order.items || [],
        shipment: shipment
          ? {
              courier_name: shipment.courier_partner || shipment.courier_name || "steadfast",
              tracking_code: shipment.tracking_code || "",
              consignment_id: shipment.consignment_id || "",
              status: shipment.courier_status,
              estimated_delivery: shipment.estimated_delivery || undefined,
            }
          : null,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Error looking up order / অর্ডার অনুসন্ধানে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
