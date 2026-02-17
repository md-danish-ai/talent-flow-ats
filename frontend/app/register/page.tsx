"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
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
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 shadow-xl rotate-3">
              <span className="text-white text-3xl font-black -rotate-3">
                T
              </span>
            </div>
            <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
              Get Started
            </h1>
            <p className="mt-2 text-slate-500 font-medium">
              Join 500+ recruitment teams
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#F96331]" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-[#F96331]/30 focus:bg-white focus:ring-4 focus:ring-[#F96331]/5"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#F96331]" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-[#F96331]/30 focus:bg-white focus:ring-4 focus:ring-[#F96331]/5"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-[#F96331]" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="Set a password"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-[#F96331]/30 focus:bg-white focus:ring-4 focus:ring-[#F96331]/5"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-[#F96331] py-4 text-lg font-bold text-white shadow-xl shadow-[#F96331]/20 transition-all hover:bg-[#e85220] active:scale-[0.98]"
            >
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
