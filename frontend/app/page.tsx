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
import Image from "next/image";
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
    <div className="flex min-h-screen overflow-hidden font-sans">
      {/* ===== LEFT SIDE — Light background with form card ===== */}
      <div className="relative flex w-full items-center justify-center bg-[#f0eeeb] lg:w-[50%]">
        {/* subtle geometric facet texture */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpolygon points='0,0 50,15 30,50' fill='%23e8e6e3'/%3E%3Cpolygon points='50,15 100,0 80,40' fill='%23eae8e5'/%3E%3Cpolygon points='30,50 80,40 60,80' fill='%23e5e3e0'/%3E%3Cpolygon points='0,100 30,50 60,80' fill='%23edebe8'/%3E%3Cpolygon points='60,80 100,100 100,60' fill='%23e8e6e3'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        {/* Form Card — positioned center-left, slight overlap to right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 mx-6 w-full max-w-[440px] rounded-3xl bg-white p-8 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.08)] lg:ml-12 lg:mr-[-60px]"
        >
          {/* Logo row */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Arcgate Logo"
                width={292}
                height={54}
                className="h-[40px] w-auto"
              />
            </div>
            <p className="ml-1 mt-2 text-[14px] font-medium italic text-slate-400">
              Elevating recruitment experiences
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
            {/* Full Name */}
            <div className="group">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="group">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                <input
                  name="mobile"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Email Address{" "}
                <span className="text-[10px] font-normal normal-case opacity-50">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Test Level Dropdown */}
            <div className="group">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Select Your Test Level
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex w-full items-center justify-between rounded-xl border bg-white py-3.5 px-4 text-left text-[15px] outline-none transition-all ${
                    isDropdownOpen
                      ? "border-brand-primary/40 ring-2 ring-brand-primary/10"
                      : "border-slate-200"
                  }`}
                >
                  <span className="font-medium text-slate-800">
                    {levels.find((l) => l.id === formData.testLevel)?.label}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-slate-400 transition-transform ${
                      isDropdownOpen ? "rotate-180 text-brand-primary" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl"
                    >
                      {levels.map((level) => (
                        <button
                          key={level.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              testLevel: level.id,
                            });
                            setIsDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-all ${
                            formData.testLevel === level.id
                              ? "bg-brand-primary/5 text-brand-primary"
                              : "text-slate-600 hover:bg-slate-50"
                          }`}
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

            {/* Submit */}
            <button
              type="submit"
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-primary/20 transition-all hover:bg-brand-hover active:scale-[0.98]"
            >
              <span>Create Account</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <Link
            href="/sign-in"
            className="mt-6 flex items-center justify-center gap-1 text-[13px] text-slate-400 transition-colors hover:text-brand-primary"
          >
            Already have an account?{" "}
            <span className="font-bold text-brand-primary">Sign In</span>
          </Link>
        </motion.div>
      </div>

      {/* ===== RIGHT SIDE — Orange brand panel with parallax bg ===== */}
      <div
        className="hidden lg:flex lg:w-[50%] relative items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#f96331db" }}
      >
        <Image
          src="/ag.svg"
          alt="Arcgate Logo"
          width={433}
          height={454}
          className="absolute"
          style={{
            right: "-230px",
            top: "50%",
            transform: "translateY(-40%)",
            height: "95%",
            width: "auto",
          }}
        />
      </div>
    </div>
  );
}
