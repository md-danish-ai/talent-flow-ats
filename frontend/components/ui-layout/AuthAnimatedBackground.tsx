"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export const AuthAnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ========================================================================= */}
      {/* 1. LEFT SECTION (FORM SIDE ON DESKTOP) */}
      {/* ========================================================================= */}
      <div className="absolute left-0 top-0 h-full w-full lg:w-1/2 overflow-hidden pointer-events-none">
        {/* Soft Conical Top Spotlight Glow */}
        <div className="hidden lg:block absolute -top-40 left-10 w-[550px] h-[550px] rounded-full bg-gradient-to-b from-brand-primary/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

        {/* Modern Architectural Geometric Tech Grid with Radial Fade */}
        <div
          className="hidden lg:block absolute inset-0 z-0 opacity-[0.45] dark:opacity-[0.22]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(249, 99, 49, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(249, 99, 49, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, black 40%, transparent 85%)",
          }}
        />

        {/* Illuminated Grid Intersection Crosshairs (+) */}
        <div
          className="hidden lg:block absolute inset-0 z-0 opacity-[0.3] dark:opacity-[0.2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='44' height='44' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M22 18v8M18 22h8' stroke='%23f96331' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(ellipse at 50% 50%, black 50%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 50%, black 50%, transparent 90%)",
          }}
        />

        {/* Luminous Neural Constellation Network (SVG Connected Nodes) */}
        <svg
          className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="nodeLineGrad1"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f96331" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#fb923c" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#f96331" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient
              id="nodeLineGrad2"
              x1="100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#f96331" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f96331" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <line
            x1="80"
            y1="140"
            x2="220"
            y2="240"
            stroke="url(#nodeLineGrad1)"
            strokeWidth="1.5"
            className="opacity-60"
          />
          <line
            x1="220"
            y1="240"
            x2="140"
            y2="420"
            stroke="url(#nodeLineGrad2)"
            strokeWidth="1.5"
            className="opacity-50"
          />
          <line
            x1="140"
            y1="420"
            x2="80"
            y2="640"
            stroke="url(#nodeLineGrad1)"
            strokeWidth="1.5"
            className="opacity-60"
          />
          <line
            x1="140"
            y1="420"
            x2="280"
            y2="560"
            stroke="url(#nodeLineGrad2)"
            strokeWidth="1.5"
            className="opacity-50"
          />
        </svg>

        {/* Pulsing Neural Constellation Nodes */}
        {[
          { left: "80px", top: "140px", size: 8, dur: 4.5, delay: 0 },
          { left: "220px", top: "240px", size: 10, dur: 5.2, delay: 1.2 },
          { left: "140px", top: "420px", size: 9, dur: 4.8, delay: 2.1 },
          { left: "80px", top: "640px", size: 8, dur: 5.8, delay: 0.7 },
          { left: "280px", top: "560px", size: 10, dur: 6.2, delay: 1.8 },
        ].map((node, idx) => (
          <motion.div
            key={`node-${idx}`}
            style={{
              position: "absolute",
              left: node.left,
              top: node.top,
              width: node.size,
              height: node.size,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: node.dur,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden lg:block rounded-full bg-brand-primary shadow-[0_0_10px_#f96331]"
          />
        ))}

        {/* Ambient Glows on Left Side */}
        <div className="hidden lg:block absolute top-[-70px] left-[-90px] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-primary/20 via-orange-500/10 to-transparent blur-3xl" />
        <div className="hidden lg:block absolute bottom-[-90px] right-[10%] w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-rose-500/15 via-brand-primary/15 to-transparent blur-3xl" />

        {/* Floating Subtle Glass Prisms on Left */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, 8, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden xl:block absolute top-[18%] left-[6%] w-14 h-14 rounded-2xl bg-white/10 dark:bg-white/[0.04] backdrop-blur-sm border border-brand-primary/20 dark:border-white/10 shadow-sm"
        />

        <motion.div
          animate={{
            y: [0, 14, 0],
            rotate: [0, -8, 0],
          }}
          transition={{
            duration: 11,
            delay: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="hidden xl:block absolute bottom-[20%] left-[8%] w-16 h-16 rounded-full bg-white/10 dark:bg-white/[0.04] backdrop-blur-sm border border-brand-primary/20 dark:border-white/10 shadow-sm"
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT SECTION (BRAND PRIMARY SIDE / FULL SCREEN ON MOBILE) */}
      {/* ========================================================================= */}
      <div className="absolute right-0 top-0 h-full w-full lg:w-1/2 bg-brand-primary overflow-hidden pointer-events-none">
        {/* Dynamic Radiant Mesh Glows */}
        <div className="absolute -top-32 -right-24 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-white/30 via-amber-200/20 to-transparent blur-3xl" />
        <div className="absolute top-[30%] -left-36 w-[580px] h-[580px] rounded-full bg-gradient-to-tr from-orange-950/40 via-amber-400/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-36 right-6 w-[600px] h-[600px] rounded-full bg-gradient-to-t from-orange-900/50 via-rose-500/20 to-transparent blur-3xl" />

        {/* Smooth Luminous Wave Ribbons (Solid Glowing Light Beams - Clean SVG) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none hidden md:block opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="70%" stopColor="#fed7aa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Smooth Continuous Ambient Curves */}
          <path
            d="M -100 280 C 180 160, 420 480, 900 320"
            fill="none"
            stroke="url(#waveGrad1)"
            strokeWidth="2.5"
          />
          <path
            d="M -100 620 C 240 460, 460 800, 900 640"
            fill="none"
            stroke="url(#waveGrad2)"
            strokeWidth="2"
          />
        </svg>

        {/* Sleek Precision Solid Orbital Halos with Orbiting Light Flares */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-130px] top-[18%] w-[600px] h-[600px] rounded-full border border-white/25 pointer-events-none hidden md:block"
        >
          {/* Glowing Orbiting Lens Bead */}
          <span className="absolute top-[8%] left-[12%] w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#ffffff]" />
        </motion.div>

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-75px] top-[24%] w-[460px] h-[460px] rounded-full border border-white/30 pointer-events-none hidden md:block"
        >
          {/* Glowing Amber Light Bead */}
          <span className="absolute bottom-[10%] right-[14%] w-3.5 h-3.5 rounded-full bg-amber-200 shadow-[0_0_10px_#fde68a]" />
        </motion.div>

        <div className="absolute right-[-20px] top-[30%] w-[320px] h-[320px] rounded-full border border-white/20 pointer-events-none hidden md:block" />

        {/* Floating Glossy 3D Glass Orbs */}
        {[
          { top: "16%", right: "24%", size: 48, delay: 0, dur: 7 },
          { top: "72%", left: "18%", size: 38, delay: 1.2, dur: 8.5 },
          { top: "44%", right: "42%", size: 32, delay: 2.4, dur: 6.8 },
          { top: "84%", right: "28%", size: 42, delay: 0.8, dur: 7.8 },
        ].map((orb, idx) => (
          <motion.div
            key={`glass-orb-${idx}`}
            style={{
              position: "absolute",
              top: orb.top,
              right: orb.right,
              left: orb.left,
              width: orb.size,
              height: orb.size,
            }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.7, 0.95, 0.7],
            }}
            transition={{
              duration: orb.dur,
              delay: orb.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-full bg-gradient-to-br from-white/30 via-white/10 to-transparent border border-white/40 shadow-sm hidden md:block"
          >
            {/* Top-left internal glass reflection highlight */}
            <div className="absolute top-1.5 left-2 w-2.5 h-1.5 rounded-full bg-white/70 rotate-[-25deg]" />
          </motion.div>
        ))}

        {/* Twinkling 4-Point Starburst Lens Flares */}
        {[
          { top: "12%", left: "28%", size: 24, dur: 4.2, delay: 0 },
          { top: "28%", right: "18%", size: 28, dur: 5.0, delay: 1.5 },
          { top: "62%", left: "32%", size: 22, dur: 4.6, delay: 0.8 },
          { top: "80%", right: "16%", size: 26, dur: 5.4, delay: 2.2 },
        ].map((star, idx) => (
          <motion.div
            key={`star-${idx}`}
            style={{
              position: "absolute",
              top: star.top,
              left: star.left,
              right: star.right,
              width: star.size,
              height: star.size,
            }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.95, 0.4],
            }}
            transition={{
              duration: star.dur,
              delay: star.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </motion.div>
        ))}

        {/* Soft Diagonal Shimmer Sheen */}
        <motion.div
          animate={{
            x: ["-120%", "220%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 4,
          }}
          className="absolute inset-0 w-2/3 bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transform -skew-x-12 pointer-events-none"
        />

        {/* Arcgate Logo with Smooth Floating / Bouncing Motion */}
        <motion.div
          animate={{
            y: ["-42%", "-38%", "-42%"],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-230px] top-[50%] h-[95%] w-auto select-none pointer-events-none will-change-transform"
        >
          <Image
            src="/ag.svg"
            alt="Arcgate Logo"
            width={433}
            height={454}
            className="opacity-20 lg:opacity-100 h-full w-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.25)]"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
};
