import { Suspense } from "react";
import { Typography } from "@components/ui-elements/Typography";
import { ThemeToggle } from "@components/ui-elements/ThemeToggle";
import { Logo } from "@components/ui-elements/Logo";
import { SignInForm } from "@features/authforms/SignInForm";
import { AuthAnimatedBackground } from "@components/ui-layout/AuthAnimatedBackground";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden font-sans bg-brand-primary lg:bg-[#f0eeeb] dark:lg:bg-background">
      <AuthAnimatedBackground />

      <div className="relative z-10 flex w-full flex-col lg:flex-row items-center justify-center lg:justify-start min-h-screen">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-10 lg:py-0">
          <div className="relative z-10 mx-auto w-[92%] sm:w-full max-w-[440px] rounded-[0.5rem] bg-white dark:bg-card p-7 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] lg:ml-12 lg:mr-[-60px] opacity-0 animate-card-entry">
            <div className="absolute right-6 top-6 z-20">
              <ThemeToggle />
            </div>
            <div className="mb-5">
              <div className="mb-3.5">
                <Logo size="lg" />
              </div>
              <Typography
                variant="h2"
                weight="bold"
                className="text-2xl sm:text-3xl text-black dark:text-white tracking-tight"
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body3"
                className="mt-1 text-black/80 dark:text-white/80 font-medium"
              >
                Please enter your details to sign in
              </Typography>
            </div>

            <Suspense
              fallback={<div className="h-64 animate-pulse bg-muted/20" />}
            >
              <SignInForm />
            </Suspense>
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 h-full" />
      </div>
    </div>
  );
}
