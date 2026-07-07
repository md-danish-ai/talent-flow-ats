import React from "react";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { DatePicker } from "@components/ui-elements/DatePicker";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { useStates, useDistrictsByState } from "@hooks/useLocations";
import { type PersonalDetailsForm } from "@lib/validations/personal-details";
import { getErrorMessage } from "@lib/utils";

export interface PersonalDetailsStepProps {
  form: PersonalDetailsForm;
  registeredMobile?: string;
  registeredEmail?: string;
}

const StateDropdown = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
}) => {
  const { data: states = [], isLoading } = useStates();
  return (
    <SelectDropdown
      options={states.map((s) => ({ id: s.name, label: s.name }))}
      value={value}
      onChange={(val) => onChange(String(val))}
      isLoading={isLoading}
      placeholder="Select state"
      error={error}
    />
  );
};

const DistrictDropdown = ({
  stateName,
  value,
  onChange,
  error,
  disabled,
}: {
  stateName: string;
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  disabled?: boolean;
}) => {
  const { data: states = [] } = useStates();
  const stateId = states.find((s) => s.name === stateName)?.id || null;
  const { data: districts = [], isLoading } = useDistrictsByState(stateId);

  return (
    <SelectDropdown
      options={districts.map((d) => ({ id: d.name, label: d.name }))}
      value={value}
      onChange={(val) => onChange(String(val))}
      isLoading={isLoading}
      placeholder="Select district"
      error={error}
      disabled={disabled || !stateId}
      emptyMessage={
        !stateId ? "Please select a state first" : "No districts available"
      }
    />
  );
};

export function PersonalDetailsStep({
  form,
  registeredMobile = "",
  registeredEmail = "",
}: PersonalDetailsStepProps) {
  const maxDobDate = new Date();
  maxDobDate.setFullYear(maxDobDate.getFullYear() - 18);
  maxDobDate.setDate(maxDobDate.getDate() - 1);
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6 pt-2"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  E-Mail <span className="text-red-500">*</span>
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

          <form.Field name="primaryMobile">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Primary Mobile <span className="text-red-500">*</span>
                </label>
                <Input
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder={registeredMobile || "Enter primary mobile"}
                  disabled={!!registeredMobile}
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

          <form.Field name="alternateMobile">
            {(field) => (
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Alternate Mobile
                </label>
                <Input
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value.replace(/\D/g, ""))
                  }
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
                  onChange={(val) => field.handleChange(val)}
                  error={
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                  }
                  disableFuture={true}
                  maxDate={maxDobDate}
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

        <div className="rounded-2xl p-6 bg-card ring-1 ring-border shadow-sm">
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
                    <StateDropdown
                      value={field.state.value}
                      onChange={(val) => {
                        field.handleChange(val);
                        // Reset district when state changes
                        form.setFieldValue("presentDistrict", "");
                      }}
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
                  <form.Subscribe
                    selector={(state) => [state.values.presentState]}
                  >
                    {([presentState]) => (
                      <div>
                        <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                          District <span className="text-red-500">*</span>
                        </label>
                        <DistrictDropdown
                          stateName={presentState}
                          value={field.state.value}
                          onChange={(val) => field.handleChange(val)}
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
                  </form.Subscribe>
                )}
              </form.Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <form.Field name="presentCity">
                {(field) => (
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                      City / Town <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter city / town"
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
                      onChange={(e) =>
                        field.handleChange(e.target.value.replace(/\D/g, ""))
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
        </div>

        <div className="rounded-2xl p-6 bg-card ring-1 ring-border shadow-sm relative">
          <Typography variant="body2" weight="bold" className="mb-4">
            Permanent Address:
          </Typography>
          <form.Subscribe selector={(state) => [state.values.sameAddress]}>
            {([sameAddress]) => (
              <>
                <div
                  className={`space-y-4 ${
                    sameAddress
                      ? "opacity-40 pointer-events-none grayscale-[30%]"
                      : ""
                  }`}
                >
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
                          <StateDropdown
                            value={field.state.value}
                            onChange={(val) => {
                              field.handleChange(val);
                              // Reset district when state changes
                              form.setFieldValue("permanentDistrict", "");
                            }}
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
                        <form.Subscribe
                          selector={(state) => [state.values.permanentState]}
                        >
                          {([permanentState]) => (
                            <div>
                              <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                                District
                              </label>
                              <DistrictDropdown
                                stateName={permanentState}
                                value={field.state.value}
                                onChange={(val) => field.handleChange(val)}
                                error={
                                  field.state.meta.isTouched &&
                                  field.state.meta.errors.length > 0
                                }
                              />
                              {field.state.meta.isTouched &&
                                field.state.meta.errors.length > 0 && (
                                  <p className="text-xs text-red-500 mt-1">
                                    {getErrorMessage(
                                      field.state.meta.errors[0],
                                    )}
                                  </p>
                                )}
                            </div>
                          )}
                        </form.Subscribe>
                      )}
                    </form.Field>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <form.Field name="permanentCity">
                      {(field) => (
                        <div>
                          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                            City / Town
                          </label>
                          <Input
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Enter city / town"
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
                              field.handleChange(
                                e.target.value.replace(/\D/g, ""),
                              )
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
                {sameAddress && (
                  <div className="absolute inset-x-0 bottom-0 top-12 flex items-center justify-center bg-white/30 rounded-b-2xl backdrop-blur-[1px] z-10">
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
