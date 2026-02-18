"use client";

import { motion } from "framer-motion";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F96331] text-white">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  User Dashboard
                </h1>
                <p className="text-slate-500">Welcome back to your workspace</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>

          <div className="rounded-2xl bg-orange-50 p-6 border border-orange-100">
            <p className="text-lg font-bold text-orange-900">
              User login in successfully
            </p>
            <p className="text-orange-600 mt-1">
              You can now browse and apply for new opportunities.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
