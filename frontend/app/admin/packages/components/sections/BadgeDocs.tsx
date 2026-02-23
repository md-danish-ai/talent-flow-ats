"use client";

import React from "react";
import { Badge } from "@components/ui-elements/Badge";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";
import { Star, Shield, User, Clock } from "lucide-react";

export const BadgeDocs = () => (
  <ComponentPageView
    title="Badge"
    description="Small status indicators used to highlight items or provide quick counts. Badges support multiple colors, fill/outline variants, and rounded/square shapes."
    code={`<Badge variant="fill" color="success">Active</Badge>`}
    fullSource={`import { Badge } from "@components/ui-elements/Badge";
import { Star, Shield, Clock, User } from "lucide-react";

export default function BadgeShowcase() {
  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-wrap gap-4">
        <Badge variant="fill" color="primary">Primary Fill</Badge>
        <Badge variant="outline" color="primary">Primary Outline</Badge>
        <Badge variant="fill" color="success">Success Fill</Badge>
        <Badge variant="outline" color="error">Error Outline</Badge>
      </div>

      <div className="flex flex-wrap gap-4">
        <Badge shape="curve" color="primary">Rounded Badge</Badge>
        <Badge shape="square" color="secondary">Square Badge</Badge>
      </div>

      <div className="flex flex-wrap gap-4">
        <Badge icon={<Shield size={12} />} color="success">Verified</Badge>
        <Badge icon={<Star size={12} />} color="warning">Premium</Badge>
        <Badge icon={<User size={12} />} color="secondary">Admin</Badge>
        <Badge icon={<Clock size={12} />} variant="outline" color="default">Pending</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        <Badge color="primary">Primary</Badge>
        <Badge color="secondary">Secondary</Badge>
        <Badge color="success">Success</Badge>
        <Badge color="warning">Warning</Badge>
        <Badge color="error">Error</Badge>
        <Badge color="default">Default</Badge>
      </div>
    </div>
  );
}`}
  >
    <div className="w-full space-y-12">
      <DocSubSection title="Variants (Fill & Outline)">
        <div className="flex flex-wrap gap-4">
          <Badge variant="fill" color="primary">
            Primary Fill
          </Badge>
          <Badge variant="outline" color="primary">
            Primary Outline
          </Badge>
          <Badge variant="fill" color="success">
            Success Fill
          </Badge>
          <Badge variant="outline" color="success">
            Success Outline
          </Badge>
          <Badge variant="fill" color="error">
            Error Fill
          </Badge>
          <Badge variant="outline" color="error">
            Error Outline
          </Badge>
        </div>
      </DocSubSection>

      <DocSubSection title="Shapes (Curve & Square)">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50">
              Curve (Default)
            </span>
            <div className="flex gap-2">
              <Badge shape="curve" color="primary">
                Status
              </Badge>
              <Badge shape="curve" color="secondary">
                New
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50">
              Square
            </span>
            <div className="flex gap-2">
              <Badge shape="square" color="primary">
                Status
              </Badge>
              <Badge shape="square" color="secondary">
                New
              </Badge>
            </div>
          </div>
        </div>
      </DocSubSection>

      <DocSubSection title="Icon Variations">
        <div className="flex flex-wrap gap-8 items-center">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50">
              Without Icon
            </span>
            <div className="flex gap-2">
              <Badge color="primary">New Post</Badge>
              <Badge color="success">Member</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase opacity-50">
              With Icon
            </span>
            <div className="flex gap-2">
              <Badge icon={<Star size={12} />} color="primary">
                Featured
              </Badge>
              <Badge icon={<Shield size={12} />} color="success">
                Verified
              </Badge>
            </div>
          </div>
        </div>
      </DocSubSection>

      <DocSubSection title="With Icons">
        <div className="flex flex-wrap gap-4">
          <Badge icon={<Shield size={12} />} color="primary">
            Verified
          </Badge>
          <Badge icon={<Star size={12} />} color="warning">
            Premium
          </Badge>
          <Badge icon={<User size={12} />} color="secondary">
            Admin
          </Badge>
          <Badge icon={<Clock size={12} />} variant="outline" color="default">
            Pending
          </Badge>
        </div>
      </DocSubSection>

      <DocSubSection title="Colors">
        <div className="flex flex-wrap gap-4 text-center">
          <Badge color="primary">Primary</Badge>
          <Badge color="secondary">Secondary</Badge>
          <Badge color="success">Success</Badge>
          <Badge color="warning">Warning</Badge>
          <Badge color="error">Error</Badge>
          <Badge color="default">Default</Badge>
        </div>
      </DocSubSection>
    </div>
  </ComponentPageView>
);
