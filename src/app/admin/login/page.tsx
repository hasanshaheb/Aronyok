"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sprout, ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(
    urlError === "unauthorized"
      ? "You must be an authorized administrator to access that section."
      : ""
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(redirectPath);
        router.refresh();
      } else {
        setErrorMsg(data.error || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error during authentication. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          Sign in to manage catalog, orders, inventory & business operations
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Secure Form */}
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
              placeholder="admin@aronyok.com"
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
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-cream-50 border border-forest-200 text-xs sm:text-sm text-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? "Verifying Credentials..." : "Sign In to Admin Portal"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="pt-3 border-t border-forest-100 flex items-center justify-between text-xs text-forest-700">
        <Link
          href="/"
          className="font-semibold hover:text-forest-900 transition-colors"
        >
          ← Public Storefront
        </Link>
        <span className="flex items-center gap-1 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Session</span>
        </span>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-cream-100 via-[#f4f0e6] to-[#ece5d5]">
      <Suspense fallback={<div className="text-xs text-forest-700">Loading admin portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
