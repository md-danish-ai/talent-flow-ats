"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  User2,
  TrendingUp,
  Users,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { resultsApi, type AdminUserResultListItem } from "@lib/api/results";

export function UserResultsClient() {
  const [items, setItems] = useState<AdminUserResultListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await resultsApi.getUserResults(search || undefined);
        setItems(data);
      } catch {
        setError("Failed to fetch user results.");
      } finally {
        setLoading(false);
      }
    };

    void fetchItems();
  }, [search]);

  const usersWithAttempts = useMemo(
    () => items.filter((item) => item.attempts_count > 0).length,
    [items],
  );
  const neverAttemptedUsers = useMemo(
    () => items.filter((item) => item.attempts_count === 0).length,
    [items],
  );

  const statCards = [
    {
      key: "total",
      label: "Total Users",
      value: items.length,
      icon: <Users size={16} />,
      tone: "from-brand-primary/15 to-brand-primary/5",
      iconTone: "bg-brand-primary/15 text-brand-primary",
    },
    {
      key: "attempted",
      label: "Users With Attempts",
      value: usersWithAttempts,
      icon: <TrendingUp size={16} />,
      tone: "from-emerald-500/15 to-emerald-500/5",
      iconTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    },
    {
      key: "pending",
      label: "No Attempt Yet",
      value: neverAttemptedUsers,
      icon: <ShieldCheck size={16} />,
      tone: "from-amber-500/15 to-amber-500/5",
      iconTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    },
  ];

  const renderedItems = useMemo(() => {
    if (items.length === 0) {
      return (
        <div className="rounded-2xl border border-dashed border-border p-10 text-center bg-muted/10">
          <Typography variant="h4">No users found</Typography>
          <Typography variant="body5" className="mt-1">
            Try another keyword to search by name, mobile, or email.
          </Typography>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {items.map((item) => {
          const latest = item.latest_attempt;
          const statusColor = latest
            ? latest.status === "auto_submitted"
              ? "warning"
              : latest.status === "submitted"
                ? "success"
                : "default"
            : "default";

          return (
            <div
              key={item.user_id}
              className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-background to-muted/10 p-5 transition-all hover:-translate-y-0.5 hover:border-brand-primary/35 hover:shadow-md"
            >
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand-primary/70 to-brand-primary/20 opacity-60 transition-opacity group-hover:opacity-100" />
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <Typography variant="h4" className="text-foreground flex items-center gap-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary/25 to-brand-primary/10 text-xs font-bold text-brand-primary ring-1 ring-brand-primary/20">
                      {item.username?.[0]?.toUpperCase() || "U"}
                    </span>
                    {item.username}
                  </Typography>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" color="default" icon={<Phone size={12} />}>
                      {item.mobile}
                    </Badge>
                    <Badge variant="outline" color="default" icon={<User2 size={12} />}>
                      Attempts: {item.attempts_count}
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-2 md:items-end md:text-right">
                  {latest ? (
                    <>
                      <Badge variant="outline" color={statusColor}>
                        {latest.status}
                      </Badge>
                      <Typography variant="body5" className="text-muted-foreground">
                        Attempted: {latest.attempted_count}/{latest.total_questions}
                      </Typography>
                    </>
                  ) : (
                    <Badge variant="outline" color="default">
                      No attempt yet
                    </Badge>
                  )}

                  <Link href={`/admin/results/user-results/${item.user_id}`}>
                    <Button
                      size="sm"
                      variant="outline"
                      color="default"
                      endIcon={<ArrowRight size={14} />}
                    >
                      View Attempts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [items]);

  return (
    <PageContainer className="py-2 space-y-5">
      <PageHeader
        title="User Result"
        description="View interview attempt summary for each user."
      />

      <div className="rounded-2xl border border-border bg-gradient-to-r from-brand-primary/10 via-background to-background p-5">
        <div className="flex flex-col gap-1">
          <Typography variant="h4" className="text-foreground">
            Interview Result Center
          </Typography>
          <Typography variant="body5">
            Track user progress, review latest status, and open complete attempt history.
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.key}
            className={`rounded-2xl border border-border bg-gradient-to-br ${stat.tone} p-4`}
          >
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${stat.iconTone}`}>{stat.icon}</div>
              <div>
                <Typography variant="body5">{stat.label}</Typography>
                <Typography variant="h3">{stat.value}</Typography>
              </div>
            </div>
          </div>
        ))}
      </div>

      <MainCard
        title="Interview Users"
        className="overflow-hidden"
        action={
          <div className="w-full sm:w-72">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name/mobile/email"
              startIcon={<Search size={16} />}
            />
          </div>
        }
        bodyClassName="space-y-4"
      >
        {loading && (
          <div className="rounded-xl border border-border bg-muted/20 p-5">
            <Typography variant="body4">Loading users...</Typography>
          </div>
        )}
        {error && <Alert variant="error" description={error} />}
        {!loading && !error && renderedItems}
      </MainCard>
    </PageContainer>
  );
}
