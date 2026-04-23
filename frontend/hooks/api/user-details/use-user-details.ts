"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@lib/api";
import { UserDetails, IApiError } from "@types";
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
  return useQuery<UserDetails, IApiError>({
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
        const apiError = error as IApiError;
        // If 404 or other error, return empty state if it's a new user
        if (apiError?.status_code === 404) {
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
  return useMutation<UserDetails, IApiError, UserDetails>({
    mutationFn: (data) => addUserDetails(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userDetailsKeys.me });
    },
  });
}

export function useUpdateUserDetails() {
  const qc = useQueryClient();
  return useMutation<UserDetails, IApiError, UserDetails>({
    mutationFn: (data) => updateUserDetails(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userDetailsKeys.me });
    },
  });
}
