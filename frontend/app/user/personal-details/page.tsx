"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    mobile1: "",
    mobile2: "",
    email: "",
    presentAddress: "",
    presentCity: "",
    permanentAddress: "",
    permanentCity: "",
    sameAddress: false,

    // Step 2: Family Details
    family: [
      {
        id: 1,
        relationLabel: "Father",
        relation: "Father",
        name: "",
        occupation: "",
        dependent: "",
      },
      {
        id: 2,
        relationLabel: "Mother",
        relation: "Mother",
        name: "",
        occupation: "",
        dependent: "",
      },
      {
        id: 3,
        relationLabel: "Spouse",
        relation: "Spouse",
        name: "",
        occupation: "",
        dependent: "",
      },
      {
        id: 4,
        relationLabel: "Brother/Sister",
        relation: "",
        name: "",
        occupation: "",
        dependent: "",
      },
      {
        id: 5,
        relationLabel: "Brother/Sister",
        relation: "",
        name: "",
        occupation: "",
        dependent: "",
      },
      {
        id: 6,
        relationLabel: "Brother/Sister",
        relation: "",
        name: "",
        occupation: "",
        dependent: "",
      },
    ],

    // Step 3: Source of Information
    interviewedBefore: "",
    workedBefore: "",
    source: {
      campus: false,
      website: false,
      employee: false,
      friends: false,
      newspaper: false,
    },

    // Step 4: Education Details
    education: [
      {
        id: 1,
        type: "Additional Qualification",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 2,
        type: "Post Graduation",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 3,
        type: "Graduation",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 4,
        type: "Diploma",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 5,
        type: "12th Std",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 6,
        type: "10th Std",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
    ],

    // Step 5: Work Experience Details
    workExp: [
      {
        id: 1,
        company: "",
        designation: "",
        joinDate: "",
        relieveDate: "",
        reason: "",
        salary: "",
      },
      {
        id: 2,
        company: "",
        designation: "",
        joinDate: "",
        relieveDate: "",
        reason: "",
        salary: "",
      },
      {
        id: 3,
        company: "",
        designation: "",
        joinDate: "",
        relieveDate: "",
        reason: "",
        salary: "",
      },
      {
        id: 4,
        company: "",
        designation: "",
        joinDate: "",
        relieveDate: "",
        reason: "",
        salary: "",
      },
    ],

    // Step 6: Other Details
    serviceCommitment: "",
    securityDeposit: "",
    shiftTime: "",
    expectedJoiningDate: "",
    expectedSalary: "",
  });

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Submitting form data", formData);
    // Submit to API
    router.push("/user/dashboard");
  };

  const renderTimeline = () => {
    return (
      <div className="flex items-center justify-center mb-10 w-full max-w-3xl mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 z-10 ${
                    isActive
                      ? "border-brand-primary bg-brand-primary text-white"
                      : isCompleted
                        ? "border-brand-success bg-brand-success text-white"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : step}
                </div>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 transition-colors duration-300 ${
                    isCompleted ? "bg-brand-success" : "bg-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value as never }));
  };

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h3"
        weight="bold"
        className="text-center mb-8 border-b pb-4"
      >
        Personal Details
      </Typography>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            *First Name
          </label>
          <Input
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            *Last Name
          </label>
          <Input
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            Gender
          </label>
          <div className="flex gap-4 items-center h-12">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={(e) => updateField("gender", e.target.value)}
                className="accent-brand-primary w-4 h-4 cursor-pointer"
              />
              <span>Male</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={(e) => updateField("gender", e.target.value)}
                className="accent-brand-primary w-4 h-4 cursor-pointer"
              />
              <span>Female</span>
            </label>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            *DOB
          </label>
          <Input
            type="date"
            value={formData.dob}
            onChange={(e) => updateField("dob", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            *Mobile 1
          </label>
          <Input
            value={formData.mobile1}
            onChange={(e) => updateField("mobile1", e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            Mobile 2
          </label>
          <Input
            value={formData.mobile2}
            onChange={(e) => updateField("mobile2", e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            *E-Mail
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>

        <div className="border rounded-xl p-4 bg-muted/30">
          <Typography variant="body2" weight="bold" className="mb-4">
            Present Address
          </Typography>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                *Present Address
              </label>
              <Input
                value={formData.presentAddress}
                onChange={(e) => updateField("presentAddress", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">
                *City
              </label>
              <Input
                value={formData.presentCity}
                onChange={(e) => updateField("presentCity", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="border rounded-xl p-4 bg-muted/30 relative">
          <Typography variant="body2" weight="bold" className="mb-4">
            Permanent Address:
          </Typography>
          {!formData.sameAddress && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  *Permanent Address
                </label>
                <Input
                  value={formData.permanentAddress}
                  onChange={(e) =>
                    updateField("permanentAddress", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">
                  *City
                </label>
                <Input
                  value={formData.permanentCity}
                  onChange={(e) => updateField("permanentCity", e.target.value)}
                />
              </div>
            </div>
          )}
          {formData.sameAddress && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-xl backdrop-blur-sm">
              <Typography className="text-brand-primary font-semibold">
                Same as Present Address
              </Typography>
            </div>
          )}
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.sameAddress}
              onChange={(e) => updateField("sameAddress", e.target.checked)}
              className="accent-brand-primary w-5 h-5 rounded cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">
              Click if permanent address is same as present address
            </span>
          </label>
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h3"
        weight="bold"
        className="text-center mb-8 border-b pb-4"
      >
        Family Details
      </Typography>
      <div className="overflow-x-auto rounded-xl border border-border mt-4">
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
            {formData.family.map((member, index) => (
              <tr
                key={member.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="p-3 border-r border-border">
                  {member.relationLabel === "Brother/Sister" ? (
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                        <input
                          type="radio"
                          checked={member.relation === "Brother"}
                          onChange={() => {
                            const newFamily = [...formData.family];
                            newFamily[index].relation = "Brother";
                            updateField("family", newFamily);
                          }}
                          className="accent-brand-primary w-4 h-4"
                        />{" "}
                        Brother
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                        <input
                          type="radio"
                          checked={member.relation === "Sister"}
                          onChange={() => {
                            const newFamily = [...formData.family];
                            newFamily[index].relation = "Sister";
                            updateField("family", newFamily);
                          }}
                          className="accent-brand-primary w-4 h-4"
                        />{" "}
                        Sister
                      </label>
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
                  />
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center gap-4">
                    <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="radio"
                        checked={member.dependent === "Yes"}
                        onChange={() => {
                          const newFamily = [...formData.family];
                          newFamily[index].dependent = "Yes";
                          updateField("family", newFamily);
                        }}
                        className="accent-brand-primary w-4 h-4"
                      />{" "}
                      Yes
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                      <input
                        type="radio"
                        checked={member.dependent === "No"}
                        onChange={() => {
                          const newFamily = [...formData.family];
                          newFamily[index].dependent = "No";
                          updateField("family", newFamily);
                        }}
                        className="accent-brand-primary w-4 h-4"
                      />{" "}
                      No
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h3"
        weight="bold"
        className="text-center mb-8 border-b pb-4"
      >
        Source of Information
      </Typography>
      <div className="space-y-8 mt-4 max-w-2xl mx-auto">
        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <label className="text-sm font-semibold block mb-4">
            Have you ever been interviewed in Arcgate?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.interviewedBefore === "Yes"}
                onChange={() => updateField("interviewedBefore", "Yes")}
                className="accent-brand-primary w-5 h-5"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.interviewedBefore === "No"}
                onChange={() => updateField("interviewedBefore", "No")}
                className="accent-brand-primary w-5 h-5"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <label className="text-sm font-semibold block mb-4">
            Have you Worked in Arcgate before?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.workedBefore === "Yes"}
                onChange={() => updateField("workedBefore", "Yes")}
                className="accent-brand-primary w-5 h-5"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={formData.workedBefore === "No"}
                onChange={() => updateField("workedBefore", "No")}
                className="accent-brand-primary w-5 h-5"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <label className="text-sm font-semibold block mb-4">
            What is the source of information for showing interest in ARCGATE?
            Please tick the appropriate from the given list.
          </label>
          <div className="flex flex-col gap-3 ml-2">
            {[
              { id: "campus", label: "Arcgate Campus Drive" },
              { id: "website", label: "Arcgate Website" },
              { id: "employee", label: "Arcgate Employee" },
              { id: "friends", label: "Friends" },
              { id: "newspaper", label: "Newspaper" },
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={
                    formData.source[item.id as keyof typeof formData.source]
                  }
                  onChange={(e) => {
                    const newSource = {
                      ...formData.source,
                      [item.id]: e.target.checked,
                    };
                    updateField("source", newSource);
                  }}
                  className="accent-brand-primary w-5 h-5 rounded cursor-pointer"
                />
                <span className="text-foreground">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h3"
        weight="bold"
        className="text-center mb-8 border-b pb-4"
      >
        Education Details
      </Typography>
      <div className="overflow-x-auto rounded-xl border border-border mt-4">
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
            {formData.education.map((edu, index) => (
              <tr key={edu.id} className="hover:bg-muted/30 transition-colors">
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
                  />
                </td>
                <td className="p-2 border-r border-border">
                  <Input
                    value={edu.year}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].year = e.target.value;
                      updateField("education", newEdu);
                    }}
                    className="h-10 border-transparent bg-transparent hover:border-border focus:bg-input"
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
                  />
                </td>
                <td className="p-3 text-center">
                  <div className="flex justify-center flex-col xl:flex-row gap-2">
                    <label className="flex items-center gap-1 cursor-pointer text-xs">
                      <input
                        type="radio"
                        checked={edu.medium === "English"}
                        onChange={() => {
                          const newEdu = [...formData.education];
                          newEdu[index].medium = "English";
                          updateField("education", newEdu);
                        }}
                        className="accent-brand-primary w-4 h-4"
                      />{" "}
                      English
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer text-xs">
                      <input
                        type="radio"
                        checked={edu.medium === "Hindi"}
                        onChange={() => {
                          const newEdu = [...formData.education];
                          newEdu[index].medium = "Hindi";
                          updateField("education", newEdu);
                        }}
                        className="accent-brand-primary w-4 h-4"
                      />{" "}
                      Hindi
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderStep5 = () => (
    <motion.div
      key="step5"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography variant="h3" weight="bold" className="text-center mb-2 pb-2">
        Work Experience Details
      </Typography>
      <Typography
        variant="body2"
        className="text-center text-brand-success font-semibold mb-8 border-b pb-4"
      >
        If you are fresher then no need to fill this form and click
        &quot;Next&quot; to continue
      </Typography>
      <div className="overflow-x-auto rounded-xl border border-border mt-4">
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
            {formData.workExp.map((exp, index) => (
              <tr key={exp.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-2 border-r border-border">
                  <Input
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...formData.workExp];
                      newExp[index].company = e.target.value;
                      updateField("workExp", newExp);
                    }}
                    className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input"
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
                    className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input text-xs"
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
                    className="h-12 border-transparent bg-transparent hover:border-border focus:bg-input text-xs"
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
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderStep6 = () => (
    <motion.div
      key="step6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <Typography
        variant="h3"
        weight="bold"
        className="text-center mb-8 border-b pb-4"
      >
        Other Details
      </Typography>
      <div className="mt-4 max-w-2xl mx-auto space-y-8">
        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            Are you willing for 1 Year Service Commitment?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.serviceCommitment === "Yes"}
                onChange={() => updateField("serviceCommitment", "Yes")}
                className="accent-brand-primary w-4 h-4"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.serviceCommitment === "No"}
                onChange={() => updateField("serviceCommitment", "No")}
                className="accent-brand-primary w-4 h-4"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            Do you agree for 1 month salary as security deposit?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.securityDeposit === "Yes"}
                onChange={() => updateField("securityDeposit", "Yes")}
                className="accent-brand-primary w-4 h-4"
              />
              Yes
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.securityDeposit === "No"}
                onChange={() => updateField("securityDeposit", "No")}
                className="accent-brand-primary w-4 h-4"
              />
              No
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            What is your preferred shift time for work at Arcgate?
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.shiftTime === "Day"}
                onChange={() => updateField("shiftTime", "Day")}
                className="accent-brand-primary w-4 h-4"
              />
              Day
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.shiftTime === "Night"}
                onChange={() => updateField("shiftTime", "Night")}
                className="accent-brand-primary w-4 h-4"
              />
              Night
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground">
              <input
                type="radio"
                checked={formData.shiftTime === "Any"}
                onChange={() => updateField("shiftTime", "Any")}
                className="accent-brand-primary w-4 h-4"
              />
              Any
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-end pt-4">
          <div>
            <label className="text-sm text-muted-foreground mb-4 block">
              On selection, please mention the expected joining date.
            </label>
            <Input
              type="date"
              value={formData.expectedJoiningDate}
              onChange={(e) =>
                updateField("expectedJoiningDate", e.target.value)
              }
              className="border-t-0 border-l-0 border-r-0 border-b border-border bg-transparent shadow-none px-0 rounded-none focus:ring-0 text-sm h-8 pb-1 pt-0"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-[#2196f3] mb-1 block">
              Expected Salary
            </label>
            <Input
              value={formData.expectedSalary}
              onChange={(e) => updateField("expectedSalary", e.target.value)}
              className="border-0 border-b-2 border-[#2196f3] bg-transparent rounded-none px-0 shadow-none focus:ring-0 hover:border-[#2196f3] h-8 pb-1 pt-0 focus-visible:ring-0 focus:!border-[#2196f3] focus:!ring-0"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-layout-bg)] py-12 px-4 transition-colors">
      <div className="mx-auto max-w-6xl">
        <Button
          variant="ghost"
          color="default"
          onClick={() => router.push("/user/dashboard")}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </Button>

        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] border border-border min-h-[700px] flex flex-col relative overflow-hidden">
          {renderTimeline()}

          <div className="flex-1 w-full relative">
            <AnimatePresence mode="wait">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
              {currentStep === 6 && renderStep6()}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex justify-end items-center border-t border-border pt-6 gap-3">
            {currentStep > 1 && (
              <Button
                color="primary"
                size="md"
                onClick={handlePrev}
                className="w-28 text-sm font-semibold shadow-sm rounded-[2px]"
              >
                PREVIOUS
              </Button>
            )}

            <Button
              color="primary"
              size="md"
              onClick={handleNext}
              className="w-28 text-sm font-semibold shadow-sm rounded-[2px]"
            >
              {currentStep === totalSteps ? "START TEST" : "NEXT"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
