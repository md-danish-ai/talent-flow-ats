"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    testLevel: "fresher",
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const levels = [
    { id: "fresher", label: "Fresher" },
    { id: "QA", label: "QA" },
    { id: "team-lead", label: "Team Lead" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/sign-in");
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

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                  <input
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                  <input
                    name="mobile"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    value={formData.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Email Address{" "}
                  <span className="text-[10px] lowercase opacity-50">
                    (Optional)
                  </span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                  <input
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full rounded-2xl border border-slate-100 bg-white py-4 pl-12 pr-4 text-slate-900 outline-none transition-all focus:border-brand-primary/30 focus:ring-4 focus:ring-brand-primary/5"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="group relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1 mb-1 block">
                  Select Your Test Level
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white py-4 pl-4 pr-12 text-left text-slate-900 outline-none transition-all ${isDropdownOpen ? "border-brand-primary/30 ring-4 ring-brand-primary/5" : ""}`}
                  >
                    <span className="font-medium text-slate-600">
                      {levels.find((l) => l.id === formData.testLevel)?.label}
                    </span>
                    <ChevronDown
                      className={`absolute right-4 h-5 w-5 text-slate-400 transition-transform ${isDropdownOpen ? "rotate-180 text-brand-primary" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl shadow-slate-200/50"
                      >
                        {levels.map((level) => (
                          <button
                            key={level.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, testLevel: level.id });
                              setIsDropdownOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${formData.testLevel === level.id ? "bg-brand-primary/5 text-brand-primary" : "text-slate-500 hover:bg-slate-50"}`}
                          >
                            {level.label}
                            {formData.testLevel === level.id && (
                              <Check className="h-4 w-4" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-brand-primary py-4 text-lg font-bold text-white shadow-xl shadow-brand-primary/20 transition-all hover:bg-brand-hover active:scale-[0.98]"
            >
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Already have an account? Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
