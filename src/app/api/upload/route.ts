import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase } from "@/lib/supabase/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFilename = `product-${Date.now()}-${cleanName}`;
    const contentType = file.type || "image/jpeg";

    const supabase = getServerSupabase();
    let publicUrl = "";

    // 1. Attempt Supabase Storage upload
    if (supabase) {
      try {
        const bucketName = "products";

        // Check or create bucket if needed
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some((b) => b.name === bucketName);

        if (!bucketExists) {
          await supabase.storage.createBucket(bucketName, {
            public: true,
            fileSizeLimit: 10485760, // 10MB
          });
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(uniqueFilename, buffer, {
            contentType: contentType,
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
        } else if (uploadError) {
          console.warn("Supabase storage upload notice:", uploadError.message);
        }
      } catch (err) {
        console.warn("Supabase storage exception, falling back to local storage:", err);
      }
    }

    // 2. Fallback to local public/uploads directory
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
    } catch (fsErr: any) {
      // 3. Ultra-resilient Base64 Data URL fallback
      const base64 = `data:${contentType};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64,
        storage: "base64",
        filename: uniqueFilename,
      });
    }
  } catch (error: any) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image upload" },
      { status: 500 }
    );
  }
}
