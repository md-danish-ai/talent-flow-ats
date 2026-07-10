import React from "react";
import { motion } from "framer-motion";
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
    const apiOptions = (relationsRes?.data || []).map(
      (c: { name: string; code: string }) => ({
        id: c.code,
        label: c.name,
      }),
    );
    // Ensure Father and Mother exist even before loading finishes
    if (
      !apiOptions.some((o: { id: string; label: string }) => o.id === "FATHER")
    ) {
      apiOptions.unshift({ id: "FATHER", label: "Father" });
    }
    if (
      !apiOptions.some((o: { id: string; label: string }) => o.id === "MOTHER")
    ) {
      apiOptions.unshift({ id: "MOTHER", label: "Mother" });
    }
    return apiOptions;
  }, [relationsRes]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-5 pt-2"
    >
      <div className="flex flex-col gap-5">
        <form.Subscribe
          selector={(state) => [
            state.values.family,
            state.values.emergencyContactRelation,
            state.values.assignedEmergencyRelation,
          ]}
        >
          {([family, emergencyRelation, assignedRelation]) =>
            (family as FamilyMember[]).map(
              (member: FamilyMember, index: number) => {
                const isMandatory =
                  member.relation === "FATHER" ||
                  member.relation === "MOTHER" ||
                  member.relation === emergencyRelation ||
                  (Boolean(assignedRelation) &&
                    member.relation === assignedRelation);
                const isEmergencyContact =
                  member.relation === emergencyRelation;
                const isRelationSelected = Boolean(
                  member.relation &&
                  (isLoadingRelations ||
                    relationOptions.some(
                      (opt: { id: string | number }) =>
                        String(opt.id) === String(member.relation),
                    )),
                );

                const selectedLabel =
                  relationOptions.find(
                    (opt: { id: string | number; label: string }) =>
                      String(opt.id) === String(member.relation),
                  )?.label || member.relationLabel;
                const headerTitle = selectedLabel
                  ? `Family Member - ${selectedLabel}`
                  : `Family Member ${index + 1}`;

                return (
                  <div
                    key={member.id}
                    className="p-5 border border-border rounded-xl bg-card shadow-sm relative group transition-all hover:shadow-md"
                  >
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                      <h4 className="text-sm font-semibold text-brand-primary uppercase tracking-wider">
                        {headerTitle}{" "}
                        {isMandatory && <span className="text-red-500">*</span>}
                      </h4>
                      <Tooltip
                        content={isMandatory ? "Required Row" : "Delete Row"}
                        side="top"
                      >
                        <button
                          type="button"
                          disabled={isMandatory}
                          onClick={() => {
                            form.removeFieldValue("family", index);
                          }}
                          className="p-2 hover:bg-red-50 rounded-full text-muted-foreground hover:text-red-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </Tooltip>
                    </div>

                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 ${isEmergencyContact ? "lg:grid-cols-5" : "lg:grid-cols-4"} gap-5`}
                    >
                      {/* Relation */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Relation
                        </label>
                        <form.Field name={`family[${index}].relation`}>
                          {(field) => (
                            <div className="flex flex-col relative">
                              <SelectDropdown
                                options={relationOptions}
                                value={field.state.value}
                                onChange={(val) => {
                                  field.handleChange(val as string);
                                  const selected = relationOptions.find(
                                    (opt) => String(opt.id) === String(val),
                                  );
                                  if (selected) {
                                    form.setFieldValue(
                                      `family[${index}].relationLabel`,
                                      selected.label,
                                    );
                                  }
                                }}
                                placeholder="Select Relation"
                                isLoading={isLoadingRelations}
                                disabled={isMandatory}
                                error={
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0
                                }
                              />
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-red-500 mt-1 pl-1">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Field>
                      </div>

                      {/* Name */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Name
                        </label>
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
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter name..."
                                error={
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0
                                }
                              />
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-red-500 mt-1 pl-1">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Field>
                      </div>

                      {/* Occupation */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Occupation
                        </label>
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
                                className="disabled:opacity-50 disabled:cursor-not-allowed"
                                placeholder="Enter occupation..."
                                error={
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0
                                }
                              />
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-[10px] text-red-500 mt-1 pl-1">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Field>
                      </div>

                      {/* Dependent Y/N */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-muted-foreground">
                          Dependent Y/N
                        </label>
                        <form.Field name={`family[${index}].dependent`}>
                          {(field) => (
                            <div className="flex flex-row items-center gap-4 relative">
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
                                  <p className="text-[10px] text-red-500 mt-1 absolute -bottom-4">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Field>
                      </div>

                      {/* Contact Number */}
                      {isEmergencyContact && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-muted-foreground">
                            Contact Number{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <form.Field name={`family[${index}].contactNo`}>
                            {(field) => (
                              <div className="flex flex-col">
                                <Input
                                  value={field.state.value || ""}
                                  onChange={(e) =>
                                    field.handleChange(
                                      e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 10),
                                    )
                                  }
                                  onBlur={field.handleBlur}
                                  maxLength={10}
                                  placeholder="Enter 10-digit number"
                                  error={
                                    field.state.meta.isTouched &&
                                    field.state.meta.errors.length > 0
                                  }
                                />
                                {field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0 && (
                                    <p className="text-[10px] text-red-500 mt-1 pl-1">
                                      {getErrorMessage(
                                        field.state.meta.errors[0],
                                      )}
                                    </p>
                                  )}
                              </div>
                            )}
                          </form.Field>
                        </div>
                      )}
                    </div>
                  </div>
                );
              },
            )
          }
        </form.Subscribe>

        <button
          type="button"
          onClick={() => {
            const family = form.getFieldValue("family") || [];
            const nextId =
              family.length > 0
                ? Math.max(...family.map((f) => Number(f.id) || 0)) + 1
                : 1;
            form.pushFieldValue("family", {
              id: nextId,
              relationLabel: "",
              relation: "",
              name: "",
              occupation: "",
              dependent: "",
            });
          }}
          className="flex items-center gap-1.5 px-4 py-2 mt-2 w-fit text-sm font-medium bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add More Family Member
        </button>
      </div>
    </motion.div>
  );
}
