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

export function FamilyDetailsStep({ formData, updateField }: StepProps) {
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
        Family Details
      </Typography>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[25%] border-r border-[#ffffff40]">
                Relation
              </th>
              <th className="p-3 font-semibold text-sm w-[35%] border-r border-[#ffffff40]">
                Name
              </th>
              <th className="p-3 font-semibold text-sm w-[25%] border-r border-[#ffffff40]">
                Occupation
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] text-center">
                Dependent Y/N
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {formData.family.map(
              (member: Record<string, string>, index: number) => (
                <tr
                  key={member.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-3 border-r border-border">
                    {member.relationLabel === "Brother/Sister" ? (
                      <div className="flex gap-4">
                        <Radio
                          label="Brother"
                          checked={member.relation === "Brother"}
                          onChange={() => {
                            const newFamily = [...formData.family];
                            newFamily[index].relation = "Brother";
                            updateField("family", newFamily);
                          }}
                        />
                        <Radio
                          label="Sister"
                          checked={member.relation === "Sister"}
                          onChange={() => {
                            const newFamily = [...formData.family];
                            newFamily[index].relation = "Sister";
                            updateField("family", newFamily);
                          }}
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-medium">
                        {member.relationLabel}
                      </span>
                    )}
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={member.name}
                      onChange={(e) => {
                        const newFamily = [...formData.family];
                        newFamily[index].name = e.target.value;
                        updateField("family", newFamily);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter name..."
                    />
                  </td>
                  <td className="p-2 border-r border-border">
                    <Input
                      value={member.occupation}
                      onChange={(e) => {
                        const newFamily = [...formData.family];
                        newFamily[index].occupation = e.target.value;
                        updateField("family", newFamily);
                      }}
                      className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
                      placeholder="Enter occupation..."
                    />
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-4">
                      <Radio
                        label="Yes"
                        checked={member.dependent === "Yes"}
                        onChange={() => {
                          const newFamily = [...formData.family];
                          newFamily[index].dependent = "Yes";
                          updateField("family", newFamily);
                        }}
                      />
                      <Radio
                        label="No"
                        checked={member.dependent === "No"}
                        onChange={() => {
                          const newFamily = [...formData.family];
                          newFamily[index].dependent = "No";
                          updateField("family", newFamily);
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
