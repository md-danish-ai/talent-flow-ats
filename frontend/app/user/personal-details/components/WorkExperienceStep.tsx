import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateField: (field: string, value: any) => void;
}

export function WorkExperienceStep({ formData, updateField }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h1"
        weight="bold"
        className="text-center mb-1 pb-1 text-gray-800"
      >
        Work Experience Details
      </Typography>
      <Typography
        variant="body2"
        className="text-center text-brand-success font-semibold mb-5 "
      >
        If you are fresher then no need to fill this form and click
        &quot;Next&quot; to continue
      </Typography>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                Name of Company
              </th>
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                Designation
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Joining Date
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Relieving Date
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Reason of Leaving
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] text-center">
                Last Salary Drawn
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {formData.workExp.map(
              (exp: Record<string, string>, index: number) => (
                <tr
                  key={exp.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-2 border-r border-border">
                    <Input
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...formData.workExp];
                        newExp[index].company = e.target.value;
                        updateField("workExp", newExp);
                      }}
                      className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter company name..."
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={exp.designation}
                      onChange={(e) => {
                        const newExp = [...formData.workExp];
                        newExp[index].designation = e.target.value;
                        updateField("workExp", newExp);
                      }}
                      className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter designation..."
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      type="date"
                      value={exp.joinDate}
                      onChange={(e) => {
                        const newExp = [...formData.workExp];
                        newExp[index].joinDate = e.target.value;
                        updateField("workExp", newExp);
                      }}
                      className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input text-xs [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      type="date"
                      value={exp.relieveDate}
                      onChange={(e) => {
                        const newExp = [...formData.workExp];
                        newExp[index].relieveDate = e.target.value;
                        updateField("workExp", newExp);
                      }}
                      className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input text-xs [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={exp.reason}
                      onChange={(e) => {
                        const newExp = [...formData.workExp];
                        newExp[index].reason = e.target.value;
                        updateField("workExp", newExp);
                      }}
                      className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Reason for leaving..."
                    />
                  </td>
                  <td className="p-2">
                    <Input
                      value={exp.salary}
                      onChange={(e) => {
                        const newExp = [...formData.workExp];
                        newExp[index].salary = e.target.value;
                        updateField("workExp", newExp);
                      }}
                      className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter last salary..."
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
