import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const pathname = request.nextUrl.pathname;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Allow login page and authentication endpoints without token
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login"
  ) {
    return response;
  }

  // Intercept and protect all administrative pages and API endpoints
  if (isAdminPage || isAdminApi) {
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

    const supabase = createServerClient(supabaseUrl, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    const role = user?.user_metadata?.role;
    const isStaff =
      Boolean(user) &&
      (role === "admin" || role === "super_admin" || role === "store_manager" || role === "fulfillment_agent");

    if (error || !isStaff) {
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
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
