"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  Users,
  Phone,
  ArrowRight,
  User2,
  CheckCircle2,
  CircleAlert,
  TrendingUp,
  LayoutDashboard,
  Filter,
  RefreshCcw,
  UserCheck,
  UserX,
  History,
} from "lucide-react";

import { ResultCard } from "@components/ui-cards/ResultCard";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Badge } from "@components/ui-elements/Badge";
import { Alert } from "@components/ui-elements/Alert";
import { Button } from "@components/ui-elements/Button";
import { resultsApi, type AdminUserResultListItem } from "@lib/api/results";

export function UserResultsClient() {
  const [items, setItems] = useState<AdminUserResultListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) setLoading(true);
        setError(null);
        const data = await resultsApi.getUserResults(search || undefined);
        setItems(data);
      } catch {
        setError("Failed to fetch user results. Please try again.");
      } finally {
        if (!isRefresh) setLoading(false);
      }
    },
    [search],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchItems();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const stats = useMemo(() => {
    const total = items.length;
    const attempted = items.filter((item) => item.attempts_count > 0).length;
    const pending = total - attempted;

    return [
      {
        label: "Total Candidates",
        value: total,
        icon: <Users size={20} />,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10",
        border: "border-brand-primary/20",
        trend: "Total registered",
      },
      {
        label: "Active Attempts",
        value: attempted,
        icon: <UserCheck size={20} />,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        trend: `${total > 0 ? ((attempted / total) * 100).toFixed(0) : 0}% Engagement`,
      },
      {
        label: "Pending Review",
        value: pending,
        icon: <UserX size={20} />,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        trend: "Awaiting first session",
      },
    ];
  }, [items]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-44 bg-muted rounded-2xl border border-border"
        />
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed border-border bg-muted/5">
      <div className="p-4 rounded-full bg-muted/20 mb-4">
        <Users size={40} className="text-muted-foreground/40" />
      </div>
      <Typography variant="h4" className="font-bold">
        No results found
      </Typography>
      <Typography
        variant="body4"
        className="text-muted-foreground mt-2 text-center max-w-sm"
      >
        We couldn&apos;t find any candidates matching &quot;{search}&quot;. Try
        searching with a different name or phone number.
      </Typography>
      <Button variant="outline" className="mt-6" onClick={() => setSearch("")}>
        Clear Search
      </Button>
    </div>
  );

  return (
    <PageContainer className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary">
            <LayoutDashboard size={18} />
            <Typography
              variant="body5"
              className="font-bold uppercase tracking-widest text-[10px]"
            >
              Admin Dashboard
            </Typography>
          </div>
          <Typography variant="h2" className="font-black tracking-tight">
            Interview Results
          </Typography>
          <Typography
            variant="body5"
            className="text-muted-foreground max-w-md"
          >
            Manage candidate performance, track interview progress, and generate
            detailed assessment reports.
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            color="primary"
            size="sm"
            className="shadow-sm"
            onClick={() => void fetchItems(true)}
            startIcon={<RefreshCcw size={14} />}
          >
            Refresh
          </Button>
          <Button
            color="primary"
            size="sm"
            className="shadow-lg shadow-brand-primary/20"
            startIcon={<TrendingUp size={14} />}
          >
            Performance analytics
          </Button>
        </div>
      </div>

      {/* Modern Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
          >
            <div className="relative z-10 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-wider text-muted-foreground/80 truncate"
                >
                  {stat.label}
                </Typography>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <Typography variant="h2" className="font-black leading-none">
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground font-medium truncate"
                  >
                    {stat.trend}
                  </Typography>
                </div>
              </div>
            </div>
            <div
              className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-40 transition-opacity group-hover:opacity-60`}
            />
          </div>
        ))}
      </div>

      {/* Main Content & Search */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-muted/10 p-2 rounded-2xl border border-border/50">
          <div className="w-full md:w-96 relative">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate name, phone, or email..."
              className="rounded-xl border-none bg-card shadow-sm h-11"
              startIcon={<Search size={18} className="text-muted-foreground" />}
            />
          </div>

          <div className="flex items-center gap-2 pr-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-muted-foreground"
            >
              <Filter size={16} className="mr-2" />
              Advanced Filters
            </Button>
            <div className="h-6 w-px bg-border/60 mx-1 hidden md:block" />
            <Badge
              variant="outline"
              color="default"
              className="font-black text-[10px]"
            >
              {items.length} RESULTS
            </Badge>
          </div>
        </div>

        {error && <Alert variant="error" description={error} />}

        {loading ? (
          <LoadingSkeleton />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {items.map((item) => {
              const latest = item.latest_attempt;

              return (
                <ResultCard
                  key={item.user_id}
                  title={item.username || "Anonymous Candidate"}
                  avatarContent={item.username?.[0]?.toUpperCase() || "A"}
                  identityIcon={User2}
                  status={latest?.status || "not_started"}
                  subtitle={
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                        <Phone size={13} className="text-brand-primary/60" />
                        {item.mobile}
                      </div>
                      <div className="h-1 w-1 rounded-full bg-border" />
                      <div className="flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground">
                        <History size={13} className="text-brand-primary/60" />
                        {item.attempts_count} Sessions
                      </div>
                    </div>
                  }
                  metrics={[
                    {
                      label: "Total Questions",
                      value: latest?.total_questions || "N/A",
                      icon: History,
                      color: "text-brand-primary",
                    },
                    {
                      label: "Completion",
                      value: latest
                        ? `${latest.attempted_count}/${latest.total_questions}`
                        : "0/0",
                      icon: CheckCircle2,
                      color: "text-emerald-500",
                    },
                    {
                      label: "Missed",
                      value: latest?.unattempted_count || 0,
                      icon: CircleAlert,
                      color: "text-rose-500",
                    },
                  ]}
                  actionHref={`/admin/results/${item.user_id}`}
                  actionLabel="View Result"
                  actionIcon={ArrowRight}
                />
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
