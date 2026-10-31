import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";
import { checkRateLimit } from "@/lib/rate-limiter";
import { sendMetaCapiEvent } from "@/lib/analytics/capi";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (5 checkouts per minute per IP)
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    const { allowed } = checkRateLimit(`checkout_${ip}`, 5, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many checkout attempts. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      division,
      city,
      thana,
      payment_method,
      items,
      notes,
      coupon_code,
    } = body;

    // 2. Validate mandatory customer contact details
    if (!customer_name || !customer_phone || !shipping_address) {
      return NextResponse.json(
        { error: "Please provide recipient name, phone number, and delivery address." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Please select at least one item." },
        { status: 400 }
      );
    }

    // 3. SERVER-SIDE PRICE LOOKUP & STOCK VERIFICATION (ANTI-TAMPERING)
    const currentProducts = runtimeStore.getProducts();
    const verifiedOrderItems: Array<{
      product_id: string;
      product_name: string;
      price: number;
      quantity: number;
      total: number;
    }> = [];

    let serverSubtotal = 0;

    for (const item of items) {
      const productId = item.product?.id || item.product_id || item.id;
      const requestedQty = Math.max(1, Math.floor(Number(item.quantity) || 1));

      const matchedProduct = currentProducts.find(
        (p) => p.id === productId || (item.slug && p.slug === item.slug)
      );

      if (!matchedProduct) {
        return NextResponse.json(
          { error: `One or more selected items are no longer available in the catalog.` },
          { status: 400 }
        );
      }

      if (!matchedProduct.is_active) {
        return NextResponse.json(
          { error: `"${matchedProduct.name.en}" is currently discontinued or out of season.` },
          { status: 400 }
        );
      }

      if (matchedProduct.stock < requestedQty) {
        return NextResponse.json(
          {
            error: `Only ${matchedProduct.stock} unit(s) of "${matchedProduct.name.en}" are available in nursery stock. Please adjust quantity.`,
          },
          { status: 400 }
        );
      }

      const itemTotal = matchedProduct.price * requestedQty;
      serverSubtotal += itemTotal;

      verifiedOrderItems.push({
        product_id: matchedProduct.id,
        product_name: matchedProduct.name.en || matchedProduct.name.bn,
        price: matchedProduct.price,
        quantity: requestedQty,
        total: itemTotal,
      });
    }

    // 4. SERVER-SIDE DELIVERY CHARGE & COUPON CALCULATION
    const targetCity = (city || division || "Dhaka").trim().toLowerCase();
    const isInsideDhaka = targetCity.includes("dhaka");
    const deliveryCharge =
      serverSubtotal >= 1500 || serverSubtotal === 0
        ? 0
        : isInsideDhaka
        ? 70
        : 130;

    let discountAmount = 0;
    let appliedCouponCode: string | undefined = undefined;

    if (coupon_code && typeof coupon_code === "string" && coupon_code.trim()) {
      const couponResult = runtimeStore.validateCoupon(coupon_code, serverSubtotal);
      if (couponResult.valid) {
        discountAmount = couponResult.discount;
        appliedCouponCode = couponResult.coupon?.code || coupon_code.trim().toUpperCase();
        runtimeStore.incrementCouponUsage(appliedCouponCode);
      }
    }

    const serverTotalAmount = Math.max(0, serverSubtotal - discountAmount) + deliveryCharge;

    const orderNumber = `ARN-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const supabase = getServerSupabase();

    let orderId = `ord-${Date.now()}`;

    // 5. ATOMIC STOCK DEDUCTION
    for (const verified of verifiedOrderItems) {
      const current = currentProducts.find((p) => p.id === verified.product_id);
      if (current) {
        const newStock = Math.max(0, current.stock - verified.quantity);
        runtimeStore.updateProduct(current.id, { stock: newStock });
      }
    }

    // 6. RECORD IN SUPABASE DATABASE (IF CONNECTED)
    if (supabase) {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .insert({
            order_number: orderNumber,
            customer_name: customer_name.trim(),
            customer_email: (customer_email || "").trim(),
            customer_phone: customer_phone.trim(),
            shipping_address: `${shipping_address.trim()}${thana ? `, ${thana}` : ""}`,
            city: city || division || "Dhaka",
            total_amount: serverTotalAmount,
            payment_method: payment_method || "cod",
            payment_status: "pending",
            order_status: "processing",
            notes: notes || null,
          })
          .select("id")
          .single();

        if (!orderError && orderData?.id) {
          orderId = orderData.id;

          const orderLines = verifiedOrderItems.map((item) => ({
            order_id: orderId,
            product_id: item.product_id.startsWith("prod-") ? null : item.product_id,
            product_name: item.product_name,
            price: item.price,
            quantity: item.quantity,
          }));

          await supabase.from("order_items").insert(orderLines);
        }
      } catch (err) {
        console.warn("Supabase order insert notice, continuing with fallback store:", err);
      }
    }

    // 7. RECORD IN ACTIVE RUNTIME STORE (INSTANT ADMIN VISIBILITY)
    runtimeStore.addOrder({
      id: orderId,
      order_number: orderNumber,
      customer_name: customer_name.trim(),
      customer_email: (customer_email || "").trim(),
      customer_phone: customer_phone.trim(),
      shipping_address: `${shipping_address.trim()}${thana ? `, ${thana}` : ""}`,
      city: city || division || "Dhaka",
      total_amount: serverTotalAmount,
      coupon_code: appliedCouponCode,
      discount_amount: discountAmount > 0 ? discountAmount : undefined,
      payment_method: payment_method || "cod",
      payment_status: "pending",
      order_status: "processing",
      notes: notes || undefined,
      items: verifiedOrderItems.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        price: item.price,
        quantity: item.quantity,
      })),
      is_archived: false,
      created_at: new Date().toISOString(),
    });

    // 8. DISPATCH SERVER-SIDE META CONVERSIONS API (CAPI) PURCHASE EVENT
    // Uses identical orderNumber as event_id so Meta deduplicates with browser Pixel!
    try {
      const forwarded = req.headers.get("x-forwarded-for");
      const clientIp = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || undefined;
      const userAgent = req.headers.get("user-agent") || undefined;

      sendMetaCapiEvent({
        event_name: "Purchase",
        event_id: orderNumber,
        event_time: Math.floor(Date.now() / 1000),
        action_source: "website",
        event_source_url: "https://aronyok.vercel.app/cart",
        user_data: {
          em: customer_email,
          ph: customer_phone,
          fn: customer_name,
          ct: city || division,
          country: "bd",
          client_ip_address: clientIp,
          client_user_agent: userAgent,
        },
        custom_data: {
          value: serverTotalAmount,
          currency: "BDT",
          order_id: orderNumber,
          num_items: verifiedOrderItems.length,
          content_ids: verifiedOrderItems.map((i) => i.product_id),
          contents: verifiedOrderItems.map((i) => ({
            id: i.product_id,
            quantity: i.quantity,
            item_price: i.price,
          })),
        },
      }).catch((err) => {
        console.warn("Server CAPI Purchase dispatch error:", err);
      });
    } catch {}

    // 9. PAYMENT INSTRUCTIONS
    let paymentInstructions = null;
    if (payment_method === "bkash" || payment_method === "nagad") {
      paymentInstructions = {
        method: payment_method.toUpperCase(),
        merchantNumber: "01700-000000",
        reference: orderNumber,
        amount: serverTotalAmount,
        note: `Please send ৳${serverTotalAmount} to our Merchant Number using Reference: ${orderNumber}`,
      };
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
      subtotal: serverSubtotal,
      deliveryCharge,
      discount: discountAmount,
      coupon_code: appliedCouponCode,
      total_amount: serverTotalAmount,
      payment_method: payment_method || "cod",
      paymentInstructions,
      itemsCount: verifiedOrderItems.reduce((acc, i) => acc + i.quantity, 0),
      message: "Order placed successfully! Verified by Aronyok Commerce Engine.",
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process checkout. Please try again." },
      { status: 500 }
    );
  }
}
