import Image from "next/image";
import { Typography } from "@components/ui-elements/Typography";
import { SignUpForm } from "@components/features/authforms/SignUpForm";

export default function RegisterPage() {
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

        {/* Content Container */}
        <div className="relative z-10 w-full flex flex-col items-center">
          {/* THE CARD — Kept in Page for SSR Performance */}
          <div className="relative z-10 mx-6 w-full max-w-[440px] rounded-3xl bg-white p-8 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.08)] lg:ml-12 lg:mr-[-60px] opacity-0 animate-card-entry">
            {/* Logo row */}
            <div className="mb-4">
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

            {/* Welcome heading */}
            <div className="mb-4">
              <Typography
                variant="h2"
                weight="bold"
                className="text-xl text-slate-800"
              >
                Create Account
              </Typography>
              <Typography variant="body3" className="mt-1 text-slate-400">
                Sign up to get started with ArcInterview
              </Typography>
            </div>

            <SignUpForm />
          </div>
        </div>
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
          priority
        />
      </div>
    </div>
  );
}
