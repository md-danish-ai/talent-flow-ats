import { api } from "./index";
import type { ApiRequestOptions } from "./client";
import type {
  SignInFormValues,
  SignUpFormValues,
  CreateAdminFormValues,
} from "@lib/validations/auth";
import type { UserDetails } from "./user-details";
import type { CurrentUser } from "@lib/auth/user-utils";

export interface AuthResponse {
  access_token: string;
  user: {
    id: number | string;
    username: string;
    email?: string;
    mobile?: string;
    role: string;
  };
}

export interface SignUpResponse {
  message: string;
  access_token: string;
  user: {
    id: number | string;
    username: string;
    email?: string;
    mobile?: string;
    role: string;
  };
}

export interface CreateAdminResponse {
  message: string;
  access_token: string;
  user: {
    id: number | string;
    username: string;
    role: string;
  };
}

// POST /auth/signup - Register a new user account
export async function signUp(
  data: SignUpFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<SignUpResponse> {
  return api.post<SignUpResponse>("/auth/signup", data, options);
}

// POST /auth/signin - Authenticate a user and receive a token
export async function signIn(
  data: SignInFormValues,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/signin", data, options);
}

// GET /auth/me - Fetch the current authenticated user's profile and recruitment details
export async function getMyDetails(): Promise<UserDetails> {
  const user = await api.get<CurrentUser>("/auth/me");
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
  return api.post<CreateAdminResponse>("/auth/create-admin", data, options);
}

export interface UserListResponse {
  id: number;
  username: string;
  mobile: string;
  email: string | null;
  role: string;
  testlevel?: string;
  testlevel_id?: number | string;
  test_level_id?: number | string;
  is_active: boolean;
  assignment?: {
    is_assigned: boolean;
    paper_id: number | null;
    department_id: number | null;
    test_level_id: number | null;
    is_attempted: boolean;
  } | null;
}

// GET /auth/get-all-users?role={role}&date={date} - Fetch users by role (e.g., admin, user)
export async function getUsersByRole(
  role: string,
  options?: Pick<ApiRequestOptions, "cookies"> & { date?: string },
): Promise<UserListResponse[]> {
  const queryParams = new URLSearchParams({ role });
  if (options?.date) {
    queryParams.append("date", options.date);
  }

  // Remove date from options so it doesn't get passed to api.get as config if not needed
  const apiOptions = options ? { ...options } : undefined;
  if (apiOptions && 'date' in apiOptions) {
    delete (apiOptions as { date?: string }).date;
  }

  return api.get<UserListResponse[]>(
    `/auth/get-all-users?${queryParams.toString()}`,
    apiOptions,
  );
}

// PUT /auth/toggle-status/{user_id} - Toggle user's active status
export async function toggleUserStatus(
  userId: number,
  options?: Pick<ApiRequestOptions, "cookies">,
): Promise<{ id: number; is_active: boolean }> {
  return api.put<{ id: number; is_active: boolean }>(
    `/auth/toggle-status/${userId}`,
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
    `/auth/delete/${userId}`,
    options,
  );
}
