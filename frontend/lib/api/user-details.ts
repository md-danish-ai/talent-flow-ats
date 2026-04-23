import { api } from "./index";
import { ENDPOINTS } from "./endpoints";
import type { ApiRequestOptions } from "./client";
import { UserDetails } from "@types";

export const addUserDetails = (data: UserDetails) =>
  api.post<UserDetails>(ENDPOINTS.USER_DETAILS.ADD, data);

export const updateUserDetails = (data: UserDetails) =>
  api.put<UserDetails>(ENDPOINTS.USER_DETAILS.UPDATE, data);

export const getUserDetailsById = (
  id: string | number,
  options?: Pick<ApiRequestOptions, "cookies">,
) => api.get<UserDetails>(ENDPOINTS.USER_DETAILS.GET_BY_ID(id), options);
