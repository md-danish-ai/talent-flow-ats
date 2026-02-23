"use client";

import { motion } from "framer-motion";
import { LogOut, User, FileText, PlayCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import Link from "next/link";
import { Card } from "@components/ui-cards/Card";

export default function UserDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-background p-8 transition-colors">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-card p-10 shadow-sm border border-border transition-colors mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20">
              <User className="h-7 w-7" />
            </div>
            <div>
              <Typography
                variant="h2"
                weight="black"
                className="text-foreground"
              >
                Welcome back!
              </Typography>
              <Typography
                variant="body1"
                className="text-muted-foreground mt-1"
              >
                Complete your details or start your interview test.
              </Typography>
            </div>
          </div>
          <Button
            variant="ghost"
            color="default"
            size="md"
            onClick={handleLogout}
            className="flex items-center gap-2 font-bold"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/user/personal-details"
              className="block h-full cursor-pointer group"
            >
              <Card className="h-full flex flex-col justify-center items-center p-12 hover:border-brand-primary transition-all duration-300 group-hover:shadow-xl group-hover:shadow-brand-primary/10">
                <div className="h-20 w-20 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-10 w-10" />
                </div>
                <Typography
                  variant="h3"
                  weight="extrabold"
                  className="mb-3 text-center"
                >
                  Personal Details
                </Typography>
                <Typography
                  variant="body1"
                  className="text-muted-foreground text-center mb-8"
                >
                  Update your timeline, personal info, education, and work
                  experience.
                </Typography>
                <div className="flex items-center gap-2 text-brand-primary font-bold">
                  Update Now{" "}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/user/interview-test"
              className="block h-full cursor-pointer group"
            >
              <Card className="h-full flex flex-col justify-center items-center p-12 hover:border-secondary transition-all duration-300 group-hover:shadow-xl group-hover:border-[var(--color-brand-secondary)] group-hover:shadow-[var(--color-brand-secondary)]/10">
                <div className="h-20 w-20 rounded-full bg-[var(--color-brand-secondary)]/10 flex items-center justify-center text-[var(--color-brand-secondary)] mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="h-10 w-10" />
                </div>
                <Typography
                  variant="h3"
                  weight="extrabold"
                  className="mb-3 text-center"
                >
                  Start Test
                </Typography>
                <Typography
                  variant="body1"
                  className="text-muted-foreground text-center mb-8"
                >
                  Begin your interview assessment test when you are ready.
                </Typography>
                <div className="flex items-center gap-2 text-[var(--color-brand-secondary)] font-bold">
                  Begin Test{" "}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
