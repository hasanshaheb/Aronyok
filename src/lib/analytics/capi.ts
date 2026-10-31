import crypto from "crypto";
import { runtimeStore } from "../runtime-store";

export interface CapiUserData {
  em?: string; // Email
  ph?: string; // Phone
  fn?: string; // First name
  ln?: string; // Last name
  ct?: string; // City
  country?: string; // Country (e.g. bd)
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string; // _fbp cookie
  fbc?: string; // _fbc cookie
}

export interface CapiEventPayload {
  event_name: string;
  event_time?: number;
  event_id?: string;
  event_source_url?: string;
  action_source?: "website" | "app" | "physical_store" | "system_generated" | "other";
  user_data?: CapiUserData;
  custom_data?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number; item_price?: number }>;
    num_items?: number;
    order_id?: string;
    status?: string;
    [key: string]: any;
  };
}

/**
 * Normalizes and hashes a string using SHA-256 for Meta Conversions API privacy compliance.
 */
export function hashData(val: string | undefined): string | undefined {
  if (!val) return undefined;
  const cleaned = val.trim().toLowerCase();
  if (!cleaned) return undefined;
  return crypto.createHash("sha256").update(cleaned).digest("hex");
}

/**
 * Normalizes Bangladeshi and international phone numbers to standard E.164 without '+' or leading 0.
 * e.g., '01712345678' -> '8801712345678'
 */
export function normalizePhone(phone: string | undefined): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("880")) {
    return digits;
  }
  if (digits.startsWith("0")) {
    digits = "88" + digits;
  } else if (digits.length === 10 && digits.startsWith("1")) {
    digits = "880" + digits;
  }
  return digits;
}

export async function sendMetaCapiEvent(payload: CapiEventPayload) {
  try {
    const settings = runtimeStore.getSettings();
    const pixelId = settings.meta_pixel_id || process.env.META_PIXEL_ID;
    const capiToken = settings.meta_capi_token || process.env.META_CAPI_TOKEN;

    if (!pixelId || !capiToken) {
      // In development or when tokens are not yet configured in admin settings
      return {
        success: true,
        configured: false,
        message: "Meta Pixel ID or CAPI Access Token not configured yet. Event logged.",
        event_name: payload.event_name,
        event_id: payload.event_id,
      };
    }

    const hashedUserData: Record<string, any> = {};

    if (payload.user_data?.em) {
      hashedUserData.em = [hashData(payload.user_data.em)];
    }
    if (payload.user_data?.ph) {
      const normalized = normalizePhone(payload.user_data.ph);
      if (normalized) {
        hashedUserData.ph = [hashData(normalized)];
      }
    }
    if (payload.user_data?.fn) {
      hashedUserData.fn = [hashData(payload.user_data.fn)];
    }
    if (payload.user_data?.ln) {
      hashedUserData.ln = [hashData(payload.user_data.ln)];
    }
    if (payload.user_data?.ct) {
      hashedUserData.ct = [hashData(payload.user_data.ct)];
    }
    if (payload.user_data?.country) {
      hashedUserData.country = [hashData(payload.user_data.country)];
    } else {
      hashedUserData.country = [hashData("bd")];
    }

    if (payload.user_data?.client_ip_address) {
      hashedUserData.client_ip_address = payload.user_data.client_ip_address;
    }
    if (payload.user_data?.client_user_agent) {
      hashedUserData.client_user_agent = payload.user_data.client_user_agent;
    }
    if (payload.user_data?.fbp) {
      hashedUserData.fbp = payload.user_data.fbp;
    }
    if (payload.user_data?.fbc) {
      hashedUserData.fbc = payload.user_data.fbc;
    }

    const eventTime = payload.event_time || Math.floor(Date.now() / 1000);
    const eventId = payload.event_id || `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const eventPayload = {
      event_name: payload.event_name,
      event_time: eventTime,
      event_id: eventId,
      event_source_url: payload.event_source_url || "https://aronyok.vercel.app",
      action_source: payload.action_source || "website",
      user_data: hashedUserData,
      custom_data: payload.custom_data ? {
        currency: payload.custom_data.currency || "BDT",
        ...payload.custom_data,
      } : undefined,
    };

    const url = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${capiToken}`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [eventPayload],
      }),
    });

    const result = await res.json();
    return {
      success: res.ok,
      configured: true,
      data: result,
      event_id: eventId,
    };
  } catch (err: any) {
    console.warn("Meta CAPI dispatch failed:", err.message);
    return {
      success: false,
      error: err.message,
    };
  }
}
