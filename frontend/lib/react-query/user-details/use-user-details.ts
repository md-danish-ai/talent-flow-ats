"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@lib/api";
import { getMyDetails } from "@lib/api/auth";
import {
  addUserDetails,
  updateUserDetails,
  type UserDetails,
} from "@lib/api/user-details";

export const userDetailsKeys = {
  me: ["user-details", "me"] as const,
};

export function useUserDetails() {
  return useQuery<UserDetails, ApiError>({
    queryKey: userDetailsKeys.me,
    queryFn: getMyDetails,
    retry: false, // If not found, we just start with empty form
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
