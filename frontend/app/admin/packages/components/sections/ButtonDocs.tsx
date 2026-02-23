"use client";

import React from "react";
import { Button } from "@components/ui-elements/Button";
import { Layers, Settings } from "lucide-react";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";

export const ButtonDocs = () => (
  <ComponentPageView
    title="Button"
    description="The primary action trigger for our design system. Buttons allow users to take actions, and make choices, with a single tap. Our implementation supports various visual styles, semantic color states, and high-performance micro-interactions."
    code={`<Button variant="primary" color="primary" shadow animate="scale">
  Action Button
</Button>`}
    fullSource={`import { Button } from "@components/ui-elements/Button";
import { Settings, Layers } from "lucide-react";

export default function ButtonShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <section>
        <h4>Base</h4>
        <div className="flex gap-3">
          <Button color="primary">Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      <section>
        <h4>Colors</h4>
        <div className="flex gap-3">
          <Button color="success">Success</Button>
          <Button color="error">Error</Button>
          <Button color="warning">Warning</Button>
        </div>
      </section>

      <section>
        <h4>Outlined</h4>
        <div className="flex gap-3">
          <Button variant="outline" color="primary">Primary</Button>
          <Button variant="outline" color="secondary">Secondary</Button>
        </div>
      </section>

      <section>
        <h4>Icons & Sizes</h4>
        <div className="flex gap-3 items-center">
          <Button startIcon={<Layers size={16} />}>Button</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" variant="ghost">
            <Settings size={20} />
          </Button>
        </div>
      </section>

      <section>
        <h4>Animations</h4>
        <div className="flex gap-3">
          <Button animate="scale" shadow>Scale</Button>
          <Button animate="slide">Slide</Button>
          <Button animate="rotate" variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
          <Button animate="spin" variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
      </section>
    </div>
  );
}`}
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-8">
      <DocSubSection title="Base">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button disabled>Disabled</Button>
      </DocSubSection>
      <DocSubSection title="Colors">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="success">Success</Button>
        <Button color="error">Error</Button>
        <Button color="warning">Warning</Button>
      </DocSubSection>
      <DocSubSection title="Outlined">
        <Button variant="outline" color="primary">
          Primary
        </Button>
        <Button variant="outline" color="secondary">
          Secondary
        </Button>
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </DocSubSection>
      <DocSubSection title="With Icons">
        <Button startIcon={<Layers size={16} />} color="primary">
          Button
        </Button>
        <Button endIcon={<Layers size={16} />} color="primary">
          Button
        </Button>
        <Button size="icon" color="primary">
          <Layers size={20} />
        </Button>
      </DocSubSection>
      <DocSubSection title="Size">
        <Button size="sm" color="primary">
          Button
        </Button>
        <Button size="md" color="primary">
          Button
        </Button>
        <Button size="lg" color="primary">
          Button
        </Button>
      </DocSubSection>
      <DocSubSection title="Animation">
        <Button color="primary" shadow>
          Default
        </Button>
        <Button
          color="secondary"
          animate="scale"
          shadow
          className="bg-purple-600"
        >
          Scale
        </Button>
        <Button color="error" animate="slide" shadow>
          Slide
        </Button>
        <Button variant="ghost" color="primary" animate="rotate" size="icon">
          <Settings size={22} />
        </Button>
        <Button variant="ghost" color="primary" animate="spin" size="icon">
          <Settings size={22} />
        </Button>
      </DocSubSection>
    </div>
  </ComponentPageView>
);
