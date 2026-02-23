import React from "react";
import { MainCard } from "@components/ui-cards/MainCard";
import { StatCard } from "@components/ui-cards/StatCard";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";

import { DASHBOARD_STATS, RECENT_ACTIVITIES } from "@lib/config/dashboard";

export default function DashboardPage() {
  return (
    <PageContainer className="space-y-10 py-2">
      <PageHeader
        title="System Overview"
        description="Manage applicants, papers and monitor candidate performance."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Secondary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MainCard title="Recent Activity" className="lg:col-span-2">
          <div className="space-y-2">
            {RECENT_ACTIVITIES.map((activity, i) => (
              <ActivityItem
                key={`${activity.user}-${activity.time}-${i}`}
                user={activity.user}
                action={activity.action}
                target={activity.target}
                time={activity.time}
                avatar={activity.avatar}
              />
            ))}
          </div>
        </MainCard>

        <MainCard title="Quick Support" className="lg:col-span-1">
          <div className="space-y-4">
            <Typography variant="body3" className="leading-relaxed font-medium">
              Need help with the new admin system? Our documentation is here to
              help.
            </Typography>
            <Button
              variant="primary"
              color="primary"
              shadow
              className="w-full font-bold"
            >
              Open Documentation
            </Button>
          </div>
        </MainCard>
      </div>
    </PageContainer>
  );
}
