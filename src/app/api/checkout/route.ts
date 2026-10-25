import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      payment_method,
      items,
      total_amount,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Please provide all required delivery details and at least one item." },
        { status: 400 }
      );
    }

    const orderNumber = `ARN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const supabase = getServerSupabase();

    let orderId = `local-${Date.now()}`;

    // If Supabase is connected, record the order & order_items
    if (supabase) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name,
            customer_email,
            customer_phone,
            shipping_address,
            city,
            total_amount,
            payment_method,
            payment_status: payment_method === "cod" ? "pending" : "pending",
            order_status: "processing",
            notes,
          })
          .select("id")
          .single();

        if (orderError) {
          console.error("Supabase order insert error:", orderError);
        } else if (orderData?.id) {
          orderId = orderData.id;
          const orderItems = items.map((item: any) => ({
            order_id: orderId,
            product_id: item.product.id,
            product_name: item.product.name?.en || item.product.name?.bn || "Product",
            price: item.product.price,
            quantity: item.quantity,
          }));

          await supabase.from("order_items").insert(orderItems);
        }
      } catch (err) {
        console.warn("DB record error, proceeding with confirmation fallback:", err);
      }
    }

    // Scaffolding responses for different payment gateways
    let paymentRedirect = null;
    let paymentInstructions = null;

    if (payment_method === "bkash" || payment_method === "nagad") {
      paymentInstructions = {
        method: payment_method.toUpperCase(),
        merchantNumber: "01711-223344",
        reference: orderNumber,
        note: `Please send payment to our merchant number with reference: ${orderNumber}`,
      };
    } else if (payment_method === "stripe") {
      // In a live environment with valid STRIPE_SECRET_KEY, create Stripe Checkout session here
      paymentInstructions = {
        method: "STRIPE",
        status: "Card authorization initialized",
      };
    } else if (payment_method === "sslcommerz") {
      paymentInstructions = {
        method: "SSLCOMMERZ",
        status: "Redirecting to SSLCommerz Gateway session",
      };
    }

    // Add to active runtime store so admin orders table immediately updates
    runtimeStore.addOrder({
      id: orderId,
      order_number: orderNumber,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      total_amount,
      payment_method,
      payment_status: "pending",
      order_status: "processing",
      notes,
      items: (items || []).map((item: any) => ({
        product_id: item.product?.id || item.id || "item",
        product_name: item.product?.name?.en || item.product?.name?.bn || item.product?.name || item.name || "Eco Item",
        price: item.product?.price || item.price || 0,
        quantity: item.quantity || 1,
      })),
      is_archived: false,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      total_amount,
      payment_method,
      paymentInstructions,
      paymentRedirect,
      message: "Order placed successfully!",
    });
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: "Failed to process checkout. Please try again." },
      { status: 500 }
    );
  }
}
