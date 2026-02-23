import React from "react";
import { motion } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Radio } from "@components/ui-elements/Radio";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { DatePicker } from "@components/ui-elements/DatePicker";

interface StepProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateField: (field: string, value: any) => void;
}

export function PersonalDetailsStep({ formData, updateField }: StepProps) {
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
        Personal Details
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
              First Name
            </label>
            <Input
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="Enter first name"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
              Last Name
            </label>
            <Input
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Enter last name"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
              E-Mail
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:col-span-2 xl:col-span-2">
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
              Gender
            </label>
            <div className="flex gap-4 items-center h-11">
              <Radio
                label="Male"
                name="gender"
                checked={formData.gender === "Male"}
                onChange={(e) => updateField("gender", e.target.value)}
                value="Male"
              />
              <Radio
                label="Female"
                name="gender"
                checked={formData.gender === "Female"}
                onChange={(e) => updateField("gender", e.target.value)}
                value="Female"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
              Mobile 1
            </label>
            <Input
              value={formData.mobile1}
              onChange={(e) => updateField("mobile1", e.target.value)}
              placeholder="Enter primary mobile"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-muted-foreground mb-1 block">
              Mobile 2
            </label>
            <Input
              value={formData.mobile2}
              onChange={(e) => updateField("mobile2", e.target.value)}
              placeholder="Enter alternate mobile"
            />
          </div>
          <div>
            <DatePicker
              label="DOB"
              value={formData.dob}
              onChange={(e) => updateField("dob", e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm">
          <Typography variant="body2" weight="bold" className="mb-4">
            Present Address
          </Typography>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                Address Line 1
              </label>
              <Input
                value={formData.presentAddressLine1}
                onChange={(e) =>
                  updateField("presentAddressLine1", e.target.value)
                }
                placeholder="Enter address line 1"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                Address Line 2
              </label>
              <Input
                value={formData.presentAddressLine2}
                onChange={(e) =>
                  updateField("presentAddressLine2", e.target.value)
                }
                placeholder="Enter address line 2"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  State
                </label>
                <Input
                  value={formData.presentState}
                  onChange={(e) => updateField("presentState", e.target.value)}
                  placeholder="Enter state"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  District
                </label>
                <Input
                  value={formData.presentDistrict}
                  onChange={(e) =>
                    updateField("presentDistrict", e.target.value)
                  }
                  placeholder="Enter district"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  City
                </label>
                <Input
                  value={formData.presentCity}
                  onChange={(e) => updateField("presentCity", e.target.value)}
                  placeholder="Enter city"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Pincode
                </label>
                <Input
                  value={formData.presentPincode}
                  onChange={(e) =>
                    updateField("presentPincode", e.target.value)
                  }
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-card ring-1 ring-border shadow-sm relative">
          <Typography variant="body2" weight="bold" className="mb-4">
            Permanent Address:
          </Typography>
          {!formData.sameAddress && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Address Line 1
                </label>
                <Input
                  value={formData.permanentAddressLine1}
                  onChange={(e) =>
                    updateField("permanentAddressLine1", e.target.value)
                  }
                  placeholder="Enter address line 1"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                  Address Line 2
                </label>
                <Input
                  value={formData.permanentAddressLine2}
                  onChange={(e) =>
                    updateField("permanentAddressLine2", e.target.value)
                  }
                  placeholder="Enter address line 2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    State
                  </label>
                  <Input
                    value={formData.permanentState}
                    onChange={(e) =>
                      updateField("permanentState", e.target.value)
                    }
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    District
                  </label>
                  <Input
                    value={formData.permanentDistrict}
                    onChange={(e) =>
                      updateField("permanentDistrict", e.target.value)
                    }
                    placeholder="Enter district"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    City
                  </label>
                  <Input
                    value={formData.permanentCity}
                    onChange={(e) =>
                      updateField("permanentCity", e.target.value)
                    }
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-1 block">
                    Pincode
                  </label>
                  <Input
                    value={formData.permanentPincode}
                    onChange={(e) =>
                      updateField("permanentPincode", e.target.value)
                    }
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>
          )}
          {formData.sameAddress && (
            <div className="absolute inset-x-0 bottom-0 top-12 flex items-center justify-center bg-card/80 rounded-b-2xl backdrop-blur-[2px]">
              <Typography className="text-brand-primary font-semibold text-sm">
                Same as Present Address
              </Typography>
            </div>
          )}
        </div>

        <div className="md:col-span-2 mt-2">
          <Checkbox
            label="Click if permanent address is same as present address"
            checked={formData.sameAddress}
            onChange={(e) => updateField("sameAddress", e.target.checked)}
            className="w-5 h-5"
          />
        </div>
      </div>
    </motion.div>
  );
}
