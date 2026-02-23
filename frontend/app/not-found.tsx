"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";
import Link from "next/link";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0eeeb] dark:bg-background px-6 font-sans overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.4] dark:opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpolygon points='0,0 50,15 30,50' fill='%23e8e6e3'/%3E%3Cpolygon points='50,15 100,0 80,40' fill='%23eae8e5'/%3E%3Cpolygon points='30,50 80,40 60,80' fill='%23e5e3e0'/%3E%3Cpolygon points='0,100 30,50 60,80' fill='%23edebe8'/%3E%3Cpolygon points='60,80 100,100 100,60' fill='%23e8e6e3'/%3E%3C/svg%3E")`,
          backgroundSize: "250px 250px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
            scale: {
              type: "spring",
              damping: 12,
              stiffness: 100,
              restDelta: 0.001,
            },
          }}
          className="relative"
        >
          <Typography
            as="h1"
            variant="h1"
            className="text-[12rem] font-black leading-none text-white dark:text-white/10 drop-shadow-2xl lg:text-[18rem]"
          >
            404
          </Typography>
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -right-4 top-1/2 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand-primary p-4 shadow-2xl shadow-brand-primary/40 lg:-right-12 lg:h-32 lg:w-32"
          >
            <Search className="h-12 w-12 text-white lg:h-16 lg:w-16" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="-mt-8 lg:-mt-12"
        >
          <Typography
            variant="h2"
            className="text-3xl font-bold text-slate-800 dark:text-foreground lg:text-5xl"
          >
            Lost in candidates?
          </Typography>
          <Typography
            variant="body1"
            className="mt-4 max-w-md font-medium text-slate-500 dark:text-muted-foreground lg:text-xl"
          >
            The page you are looking for has been moved, deleted, or never
            existed in our database.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 flex flex-col gap-4 sm:flex-row"
        >
          <Link href="/">
            <Button
              variant="primary"
              color="primary"
              size="lg"
              className="w-full sm:w-auto font-bold px-8"
              startIcon={<Home className="h-5 w-5" />}
            >
              Go to Home
            </Button>
          </Link>
          <Button
            variant="outline"
            color="primary"
            size="lg"
            className="w-full sm:w-auto font-bold px-8 bg-transparent"
            onClick={() => window.history.back()}
            startIcon={
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            }
          >
            Go Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20"
        >
          <Typography
            variant="body3"
            className="font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500"
          >
            TalentFlow ATS
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}
