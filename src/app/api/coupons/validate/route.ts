import { NextRequest, NextResponse } from "next/server";
import { runtimeStore } from "@/lib/runtime-store";
import { checkRateLimit } from "@/lib/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous";

    // Rate limit: 20 coupon validations per minute per IP to prevent coupon brute-forcing
    const { allowed } = checkRateLimit(`coupon_${ip}`, 20, 60000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again in a few moments." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json(
        { valid: false, discount: 0, message: "Please provide a coupon code." },
        { status: 400 }
      );
    }

    const numericSubtotal = Math.max(0, Number(subtotal) || 0);
    const result = runtimeStore.validateCoupon(code, numericSubtotal);

    if (!result.valid) {
      return NextResponse.json(
        { valid: false, discount: 0, message: result.message },
        { status: 200 }
      );
    }

    return NextResponse.json({
      valid: true,
      discount: result.discount,
      code: result.coupon?.code,
      message: result.message,
    });
  } catch (err: any) {
    return NextResponse.json(
      { valid: false, discount: 0, message: err.message || "Validation failed." },
      { status: 500 }
    );
  }
}
