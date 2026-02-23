"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { ComponentPageView } from "../ComponentPageView";
import { DocSubSection } from "../DocSubSection";

export const TypographyDocs = () => (
  <ComponentPageView
    title="Typography"
    description="The foundation of our communication. Our font system ensures hierarchy, clarity, and consistency across all resolutions."
    code={`<Typography variant="h1">Display</Typography>`}
    fullSource={`import { Typography } from "@components/ui-elements/Typography";

export default function TypographyShowcase() {
  return (
    <div className="w-full space-y-12">
      <section className="space-y-6">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Headings (h1 - h6)</h4>
        <div className="space-y-4">
          <Typography variant="h1">h1. Display Headline</Typography>
          <Typography variant="h2">h2. Section Header</Typography>
          <Typography variant="h3">h3. Subsection Heading</Typography>
          <Typography variant="h4">h4. Small Subsection</Typography>
          <Typography variant="h5">h5. Item Title</Typography>
          <Typography variant="h6">h6. Caption Header</Typography>
        </div>
      </section>

      <section className="space-y-6">
        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Body Text (body1 - body5)</h4>
        <div className="space-y-4">
          <Typography variant="body1">body1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Typography>
          <Typography variant="body2">body2. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Typography>
          <Typography variant="body3">body3. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</Typography>
          <Typography variant="body4">body4. Duis aute irure dolor in reprehenderit in voluptate velit esse.</Typography>
          <Typography variant="body5">body5. EXCEEDINGLY SMALL BUT BLACK WEIGHT LABEL.</Typography>
        </div>
      </section>
    </div>
  );
}`}
  >
    <div className="w-full py-4 space-y-12">
      <DocSubSection title="Headings (h1 - h6)">
        <div className="space-y-4 w-full">
          <Typography variant="h1">h1. Display Headline</Typography>
          <Typography variant="h2">h2. Section Header</Typography>
          <Typography variant="h3">h3. Subsection Heading</Typography>
          <Typography variant="h4">h4. Small Subsection</Typography>
          <Typography variant="h5">h5. Item Title</Typography>
          <Typography variant="h6">h6. Caption Header</Typography>
        </div>
      </DocSubSection>
      <DocSubSection title="Body Text (body1 - body5)">
        <div className="space-y-4 w-full">
          <Typography variant="body1">
            body1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </Typography>
          <Typography variant="body2">
            body2. Sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua.
          </Typography>
          <Typography variant="body3">
            body3. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris.
          </Typography>
          <Typography variant="body4">
            body4. Duis aute irure dolor in reprehenderit in voluptate velit
            esse.
          </Typography>
          <Typography variant="body5">
            body5. EXCEEDINGLY SMALL BUT BLACK WEIGHT LABEL.
          </Typography>
        </div>
      </DocSubSection>
    </div>
  </ComponentPageView>
);
