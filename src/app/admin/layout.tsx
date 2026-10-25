"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "../../components/admin/AdminSidebar";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    async function checkAuth() {
      if (isLoginPage) {
        setIsAuthenticated(true);
        return;
      }

      // 1. Check local demo session
      const localAdminSession = localStorage.getItem("aronyok_admin_auth");
      if (localAdminSession === "true") {
        setIsAuthenticated(true);
        return;
      }

      // 2. Check Supabase auth session
      if (isSupabaseConfigured && supabase) {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          // Verify role is admin
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();

          if (profile?.role === "admin") {
            setIsAuthenticated(true);
            return;
          }
        }
      }

      // Not authenticated, redirect to login
      setIsAuthenticated(false);
      router.push("/admin/login");
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#fdfbf7]">{children}</div>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-950 text-cream-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-mint-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-forest-300">Verifying Admin Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f7f5ed] text-forest-950">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-7xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
