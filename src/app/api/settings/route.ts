import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { fallbackSettings } from "@/lib/supabase/fallback-data";

// In-memory server-side cache for instant persistence even before Supabase table is created
let runtimeSettings = { ...fallbackSettings };

export async function GET() {
  const supabase = getServerSupabase();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .limit(1)
        .single();
      if (!error && data) {
        runtimeSettings = { ...runtimeSettings, ...data };
      }
    } catch {
      // Use runtimeSettings
    }
  }
  return NextResponse.json(runtimeSettings);
}

export async function POST(req: NextRequest) {
  try {
    const updated = await req.json();
    runtimeSettings = { ...runtimeSettings, ...updated };

    const supabase = getServerSupabase();
    let syncedToSupabase = false;

    if (supabase) {
      try {
        const { error } = await supabase.from("settings").upsert({
          id: runtimeSettings.id || "00000000-0000-0000-0000-000000000001",
          global_seo_title: runtimeSettings.global_seo_title,
          global_seo_description: runtimeSettings.global_seo_description,
          analytics_script: runtimeSettings.analytics_script,
          ad_banner_top_html: runtimeSettings.ad_banner_top_html,
          ai_system_prompt: runtimeSettings.ai_system_prompt,
          contact_email: runtimeSettings.contact_email,
          contact_phone: runtimeSettings.contact_phone,
          updated_at: new Date().toISOString(),
        });
        if (!error) {
          syncedToSupabase = true;
        }
      } catch {
        // Fallback to runtimeSettings
      }
    }

    return NextResponse.json({
      success: true,
      settings: runtimeSettings,
      syncedToSupabase,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
