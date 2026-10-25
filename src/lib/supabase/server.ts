import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isServerSupabaseConfigured =
  Boolean(supabaseUrl) &&
  !supabaseUrl.includes("placeholder") &&
  Boolean(serviceRoleKey) &&
  !serviceRoleKey.includes("placeholder");

export function getServerSupabase() {
  if (!isServerSupabaseConfigured) {
    return null;
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
