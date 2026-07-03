import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Trash2, Plus } from "lucide-react";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { useClassifications } from "@hooks/api/classifications/use-classifications";

import {
  type PersonalDetailsForm,
  type FamilyMember,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface FamilyDetailsStepProps {
  form: PersonalDetailsForm;
}

export function FamilyDetailsStep({ form }: FamilyDetailsStepProps) {
  const { data: relationsRes, isLoading: isLoadingRelations } =
    useClassifications({
      type: "family_relation",
      is_active: true,
    });
  
  const relationOptions = React.useMemo(() => {
    const apiOptions = (relationsRes?.data || []).map((c: { name: string }) => ({
      id: c.name,
      label: c.name,
    }));
    // Ensure Father and Mother exist even before loading finishes
    if (!apiOptions.some((o: { id: string; label: string }) => o.id === "Father")) {
      apiOptions.unshift({ id: "Father", label: "Father" });
    }
    if (!apiOptions.some((o: { id: string; label: string }) => o.id === "Mother")) {
      apiOptions.unshift({ id: "Mother", label: "Mother" });
    }
    return apiOptions;
  }, [relationsRes]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="relative flex items-center justify-center mb-6">
        <Typography
          variant="h1"
          weight="bold"
        >
          2. Family Details
        </Typography>
        <button
          type="button"
          onClick={() => {
            form.pushFieldValue("family", {
              id: Date.now(),
              relationLabel: "",
              relation: "",
              name: "",
              occupation: "",
              dependent: "",
            });
          }}
          className="absolute right-0 flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add More
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl ring-1 ring-border mt-2 shadow-sm bg-card">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-brand-primary text-white">
              <th className="p-3 font-semibold text-sm w-[23%] border-r border-[#ffffff40]">
                Relation
              </th>
              <th className="p-3 font-semibold text-sm w-[32%] border-r border-[#ffffff40]">
                Name
              </th>
              <th className="p-3 font-semibold text-sm w-[23%] border-r border-[#ffffff40]">
                Occupation
              </th>
              <th className="p-3 font-semibold text-sm w-[15%] border-r border-[#ffffff40] text-center">
                Dependent Y/N
              </th>
              <th className="p-3 font-semibold text-sm w-[7%] text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <form.Subscribe selector={(state) => [state.values.family]}>
              {([family]) =>
                family.map((member: FamilyMember, index: number) => {
                  const isMandatory = member.relationLabel === "Father" || member.relationLabel === "Mother";
                  const isRelationSelected = Boolean(
                    member.relation &&
                      (isLoadingRelations ||
                        relationOptions.some(
                          (opt: { id: string | number }) => String(opt.id) === String(member.relation)
                        ))
                  );
                  return (
                  <tr
                    key={member.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 border-r border-border">
                        <form.Field name={`family[${index}].relation`}>
                          {(field) => (
                            <div className="flex flex-col relative">
                              <SelectDropdown
                                options={relationOptions}
                                value={field.state.value}
                                onChange={(val) => field.handleChange(val as string)}
                                placeholder="Select Relation"
                                isLoading={isLoadingRelations}
                                disabled={isMandatory}
                                error={
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0
                                }
                              />
                              {isMandatory && (
                                <span className="text-red-500 absolute -top-1 -right-1 text-xs">*</span>
                              )}
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-red-500 mt-1 pl-1">
                                    {getErrorMessage(field.state.meta.errors[0])}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`family[${index}].name`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              disabled={!isRelationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="Enter name..."
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-2 border-r border-border">
                      <form.Field name={`family[${index}].occupation`}>
                        {(field) => (
                          <div className="flex flex-col">
                            <Input
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              disabled={!isRelationSelected}
                              className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input disabled:opacity-50 disabled:cursor-not-allowed"
                              placeholder="Enter occupation..."
                              error={
                                field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0
                              }
                            />
                            {field.state.meta.isTouched &&
                              field.state.meta.errors.length > 0 && (
                                <p className="text-[10px] text-red-500 mt-1 pl-1">
                                  {getErrorMessage(field.state.meta.errors[0])}
                                </p>
                              )}
                          </div>
                        )}
                      </form.Field>
                    </td>
                    <td className="p-3 text-center border-r border-border">
                      <div className="flex justify-center gap-4">
                        <form.Field name={`family[${index}].dependent`}>
                          {(field) => (
                            <>
                              <Radio
                                label="Yes"
                                checked={field.state.value === "Yes"}
                                onChange={() => field.handleChange("Yes")}
                                disabled={!isRelationSelected}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              <Radio
                                label="No"
                                checked={field.state.value === "No"}
                                onChange={() => field.handleChange("No")}
                                disabled={!isRelationSelected}
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-red-500 mt-1">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </>
                          )}
                        </form.Field>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <Tooltip
                        content={
                          member.relationLabel === "Father" ||
                          member.relationLabel === "Mother"
                            ? "Required Row"
                            : "Delete Row"
                        }
                        side="top"
                      >
                        <button
                          type="button"
                          disabled={
                            member.relationLabel === "Father" ||
                            member.relationLabel === "Mother"
                          }
                          onClick={() => {
                            form.removeFieldValue("family", index);
                          }}
                          className="p-2 hover:bg-red-50 rounded-full text-muted-foreground hover:text-red-500 transition-all group inline-flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110" />
                        </button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })}
            </form.Subscribe>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
