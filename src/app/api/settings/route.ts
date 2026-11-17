import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSupabase } from "@/lib/supabase/server";
import { runtimeStore } from "@/lib/runtime-store";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import {
  loadLatestSettings,
  loadLatestCampaigns,
  persistCloudSnapshot,
} from "@/lib/data-hydrator";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  const [settings, campaigns] = await Promise.all([
    loadLatestSettings(),
    loadLatestCampaigns(),
  ]);
  const activeCampaign = campaigns.find((c) => c.is_active) || null;
  return NextResponse.json(
    {
      ...settings,
      active_campaign: activeCampaign,
    },
    { headers: NO_CACHE_HEADERS }
  );
}

export async function POST(req: NextRequest) {
  try {
    const staff = await verifyAdminSession(req);
    if (!staff) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator access required." },
        { status: 401 }
      );
    }

    await loadLatestSettings();
    const updated = await req.json();
    const { sync_git, git_message, ...cleanSettings } = updated;
    const currentSettings = runtimeStore.updateSettings(cleanSettings);

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
      } catch {}
    }

    const cloudSaved = await persistCloudSnapshot("settings", currentSettings);
    syncedToSupabase = syncedToSupabase || cloudSaved;

    try {
      revalidatePath("/", "layout");
    } catch {}

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
