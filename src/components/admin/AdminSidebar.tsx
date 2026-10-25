"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BookOpen,
  FileText,
  Wrench,
  ShoppingBag,
  Settings,
  Store,
  LogOut,
  Sprout,
  ShieldCheck,
} from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase/client";
import AdminSyncWidget from "./AdminSyncWidget";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show admin sidebar
  if (pathname === "/admin/login") {
    return null;
  }

  const menuItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/blog", label: "Blog Posts", icon: BookOpen },
    { href: "/admin/pages", label: "Dynamic Pages", icon: FileText },
    { href: "/admin/tools", label: "Tools & Apps", icon: Wrench },
    { href: "/admin/orders", label: "Orders & MFS", icon: ShoppingBag },
    { href: "/admin/settings", label: "SEO & AI Setup", icon: Settings },
  ];

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem("aronyok_admin_auth");
    router.push("/admin/login");
  };

  return (
    <aside className="w-64 bg-forest-950 text-cream-100 flex flex-col min-h-screen border-r border-forest-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-forest-850 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-mint-300">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-base text-white tracking-tight">
              Aronyok Admin
            </h2>
            <p className="text-[10px] text-forest-300 font-medium uppercase tracking-wider">
              Nature CMS v1.0
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-forest-800 text-white shadow-soft-sm font-bold"
                  : "text-forest-200/80 hover:bg-forest-900 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 text-forest-300" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Shortcuts & Code Sync */}
      <div className="p-4 border-t border-forest-850 space-y-3">
        <AdminSyncWidget />

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-forest-300 hover:text-white hover:bg-forest-900 transition-colors"
        >
          <Store className="w-4 h-4 text-emerald-400" />
          <span>View Public Store</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-red-400 hover:bg-forest-900 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
