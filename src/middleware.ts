import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  ADMIN_FALLBACK_COOKIE,
  verifySignedAdminToken,
  resolveSupabaseStaffRole,
} from "@/lib/auth/admin-guard";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Allow login page and auth endpoints to handle their own session checks cleanly
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout" ||
    pathname === "/api/admin/auth/me"
  ) {
    return response;
  }

  if (isAdminPage || isAdminApi) {
    // 1. Verify signed env-admin cookie if present
    const fallbackToken = request.cookies.get(ADMIN_FALLBACK_COOKIE)?.value;
    if (fallbackToken) {
      const verified = await verifySignedAdminToken(fallbackToken);
      if (verified) {
        return response;
      }
    }

    // 2. Verify Supabase Auth session
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!supabaseUrl || !anonKey) {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Configuration Error: Supabase connection keys missing" },
          { status: 500 }
        );
      }
      return NextResponse.redirect(new URL("/admin/login?error=config_missing", request.url));
    }

    try {
      const supabase = createServerClient(supabaseUrl, anonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
            response = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      });

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      const staffRole = !error && user ? await resolveSupabaseStaffRole(user) : null;

      if (error || !user || !staffRole) {
        if (isAdminApi) {
          return NextResponse.json(
            { error: "Unauthorized: Valid Administrator session required." },
            { status: 401 }
          );
        }
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
    } catch {
      if (isAdminApi) {
        return NextResponse.json(
          { error: "Unauthorized: Could not verify administrator session." },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
