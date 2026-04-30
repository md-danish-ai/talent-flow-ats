"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  Shield,
  User,
  Lock,
  CheckCircle2,
  Save,
  Edit2,
  X,
  KeyRound,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Card } from "@components/ui-cards/Card";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { Tabs } from "@components/ui-elements/Tabs";
import { toast } from "@lib/toast";
import type { CurrentUser } from "@lib/auth/user-utils";
import { getInitials } from "@lib/auth/user-utils";
import { cn } from "@lib/utils";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  changePasswordSchema,
  type SignUpFormValues,
} from "@lib/validations/auth";
import {
  useChangePassword,
  useUpdateBasicInfo,
} from "@hooks/api/user/use-auth";
import { UserDetails } from "@types";

interface ProfileClientProps {
  user: CurrentUser | null;
  userDetails?: UserDetails | null;
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    full_name: user?.username || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const changePasswordMutation = useChangePassword();
  const updateProfileMutation = useUpdateBasicInfo(user?.id || "");

  // Change Password Form using Tanstack Form + Zod
  const form = useForm({
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
    // @ts-expect-error - validatorAdapter types mismatch in this version
    validatorAdapter: zodValidator(),
    validators: {
      onChange: changePasswordSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await changePasswordMutation.mutateAsync(value);
        toast.success("Password changed successfully");
        form.reset();
      } catch (error: unknown) {
        const err = error as { message?: string };
        toast.error(err?.message || "Failed to change password");
      }
    },
  });

  if (!user) return null;

  const initials = getInitials(formData.full_name || user?.username || "U");
  const displayRole = user?.role?.replace("_", " ") || "User";

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfileMutation.mutateAsync({
        name: formData.full_name,
        email: formData.email,
        mobile: formData.mobile,
        // Passing required fields for SignUpFormValues that might not be in profile edit yet
        department_id: String(user?.department_id || ""),
        test_level_id: String(user?.test_level_id || ""),
        role: user?.role as SignUpFormValues["role"],
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to update profile");
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl pb-20 px-4 sm:px-6 lg:px-8">
      {/* Header Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-8 mb-10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-primary/5 blur-3xl -z-10 h-64 opacity-50" />

        <Card className="p-8 border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-xl overflow-hidden relative group">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group/avatar">
              <div className="w-32 h-32 rounded-3xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center border-4 border-white dark:border-zinc-800 shadow-2xl relative z-10 transition-transform duration-500 group-hover/avatar:scale-[1.02] overflow-hidden">
                <Typography
                  variant="h1"
                  weight="black"
                  className="text-4xl text-brand-primary select-none"
                >
                  {initials}
                </Typography>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-10 w-10 rounded-xl bg-green-500 border-4 border-white dark:border-zinc-800 flex items-center justify-center z-20 shadow-lg">
                <CheckCircle2 className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Basic Info Section */}
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                  <Typography
                    variant="h2"
                    weight="black"
                    className="text-3xl tracking-tight leading-tight"
                  >
                    {formData.full_name}
                  </Typography>
                  <div className="flex justify-center md:justify-start">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase tracking-widest leading-none">
                      {displayRole} Account
                    </span>
                  </div>
                </div>
                <Typography
                  variant="body3"
                  weight="medium"
                  className="text-muted-foreground flex items-center justify-center md:justify-start gap-2"
                >
                  <Mail size={16} className="text-brand-primary/60" />
                  {formData.email}
                </Typography>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 w-fit">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <Typography
                    variant="body5"
                    weight="black"
                    className="text-green-600 dark:text-green-500 uppercase tracking-widest text-[9px]"
                  >
                    Authenticated Session
                  </Typography>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-primary/5 border border-brand-primary/10 w-fit">
                  <Shield size={12} className="text-brand-primary" />
                  <Typography
                    variant="body5"
                    weight="black"
                    className="text-brand-primary uppercase tracking-widest text-[10px] opacity-80"
                  >
                    Level: {user?.role?.replace("_", " ").toUpperCase()}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs Section */}
      <div className="space-y-8">
        <div className="flex justify-center md:justify-start">
          <Tabs
            tabs={[
              {
                label: "Personal Info",
                value: "personal",
                icon: <User size={16} />,
              },
              {
                label: "Security",
                value: "security",
                icon: <Shield size={16} />,
              },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="pills"
            size="lg"
            className="bg-slate-100/50 dark:bg-slate-900/40 p-1.5 backdrop-blur-md border border-slate-200/50 dark:border-white/5"
          />
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "personal" ? (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-8"
            >
              <Card className="p-8 border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <Typography
                      variant="h4"
                      weight="black"
                      className="uppercase tracking-tight flex items-center gap-3"
                    >
                      <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <User size={20} />
                      </div>
                      Personal Information
                    </Typography>
                    <Typography
                      variant="body4"
                      className="text-muted-foreground pl-13"
                    >
                      Manage your profile details and contact information
                    </Typography>
                  </div>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      color="primary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="rounded-xl px-4 py-2 font-bold h-10"
                    >
                      <Edit2 size={16} className="mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        className="rounded-xl px-4 py-2 font-bold h-10"
                      >
                        <X size={16} className="mr-2" />
                        Cancel
                      </Button>
                      <Button
                        variant="outline"
                        color="primary"
                        size="sm"
                        onClick={handleProfileUpdate}
                        // isLoading={isSaving}
                        className="rounded-xl px-6 py-2 font-bold h-10"
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                      Full Name
                    </label>
                    <Input
                      placeholder="Your Full Name"
                      value={formData.full_name}
                      onChange={(e) =>
                        setFormData({ ...formData, full_name: e.target.value })
                      }
                      disabled={!isEditing}
                      startIcon={<User size={18} />}
                      className={cn(
                        !isEditing &&
                          "bg-muted/30 border-transparent cursor-not-allowed",
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                      Email Address
                    </label>
                    <Input
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      startIcon={<Mail size={18} />}
                      className={cn(
                        !isEditing &&
                          "bg-muted/30 border-transparent cursor-not-allowed",
                      )}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                      Mobile Number
                    </label>
                    <Input
                      placeholder="Your Mobile Number"
                      value={formData.mobile}
                      onChange={(e) =>
                        setFormData({ ...formData, mobile: e.target.value })
                      }
                      disabled={!isEditing}
                      startIcon={<Phone size={18} />}
                      className={cn(
                        !isEditing &&
                          "bg-muted/30 border-transparent cursor-not-allowed",
                      )}
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="security"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 gap-8"
            >
              <Card className="p-8 border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                <div className="space-y-1 mb-8">
                  <Typography
                    variant="h4"
                    weight="black"
                    className="uppercase tracking-tight flex items-center gap-3"
                  >
                    <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                      <Lock size={20} />
                    </div>
                    Security Settings
                  </Typography>
                  <Typography
                    variant="body4"
                    className="text-muted-foreground pl-13"
                  >
                    Keep your account secure by updating your password regularly
                  </Typography>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    form.handleSubmit();
                  }}
                  className="max-w-2xl space-y-8"
                >
                  <div className="space-y-6">
                    <form.Field name="current_password">
                      {(field) => (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                            Current Password
                          </label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            error={field.state.meta.errors.length > 0}
                            startIcon={<KeyRound size={18} />}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">
                              {field.state.meta.errors[0]?.message}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <form.Field name="new_password">
                        {(field) => (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                              New Password
                            </label>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              error={field.state.meta.errors.length > 0}
                              startIcon={<Lock size={18} />}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>

                      <form.Field name="confirm_password">
                        {(field) => (
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                              Confirm New Password
                            </label>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              value={field.state.value}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              onBlur={field.handleBlur}
                              error={field.state.meta.errors.length > 0}
                              startIcon={<CheckCircle2 size={18} />}
                            />
                            {field.state.meta.errors.length > 0 && (
                              <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider ml-1">
                                {field.state.meta.errors[0]?.message}
                              </p>
                            )}
                          </div>
                        )}
                      </form.Field>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}
                    >
                      {([canSubmit, isSubmitting]) => (
                        <Button
                          type="submit"
                          variant="outline"
                          color="primary"
                          disabled={!canSubmit}
                          isLoading={
                            isSubmitting || changePasswordMutation.isPending
                          }
                          className="rounded-xl px-10 py-4 font-black text-xs uppercase tracking-widest"
                        >
                          Update Password
                        </Button>
                      )}
                    </form.Subscribe>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
