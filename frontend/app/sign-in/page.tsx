"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Lock, Phone, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { signInSchema, type SignInFormValues } from "@/lib/validations/auth";
import { useSignIn } from "@/lib/hooks/use-auth";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error)
    return String((error as { message: string }).message);
  return "Invalid value";
}

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("user");
  const [serverError, setServerError] = useState<string | null>(null);

  const signInMutation = useSignIn();

  const form = useForm({
    defaultValues: {
      mobile: "",
      password: "",
      role: role as "user" | "admin",
    } as SignInFormValues,
    validators: {
      onChange: signInSchema,
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const response = await signInMutation.mutateAsync(value);

        // Store auth token and role in cookies
        document.cookie = `role=${response.user?.role ?? value.role}; path=/`;
        document.cookie = `auth_token=${response.access_token}; path=/`;

        const userRole = response.user?.role ?? value.role;
        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/user/dashboard");
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        setServerError(
          error.message ?? "Sign in failed. Please check your credentials.",
        );
      }
    },
  });

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

          {/* Welcome heading */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">Welcome Back</h2>
            <p className="mt-1 text-[13px] text-slate-400">
              Please enter your details to sign in
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
            {/* Role Selection */}
            <form.Field name="role">
              {(field) => (
                <div>
                  <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`flex cursor-pointer items-center justify-center rounded-xl border-2 py-2.5 text-[13px] font-bold transition-all ${
                        field.state.value === "admin"
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                          : "border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        className="hidden"
                        checked={field.state.value === "admin"}
                        onChange={(e) => {
                          field.handleChange(
                            e.target.value as "admin" | "user",
                          );
                          setRole(e.target.value);
                        }}
                      />
                      Admin
                    </label>
                    <label
                      className={`flex cursor-pointer items-center justify-center rounded-xl border-2 py-2.5 text-[13px] font-bold transition-all ${
                        field.state.value === "user"
                          ? "border-brand-primary bg-brand-primary/5 text-brand-primary"
                          : "border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        className="hidden"
                        checked={field.state.value === "user"}
                        onChange={(e) => {
                          field.handleChange(
                            e.target.value as "admin" | "user",
                          );
                          setRole(e.target.value);
                        }}
                      />
                      User
                    </label>
                  </div>
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

            {/* Password */}
            <form.Field name="password">
              {(field) => (
                <div className="group">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Password
                    </label>
                    <Link
                      href="#"
                      className="text-[11px] font-bold text-brand-primary hover:underline"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-slate-300 transition-colors group-focus-within:text-brand-primary" />
                    <input
                      type="password"
                      placeholder="••••••••"
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

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 rounded border-slate-200 text-brand-primary focus:ring-brand-primary"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer text-[13px] font-medium text-slate-500"
              >
                Keep me logged in
              </label>
            </div>

            {/* Submit */}
            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit]}
            >
              {([isSubmitting, canSubmit]) => (
                <button
                  type="submit"
                  disabled={isSubmitting || !canSubmit}
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Signing In…</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              )}
            </form.Subscribe>
          </form>

          <p className="mt-6 text-center text-[13px] text-slate-400">
            New to TalentFlow?{" "}
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-brand-primary hover:underline"
            >
              Create an account <UserPlus className="h-3.5 w-3.5" />
            </Link>
          </p>
        </motion.div>
      </div>

      {/* ===== RIGHT SIDE — Orange brand panel with parallax bg ===== */}
      <div
        className="hidden lg:flex lg:w-[50%]  bg-primary relative items-center justify-center overflow-hidden"
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
