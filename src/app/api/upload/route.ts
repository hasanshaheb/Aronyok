import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/auth/admin-guard";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
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

    // 2. File size limit (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB maximum upload limit." },
        { status: 400 }
      );
    }

    // 3. MIME type validation
    const rawType = (file.type || "").toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(rawType)) {
      return NextResponse.json(
        { error: "Invalid file format. Allowed formats: JPG, PNG, WebP, GIF, SVG." },
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

    // 5. Attempt Supabase Storage upload
    if (supabase) {
      try {
        const bucketName = "products";

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(uniqueFilename, buffer, {
            contentType: rawType,
            upsert: true,
          });

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
