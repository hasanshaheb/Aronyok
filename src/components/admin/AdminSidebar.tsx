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
  Users,
  Target,
  Building2,
  ClipboardList,
  Truck,
  TrendingUp,
  Tag,
  Megaphone,
  Boxes,
  ShieldAlert,
  UserCheck,
  Sparkles,
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

  const navSections = [
    {
      title: "Operations & Sales",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/orders", label: "Orders & MFS", icon: ShoppingBag },
        { href: "/admin/shipments", label: "Shipments & Logistics", icon: Truck },
        { href: "/admin/customers", label: "Customers & CRM", icon: Users },
        { href: "/admin/leads", label: "Leads Pipeline", icon: Target },
      ],
    },
    {
      title: "Catalog & Procurement",
      items: [
        { href: "/admin/products", label: "Product Catalog", icon: Package },
        { href: "/admin/inventory", label: "Nursery Stock Ledger", icon: Boxes },
        { href: "/admin/suppliers", label: "Suppliers & Nurseries", icon: Building2 },
        { href: "/admin/purchases", label: "Purchases & Restock", icon: ClipboardList },
      ],
    },
    {
      title: "Marketing & Growth",
      items: [
        { href: "/admin/coupons", label: "Coupons & Discounts", icon: Tag },
        { href: "/admin/campaigns", label: "Campaigns & Banners", icon: Megaphone },
      ],
    },
    {
      title: "Content & Intelligence",
      items: [
        { href: "/admin/insights", label: "AI Botanical Insights", icon: Sparkles },
        { href: "/admin/reports", label: "Business Reports", icon: TrendingUp },
        { href: "/admin/blog", label: "Blog & Journal", icon: BookOpen },
        { href: "/admin/pages", label: "Dynamic Pages", icon: FileText },
        { href: "/admin/tools", label: "Botanical Tools", icon: Wrench },
      ],
    },
    {
      title: "Security & Governance",
      items: [
        { href: "/admin/users", label: "Staff & Roles (RBAC)", icon: UserCheck },
        { href: "/admin/audit-logs", label: "Security Audit Logs", icon: ShieldAlert },
        { href: "/admin/settings", label: "SEO & AI Setup", icon: Settings },
      ],
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
    } catch {}
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {}
    }
    localStorage.removeItem("aronyok_admin_auth");
    router.push("/admin/login");
    router.refresh();
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
              Enterprise v2.0
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-5 overflow-y-auto">
        {navSections.map((sec, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-forest-400/80 mb-1.5">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-forest-800 text-white shadow-soft-sm font-bold"
                      : "text-forest-200/80 hover:bg-forest-900 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-forest-300 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
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
