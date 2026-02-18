"use client";

import { motion } from "framer-motion";
import { ArrowRight, Lock, Phone, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Static logic for redirection with role-based cookies
    document.cookie = `role=${role}; path=/`;
    document.cookie = `auth_token=static-token; path=/`; // Mock token for middleware

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/user/dashboard");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white font-sans">
      <div className="w-full max-w-md p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* Logo Area */}
          <div className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary shadow-lg shadow-brand-primary/20 rotate-3">
              <span className="text-white text-3xl font-black -rotate-3">
                T
              </span>
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
              TalentFlow
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Elevating recruitment experiences
            </p>
          </div>

          <div className="space-y-2 text-center">
            <h2 className="text-xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-sm text-slate-400">
              Please enter your details to sign in
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-4">
              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
              </div>

              <div className="group relative">
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-xs font-bold text-brand-primary hover:underline"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 block">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 py-3 transition-all ${role === "admin" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-slate-100 bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    className="hidden"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="font-bold">Admin</span>
                </label>
                <label
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 py-3 transition-all ${role === "user" ? "border-brand-primary bg-brand-primary/5 text-brand-primary" : "border-slate-100 bg-white text-slate-500 hover:bg-slate-50"}`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    className="hidden"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="font-bold">User</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-200 text-brand-primary focus:ring-brand-primary"
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium text-slate-500 cursor-pointer"
              >
                Keep me logged in
              </label>
            </div>

            <button
              type="submit"
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-primary py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-hover active:scale-[0.98]"
            >
              <span>Sign In</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-400">
            New to TalentFlow?{" "}
            <Link
              href="/"
              className="font-bold text-brand-primary hover:underline inline-flex items-center gap-1"
            >
              Create an account <UserPlus className="h-4 w-4" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
