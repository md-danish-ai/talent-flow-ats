import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { DatePicker } from "@components/ui-elements/DatePicker";

import { type PersonalDetailsForm } from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface PersonalDetailsStepProps {
  form: PersonalDetailsForm;
}

export function PersonalDetailsStep({ form }: PersonalDetailsStepProps) {
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
        1. Personal Details
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
          <form.Field name="firstName">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter first name"
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

          <form.Field name="lastName">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter last name"
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

          <form.Field name="email">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  E-Mail
                </label>
                <Input
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter email address"
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2 xl:col-span-2">
          <form.Field name="gender">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Gender <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4 items-center h-11">
                  <Radio
                    label="Male"
                    name="gender"
                    checked={field.state.value === "Male"}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value="Male"
                  />
                  <Radio
                    label="Female"
                    name="gender"
                    checked={field.state.value === "Female"}
                    onChange={(e) => field.handleChange(e.target.value)}
                    value="Female"
                  />
                </div>
                {field.state.meta.isTouched &&
                  field.state.meta.errors.length > 0 && (
                    <p className="text-xs text-red-500 mt-0">
                      {getErrorMessage(field.state.meta.errors[0])}
                    </p>
                  )}
              </div>
            )}
          </form.Field>

          <form.Field name="mobile1">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Mobile 1 <span className="text-red-500">*</span>
                </label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter primary mobile"
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

          <form.Field name="mobile2">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Mobile 2
                </label>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter alternate mobile"
                />
              </div>
            )}
          </form.Field>

          <form.Field name="dob">
            {(field) => (
              <div>
                <DatePicker
                  label={
                    <span>
                      DOB <span className="text-red-500">*</span>
                    </span>
                  }
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
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

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <Typography variant="body2" weight="bold" className="mb-4">
            Present Address
          </Typography>
          <div className="space-y-4">
            <form.Field name="presentAddressLine1">
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter address line 1"
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

            <form.Field name="presentAddressLine2">
              {(field) => (
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Address Line 2
                  </label>
                  <Input
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter address line 2"
                  />
                </div>
              )}
            </form.Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="presentState">
                {(field) => (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      State <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter state"
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

              <form.Field name="presentDistrict">
                {(field) => (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      District <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter district"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="presentCity">
                {(field) => (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter city"
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

              <form.Field name="presentPincode">
                {(field) => (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      Pincode <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter pincode"
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

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm relative">
          <Typography variant="body2" weight="bold" className="mb-4">
            Permanent Address:
          </Typography>
          <form.Subscribe selector={(state) => [state.values.sameAddress]}>
            {([sameAddress]) => (
              <>
                {!sameAddress && (
                  <div className="space-y-4">
                    <form.Field name="permanentAddressLine1">
                      {(field) => (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                            Address Line 1
                          </label>
                          <Input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter address line 1"
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

                    <form.Field name="permanentAddressLine2">
                      {(field) => (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                            Address Line 2
                          </label>
                          <Input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter address line 2"
                          />
                        </div>
                      )}
                    </form.Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="permanentState">
                        {(field) => (
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                              State
                            </label>
                            <Input
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Enter state"
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
                      <form.Field name="permanentDistrict">
                        {(field) => (
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                              District
                            </label>
                            <Input
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Enter district"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="permanentCity">
                        {(field) => (
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                              City
                            </label>
                            <Input
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Enter city"
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
                      <form.Field name="permanentPincode">
                        {(field) => (
                          <div>
                            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                              Pincode
                            </label>
                            <Input
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              placeholder="Enter pincode"
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
                )}
                {sameAddress && (
                  <div className="absolute inset-x-0 bottom-0 top-12 flex items-center justify-center bg-card/80 rounded-b-2xl backdrop-blur-[2px] z-10">
                    <Typography className="text-brand-primary font-semibold text-sm">
                      Same as Present Address
                    </Typography>
                  </div>
                )}
              </>
            )}
          </form.Subscribe>
        </div>

        <div className="md:col-span-2 mt-2">
          <form.Field name="sameAddress">
            {(field) => (
              <Checkbox
                label="Click if permanent address is same as present address"
                checked={field.state.value}
                onChange={(e) => {
                  const isChecked = e.target.checked;
                  field.handleChange(isChecked);
                  if (isChecked) {
                    const values = form.state.values;
                    form.setFieldValue(
                      "permanentAddressLine1",
                      values.presentAddressLine1,
                    );
                    form.setFieldValue(
                      "permanentAddressLine2",
                      values.presentAddressLine2,
                    );
                    form.setFieldValue("permanentState", values.presentState);
                    form.setFieldValue(
                      "permanentDistrict",
                      values.presentDistrict,
                    );
                    form.setFieldValue("permanentCity", values.presentCity);
                    form.setFieldValue(
                      "permanentPincode",
                      values.presentPincode,
                    );
                  }
                }}
                className="w-5 h-5"
              />
            )}
          </form.Field>
        </div>
      </div>
    </motion.div>
  );
}
