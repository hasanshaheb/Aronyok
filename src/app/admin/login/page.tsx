"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sprout, ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../../lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@aronyok.com");
  const [password, setPassword] = useState("aronyok123");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // If Supabase credentials are configured but user is invalid
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }
      }

      // Set admin session state & redirect
      localStorage.setItem("aronyok_admin_auth", "true");
      router.push("/admin");
    } catch (err: any) {
      setErrorMsg(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream-100 via-[#f4f0e6] to-[#ece5d5]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-forest-100 shadow-soft-lg p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 flex items-center justify-center text-mint-300 mx-auto shadow-md">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-forest-950 tracking-tight">
            Aronyok Admin Portal
          </h1>
          <p className="text-xs text-forest-700/80">
            Sign in to manage products, blogs, tools, pages & AI prompts
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-forest-900 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Shell"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-forest-50">
          <Link
            href="/"
            className="text-xs font-semibold text-forest-700 hover:text-forest-900"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
