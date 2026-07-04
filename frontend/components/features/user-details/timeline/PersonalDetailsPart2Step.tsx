import React from "react";
import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
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
} from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface PersonalDetailsPart2StepProps {
  form: PersonalDetailsForm;
}

const BLOOD_GROUPS = [
  { id: "A+", label: "A+" },
  { id: "A-", label: "A-" },
  { id: "B+", label: "B+" },
  { id: "B-", label: "B-" },
  { id: "O+", label: "O+" },
  { id: "O-", label: "O-" },
  { id: "AB+", label: "AB+" },
  { id: "AB-", label: "AB-" },
];

const RELIGIONS = [
  { id: "Hindu", label: "Hindu" },
  { id: "Muslim", label: "Muslim" },
  { id: "Christian", label: "Christian" },
  { id: "Sikh", label: "Sikh" },
  { id: "Buddhist", label: "Buddhist" },
  { id: "Jain", label: "Jain" },
  { id: "Parsi", label: "Parsi" },
  { id: "Other", label: "Other" },
];

const CATEGORIES = [
  { id: "General", label: "General" },
  { id: "OBC", label: "OBC" },
  { id: "SC", label: "SC" },
  { id: "ST", label: "ST" },
];

const MARITAL_STATUSES = [
  { id: "Single", label: "Single" },
  { id: "Married", label: "Married" },
  { id: "Divorcee", label: "Divorcee" },
  { id: "Widow", label: "Widow" },
];

export function PersonalDetailsPart2Step({
  form,
}: PersonalDetailsPart2StepProps) {
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
                    options={BLOOD_GROUPS}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(String(val))}
                    placeholder="Select blood group"
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
                    options={RELIGIONS}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(String(val))}
                    placeholder="Select religion"
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
                    options={CATEGORIES}
                    value={field.state.value}
                    onChange={(val) => field.handleChange(String(val))}
                    placeholder="Select category"
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
                    options={MARITAL_STATUSES}
                    value={field.state.value}
                    onChange={(val) => {
                      field.handleChange(String(val));
                      if (val !== "Married") {
                        form.setFieldValue("anniversaryDate", "");
                      }
                    }}
                    placeholder="Select marital status"
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
