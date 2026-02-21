"use client";

import React from "react";
import { StatCard } from "@components/ui-cards/StatCard";
import { User } from "lucide-react";
import { ComponentPageView } from "../ComponentPageView";

export const StatDocs = () => (
  <ComponentPageView
    title="Stat Card"
    description="A visual metric display used primarily on dashboards for quick analytical insights."
    code={`<StatCard label="Label" value="Value" />`}
    fullSource={`import { StatCard } from "@components/ui-cards/StatCard";
import { User } from "lucide-react";

export default function StatsDemo() {
  return <StatCard label="Total Candidates" value="2,482" change="+15.2%" icon={<User size={20} />} />;
}`}
  >
    <div className="w-full max-w-sm">
      <StatCard
        label="Total Candidates"
        value="2,482"
        change="+15.2%"
        icon={<User size={20} />}
      />
    </div>
  </ComponentPageView>
);
