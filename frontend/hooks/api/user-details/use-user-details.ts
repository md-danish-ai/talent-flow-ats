"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@lib/api";
import { UserDetails } from "@types";
import { type CurrentUser } from "@lib/auth/user-utils";
import {
  addUserDetails,
  updateUserDetails,
  getUserDetailsById,
} from "@lib/api/user-details";
import { ENDPOINTS } from "@lib/api/endpoints";

export const userDetailsKeys = {
  me: ["user-details", "me"] as const,
};

export function useUserDetails() {
  return useQuery<UserDetails, ApiError>({
    queryKey: userDetailsKeys.me,
    queryFn: async () => {
      // 1. Get current user to get the ID
      const user = await api.get<CurrentUser>(ENDPOINTS.AUTH.ME);
      if (!user?.id) {
        throw new Error("User ID not found");
      }
      try {
        return await getUserDetailsById(user.id);
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          return {
            is_submitted: false,
            is_interview_submitted: false,
          } as UserDetails;
        }
        throw error;
      }
    },
    retry: false,
  });
}

export function useSaveUserDetails() {
  const qc = useQueryClient();
  return useMutation<UserDetails, ApiError, UserDetails>({
    mutationFn: (data) => addUserDetails(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userDetailsKeys.me });
    },
  });
}

export function useUpdateUserDetails() {
  const qc = useQueryClient();
  return useMutation<UserDetails, ApiError, UserDetails>({
    mutationFn: (data) => updateUserDetails(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userDetailsKeys.me });
    },
  });
}
