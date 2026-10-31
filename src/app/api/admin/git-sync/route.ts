import { NextRequest, NextResponse } from "next/server";
import { gitCommitAndPush, getGitStatus } from "@/lib/git-sync";
import { persistToCodebase } from "@/lib/runtime-store";
import { verifyAdminSession } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const staff = await verifyAdminSession(req);
  if (!staff) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required." },
      { status: 401 }
    );
  }

  try {
    const status = await getGitStatus();
    return NextResponse.json({ success: true, ...status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const staff = await verifyAdminSession(req);
  if (!staff) {
    return NextResponse.json(
      { error: "Unauthorized: Administrator access required." },
      { status: 401 }
    );
  }

  try {
    let customMessage: string | undefined;
    try {
      const body = await req.json();
      customMessage = body.message;
    } catch {}

    // Make sure latest in-memory state is dumped to fallback-data.ts
    persistToCodebase();

    const result = await gitCommitAndPush(customMessage);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
