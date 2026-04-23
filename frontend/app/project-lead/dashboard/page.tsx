"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Zap,
  Clock,
  Bell,
  BookOpen,
  ArrowRight,
} from "lucide-react";

import { MainCard } from "@components/ui-cards/MainCard";
import { StatCard } from "@components/ui-cards/StatCard";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

import { DASHBOARD_STATS, RECENT_ACTIVITIES } from "@lib/config/dashboard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

export default function ProjectLeadDashboardPage() {
  // Mapping icons and colors to static stats for better UI
  const getStatConfig = (index: number) => {
    const configs = [
      { icon: <Users />, color: "text-blue-500", bgColor: "bg-blue-500/10" },
      {
        icon: <FileText />,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
      },
      { icon: <Zap />, color: "text-amber-500", bgColor: "bg-amber-500/10" },
    ];
    return configs[index] || configs[0];
  };

  return (
    <PageContainer className="space-y-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography variant="h2" className="font-black tracking-tight">
            Dashboard
          </Typography>
          <Typography
            variant="body3"
            className="text-muted-foreground font-medium mt-1"
          >
            Welcome back! Here&apos;s an overview of your managed activities.
          </Typography>
        </motion.div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {DASHBOARD_STATS.map((stat, idx) => {
          const config = getStatConfig(idx);
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={config.icon}
                color={config.color}
                bgColor={config.bgColor}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MainCard
            title={
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-brand-primary" />
                <Typography
                  variant="h4"
                  weight="black"
                  className="uppercase tracking-widest pt-0.5"
                >
                  Recent Activity
                </Typography>
              </div>
            }
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              {RECENT_ACTIVITIES.map((activity, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <ActivityItem
                    icon={
                      activity.avatar === "MJ" ? (
                        <Users size={18} />
                      ) : (
                        <FileText size={18} />
                      )
                    }
                    title={activity.user}
                    description={`${activity.action} ${activity.target}`}
                    time={activity.time}
                    color={
                      activity.avatar === "MJ"
                        ? "text-blue-500"
                        : "text-emerald-500"
                    }
                  />
                </motion.div>
              ))}
              <button className="w-full py-5 mt-4 text-xs font-black uppercase tracking-widest text-brand-primary hover:bg-muted/30 transition-all border-t border-border rounded-b-3xl flex items-center justify-center gap-2">
                View all activities <ArrowRight size={14} />
              </button>
            </motion.div>
          </MainCard>
        </div>

        <div className="lg:col-span-1">
          <MainCard
            title={
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-amber-500" />
                <Typography
                  variant="h4"
                  weight="black"
                  className="uppercase tracking-widest pt-0.5"
                >
                  Quick Support
                </Typography>
              </div>
            }
          >
            <div className="space-y-6 p-1">
              <div className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                <Typography
                  variant="body3"
                  className="leading-relaxed font-medium text-muted-foreground"
                >
                  Need help with the project lead system? Our documentation
                  covers everything from candidate management to result
                  analysis.
                </Typography>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  color="primary"
                  shadow
                  animate="scale"
                  fullWidth
                  className="font-bold py-6 rounded-2xl"
                  startIcon={<BookOpen size={18} />}
                >
                  Open Docs
                </Button>

                <Typography
                  variant="body5"
                  className="text-center font-bold uppercase tracking-widest text-muted-foreground/40 pt-2"
                >
                  v2.4.0 Extended Support
                </Typography>
              </div>
            </div>
          </MainCard>
        </div>
      </div>
    </PageContainer>
  );
}
