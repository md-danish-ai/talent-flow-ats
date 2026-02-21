"use client";

import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";

export default function UserDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/sign-in");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-12 shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <Typography
                  variant="h2"
                  weight="black"
                  className="text-slate-900"
                >
                  User Dashboard
                </Typography>
                <Typography variant="body2" className="text-slate-500">
                  Welcome back to your workspace
                </Typography>
              </div>
            </div>
            <Button
              variant="ghost"
              color="default"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 font-bold"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100">
            <Typography
              variant="body1"
              weight="bold"
              className="text-orange-900"
            >
              User login in successfully
            </Typography>
            <Typography variant="body2" className="text-orange-600 mt-1">
              You can now browse and apply for new opportunities.
            </Typography>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
