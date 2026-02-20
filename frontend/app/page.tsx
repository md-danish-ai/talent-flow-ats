"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  signUpSchema,
  type SignUpFormValues,
  TEST_LEVELS,
} from "@/lib/validations/auth";
import { useSignUp } from "@/lib/react-query/user/use-auth";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error)
    return String((error as { message: string }).message);
  return "Invalid value";
}

export default function RegisterPage() {
  const router = useRouter();
  const [isTestLevelOpen, setIsTestLevelOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const signUpMutation = useSignUp();

  const form = useForm({
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      testLevel: "fresher",
      role: "user",
    } as SignUpFormValues,
    validators: {
      onChange: signUpSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await signUpMutation.mutateAsync(value);
        router.push("/sign-in");
      } catch (err: unknown) {
        const error = err as { message?: string };
        setServerError(
          error.message ?? "Registration failed. Please try again.",
        );
      }
    },
  });

  const levelLabels: Record<(typeof TEST_LEVELS)[number], string> = {
    fresher: "Fresher",
    QA: "Quality Analyst",
    "team-lead": "Team Lead",
  };
  const levels = TEST_LEVELS.map((id) => ({ id, label: levelLabels[id] }));

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

        {/* Form Card */}
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

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600"
            >
              {serverError}
            </motion.div>
          )}

          {/* Form */}
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            {/* Full Name */}
            <form.Field name="name">
              {(field) => (
                <div className="group">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                    <input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 ${
                        field.state.meta.errors.length > 0
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-[12px] font-medium text-red-500">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            {/* Mobile Number */}
            <form.Field name="mobile">
              {(field) => (
                <div className="group">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                    <input
                      name="mobile"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 ${
                        field.state.meta.errors.length > 0
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-[12px] font-medium text-red-500">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => (
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
                      className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-[15px] text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/10 ${
                        field.state.meta.errors.length > 0
                          ? "border-red-300"
                          : "border-slate-200"
                      }`}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="mt-1 text-[12px] font-medium text-red-500">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            {/* Test Level Dropdown */}
            <form.Field name="testLevel">
              {(field) => (
                <div className="group">
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Select Your Test Level
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsTestLevelOpen(!isTestLevelOpen)}
                      className={`flex w-full items-center justify-between rounded-xl border bg-white py-3.5 px-4 text-left text-[15px] outline-none transition-all ${
                        isTestLevelOpen
                          ? "border-brand-primary/40 ring-2 ring-brand-primary/10"
                          : "border-slate-200"
                      }`}
                    >
                      <span className="font-medium text-slate-800">
                        {levels.find((l) => l.id === field.state.value)?.label}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-400 transition-transform ${
                          isTestLevelOpen ? "rotate-180 text-brand-primary" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isTestLevelOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          className="absolute bottom-full left-0 right-0 z-50 mb-2 overflow-hidden rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl"
                        >
                          {levels.map((level) => (
                            <button
                              key={level.id}
                              type="button"
                              onClick={() => {
                                field.handleChange(level.id);
                                setIsTestLevelOpen(false);
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-[14px] font-semibold transition-all ${
                                field.state.value === level.id
                                  ? "bg-brand-primary/5 text-brand-primary"
                                  : "text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {level.label}
                              {field.state.value === level.id && (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </form.Field>

            {/* Submit */}
            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit]}
            >
              {([isSubmitting, canSubmit]) => (
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Creating Account…</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </form.Subscribe>
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
