"use client";

import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { ArrowLeft, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function InterviewTestPage() {
  return (
    <div className="min-h-screen bg-[var(--color-layout-bg)] p-8 transition-colors flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="bg-card rounded-3xl p-12 shadow-sm border border-border text-center">
          <div className="h-24 w-24 rounded-full bg-[var(--color-brand-secondary)]/10 text-[var(--color-brand-secondary)] mx-auto flex items-center justify-center mb-8">
            <PlayCircle className="h-12 w-12" />
          </div>
          <Typography
            variant="h2"
            weight="black"
            className="mb-4 text-foreground"
          >
            Interview Test
          </Typography>
          <Typography variant="body1" className="text-muted-foreground mb-10">
            The interview test questions will be loaded here. Are you ready to
            begin your assessment?
          </Typography>

          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <Button size="lg" color="primary" className="w-full">
              Start Test Now
            </Button>
            <Link href="/user/dashboard" className="w-full">
              <Button
                size="lg"
                variant="outline"
                color="default"
                className="w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Go Back
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
