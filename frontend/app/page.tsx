"use client";

import { motion } from "framer-motion";
import { ChevronRight, Loader2, Mail, Phone, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Input } from "@components/ui-elements/Input";
import {
  signUpSchema,
  type SignUpFormValues,
  TEST_LEVELS,
} from "@lib/validations/auth";
import { useSignUp } from "@lib/react-query/user/use-auth";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error)
    return String((error as { message: string }).message);
  return "Invalid value";
}

export default function RegisterPage() {
  const router = useRouter();
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
            <Typography
              variant="body3"
              italic
              className="ml-1 mt-2 text-slate-400"
            >
              Elevating recruitment experiences
            </Typography>
          </div>

          {/* Server Error */}
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-small font-medium text-red-600"
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
                  <Typography
                    as="label"
                    variant="h6"
                    className="mb-1.5 block uppercase tracking-wider text-slate-500"
                  >
                    Full Name
                  </Typography>
                  <div className="relative">
                    <Input
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      startIcon={<User className="h-[18px] w-[18px]" />}
                      error={field.state.meta.errors.length > 0}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <Typography
                        variant="body5"
                        className="mt-1 font-medium text-red-500"
                      >
                        {getErrorMessage(field.state.meta.errors[0])}
                      </Typography>
                    )}
                </div>
              )}
            </form.Field>

            {/* Mobile Number */}
            <form.Field name="mobile">
              {(field) => (
                <div className="group">
                  <Typography
                    as="label"
                    variant="h6"
                    className="mb-1.5 block uppercase tracking-wider text-slate-500"
                  >
                    Mobile Number
                  </Typography>
                  <div className="relative">
                    <Input
                      name="mobile"
                      type="tel"
                      placeholder="+91 98765 43210"
                      startIcon={<Phone className="h-[18px] w-[18px]" />}
                      error={field.state.meta.errors.length > 0}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <Typography
                        variant="body5"
                        className="mt-1 font-medium text-red-500"
                      >
                        {getErrorMessage(field.state.meta.errors[0])}
                      </Typography>
                    )}
                </div>
              )}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => (
                <div className="group">
                  <Typography
                    as="label"
                    variant="h6"
                    className="mb-1.5 block uppercase tracking-wider text-slate-500"
                  >
                    Email Address{" "}
                    <Typography
                      variant="body5"
                      as="span"
                      className="font-normal normal-case opacity-50"
                    >
                      (optional)
                    </Typography>
                  </Typography>
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      startIcon={<Mail className="h-[18px] w-[18px]" />}
                      error={field.state.meta.errors.length > 0}
                      value={field.state.value ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <Typography
                        variant="body5"
                        className="mt-1 font-medium text-red-500"
                      >
                        {getErrorMessage(field.state.meta.errors[0])}
                      </Typography>
                    )}
                </div>
              )}
            </form.Field>

            {/* Test Level Dropdown */}
            <form.Field name="testLevel">
              {(field) => (
                <div className="group">
                  <Typography
                    as="label"
                    variant="h6"
                    className="mb-1.5 block uppercase tracking-wider text-slate-500"
                  >
                    Select Your Test Level
                  </Typography>
                  <SelectDropdown
                    options={levels}
                    value={field.state.value}
                    onChange={(val) =>
                      field.handleChange(val as (typeof TEST_LEVELS)[number])
                    }
                    placement="top"
                  />
                </div>
              )}
            </form.Field>

            <form.Subscribe
              selector={(state) => [state.isSubmitting, state.canSubmit]}
            >
              {([isSubmitting, canSubmit]) => (
                <Button
                  type="submit"
                  variant="primary"
                  color="primary"
                  shadow
                  disabled={isSubmitting || !canSubmit}
                  animate="scale"
                  className="w-full py-3.5 text-medium font-bold mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin text-white" />
                      <Typography
                        variant="span"
                        weight="bold"
                        className="text-white"
                      >
                        Creating Account…
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        variant="span"
                        weight="bold"
                        className="text-white"
                      >
                        Create Account
                      </Typography>
                      <ChevronRight className="h-5 w-5 text-white transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              )}
            </form.Subscribe>
          </form>

          <Link
            href="/sign-in"
            className="mt-6 flex items-center justify-center gap-1 text-small text-slate-400 transition-colors hover:text-brand-primary"
          >
            Already have an account?{" "}
            <Typography
              variant="body3"
              weight="bold"
              as="span"
              className="text-brand-primary"
            >
              Sign In
            </Typography>
          </Link>
        </motion.div>
      </div>

      {/* ===== RIGHT SIDE — Orange brand panel with parallax bg ===== */}
      <div className="hidden lg:flex w-1/2 relative bg-brand-primary flex-col items-center justify-center p-12 overflow-hidden">
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
