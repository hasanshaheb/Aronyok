"use client";

// Define global typings for fbq and gtag
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface AnalyticsEventParams {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: Array<{ id: string; quantity: number; item_price?: number }>;
  value?: number;
  currency?: string;
  num_items?: number;
  order_id?: string;
  search_string?: string;
  status?: string;
  [key: string]: any;
}

export interface AnalyticsUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  [key: string]: any;
}

/**
 * Dispatches an ecommerce event to both Meta Pixel (browser), Google Analytics 4 (browser),
 * and Meta Conversions API (server) with a shared event_id to ensure deduplication.
 */
export function trackEvent(
  eventName: "ViewContent" | "AddToCart" | "InitiateCheckout" | "Purchase" | "Lead" | "Search" | "Contact" | string,
  params: AnalyticsEventParams = {},
  userData?: AnalyticsUserData,
  existingEventId?: string
) {
  if (typeof window === "undefined") return;

  const eventId = existingEventId || `aronyok_${eventName.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const currency = params.currency || "BDT";
  const normalizedParams = {
    ...params,
    currency,
  };

  // 1. Meta Pixel client-side dispatch
  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", eventName, normalizedParams, { eventID: eventId });
    }
  } catch (err) {
    console.warn("Client fbq tracking error:", err);
  }

  // 2. Google Analytics 4 client-side dispatch
  try {
    if (typeof window.gtag === "function") {
      // Map Meta event names to GA4 recommended event names
      let ga4EventName = eventName;
      if (eventName === "ViewContent") ga4EventName = "view_item";
      else if (eventName === "AddToCart") ga4EventName = "add_to_cart";
      else if (eventName === "InitiateCheckout") ga4EventName = "begin_checkout";
      else if (eventName === "Purchase") ga4EventName = "purchase";
      else if (eventName === "Lead") ga4EventName = "generate_lead";
      else if (eventName === "Search") ga4EventName = "search";

      window.gtag("event", ga4EventName, {
        ...normalizedParams,
        transaction_id: params.order_id || eventId,
      });
    }
  } catch (err) {
    console.warn("Client gtag tracking error:", err);
  }

  // 3. Server-side CAPI Beacon/Fetch for guaranteed delivery and server deduplication
  try {
    fetch("/api/analytics/capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: eventName,
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        user_data: userData ? {
          em: userData.email,
          ph: userData.phone,
          fn: userData.firstName,
          ln: userData.lastName,
          ct: userData.city,
        } : undefined,
        custom_data: normalizedParams,
      }),
      keepalive: true,
    }).catch(() => {
      // Non-blocking fail-safe
    });
  } catch {}

  return eventId;
}
