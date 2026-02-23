"use client";

import React, { useState } from "react";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { ComponentPageView } from "../ComponentPageView";

export const SelectDocs = () => {
  const [value, setValue] = useState<string | number | undefined>(undefined);

  return (
    <ComponentPageView
      title="Select Dropdown"
      description="A premium selection menu for single and multi-choice operations."
      code={`<SelectDropdown options={options} value={value} onChange={setValue} />`}
      fullSource={`import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { useState } from "react";

export default function SelectDemo() {
  const [value, setValue] = useState();
  const options = [
    { id: "1", label: "Product Management" },
    { id: "2", label: "Software Architecture" },
    { id: "3", label: "Human Resources" },
  ];

  return (
    <SelectDropdown options={options} placeholder="Select Department" value={value} onChange={setValue} className="rounded-xl shadow-md" />
  );
}`}
    >
      <div className="w-full max-w-xs">
        <SelectDropdown
          options={[
            { id: "1", label: "Product Management" },
            { id: "2", label: "Software Architecture" },
            { id: "3", label: "Human Resources" },
          ]}
          placeholder="Select Department"
          value={value}
          onChange={setValue}
          className="rounded-xl shadow-md border-border"
        />
      </div>
    </ComponentPageView>
  );
};
