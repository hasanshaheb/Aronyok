import { NextRequest, NextResponse } from "next/server";
import { sendMetaCapiEvent } from "@/lib/analytics/capi";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event_name, event_id, event_time, event_source_url, user_data, custom_data } = body;

    if (!event_name) {
      return NextResponse.json({ error: "Missing event_name" }, { status: 400 });
    }

    // Extract client IP and User Agent from request headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    // Read cookie headers if available for _fbp and _fbc
    const cookieHeader = req.headers.get("cookie") || "";
    let fbp: string | undefined;
    let fbc: string | undefined;

    const fbpMatch = cookieHeader.match(/_fbp=([^;]+)/);
    if (fbpMatch) fbp = fbpMatch[1];
    const fbcMatch = cookieHeader.match(/_fbc=([^;]+)/);
    if (fbcMatch) fbc = fbcMatch[1];

    const result = await sendMetaCapiEvent({
      event_name,
      event_id,
      event_time,
      event_source_url,
      action_source: "website",
      user_data: {
        ...(user_data || {}),
        client_ip_address: ip,
        client_user_agent: userAgent,
        fbp,
        fbc,
      },
      custom_data,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal CAPI error", message: err.message },
      { status: 500 }
    );
  }
}
