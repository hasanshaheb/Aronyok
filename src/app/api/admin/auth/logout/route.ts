import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    let response = NextResponse.json({ success: true, message: "Logged out successfully." });

    if (supabaseUrl && anonKey) {
      const supabase = createServerClient(supabaseUrl, anonKey, {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      });

      await supabase.auth.signOut();
    }

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to log out." },
      { status: 500 }
    );
  }
}
