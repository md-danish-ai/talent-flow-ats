"use client";

import React from "react";
import { Alert } from "@components/ui-elements/Alert";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";
import { ShieldCheck, Zap } from "lucide-react";

export const AlertDocs = () => (
  <ComponentPageView
    title="Alert"
    description="Contextual feedback messages for user actions. Alerts provide a high-visibility way to communicate success, errors, warnings, and general information with a clean, low-profile design."
    code={`<Alert variant="success" description="Data saved successfully!" />`}
    fullSource={`import { Alert } from "@components/ui-elements/Alert";
import { Zap } from "lucide-react";

export default function AlertShowcase() {
  return (
    <div className="space-y-4">
      <Alert 
        variant="success" 
        title="Payment Success" 
        description="Your transaction has been processed and your account is updated." 
      />
      <Alert 
        variant="error" 
        title="Connection Failed" 
        description="We were unable to reach the server. Please check your internet connection." 
      />
      <Alert 
        variant="info" 
        description="A new version of the dashboard is available. Refresh to update." 
        icon={<Zap size={18} />}
      />
    </div>
  );
}`}
  >
    <div className="w-full space-y-12">
      <DocSubSection title="Variants">
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
          <Alert
            variant="info"
            title="Update Available"
            description="A new software update is available for your account. Please check the settings for more details."
          />
          <Alert
            variant="success"
            title="Success"
            description="The candidate profile has been successfully uploaded to the database."
          />
          <Alert
            variant="warning"
            title="Account Suspension"
            description="Your account is nearing its usage limit. Please upgrade to avoid suspension."
          />
          <Alert
            variant="error"
            title="System Error"
            description="The requested operation could not be completed at this time."
          />
        </div>
      </DocSubSection>

      <DocSubSection title="Compact Mode">
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
          <Alert
            variant="info"
            description="Syncing your latest changes to the cloud..."
          />
          <Alert
            variant="success"
            description="Project published successfully!"
          />
          <Alert
            variant="error"
            description="Critical vulnerability detected in code."
          />
        </div>
      </DocSubSection>

      <DocSubSection title="Icons vs No Icons">
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
          <Alert
            variant="success"
            title="Success with Icon"
            description="Our system uses context-aware icons by default to improve scanability."
          />
          <Alert
            variant="success"
            showIcon={false}
            title="Success without Icon"
            description="You can disable icons for a more minimal, text-focused appearance."
          />
        </div>
      </DocSubSection>

      <DocSubSection title="Custom Icons & Closable">
        <div className="grid grid-cols-1 gap-4 w-full max-w-2xl">
          <Alert
            variant="default"
            icon={<ShieldCheck size={18} />}
            description="Verified by TalentFlow Security protocols."
            onClose={() => alert("Closing...")}
          />
          <Alert
            variant="warning"
            icon={<Zap size={18} className="text-amber-500" />}
            description="High priority system notification."
          />
        </div>
      </DocSubSection>
    </div>
  </ComponentPageView>
);
