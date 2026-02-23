import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateField: (field: string, value: any) => void;
}

export function EducationDetailsStep({ formData, updateField }: StepProps) {
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
        Education Details
      </Typography>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40]">
                Education Details
              </th>
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                School/College
              </th>
              <th className="p-3 font-semibold text-sm w-[20%] border-r border-[#ffffff40]">
                Board/University
              </th>
              <th className="p-3 font-semibold text-sm w-[10%] border-r border-[#ffffff40]">
                Year of Passing
              </th>
              <th className="p-3 font-semibold text-sm w-[10%] border-r border-[#ffffff40]">
                Division
              </th>
              <th className="p-3 font-semibold text-sm w-[10%] border-r border-[#ffffff40]">
                %
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] text-center">
                Medium
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {formData.education.map(
              (edu: Record<string, string>, index: number) => (
                <tr
                  key={edu.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 border-r border-border">
                    <span className="text-sm font-medium">{edu.type}</span>
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={edu.school}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].school = e.target.value;
                        updateField("education", newEdu);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter school/college..."
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={edu.board}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].board = e.target.value;
                        updateField("education", newEdu);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter board/university..."
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={edu.year}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].year = e.target.value.replace(/\D/g, "");
                        updateField("education", newEdu);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="YYYY"
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={edu.division}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].division = e.target.value;
                        updateField("education", newEdu);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="e.g. 1st, 2nd"
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={edu.percentage}
                      onChange={(e) => {
                        const newEdu = [...formData.education];
                        newEdu[index].percentage = e.target.value;
                        updateField("education", newEdu);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="e.g. 85%"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center flex-col xl:flex-row gap-2">
                      <Radio
                        label="English"
                        checked={edu.medium === "English"}
                        onChange={() => {
                          const newEdu = [...formData.education];
                          newEdu[index].medium = "English";
                          updateField("education", newEdu);
                        }}
                      />
                      <Radio
                        label="Hindi"
                        checked={edu.medium === "Hindi"}
                        onChange={() => {
                          const newEdu = [...formData.education];
                          newEdu[index].medium = "Hindi";
                          updateField("education", newEdu);
                        }}
                      />
                    </div>
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
