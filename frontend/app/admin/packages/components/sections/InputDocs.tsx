"use client";

import React from "react";
import { Input } from "@components/ui-elements/Input";
import { Search, Mail, Lock } from "lucide-react";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";

export const InputDocs = () => (
  <ComponentPageView
    title="Input"
    description="The Input component is used to collect text-based user data. It features support for start and end icons, built-in password visibility toggling, and specialized error states."
    code={`<Input placeholder="Search records..." startIcon={<Search size={18} />} />`}
    fullSource={`import { Input } from "@components/ui-elements/Input";
import { Search, Mail, Lock } from "lucide-react";

export default function InputShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {/* Search & Icons */}
      <section className="space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Search & Icons</h4>
        <Input placeholder="Search records..." startIcon={<Search size={18} />} />
        <Input placeholder="Enter email" startIcon={<Mail size={16} />} />
      </section>
      
      {/* Types */}
      <section className="space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Types</h4>
        <Input type="password" placeholder="Password" startIcon={<Lock size={16} />} />
        <Input type="number" placeholder="Enter age" />
      </section>

      {/* Feedback States */}
      <section className="space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Feedback States</h4>
        <Input error placeholder="Error state" defaultValue="invalid_email" />
        <Input disabled placeholder="Disabled state" />
      </section>

      {/* Simple Inputs */}
      <section className="space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Simple Inputs</h4>
        <Input placeholder="Placeholder text" />
        <Input defaultValue="Predefined value" />
      </section>
    </div>
  );
}`}
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
      <DocSubSection title="Search & Icons">
        <Input
          placeholder="Search records..."
          startIcon={<Search size={18} />}
        />
        <Input placeholder="Enter email" startIcon={<Mail size={16} />} />
      </DocSubSection>
      <DocSubSection title="Types">
        <Input
          type="password"
          placeholder="Password"
          startIcon={<Lock size={16} />}
        />
        <Input type="number" placeholder="Enter age" />
      </DocSubSection>
      <DocSubSection title="Feedback States">
        <Input error placeholder="Error state" defaultValue="invalid_email" />
        <Input disabled placeholder="Disabled state" />
      </DocSubSection>
      <DocSubSection title="Simple Inputs">
        <Input placeholder="Placeholder text" />
        <Input defaultValue="Predefined value" />
      </DocSubSection>
    </div>
  </ComponentPageView>
);
