"use client";

import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { DatePicker } from "@components/ui-elements/DatePicker";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateField: (field: string, value: any) => void;
}

export function OtherDetailsStep({ formData, updateField }: StepProps) {
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
        Other Details
      </Typography>
      <div className="mt-2 max-w-2xl mx-auto space-y-6">
        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            Are you willing for 1 Year Service Commitment?
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              name="serviceCommitment"
              checked={formData.serviceCommitment === "Yes"}
              onChange={() => updateField("serviceCommitment", "Yes")}
            />
            <Radio
              label="No"
              name="serviceCommitment"
              checked={formData.serviceCommitment === "No"}
              onChange={() => updateField("serviceCommitment", "No")}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            Do you agree for 1 month salary as security deposit?
          </label>
          <div className="flex gap-6">
            <Radio
              label="Yes"
              name="securityDeposit"
              checked={formData.securityDeposit === "Yes"}
              onChange={() => updateField("securityDeposit", "Yes")}
            />
            <Radio
              label="No"
              name="securityDeposit"
              checked={formData.securityDeposit === "No"}
              onChange={() => updateField("securityDeposit", "No")}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <label className="text-sm font-semibold text-muted-foreground mb-3 block">
            What is your preferred shift time for work at Arcgate?
          </label>
          <div className="flex gap-6">
            <Radio
              label="Day"
              name="shiftTime"
              checked={formData.shiftTime === "Day"}
              onChange={() => updateField("shiftTime", "Day")}
            />
            <Radio
              label="Night"
              name="shiftTime"
              checked={formData.shiftTime === "Night"}
              onChange={() => updateField("shiftTime", "Night")}
            />
            <Radio
              label="Any"
              name="shiftTime"
              checked={formData.shiftTime === "Any"}
              onChange={() => updateField("shiftTime", "Any")}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end">
            <div>
              <DatePicker
                label="On selection, please mention the expected joining date."
                value={formData.expectedJoiningDate}
                onChange={(e) =>
                  updateField("expectedJoiningDate", e.target.value)
                }
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                Expected Salary
              </label>
              <Input
                value={formData.expectedSalary}
                onChange={(e) => updateField("expectedSalary", e.target.value)}
                placeholder="Enter expected salary..."
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
