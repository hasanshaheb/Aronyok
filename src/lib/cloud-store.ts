import { getServerSupabase } from "./supabase/server";

const CLOUD_BUCKET = "aronyok-cms-state";

export type CloudEntityName =
  | "products"
  | "blogs"
  | "pages"
  | "tools"
  | "settings"
  | "orders"
  | "customers"
  | "leads"
  | "suppliers"
  | "purchases"
  | "shipments"
  | "returns"
  | "coupons"
  | "campaigns"
  | "stock_movements"
  | "admin_users"
  | "audit_logs"
  | "abandoned_carts";

let bucketEnsured = false;

async function ensureCloudBucket(): Promise<boolean> {
  if (bucketEnsured) return true;
  const supabase = getServerSupabase();
  if (!supabase) return false;

  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (!error && Array.isArray(buckets)) {
      if (buckets.some((b) => b.name === CLOUD_BUCKET)) {
        bucketEnsured = true;
        return true;
      }
    }
    const { error: createErr } = await supabase.storage.createBucket(CLOUD_BUCKET, {
      public: false,
      fileSizeLimit: 10 * 1024 * 1024,
    });
    if (!createErr || /already exists|duplicate/i.test(createErr.message || "")) {
      bucketEnsured = true;
      return true;
    }
  } catch (err) {
    console.warn("Cloud store bucket ensure warning:", err);
  }
  return false;
}

/**
 * Reads a persisted JSON entity snapshot from Supabase Cloud Storage.
 * Returns null if Supabase is unavailable or the snapshot does not exist yet.
 */
export async function readCloudEntity<T>(entity: CloudEntityName): Promise<T | null> {
  const supabase = getServerSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.storage
      .from(CLOUD_BUCKET)
      .download(`${entity}.json`);

    if (error || !data) {
      return null;
    }

    const text = await data.text();
    if (!text) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Persists a JSON entity snapshot to Supabase Cloud Storage so all Vercel
 * serverless instances immediately read the latest admin updates.
 */
export async function writeCloudEntity<T>(
  entity: CloudEntityName,
  payload: T
): Promise<boolean> {
  const supabase = getServerSupabase();
  if (!supabase) return false;

  try {
    const jsonBuffer = Buffer.from(JSON.stringify(payload), "utf-8");

    let { error } = await supabase.storage
      .from(CLOUD_BUCKET)
      .upload(`${entity}.json`, jsonBuffer, {
        contentType: "application/json",
        upsert: true,
        cacheControl: "0",
      });

    if (error && /bucket|not found/i.test(error.message || "")) {
      const created = await ensureCloudBucket();
      if (created) {
        const retry = await supabase.storage
          .from(CLOUD_BUCKET)
          .upload(`${entity}.json`, jsonBuffer, {
            contentType: "application/json",
            upsert: true,
            cacheControl: "0",
          });
        error = retry.error;
      }
    }

    if (error) {
      console.warn(`Cloud store write warning (${entity}):`, error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.warn(`Cloud store write exception (${entity}):`, err);
    return false;
  }
}
