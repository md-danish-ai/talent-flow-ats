import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Radio } from "@components/ui-elements/Radio";
import { Checkbox } from "@components/ui-elements/Checkbox";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateField: (field: string, value: any) => void;
}

export function SourceOfInformationStep({ formData, updateField }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h1"
        weight="bold"
        className="text-center mb-6 text-gray-800"
      >
        Source of Information
      </Typography>
      <div className="space-y-4 mt-2 max-w-2xl mx-auto">
        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            Have you ever been interviewed in Arcgate?
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              checked={formData.interviewedBefore === "Yes"}
              onChange={() => updateField("interviewedBefore", "Yes")}
            />
            <Radio
              label="No"
              checked={formData.interviewedBefore === "No"}
              onChange={() => updateField("interviewedBefore", "No")}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            Have you Worked in Arcgate before?
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              checked={formData.workedBefore === "Yes"}
              onChange={() => updateField("workedBefore", "Yes")}
            />
            <Radio
              label="No"
              checked={formData.workedBefore === "No"}
              onChange={() => updateField("workedBefore", "No")}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold block mb-4">
            What is the source of information for showing interest in ARCGATE?
            Please tick the appropriate from the given list.
          </label>
          <div className="flex flex-col gap-3 ml-2">
            {[
              { id: "campus", label: "Arcgate Campus Drive" },
              { id: "website", label: "Arcgate Website" },
              { id: "employee", label: "Arcgate Employee" },
              { id: "friends", label: "Friends" },
              { id: "newspaper", label: "Newspaper" },
            ].map((item) => (
              <Checkbox
                key={item.id}
                label={item.label}
                checked={
                  formData.source[item.id as keyof typeof formData.source]
                }
                onChange={(e) => {
                  const newSource = {
                    ...formData.source,
                    [item.id]: e.target.checked,
                  };
                  updateField("source", newSource);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
