import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_FALLBACK_COOKIE,
  createSignedAdminToken,
  verifyEnvAdminCredentials,
  resolveSupabaseStaffRole,
} from "@/lib/auth/admin-guard";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const rawPassword = String(password);

    // 1. Check optional explicit env-configured admin credentials first (works even if Supabase pauses)
    const envStaff = verifyEnvAdminCredentials(normalizedEmail, rawPassword);
    if (envStaff) {
      const signedToken = await createSignedAdminToken(envStaff);
      if (signedToken) {
        const res = NextResponse.json({
          success: true,
          user: {
            id: envStaff.userId,
            email: envStaff.email,
            fullName: envStaff.fullName || "Admin",
            role: envStaff.role,
          },
        });
        res.cookies.set(ADMIN_FALLBACK_COOKIE, signedToken, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        });
        return res;
      }
    }

    // 2. Primary Supabase Auth sign-in
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json(
        { error: "Server authentication configuration missing." },
        { status: 500 }
      );
    }

    const cookiesToApply: Array<{ name: string; value: string; options?: any }> = [];

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password: rawPassword,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message || "Invalid email or password." },
        { status: 401 }
      );
    }

    const role = await resolveSupabaseStaffRole(data.user);

    if (!role) {
      await supabase.auth.signOut();
      return NextResponse.json(
        { error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    const finalResponse = NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || data.user.user_metadata?.name || "Admin",
        role,
      },
    });

    // Apply every Supabase auth cookie directly onto the final response (prevents dropped chunked cookies on Vercel)
    for (const { name, value, options } of cookiesToApply) {
      finalResponse.cookies.set(name, value, {
        ...options,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    }

    return finalResponse;
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Authentication error occurred." },
      { status: 500 }
    );
  }
}
