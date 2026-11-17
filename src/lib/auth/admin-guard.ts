import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export interface AuthenticatedStaff {
  userId: string;
  email: string;
  fullName?: string;
  role: string;
}

export const ADMIN_FALLBACK_COOKIE = "aronyok_admin_session";

const STAFF_ROLES = new Set([
  "admin",
  "super_admin",
  "store_manager",
  "fulfillment_agent",
  "botanist",
]);

export function isStaffRole(role: unknown): role is string {
  return typeof role === "string" && STAFF_ROLES.has(role.toLowerCase());
}

function getSigningSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(sig);
}

export async function createSignedAdminToken(staff: AuthenticatedStaff): Promise<string | null> {
  const secret = getSigningSecret();
  if (!secret) return null;

  const payload = {
    ...staff,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  };
  const jsonStr = JSON.stringify(payload);
  const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
  const sig = await hmacSign(encoded, secret);
  return `${encoded}.${sig}`;
}

export async function verifySignedAdminToken(
  token: string | undefined
): Promise<AuthenticatedStaff | null> {
  if (!token) return null;
  const secret = getSigningSecret();
  if (!secret) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encoded, sig] = parts;
    const expected = await hmacSign(encoded, secret);
    if (!timingSafeEqualStr(sig, expected)) return null;

    const jsonStr = decodeURIComponent(escape(atob(encoded)));
    const payload = JSON.parse(jsonStr);
    if (!payload?.exp || Date.now() > payload.exp) return null;
    if (!isStaffRole(payload.role)) return null;

    return {
      userId: payload.userId || "env-admin",
      email: payload.email || "",
      fullName: payload.fullName || "Admin",
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function verifyEnvAdminCredentials(email: string, password: string): AuthenticatedStaff | null {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPass) return null;

  const inputEmail = email.trim().toLowerCase();
  if (timingSafeEqualStr(inputEmail, envEmail) && timingSafeEqualStr(password, envPass)) {
    return {
      userId: "env-super-admin",
      email: envEmail,
      fullName: process.env.ADMIN_NAME || "Aronyok Administrator",
      role: "super_admin",
    };
  }
  return null;
}

/**
 * Resolves a Supabase user's staff role from user_metadata, app_metadata,
 * or the public.profiles table (using service-role client if available).
 */
export async function resolveSupabaseStaffRole(user: {
  id: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}): Promise<string | null> {
  const metaRole = user.user_metadata?.role || user.app_metadata?.role;
  if (isStaffRole(metaRole)) {
    return metaRole;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (supabaseUrl && serviceKey && !supabaseUrl.includes("placeholder")) {
    try {
      const adminClient = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      const { data } = await adminClient
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.role && isStaffRole(data.role)) {
        return data.role;
      }
    } catch {}
  }

  return null;
}

export async function verifyAdminSession(req: NextRequest): Promise<AuthenticatedStaff | null> {
  // 1. Check signed env-fallback session cookie (if explicitly enabled via env vars)
  const fallbackCookie = req.cookies.get(ADMIN_FALLBACK_COOKIE)?.value;
  if (fallbackCookie) {
    const verified = await verifySignedAdminToken(fallbackCookie);
    if (verified) return verified;
  }

  // 2. Check Supabase Auth session
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  if (!supabaseUrl || !anonKey) return null;

  try {
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

    const role = await resolveSupabaseStaffRole(user);
    if (!role) return null;

    return {
      userId: user.id,
      email: user.email || "",
      fullName: user.user_metadata?.full_name || user.user_metadata?.name || "Admin",
      role,
    };
  } catch {
    return null;
  }
}
