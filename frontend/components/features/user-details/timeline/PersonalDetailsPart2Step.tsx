import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { DatePicker } from "@components/ui-elements/DatePicker";
import {
  type PersonalDetailsForm,
  bloodGroupSchema,
  aadhaarNoSchema,
  nameAsPerAadhaarSchema,
  panNoSchema,
  nameAsPerPanSchema,
  religionSchema,
  categorySchema,
  maritalStatusSchema,
  emergencyContactRelationSchema,
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

import { useClassifications } from "@hooks/api/classifications/use-classifications";

export interface PersonalDetailsPart2StepProps {
  form: PersonalDetailsForm;
}

export function PersonalDetailsPart2Step({
  form,
}: PersonalDetailsPart2StepProps) {
  const { data: relationsRes, isLoading: isLoadingRelations } =
    useClassifications({
      type: "family_relation",
      is_active: true,
    });

  const { data: bloodGroupRes, isLoading: isLoadingBloodGroup } =
    useClassifications({
      type: "blood_group",
      is_active: true,
    });

  const { data: religionRes, isLoading: isLoadingReligion } =
    useClassifications({
      type: "religion",
      is_active: true,
    });

  const { data: categoryRes, isLoading: isLoadingCategory } =
    useClassifications({
      type: "social_category",
      is_active: true,
    });

  const { data: maritalStatusRes, isLoading: isLoadingMaritalStatus } =
    useClassifications({
      type: "marital_status",
      is_active: true,
    });

  const bloodGroupOptions = React.useMemo(() => {
    return (bloodGroupRes?.data || []).map((c: { name: string }) => ({
      id: c.name,
      label: c.name,
    }));
  }, [bloodGroupRes]);

  const religionOptions = React.useMemo(() => {
    return (religionRes?.data || []).map((c: { name: string }) => ({
      id: c.name,
      label: c.name,
    }));
  }, [religionRes]);

  const categoryOptions = React.useMemo(() => {
    return (categoryRes?.data || []).map((c: { name: string }) => ({
      id: c.name,
      label: c.name,
    }));
  }, [categoryRes]);

  const maritalStatusOptions = React.useMemo(() => {
    return (maritalStatusRes?.data || []).map((c: { name: string }) => ({
      id: c.name,
      label: c.name,
    }));
  }, [maritalStatusRes]);

  const emergencyOptions = React.useMemo(() => {
    // Start with default FATHER and MOTHER
    const optionsMap = new Map<string, string>([
      ["FATHER", "Father"],
      ["MOTHER", "Mother"],
    ]);

    // Add admin-assigned relation
    const assignedCode = form.state.values.assignedEmergencyRelation;
    if (assignedCode) {
      const matched = (relationsRes?.data || []).find(
        (c: { code: string; name: string }) => c.code === assignedCode,
      );
      const label = matched ? matched.name : assignedCode;
      const displayLabel =
        label === assignedCode
          ? assignedCode.charAt(0).toUpperCase() +
            assignedCode.slice(1).toLowerCase()
          : label;
      optionsMap.set(assignedCode, displayLabel);
    }

    // Add any relations entered in the family details step
    const familyMembers = form.state.values.family || [];
    familyMembers.forEach((member) => {
      if (member.relation) {
        const code = member.relation;
        const matched = (relationsRes?.data || []).find(
          (c: { code: string; name: string }) => c.code === code,
        );
        const label = matched ? matched.name : member.relationLabel || code;
        const displayLabel =
          label === code
            ? code.charAt(0).toUpperCase() + code.slice(1).toLowerCase()
            : label;
        optionsMap.set(code, displayLabel);
      }
    });

    return Array.from(optionsMap.entries()).map(([id, label]) => ({
      id,
      label,
    }));
  }, [
    relationsRes,
    form.state.values.assignedEmergencyRelation,
    form.state.values.family,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pt-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Identity Details */}
        <div className="space-y-4 md:col-span-2">
          <Typography variant="h4" className="mb-2">
            Identity Proofs
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="aadhaarNo"
              validators={{
                onChange: aadhaarNoSchema,
                onBlur: aadhaarNoSchema,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Aadhaar Card Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(
                        e.target.value.replace(/\D/g, "").slice(0, 12),
                      )
                    }
                    placeholder="Enter 12-digit Aadhaar number"
                    maxLength={12}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="nameAsPerAadhaar"
              validators={{
                onChange: nameAsPerAadhaarSchema,
                onBlur: nameAsPerAadhaarSchema,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Name as per Aadhaar <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter name on Aadhaar"
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="panNo"
              validators={{ onChange: panNoSchema, onBlur: panNoSchema }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    PAN Card Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) =>
                      field.handleChange(e.target.value.toUpperCase())
                    }
                    placeholder="e.g. ABCDE1234F"
                    maxLength={10}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="nameAsPerPan"
              validators={{
                onChange: nameAsPerPanSchema,
                onBlur: nameAsPerPanSchema,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Name as per PAN <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter name on PAN"
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>
          </div>
        </div>

        {/* Demographic Details */}
        <div className="space-y-4 md:col-span-2 mt-4">
          <Typography variant="h4" className="mb-2">
            Demographic Details
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form.Field
              name="bloodGroup"
              validators={{
                onChange: bloodGroupSchema,
                onBlur: bloodGroupSchema,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Blood Group <span className="text-red-500">*</span>
                  </label>
                  <SelectDropdown
                    options={bloodGroupOptions}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(String(val))}
                    placeholder="Select blood group"
                    isLoading={isLoadingBloodGroup}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="religion"
              validators={{ onChange: religionSchema, onBlur: religionSchema }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Religion <span className="text-red-500">*</span>
                  </label>
                  <SelectDropdown
                    options={religionOptions}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(String(val))}
                    placeholder="Select religion"
                    isLoading={isLoadingReligion}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="category"
              validators={{ onChange: categorySchema, onBlur: categorySchema }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <SelectDropdown
                    options={categoryOptions}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(String(val))}
                    placeholder="Select category"
                    isLoading={isLoadingCategory}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="maritalStatus"
              validators={{
                onChange: maritalStatusSchema,
                onBlur: maritalStatusSchema,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <SelectDropdown
                    options={maritalStatusOptions}
                    value={field.state.value}
                    onChange={(val) => {
                      field.handleChange(String(val));
                      if (val !== "Married") {
                        form.setFieldValue("anniversaryDate", "");
                      }
                    }}
                    placeholder="Select marital status"
                    isLoading={isLoadingMaritalStatus}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>

            <form.Subscribe selector={(state) => [state.values.maritalStatus]}>
              {([maritalStatus]) =>
                maritalStatus === "Married" ? (
                  <form.Field name="anniversaryDate">
                    {(field) => (
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                          Anniversary Date{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                          value={field.state.value}
                          onChange={(val) => field.handleChange(val)}
                        />
                        {field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0 && (
                            <p className="text-xs text-red-500 mt-1">
                              {getErrorMessage(field.state.meta.errors[0])}
                            </p>
                          )}
                      </div>
                    )}
                  </form.Field>
                ) : null
              }
            </form.Subscribe>

            <form.Field
              name="emergencyContactRelation"
              validators={{
                onChange: emergencyContactRelationSchema,
                onBlur: emergencyContactRelationSchema,
              }}
            >
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Emergency Contact Relation{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <SelectDropdown
                    options={emergencyOptions}
                    value={field.state.value}
                    onChange={(val) => {
                      const relationCode = String(val);
                      const oldRelationCode = form.getFieldValue(
                        "emergencyContactRelation",
                      );
                      field.handleChange(relationCode);

                      let family = form.getFieldValue("family") || [];

                      // Remove previous custom relation (not FATHER/MOTHER) from family details
                      if (
                        oldRelationCode &&
                        oldRelationCode !== "FATHER" &&
                        oldRelationCode !== "MOTHER" &&
                        oldRelationCode !== relationCode
                      ) {
                        family = family.filter(
                          (f) =>
                            f.relation?.toUpperCase() !==
                            oldRelationCode.toUpperCase(),
                        );
                      }

                      // Add the new custom relation if not already present
                      if (
                        relationCode &&
                        !family.some(
                          (f) =>
                            f.relation?.toUpperCase() ===
                            relationCode.toUpperCase(),
                        )
                      ) {
                        const matchedOpt = emergencyOptions.find(
                          (opt) => opt.id === relationCode,
                        );
                        const label = matchedOpt
                          ? matchedOpt.label
                          : relationCode.charAt(0).toUpperCase() +
                            relationCode.slice(1).toLowerCase();

                        family = [
                          ...family,
                          {
                            id: family.length + 1,
                            relationLabel: label,
                            relation: relationCode,
                            name: "",
                            occupation: "",
                            dependent: "",
                            contactNo: "",
                          },
                        ];
                      }

                      form.setFieldValue("family", family);
                    }}
                    placeholder="Select emergency contact relation"
                    isLoading={isLoadingRelations}
                    error={
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                    }
                  />
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        {getErrorMessage(field.state.meta.errors[0])}
                      </p>
                    )}
                </div>
              )}
            </form.Field>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
