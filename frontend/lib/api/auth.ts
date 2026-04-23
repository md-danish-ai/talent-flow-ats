import { api } from "./index";
import { ENDPOINTS } from "./endpoints";
import type { ApiRequestOptions } from "./client";
import type {
  SignInFormValues,
  SignUpFormValues,
  CreateAdminFormValues,
} from "@lib/validations/auth";
import type { CurrentUser } from "@lib/auth/user-utils";
import {
  AuthResponse,
  SignUpResponse,
  CreateAdminResponse,
  UserListResponse,
  PaginatedResponse,
  UserDetails,
} from "@types";

// POST /auth/signup - Register a new user account
export async function signUp(
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<SignUpResponse> {
  return api.post<SignUpResponse>(ENDPOINTS.AUTH.SIGN_UP, data, options);
}

// POST /auth/signin - Authenticate a user and receive a token
export async function signIn(
  data: SignInFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<AuthResponse> {
  return api.post<AuthResponse>(ENDPOINTS.AUTH.SIGN_IN, data, options);
}

// GET /auth/me - Fetch the current authenticated user's profile and recruitment details
export async function getMyDetails(): Promise<UserDetails> {
  const user = await api.get<CurrentUser>(ENDPOINTS.AUTH.ME);
  if (!user?.recruitment_details) {
    return { is_submitted: false } as UserDetails;
  }
  return user.recruitment_details as unknown as UserDetails;
}

// POST /auth/create-admin - Create a new admin user
export async function createAdmin(
  data: CreateAdminFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<CreateAdminResponse> {
  return api.post<CreateAdminResponse>(
    ENDPOINTS.AUTH.CREATE_ADMIN,
    data,
    options,
  );
}

// POST /auth/create-project-lead - Create a new project lead
export async function createProjectLead(
  data: CreateAdminFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<CreateAdminResponse> {
  return api.post<CreateAdminResponse>(
    ENDPOINTS.AUTH.CREATE_PROJECT_LEAD,
    data,
    options,
  );
}
// GET /auth/get-all-users
export async function getUsersByRole(
  role: string,
  options?: Pick<ApiRequestOptions, "cookies"> & {
    page?: number;
    limit?: number;
    search?: string;
    date_from?: string;
    date_to?: string;
    department_id?: number | string;
    test_level_id?: number | string;
    status?: string;
  },
): Promise<PaginatedResponse<UserListResponse>> {
  const queryParams = new URLSearchParams({ role });
  if (options?.page) queryParams.append("page", options.page.toString());
  if (options?.limit) queryParams.append("limit", options.limit.toString());
  if (options?.search) queryParams.append("search", options.search);
  if (options?.date_from) queryParams.append("date_from", options.date_from);
  if (options?.date_to) queryParams.append("date_to", options.date_to);
  if (options?.department_id)
    queryParams.append("department_id", options.department_id.toString());
  if (options?.test_level_id)
    queryParams.append("test_level_id", options.test_level_id.toString());
  if (options?.status) queryParams.append("status", options.status);

  const apiOptions = options ? { ...options } : undefined;
  if (apiOptions) {
    delete (apiOptions as { page?: number }).page;
    delete (apiOptions as { limit?: number }).limit;
    delete (apiOptions as { search?: string }).search;
    delete (apiOptions as { date_from?: string }).date_from;
    delete (apiOptions as { date_to?: string }).date_to;
    delete (apiOptions as { department_id?: number | string }).department_id;
    delete (apiOptions as { test_level_id?: number | string }).test_level_id;
  }

  return api.get<PaginatedResponse<UserListResponse>>(
    `${ENDPOINTS.AUTH.GET_ALL_USERS}?${queryParams.toString()}`,
    apiOptions,
  );
}

// PUT /auth/toggle-status/{user_id} - Toggle user's active status
export async function toggleUserStatus(
  userId: number,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ id: number; is_active: boolean }> {
  return api.put<{ id: number; is_active: boolean }>(
    ENDPOINTS.AUTH.TOGGLE_STATUS(userId),
    {},
    options,
  );
}

// DELETE /auth/delete/{user_id} - Delete a user
export async function deleteUser(
  userId: number,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ id: number; message: string }> {
  return api.delete<{ id: number; message: string }>(
    ENDPOINTS.AUTH.DELETE_USER(userId),
    options,
  );
}

// PUT /auth/update-basic-info/{user_id} - Update basic user info
export async function updateBasicInfo(
  userId: number,
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ message: string; user_id: number }> {
  return api.put<{ message: string; user_id: number }>(
    ENDPOINTS.AUTH.UPDATE_BASIC_INFO(userId),
    data,
    options,
  );
}
