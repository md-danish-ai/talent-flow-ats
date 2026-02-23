import Image from "next/image";
import { Typography } from "@components/ui-elements/Typography";
import { SignUpForm } from "@components/features/authforms/SignUpForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen overflow-hidden font-sans bg-brand-primary lg:bg-[#f0eeeb] dark:lg:bg-background">
      {/* ===== DESKTOP ONLY — Faceted background for the left side ===== */}
      <div
        className="hidden lg:block absolute inset-0 z-0 opacity-[0.35] dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpolygon points='0,0 50,15 30,50' fill='%23e8e6e3'/%3E%3Cpolygon points='50,15 100,0 80,40' fill='%23eae8e5'/%3E%3Cpolygon points='30,50 80,40 60,80' fill='%23e5e3e0'/%3E%3Cpolygon points='0,100 30,50 60,80' fill='%23edebe8'/%3E%3Cpolygon points='60,80 100,100 100,60' fill='%23e8e6e3'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
          width: "50%",
        }}
      />

      {/* ===== ORANGE PANEL — Always visible, full width on mobile, half on desktop ===== */}
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

      {/* ===== CONTENT LAYER — Card centered on mobile, positioned on desktop ===== */}
      <div className="relative z-10 flex w-full flex-col lg:flex-row items-center justify-center lg:justify-start min-h-screen">
        {/* Left padding/space on desktop to align the card to the faceted side */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center py-10 lg:py-0">
          {/* THE CARD */}
          <div className="relative z-10 mx-auto w-[92%] sm:w-full max-w-[440px] rounded-[2.5rem] bg-white dark:bg-card p-7 sm:p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] lg:ml-12 lg:mr-[-60px] opacity-0 animate-card-entry">
            {/* Logo row */}
            <div className="mb-6">
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
                className="ml-1 mt-2 text-slate-400 dark:text-slate-400/80"
              >
                Elevating recruitment experiences
              </Typography>
            </div>

            {/* Welcome heading */}
            <div className="mb-6">
              <Typography
                variant="h2"
                weight="bold"
                className="text-2xl text-slate-800 dark:text-foreground"
              >
                Create Account
              </Typography>
              <Typography
                variant="body3"
                className="mt-1 text-slate-400 dark:text-muted-foreground"
              >
                Sign up to get started with ArcInterview
              </Typography>
            </div>

            <SignUpForm />
          </div>
        </div>

        {/* Empty right side on desktop - card is already overlapping from the left side */}
        <div className="hidden lg:block lg:w-1/2 h-full" />
      </div>
    </div>
  );
}
