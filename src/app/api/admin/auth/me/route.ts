import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
};

export async function GET(req: NextRequest) {
  try {
    const staff = await verifyAdminSession(req);
    if (!staff) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    return NextResponse.json(
      {
        authenticated: true,
        user: {
          id: staff.userId,
          email: staff.email,
          fullName: staff.fullName || "Admin",
          role: staff.role,
        },
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { authenticated: false },
      { status: 401, headers: NO_CACHE_HEADERS }
    );
  }
}
