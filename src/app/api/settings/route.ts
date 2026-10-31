import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";

export const dynamic = "force-dynamic";

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
        runtimeStore.updateSettings(data);
      }
    } catch {
      // Use runtimeStore
    }
  }
  return NextResponse.json(runtimeStore.getSettings());
}

export async function POST(req: NextRequest) {
  try {
    const updated = await req.json();
    const currentSettings = runtimeStore.updateSettings(updated);

    const supabase = getServerSupabase();
    let syncedToSupabase = false;

    if (supabase) {
      try {
        const { error } = await supabase.from("settings").upsert({
          id: currentSettings.id || "00000000-0000-0000-0000-000000000001",
          global_seo_title: currentSettings.global_seo_title,
          global_seo_description: currentSettings.global_seo_description,
          analytics_script: currentSettings.analytics_script,
          ad_banner_top_html: currentSettings.ad_banner_top_html,
          ai_system_prompt: currentSettings.ai_system_prompt,
          contact_email: currentSettings.contact_email,
          contact_phone: currentSettings.contact_phone,
          updated_at: new Date().toISOString(),
        });
        if (!error) {
          syncedToSupabase = true;
        }
      } catch {
        // Fallback to runtimeStore
      }
    }

    return NextResponse.json({
      success: true,
      settings: currentSettings,
      syncedToSupabase,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update settings" },
      { status: 500 }
    );
  }
}
