import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export interface AuthenticatedStaff {
  userId: string;
  email: string;
  role: string;
}

export async function verifyAdminSession(req: NextRequest): Promise<AuthenticatedStaff | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !anonKey) return null;

  const supabase = createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll() {},
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const role = user.user_metadata?.role;
  const isStaff =
    role === "admin" ||
    role === "super_admin" ||
    role === "store_manager" ||
    role === "fulfillment_agent";

  if (!isStaff) return null;

  return {
    userId: user.id,
    email: user.email || "",
    role,
  };
}
