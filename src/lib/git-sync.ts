import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export interface GitSyncResult {
  success: boolean;
  message: string;
  commitHash?: string;
  hasChanges?: boolean;
  details?: string;
  isCloud?: boolean;
}

export function isCloudRuntime(): boolean {
  return Boolean(process.env.VERCEL) || !fs.existsSync(path.join(process.cwd(), ".git"));
}

/**
 * Commits changed fallback data, orders, and local uploads to Git and pushes to origin main.
 * On Vercel Cloud, skips local git exec because changes persist directly to Supabase Cloud.
 */
export async function gitCommitAndPush(customMessage?: string): Promise<GitSyncResult> {
  if (isCloudRuntime()) {
    return {
      success: true,
      isCloud: true,
      hasChanges: false,
      message: "Saved directly to Cloud Database! Live immediately on Vercel (no Git push required).",
    };
  }

  const cwd = process.cwd();
  try {
    // Clean up any stale git lock file if present on Windows
    const lockFile = path.join(cwd, ".git", "index.lock");
    if (fs.existsSync(lockFile)) {
      try {
        fs.unlinkSync(lockFile);
      } catch {}
    }

    // 1. Stage the fallback code, order database, products cache, seed script, and public uploads (if exists)
    const pathsToStage = ["src/lib/supabase/fallback-data.ts", "data/orders.json", "supabase/seed.sql"];
    const productsJsonPath = path.join(cwd, "data", "products.json");
    if (fs.existsSync(productsJsonPath)) {
      pathsToStage.push("data/products.json");
    }
    const uploadsDir = path.join(cwd, "public", "uploads");
    if (fs.existsSync(uploadsDir)) {
      pathsToStage.push("public/uploads");
    }
    const stageArgs = pathsToStage.map((p) => `"${p}"`).join(" ");
    await execAsync(`git add ${stageArgs}`, {
      cwd,
      timeout: 15000,
    });

    // 2. Check if there are staged or unstaged changes
    const { stdout: statusOutput } = await execAsync(`git status --porcelain`, {
      cwd,
      timeout: 15000,
    });

    if (!statusOutput || !statusOutput.trim()) {
      return {
        success: true,
        message: "Codebase is fully up to date. No new changes to push.",
        hasChanges: false,
      };
    }

    // 3. Commit changes
    const defaultMsg = `CMS Sync: Admin updated catalog, content & data [${new Date().toISOString().slice(0, 19).replace("T", " ")}]`;
    const commitMsg = (customMessage || defaultMsg).replace(/["`$\\]/g, "");

    await execAsync(`git commit -m "${commitMsg}"`, {
      cwd,
      timeout: 20000,
    });

    // 4. Get latest commit hash
    const { stdout: hashOutput } = await execAsync(`git rev-parse --short HEAD`, {
      cwd,
      timeout: 10000,
    });
    const commitHash = hashOutput.trim();

    // 5. Push to origin main (triggers Vercel redeployment)
    let pushDetails = "";
    try {
      const { stdout: pushOutput, stderr: pushErr } = await execAsync(`git push origin main`, {
        cwd,
        timeout: 45000,
      });
      pushDetails = pushOutput || pushErr || "Pushed successfully";
    } catch (pushErr: any) {
      console.warn("Git push warning:", pushErr);
      return {
        success: true, // Local commit succeeded
        message: `Changes committed locally (${commitHash}), but remote push encountered: ${pushErr.message}. You can manually sync anytime.`,
        commitHash,
        hasChanges: true,
        details: pushErr.stderr || pushErr.message,
      };
    }

    return {
      success: true,
      message: `Successfully updated code and pushed to GitHub (${commitHash})! Vercel build triggered.`,
      commitHash,
      hasChanges: true,
      details: pushDetails,
    };
  } catch (error: any) {
    console.error("Git sync execution error:", error);
    return {
      success: false,
      message: error.message || "Failed to commit and push changes.",
      details: error.stderr || error.stdout,
    };
  }
}

/**
 * Gets the current git status & last commit info
 */
export async function getGitStatus(): Promise<{
  branch: string;
  lastCommit: string;
  hasUncommitted: boolean;
  isCloud: boolean;
}> {
  if (isCloudRuntime()) {
    return {
      branch: process.env.VERCEL_GIT_COMMIT_REF || "main",
      lastCommit: "Vercel Cloud Live — Instant Supabase Sync",
      hasUncommitted: false,
      isCloud: true,
    };
  }

  const cwd = process.cwd();
  try {
    const { stdout: branch } = await execAsync(`git rev-parse --abbrev-ref HEAD`, { cwd, timeout: 5000 });
    const { stdout: commit } = await execAsync(`git log -1 --pretty=format:"%h - %s (%cr)"`, { cwd, timeout: 5000 });
    const { stdout: status } = await execAsync(`git status --porcelain`, { cwd, timeout: 5000 });
    return {
      branch: branch.trim(),
      lastCommit: commit.trim(),
      hasUncommitted: Boolean(status.trim()),
      isCloud: false,
    };
  } catch {
    return {
      branch: "main",
      lastCommit: "Cloud Runtime Active",
      hasUncommitted: false,
      isCloud: true,
    };
  }
}
