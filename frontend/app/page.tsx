import Image from "next/image";
import { Typography } from "@components/ui-elements/Typography";
import { ThemeToggle } from "@components/ui-elements/ThemeToggle";
import { SignUpForm } from "@features/authforms/SignUpForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen overflow-hidden font-sans bg-brand-primary lg:bg-[#f0eeeb] dark:lg:bg-background">
      <div
        className="hidden lg:block absolute inset-0 z-0 opacity-[0.35] dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpolygon points='0,0 50,15 30,50' fill='%23e8e6e3'/%3E%3Cpolygon points='50,15 100,0 80,40' fill='%23eae8e5'/%3E%3Cpolygon points='30,50 80,40 60,80' fill='%23e5e3e0'/%3E%3Cpolygon points='0,100 30,50 60,80' fill='%23edebe8'/%3E%3Cpolygon points='60,80 100,100 100,60' fill='%23e8e6e3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          width: "50%",
        }}
      />

      <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 bg-brand-primary overflow-hidden">
        <Image
          src="/ag.svg"
          alt="Arcgate Logo"
          width={433}
          height={454}
          className="absolute opacity-20 lg:opacity-100"
          style={{
            right: "-230px",
            top: "50%",
            transform: "translateY(-40%)",
            height: "95%",
            width: "auto",
          }}
          priority
        />
      </div>

      <div className="relative z-10 flex w-full flex-col lg:flex-row items-center justify-center min-h-screen">
        <div className="w-full lg:w-1/2 flex items-center justify-center py-10 relative">
          <div className="relative z-10 mx-auto w-[92%] sm:w-full max-w-[540px] rounded-[0.6rem] bg-white dark:bg-card p-8 sm:p-9 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.18)] opacity-0 animate-card-entry">
            <div className="absolute right-6 top-6 z-20">
              <ThemeToggle />
            </div>
            <div className="mb-6 flex flex-col items-center text-center">
              <Image
                src="/logo.svg"
                alt="Arcgate Logo"
                width={200}
                height={40}
                className="h-[45px] w-auto mb-6"
              />
              <Typography
                variant="h2"
                weight="bold"
                className="text-3xl text-slate-800 dark:text-foreground tracking-tight"
              >
                Create Account
              </Typography>
              <Typography
                variant="body2"
                className="mt-2 text-slate-500 dark:text-muted-foreground font-medium"
              >
                Sign up to get started with ArcInterview
              </Typography>
            </div>

            <SignUpForm />
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/2 h-full" />
      </div>
    </div>
  );
}
