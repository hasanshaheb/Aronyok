import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_FALLBACK_COOKIE } from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    const cookiesToApply: Array<{ name: string; value: string; options?: any }> = [];

    if (supabaseUrl && anonKey) {
      try {
        const supabase = createServerClient(supabaseUrl, anonKey, {
          cookies: {
            getAll() {
              return req.cookies.getAll();
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
              cookiesToApply.push(...cookiesToSet);
            },
          },
        });
        await supabase.auth.signOut();
      } catch {}
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully." });

    for (const { name, value, options } of cookiesToApply) {
      response.cookies.set(name, value, { ...options, path: "/" });
    }

    response.cookies.set(ADMIN_FALLBACK_COOKIE, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to log out." },
      { status: 500 }
    );
  }
}
