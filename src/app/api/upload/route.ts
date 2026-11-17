import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/jfif",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
]);

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/jfif": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function POST(req: NextRequest) {
  try {
    // 1. Staff authentication guard
    const staff = await verifyAdminSession(req);
    if (!staff) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator privileges required for asset upload." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. File size limit (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB maximum upload limit." },
        { status: 400 }
      );
    }

    // 3. MIME type validation (with filename extension fallback)
    let rawType = (file.type || "").toLowerCase();
    if (!rawType || rawType === "application/octet-stream") {
      const fileExt = path.extname(file.name || "").toLowerCase();
      rawType = EXT_TO_MIME[fileExt] || rawType;
    }
    if (rawType === "image/jpg" || rawType === "image/jfif") {
      rawType = "image/jpeg";
    }
    if (!ALLOWED_MIME_TYPES.has(rawType)) {
      return NextResponse.json(
        { error: "Invalid file format. Allowed formats: JPG, PNG, WebP, AVIF, GIF, SVG." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Secure UUID-based filename generation
    const ext = EXTENSION_MAP[rawType] || "jpg";
    const uniqueFilename = `asset-${Date.now()}-${crypto.randomUUID().slice(0, 10)}.${ext}`;

    const supabase = getServerSupabase();
    let publicUrl = "";

    // 5. Attempt Supabase Storage upload (auto-creating public bucket if missing)
    if (supabase) {
      try {
        const bucketName = "products";

        let { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(uniqueFilename, buffer, {
            contentType: rawType,
            upsert: true,
          });

        if (uploadError && /bucket/i.test(uploadError.message || "")) {
          await supabase.storage.createBucket(bucketName, { public: true }).catch(() => {});
          const retry = await supabase.storage
            .from(bucketName)
            .upload(uniqueFilename, buffer, {
              contentType: rawType,
              upsert: true,
            });
          uploadData = retry.data;
          uploadError = retry.error;
        }

        if (!uploadError && uploadData) {
          const { data: urlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(uniqueFilename);

          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl;
            return NextResponse.json({
              success: true,
              url: publicUrl,
              storage: "supabase",
              filename: uniqueFilename,
            });
          }
        } else if (uploadError) {
          console.warn("Supabase storage upload error:", uploadError.message);
        }
      } catch (err) {
        console.warn("Supabase storage exception, proceeding to fallback:", err);
      }
    }

    // 6. Fallback to local public/uploads directory
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      const filePath = path.join(uploadsDir, uniqueFilename);
      await fs.writeFile(filePath, buffer);

      publicUrl = `/uploads/${uniqueFilename}`;
      return NextResponse.json({
        success: true,
        url: publicUrl,
        storage: "local",
        filename: uniqueFilename,
      });
    } catch {
      // 7. Base64 Data URL fallback
      const base64 = `data:${rawType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64,
        storage: "base64",
        filename: uniqueFilename,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
